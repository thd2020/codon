import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { sceneColor } from './lens.js';
import { ORGANELLE, BRAND } from './palette.js';

// The Garden stage, in millimetres: a lady's mantle leaf beaded with dew at dawn, seen from the
// child's eye 117 mm above the tear bead, and G.'s brass 10x loupe held over it.
//
// One light for everything: an analytic dawn sky (lilac zenith, a warm glow low in the sun's
// azimuth, the sun itself still below the horizon) lights the leaf, the brass and the skin, is what
// the beads reflect and refract, and carries the child as a dark silhouette leaning over the leaf.
// All colours are display colours turned scene-linear through sceneColor(), so the Garden goes
// through the same bloom, tone mapping and lens grade as the drop and reads as the same world.
//
// Three layers, each drawn sharp and then given its own depth of field:
//   far  (the leaves below, the soil and the pot rim): drawn into a target and blurred, then shown
//        as the backdrop of the middle layer;
//   mid  (the leaf, its hairs, the beads and the image in the glass): drawn by the composer's scene
//        pass, blurred as a whole only during a focus pull or by the glass in the dive;
//   near (the loupe's brass and the fingers holding it): drawn into its own target, blurred by its
//        circle of confusion and laid over everything by GardenPass.
// The image in the glass is real optics: the mid layer drawn again from the eye, magnified by the
// thin-lens angular magnification M around the loupe's axis, inverted when M < 0.

export const B = new THREE.Vector3(0, 3.55, 0); // the tear bead's centre (after the merge)
export const BEAD_R = 2.15;
export const EYE_H = 117; // the child's eye above the bead in the hub
// focal length 250/10 mm, clear radius. Raised to 60 mm the image is inverted at about -6x (the
// least it gets between the two flip heights, 36 and 81 mm): the upside-down world reads.
export const LOUPE = { f: 25, R: 15, rest: 23, min: 6, max: 60 };
export const FOV = 42;

// Dawn, before the sun is up (display sRGB). The sky is lilac overhead, pearl at the horizon and warm
// peach low in the east; there is no direct sun yet, so shadows are soft and lilac.
const DAWN = {
  zenith: 0xaeb8e0,
  sky: 0xccd3ec,
  horizon: 0xe2dcec,
  glow: 0xf6dccb,
  ground: 0x9a9a8e,
  sun: 0xfff1e2,
  child: 0x564c66,
  haze: 0xdcd8ea,
};
// The sun's azimuth, about 12 degrees up (the morning sunDir of the story).
const GLOW_DIR = new THREE.Vector3(0.35, 0.12, 0.45).normalize();
// The leaf.
// bend: how far (radians at the margin) the lobes and their veins curve as they run out; it is zero at
// the sinus, so the basal cut stays straight.
const LEAF = { R0: 40, lobes: 9, sinus: -Math.PI / 2 - 0.42, tooth: 1.25, teeth: 9, cup: 8.0, pleat: 3.4, bend: 0.09, phase: 0 };
const NB = 32; // beads the leaf shader knows about

const TAU = Math.PI * 2;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = Math.imul(s ^ (s >>> 15), 2246822519) + 0x9e3779b9) >>> 0) / 4294967296;
}

// ------------------------------------------------------------------------------------- GLSL
const NOISE = /* glsl */ `
  #define PI 3.14159265359
  #define TAU 6.28318530718
  float h12(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  vec2 h22(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.xx + q.yz) * q.zy); }
  float h13(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float vn2(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h12(i), h12(i + vec2(1, 0)), f.x), mix(h12(i + vec2(0, 1)), h12(i + vec2(1, 1)), f.x), f.y);
  }
  float vn3(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    float a = mix(mix(h13(i), h13(i + vec3(1, 0, 0)), f.x), mix(h13(i + vec3(0, 1, 0)), h13(i + vec3(1, 1, 0)), f.x), f.y);
    float b = mix(mix(h13(i + vec3(0, 0, 1)), h13(i + vec3(1, 0, 1)), f.x), mix(h13(i + vec3(0, 1, 1)), h13(i + vec3(1, 1, 1)), f.x), f.y);
    return mix(a, b, f.z);
  }
  // Voronoi: x = distance to the nearest centre, y = distance to the nearest border (F2 - F1).
  vec2 vor(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float F1 = 8.0, F2 = 8.0;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = g + 0.15 + 0.7 * h22(i + g);
      float d = length(o - f);
      if (d < F1) { F2 = F1; F1 = d; } else F2 = min(F2, d);
    }
    return vec2(F1, F2 - F1);
  }
  // Voronoi with the offset to the nearest centre: x = F1, y = F2 - F1, zw = p - centre.
  vec4 vorC(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float F1 = 8.0, F2 = 8.0;
    vec2 o1 = vec2(0.0);
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = g + 0.15 + 0.7 * h22(i + g);
      float d = length(o - f);
      if (d < F1) { F2 = F1; F1 = d; o1 = f - o; } else F2 = min(F2, d);
    }
    return vec4(F1, F2 - F1, o1);
  }
  // A line of half-width hw at distance d, drawn at least a pixel wide (its strength falls instead),
  // and faded out entirely once it is a small fraction of a pixel, so fine veins never shimmer.
  float lineAA(float d, float hw, float pw) {
    float w = max(hw, 0.5 * pw);
    return (hw / w) * smoothstep(0.08, 0.3, hw / pw) * (1.0 - smoothstep(w - 0.5 * pw, w + 0.5 * pw, d));
  }
`;

// The dawn sky, analytic: what every surface in the Garden reflects and is lit by.
const SKY = /* glsl */ `
  uniform vec3 uZenith, uSkyC, uHorizon, uGlow, uGround, uSun, uGlowDir;
  uniform vec3 uLightUp, uLightDown, uLightGlow;
  uniform float uSkyOcc, uExpo;
  vec3 skyColor(vec3 d) {
    float y = d.y;
    vec3 c = mix(uHorizon, uSkyC, smoothstep(0.02, 0.45, y));
    c = mix(c, uZenith, smoothstep(0.4, 1.0, y));
    float az = dot(normalize(d.xz + 1e-5), normalize(uGlowDir.xz)) * 0.5 + 0.5;
    c = mix(c, uGlow, pow(az, 3.0) * exp(-max(y, 0.0) * 3.2) * 0.9);
    float s = max(dot(d, uGlowDir), 0.0);
    // The brightest part of the dawn: the sky just above where the sun will rise.
    c += uSun * (pow(s, 900.0) * 36.0 + pow(s, 140.0) * 2.5 + pow(s, 30.0) * 0.45 + pow(s, 8.0) * 0.12);
    c = mix(c, uGround, smoothstep(0.0, -0.18, y));
    return c;
  }
  // Light falling on a surface facing n, about 1 for a surface facing up.
  // The broad warm glow low in the east acts as a soft key light (about 30 degrees up); the lilac
  // dome is the fill. Surfaces facing the glow warm up, those facing away go cool and lilac.
  vec3 glowL() { return normalize(vec3(normalize(uGlowDir.xz) * 1.0, 0.62).xzy); }
  vec3 skyHemi(vec3 n) { return mix(uLightDown, uLightUp, n.y * 0.5 + 0.5) * (1.0 - 0.15 * uSkyOcc) * uExpo; }
  vec3 skyKey(vec3 n) { return uLightGlow * max(dot(n, glowL()) * 0.8 + 0.2, 0.0) * (1.0 - 0.15 * uSkyOcc) * uExpo; }
  vec3 skyLight(vec3 n) { return skyHemi(n) + skyKey(n); }
  // A bead is a ball lens for the glow: behind it (seen from the glow) the light it gathers lands in
  // a bright core, ringed by its shadow. Returns the factor on the key light at P.
  float beadBeam(vec3 P, vec3 C, float R) {
    vec3 L = glowL();
    vec3 w = C - P;
    float s = dot(w, L);
    if (s <= 0.0) return 1.0;
    float dp = length(w - L * s);
    float b = max(R * abs(1.0 - s / (2.0 * R)), 0.14 * R);
    float core = min(pow(R / b, 2.0) * 0.8, 5.0);
    float inBead = 1.0 - smoothstep(R * 0.92, R * 1.05, dp);
    float inCore = 1.0 - smoothstep(b * 0.75, b * 1.1, dp);
    return mix(1.0, mix(0.12, core, inCore), inBead);
  }
`;

// The child leaning over the leaf, as the beads see it: a dark silhouette against the sky (head,
// shoulders, the arm reaching down to the glass). Positions are relative to the tear bead. No face.
const CHILD = /* glsl */ `
  uniform vec3 uHeadC, uHeadR, uBodyC, uBodyR, uArmA, uArmB, uChildCol, uB;
  uniform float uChild;
  float ellSoft(vec3 ro, vec3 rd, vec3 c, vec3 r) {
    vec3 o = (ro - c) / r, d = rd / r;
    float a = dot(d, d), b = dot(o, d), cc = dot(o, o) - 1.0;
    float h = (b * b - a * cc) / a;
    return smoothstep(-0.004, 0.012, h) * step(b, 0.0);
  }
  float capSoft(vec3 ro, vec3 rd, vec3 a, vec3 b, float r) {
    vec3 ba = b - a, oa = ro - a;
    float baba = dot(ba, ba), bard = dot(ba, rd), baoa = dot(ba, oa), rdoa = dot(rd, oa);
    // Closest points of the ray and the segment.
    float s = clamp((baoa - bard * rdoa) / max(baba - bard * bard, 1e-6), 0.0, 1.0);
    float t = max(bard * s - rdoa, 0.0);
    float d = length(oa + rd * t - ba * s);
    return 1.0 - smoothstep(r * 0.92, r * 1.05, d);
  }
  vec3 envColor(vec3 ro, vec3 d) {
    vec3 c = skyColor(d);
    if (uChild <= 0.0 || d.y < 0.05) return c;
    float m = max(ellSoft(ro, d, uHeadC, uHeadR), ellSoft(ro, d, uBodyC, uBodyR));
    m = max(m, capSoft(ro, d, uArmA, uArmB, 26.0));
    // Backlit: the edge of the silhouette on the glow side is warm.
    vec3 sil = uChildCol * (1.0 + 0.5 * pow(max(dot(normalize(d.xz + 1e-5), normalize(uGlowDir.xz)), 0.0), 4.0));
    return mix(c, sil, m * uChild);
  }
`;

// The lady's mantle blade, in the leaf's own flat coordinates (mm, x and z before the cup and the
// pleats lift it). Shared by the leaf and by the beads, which see the blade magnified below them.
const BLADE = /* glsl */ `
  uniform float uR0, uLobes, uSinus, uTooth, uTeeth, uBend, uBendPhase;
  uniform vec3 uLeafA, uLeafB, uVein, uLeafEdge, uLeafDeep;
  // The angle round the blade from the sinus (0..TAU), bent a little with the distance out, so the
  // lobes and the veins in their valleys curve as they run to the margin, each lobe differently.
  float psiOf(float phi, float rn) {
    float psi = mod(phi - uSinus, TAU);
    return psi + uBend * pow(clamp(rn, 0.0, 1.2), 1.5) * (0.8 * sin(1.5 * psi) + 0.35 * sin(4.0 * psi + 1.0 + uBendPhase) * sin(0.5 * psi));
  }
  float lobeU2(float phi, float rn) { return psiOf(phi, rn) * uLobes / TAU; }
  float lobeU(float phi) { return lobeU2(phi, 0.95); }
  // Radius of the margin at angle phi: shallow rounded lobes, each with a row of small teeth.
  float marginR(float phi) {
    float f = fract(lobeU(phi));
    float lobe = pow(sin(PI * f), 0.55);
    float R = uR0 * (0.885 + 0.115 * lobe);
    float g = fract(f * uTeeth);
    float tooth = 1.0 - pow(abs(2.0 * g - 1.0), 0.72);
    return R + uTooth * tooth * (0.5 + 0.5 * lobe);
  }
  // Signed distance (mm, negative inside) to the margin, with the narrow basal sinus.
  float leafSd(vec2 p) {
    float rho = length(p), phi = atan(p.y, p.x);
    float d = rho - marginR(phi);
    float ds = mod(phi - uSinus + PI, TAU) - PI;
    float lat = rho * abs(sin(ds));
    if (cos(ds) > 0.0 && rho > 9.0) d = max(d, 0.07 * (rho - 9.0) - lat);
    return d;
  }
  // The blade's colour. pw: the size of a pixel on the blade (mm), which decides how fine a detail
  // can still be drawn. bump: the slope of the surface in the blade's flat coordinates. Nothing here
  // is a drawn line: veins are grooves with a faint paler floor, the areoles little domes, the cells
  // soft cushions, the hair feet small mounds. Each fades in only once it is a few pixels wide.
  vec3 bladeColor(vec2 p, float pw, out vec2 bump) {
    float rho = length(p), phi = atan(p.y, p.x), rn = rho / uR0;
    float u = lobeU2(phi, rn), fu = fract(u);
    float lobe = floor(u);
    float dv = (fu - 0.5) * TAU / uLobes;
    float along = rho * cos(dv), across = rho * sin(dv);
    vec3 col = mix(uLeafA, uLeafB, clamp(0.5 + 0.7 * (vn2(p * 0.085) - 0.5) + 0.4 * (rn - 0.55), 0.0, 1.0));
    // The pleats' valleys (where the primaries run) are a little deeper in colour.
    float vpan = 2.0 * fract(u + 0.5) - 1.0; // -1..1 from valley to valley, 0 on the ridge
    float valley = smoothstep(0.35, 1.0, abs(vpan));
    col = mix(col, uLeafDeep, valley * 0.3 * smoothstep(0.08, 0.45, rn));
    // Primary veins, one to each lobe, converging on the petiole: sunk grooves with a faintly paler
    // floor. Past two thirds of the way out each forks toward the lobe's flanks.
    float wob = (vn2(vec2(rho * 0.3, lobe * 7.1)) - 0.5) * 0.3;
    float hw1 = mix(0.12, 0.05, rn);
    float a1 = across + wob;
    float fk = max(rho - (0.62 + 0.08 * h12(vec2(lobe, 5.0))) * uR0, 0.0) * 0.32;
    float a1f = fk > 0.0 ? min(abs(a1 - fk), abs(a1 + fk)) : abs(a1);
    float hwf = mix(hw1, hw1 * 0.7, smoothstep(0.0, 1.0, fk));
    float aV = min(abs(a1), a1f);
    float wV = aV < abs(a1) ? hwf : hw1;
    float sgV = max(wV * 1.6, 0.55 * pw);
    float v1 = exp(-aV * aV / (2.0 * sgV * sgV)) * (wV / max(wV, 0.6 * pw)) * smoothstep(0.25, 0.9, rho);
    float phv = uSinus + (lobe + 0.5) * TAU / uLobes;
    vec2 gAcross = vec2(-sin(phv), cos(phv)), gAlong = vec2(cos(phv), sin(phv));
    float sg1 = wV * 2.2;
    float sgn1 = aV < abs(a1) ? sign(a1 - (a1 > 0.0 ? fk : -fk)) : sign(a1);
    vec2 groove = -gAcross * sgn1 * (0.16 * aV / (sg1 * sg1)) * exp(-aV * aV / (2.0 * sg1 * sg1)) * smoothstep(0.25, 0.9, rho);
    // The petiole's knot at the centre, where the primaries meet: a soft, paler boss.
    float knot = exp(-rho * rho / 0.5);
    // Secondary veins from the primary out to the teeth, curving, irregular.
    float sp = 3.0 + 0.7 * h12(vec2(lobe, 3.0));
    float s = along - abs(across) * (1.2 - 0.01 * abs(across)) + 1.1 * (vn2(p * 0.22) - 0.5);
    float k = floor(s / sp + 0.5);
    float hw2 = mix(0.075, 0.03, rn);
    float a2 = (s - k * sp) * 0.64;
    float on2 = step(0.5, k) * smoothstep(hw1 + 0.15, hw1 + 1.0, abs(across)) * (0.55 + 0.45 * vn2(p * 0.7));
    float sg2 = max(hw2 * 1.6, 0.55 * pw);
    float v2 = exp(-a2 * a2 / (2.0 * sg2 * sg2)) * (hw2 / max(hw2, 0.6 * pw)) * smoothstep(0.1, 0.4, hw2 / pw) * on2;
    float sg2b = hw2 * 2.4;
    vec2 gs = normalize(gAlong - 1.2 * sign(across) * gAcross);
    groove -= gs * (0.06 * a2 / (sg2b * sg2b)) * exp(-a2 * a2 / (2.0 * sg2b * sg2b)) * on2;
    // Areoles: little domes between the smallest veins, their slopes falling to nothing at their
    // borders, so the blade reads quilted without any line between them.
    vec2 q = p + 0.5 * vec2(vn2(p * 0.42), vn2(p * 0.42 + 9.1)) - 0.25;
    vec4 a = vorC(q / 1.1);
    float dome = smoothstep(0.012, 0.05, 1.1 / (pw * 60.0));
    // (gentler once each areole is large on screen: close up the blade is soft, not cobbled)
    dome *= 1.0 - 0.5 * smoothstep(40.0, 160.0, 1.1 / pw);
    bump = a.zw * 0.28 * dome * smoothstep(0.0, 0.22, a.y) + groove * smoothstep(0.15, 0.6, sg1 / pw);
    // The areoles' crowns catch a little more light than their edges: shading, not outline.
    col *= 1.0 + 0.05 * dome * (smoothstep(0.0, 0.3, a.y) - 0.5);
    // Close up: the epidermal cells as soft cushions, and the feet of the silver hairs as small
    // mounds, each faintly paler on its crown.
    vec4 e = vorC(p / 0.045);
    float cellK = smoothstep(2.0, 6.0, 0.045 / pw);
    col *= 1.0 + 0.045 * cellK * (0.5 - smoothstep(0.1, 0.55, e.x));
    bump += e.zw * 0.2 * cellK * smoothstep(0.0, 0.25, e.y);
    vec2 hc = floor(p / 0.17);
    vec2 hp = (hc + 0.2 + 0.6 * h22(hc)) * 0.17;
    vec2 hdv = p - hp;
    float hd2 = dot(hdv, hdv);
    float footK = smoothstep(1.5, 4.0, 0.03 / pw) * step(h22(hc + 7.0).x, 0.88);
    float mound = exp(-hd2 / (2.0 * 0.026 * 0.026));
    bump += hdv / 0.026 * 0.55 * mound * footK;
    col = mix(col, uVein * 1.05, mound * 0.35 * footK);
    float vein = max(v1 * (0.16 + 0.08 * h12(vec2(lobe, 9.0))), v2 * 0.14);
    col = mix(col, uVein, max(vein, knot * 0.35));
    return col;
  }
`;

// ---------------------------------------------------------------------------------- the leaf
// A polar grid bent into the blade: a shallow funnel, fan pleats with the veins in the valleys, and
// a slow wave. The margin, teeth and sinus are cut per pixel (leafSd) so they stay crisp at any zoom.
// The angle round the blade from the sinus, bent with the distance out (the same as psiOf in BLADE).
function psiOf(phi, rn, L = LEAF) {
  let psi = (phi - L.sinus) % TAU;
  if (psi < 0) psi += TAU;
  return psi + L.bend * Math.pow(clamp(rn, 0, 1.2), 1.5) * (0.8 * Math.sin(1.5 * psi) + 0.35 * Math.sin(4 * psi + 1.0 + L.phase) * Math.sin(0.5 * psi));
}

export function leafHeight(x, z, L = LEAF) {
  const rho = Math.hypot(x, z);
  const phi = Math.atan2(z, x);
  const rn = rho / L.R0;
  const u = (psiOf(phi, rn, L) * L.lobes) / TAU;
  // Each panel between two veins is a shallow arch (a parabola across it): rounded ridges, the
  // veins in soft creases, smooth shading from one side of a panel to the other.
  const v = 2 * (u + 0.5 - Math.floor(u + 0.5)) - 1;
  // The pleats are deeper on some lobes than others and ease off toward the margin, so the blade
  // reads as a leaf, not a pleated fan.
  const psi = psiOf(phi, rn, L);
  const amp = 0.72 + 0.3 * Math.sin(2 * psi + 0.7 + L.phase) + 0.14 * Math.sin(5 * psi + 2 + L.phase);
  const pleat = (1 - v * v) * amp * (1 - 0.35 * rn);
  return L.cup * Math.pow(rn, 1.6) + L.pleat * rn * pleat * smooth(0.0, 0.35, rn) + 1.3 * rn * rn * Math.sin(2 * phi + 0.9) + 0.6 * rn * rn * rn * Math.sin(5 * phi + 2.1 + L.phase) + 0.35 * rn * rn * Math.sin(7 * phi + 0.4);
}

function marginR(phi, L = LEAF) {
  const u = (psiOf(phi, 0.95, L) * L.lobes) / TAU;
  const f = u - Math.floor(u);
  const lobe = Math.pow(Math.sin(Math.PI * f), 0.55);
  const R = L.R0 * (0.885 + 0.115 * lobe);
  const g = f * L.teeth - Math.floor(f * L.teeth);
  const tooth = 1 - Math.pow(Math.abs(2 * g - 1), 0.72);
  return R + L.tooth * tooth * (0.5 + 0.5 * lobe);
}

function leafGeometry(L = LEAF, NR = 96, NS = 216) {
  const Rmax = L.R0 * 1.0 + L.tooth + 0.8;
  const pos = [0, leafHeight(0, 0, L), 0];
  const flat = [0, 0];
  for (let i = 1; i <= NR; i++) {
    const rho = Rmax * Math.pow(i / NR, 1.1);
    for (let j = 0; j < NS; j++) {
      const phi = L.sinus + (TAU * j) / NS;
      const x = rho * Math.cos(phi), z = rho * Math.sin(phi);
      pos.push(x, leafHeight(x, z, L), z);
      flat.push(x, z);
    }
  }
  const idx = [];
  for (let j = 0; j < NS; j++) idx.push(0, 1 + ((j + 1) % NS), 1 + j);
  for (let i = 1; i < NR; i++) {
    const a = 1 + (i - 1) * NS, b = 1 + i * NS;
    for (let j = 0; j < NS; j++) {
      const j1 = (j + 1) % NS;
      idx.push(a + j, a + j1, b + j, a + j1, b + j1, b + j);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('aFlat', new THREE.Float32BufferAttribute(flat, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const leafVertex = /* glsl */ `
  attribute vec2 aFlat;
  uniform float uShell;
  varying vec2 vFlat;
  varying vec3 vWorld, vN;
  void main() {
    vec3 p = position + normal * uShell;
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vWorld = wp.xyz;
    vFlat = aFlat;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const leafFragment = /* glsl */ `
  ${NOISE}
  ${SKY}
  ${BLADE}
  uniform vec4 uBeads[${NB}];
  uniform int uNB;
  uniform vec3 uLilac, uCaustic, uHair, uHaze, uSheen;
  uniform float uHazeK, uFocus, uPupil, uPxScale;
  varying vec2 vFlat;
  varying vec3 vWorld, vN;
  void main() {
    vec2 p = vFlat;
    float pw = max(length(fwidth(p)), 1e-5);
    float dist = length(vWorld - cameraPosition);
    // Analytic defocus of the margin: the circle of confusion at this depth, in mm on the leaf.
    float coc = uPupil * abs(1.0 - dist / uFocus);
    float aa = max(pw, coc);
    float sd = leafSd(p);
    float alpha = 1.0 - smoothstep(-0.5 * aa, 0.5 * aa, sd);
    if (alpha <= 0.002) discard;
#ifdef LITE
    vec3 alb = mix(uLeafA, uLeafB, vn2(p * 0.07));
    float rn = length(p) / uR0;
    float uu = lobeU2(atan(p.y, p.x), rn);
    float dv = (fract(uu) - 0.5) * TAU / uLobes;
    alb = mix(alb, uLeafDeep, smoothstep(0.35, 1.0, abs(2.0 * fract(uu + 0.5) - 1.0)) * 0.35 * smoothstep(0.08, 0.4, rn));
    alb = mix(alb, uVein, exp(-pow(length(p) * sin(dv) / 0.5, 2.0)) * 0.12 * smoothstep(0.05, 0.2, rn));
    vec2 bump = vec2(0.0);
#else
    vec2 bump;
    vec3 alb = bladeColor(p, pw, bump);
#endif
    // A paler, slightly golden band along the margin.
    alb = mix(alb, uLeafEdge, smoothstep(-2.2, 0.0, sd) * 0.4);
    vec3 N = normalize(vN);
    if (!gl_FrontFacing) N = -N;
    N = normalize(N + vec3(bump.x, 0.0, bump.y));
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 hemi = skyHemi(N);
    // Valleys of the pleats see less sky: lilac in the creases.
    float rnv = length(p) / uR0;
    float vp = abs(2.0 * fract(lobeU2(atan(p.y, p.x), rnv) + 0.5) - 1.0);
    float valley = smoothstep(0.3, 1.0, vp);
    hemi *= mix(vec3(1.0), uLilac, valley * 0.42 * smoothstep(0.08, 0.4, rnv));
    // The beads: each shades the sky above the blade (a soft lilac shadow) and, being a lens,
    // gathers the glow into a bright core inside its own shadow.
    float occ = 0.0, key = 1.0;
    for (int i = 0; i < ${NB}; i++) {
      if (i >= uNB) break;
      vec4 b = uBeads[i];
      vec3 d = vWorld - b.xyz;
      float h = max(b.y - vWorld.y, 0.05);
      occ += b.w * b.w / (dot(d.xz, d.xz) + h * h + 0.2 * b.w * b.w);
      key *= beadBeam(vWorld, b.xyz, b.w);
    }
    hemi *= mix(vec3(1.0), uLilac, clamp(occ * 0.9, 0.0, 0.75));
    vec3 col = alb * (hemi + skyKey(N) * key);
    // Light through the blade from the glow side lights the pleats that face away from it.
    col += alb * vec3(1.0, 0.95, 0.6) * uLightGlow * 0.7 * max(dot(-N, glowL()), 0.0);
    // The silver hairs: a fine sheen, strongest where the blade turns away from the eye, and a
    // broad silvery shine where the pleats face the glow (the hairs catch it like brushed metal).
    float nv = clamp(dot(N, V), 0.0, 1.0);
    col += uSheen * min(skyColor(reflect(-V, N)), vec3(1.4)) * (0.05 + 0.75 * pow(1.0 - nv, 2.5)) * uExpo;
    float nh = max(dot(N, normalize(glowL() + V)), 0.0);
    col += vec3(0.95, 0.93, 0.9) * uLightGlow * (pow(nh, 8.0) * 0.38 + pow(nh, 40.0) * 0.3) * key * uExpo;
    // A waxy highlight from the bright part of the sky.
    vec3 H = normalize(uGlowDir + V);
    col += uSun * pow(max(dot(N, H), 0.0), 60.0) * 0.08 * uExpo;
    col = mix(col, uHaze, 1.0 - exp(-dist * uHazeK));
    gl_FragColor = vec4(col, alpha);
  }
`;

// The hairs as six shells: the blade drawn again, each a little higher along its normal, with a
// hashed field of fine strands. From above they are a velvet sheen; at a slant, where the eye passes
// through more of them, they turn silver; magnified, they resolve into single glassy hairs.
const shellFragment = /* glsl */ `
  ${NOISE}
  ${SKY}
  ${BLADE}
  uniform float uShellH, uHairLen, uTop;
  uniform vec3 uHair, uHaze;
  uniform float uHazeK;
  varying vec2 vFlat;
  varying vec3 vWorld, vN;
  void main() {
    vec2 p = vFlat;
    float pw = max(length(fwidth(p)), 1e-5);
    float rho = length(p), phi = atan(p.y, p.x);
    float h = uShellH / uHairLen; // 0 at the blade, 1 at the hair tips
    // Hairs stand along the margin too, a soft silver fringe just beyond the edge.
    float sd = rho - marginR(phi) - 0.45 * h;
    float ds = mod(phi - uSinus + PI, TAU) - PI;
    if (cos(ds) > 0.0 && rho > 9.0) sd = max(sd, 0.07 * (rho - 9.0) - rho * abs(sin(ds)));
    if (sd > 0.0) discard;
    float cell = 0.17;
    float r0 = 0.014;
    // How well single hairs resolve here: below about a pixel across they are a velvet sheen (the
    // shells); above it each is traced whole, from foot to tip, in the top shell alone, so a close
    // view never shows the shells as rows of dots.
    float res = smoothstep(0.45, 1.1, r0 / pw);
    if (uTop < 0.5 && res > 0.995) discard;
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vWorld);
    float nv = abs(dot(N, V));
    vec3 skyTop = skyColor(vec3(0.0, 1.0, 0.0));
    float a = 0.0;
    vec3 col = uHair * skyLight(vec3(0.0, 1.0, 0.0)) * (0.92 + 0.35 * h);
    if (res < 0.995) {
      // The velvet: one hair per cell, leaning outward; the average coverage once too fine to draw.
      vec2 c = floor(p / cell);
      vec2 j = h22(c);
      vec2 base = (c + 0.2 + 0.6 * j) * cell;
      vec2 lean = normalize(base + 1e-3) * (0.55 + 0.5 * j.x) + (j - 0.5) * 0.6;
      vec2 at = base + lean * uShellH * 0.8;
      float r = r0 * (1.0 - 0.5 * h);
      float d = length(p - at);
      float mask = (1.0 - smoothstep(r - 0.5 * pw, r + 0.5 * pw, d)) * step(h22(c + 7.0).x, 0.88);
      float cover = 0.88 * 3.14159 * r * r / (cell * cell);
      float fine = smoothstep(0.35, 1.0, pw / (2.0 * r));
      mask = mix(mask, cover, fine);
      a = mask / max(nv, 0.22) + cover * 1.6 * (1.0 - nv) * fine;
      a *= 1.0 - res;
    }
    if (uTop > 0.5 && res > 0.005) {
      // Traced hairs: the eye's ray against each hair (a tapering glass fibre) in the cells round
      // where it crosses the hair layer. The blade is taken as flat under them.
      vec3 rd = normalize(vWorld - cameraPosition);
      vec3 foot0 = vWorld - N * uShellH;
      vec2 c0 = floor(p / cell);
      float hm = 0.0;
      for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
        vec2 cc = c0 + vec2(float(x), float(y));
        if (h22(cc + 7.0).x > 0.88) continue;
        vec2 j = h22(cc);
        vec2 base = (cc + 0.2 + 0.6 * j) * cell;
        vec2 lean = normalize(base + 1e-3) * (0.55 + 0.5 * j.x) + (j - 0.5) * 0.6;
        vec2 db = base - p;
        vec3 A = foot0 + vec3(db.x, -(N.x * db.x + N.z * db.y) / max(N.y, 0.2), db.y);
        vec3 Bh = A + N * uHairLen + vec3(lean.x, 0.0, lean.y) * uHairLen * 0.8;
        vec3 ba = Bh - A, oa = cameraPosition - A;
        float baba = dot(ba, ba), bard = dot(ba, rd), baoa = dot(ba, oa), rdoa = dot(rd, oa);
        float sh = clamp((baoa - bard * rdoa) / max(baba - bard * bard, 1e-6), 0.0, 1.0);
        float th = max(bard * sh - rdoa, 0.0);
        float dd = length(oa + rd * th - ba * sh);
        float lp = max(th, 0.01) * pw / max(length(vWorld - cameraPosition), 0.01);
        float rr = r0 * (1.0 - 0.6 * sh);
        float core = 1.0 - smoothstep(rr - lp * 0.5, rr + lp * 0.5, dd);
        // A glass fibre: its edges brighter than its middle, and fading out toward its fine tip.
        float edge = smoothstep(rr * 0.15, rr * 0.9, dd);
        hm = max(hm, core * (0.35 + 0.65 * edge) * (1.0 - 0.55 * sh * sh));
      }
      a = mix(a, hm * 0.7, res);
      col = mix(col, skyTop * 1.15 + uSun * 0.12, res);
    }
    col += uSun * pow(max(dot(normalize(uGlowDir + V), N), 0.0), 8.0) * 0.25 * uExpo;
    float dist = length(vWorld - cameraPosition);
    col = mix(col, uHaze, 1.0 - exp(-dist * uHazeK));
    gl_FragColor = vec4(col, clamp(a * 0.85, 0.0, 0.9));
  }
`;

// ------------------------------------------------------------------------------------ beads
// Each bead is a sphere proxy whose pixels trace the real sphere: refraction into it (three indices
// for a faint dispersion), out through the far side, and on to the sky, the child, or, below, the
// blade itself, which lies inside the bead's focal length and so shows upright and about 6x larger,
// as under a magnifying glass. Reflection by Fresnel gives the bright rim. The tear bead also
// carries the salt streaks (schlieren) still churning in it, and a speck of dust.
const beadVertex = /* glsl */ `
  attribute vec4 aBead; // x: blade height under the bead, y: kind (0 tear, 1 on the leaf, 2 elsewhere), z: rim boost, w: seed
  varying vec3 vWorld, vC;
  varying float vR;
  varying vec4 vBead;
  void main() {
    mat4 m = modelMatrix * instanceMatrix;
    vec4 wp = m * vec4(position, 1.0);
    vWorld = wp.xyz;
    vC = (m * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vR = length(m[0].xyz);
    vBead = aBead;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const beadFragment = /* glsl */ `
  ${NOISE}
  ${SKY}
  ${CHILD}
  ${BLADE}
  uniform mat4 projectionMatrix;
  uniform float uPxAngle, uTime, uSchlieren, uSkin, uDust, uMirror;
  uniform vec3 uBladeLight, uWaterTint, uHaze;
  uniform float uHazeK;
  varying vec3 vWorld, vC;
  varying float vR;
  varying vec4 vBead;

  // The salt field of the tear still mixing with the dew: broad, slow, curling layers. Only its low
  // frequencies are kept: schlieren are seen as a wavering of what lies behind, not as lines.
  float salt(vec3 q, float t) {
    float a = t * 0.22 + q.y * 1.6 + length(q.xz) * 1.1;
    q.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * q.xz;
    q += 0.3 * vec3(vn3(q * 1.3 + t * 0.07), vn3(q * 1.3 + 4.0), vn3(q * 1.3 - t * 0.07));
    return vn3(q * vec3(2.2, 3.6, 2.2) + vec3(0.0, t * 0.05, 0.0));
  }

  vec3 behind(vec3 P2, vec3 T2, float pw) {
    vec3 c = envColor(P2 - uB, T2);
    if (vBead.y < 1.5 && T2.y < -0.02) {
      vec3 Q = P2 + T2 * ((vBead.x - P2.y) / T2.y);
      float lp = clamp(length(fwidth(Q.xz)), 0.0015, 2.0);
      float m = 1.0 - smoothstep(-lp, lp, leafSd(Q.xz));
      vec2 bump;
      vec3 bc = bladeColor(Q.xz, lp, bump);
      vec3 n = normalize(vec3(bump.x, 1.0, bump.y));
      // The blade under the bead, lit through the bead itself: the glow's focused core.
      bc *= (skyHemi(n) * 1.08 + skyKey(n) * beadBeam(Q, vC, vR)) * uBladeLight;
      c = mix(c, bc, m);
      // The silver hairs holding the bead up, seen magnified between it and the blade: each hair a
      // tapering glassy strand from the blade, leaning outward.
      float hl = 1.25;
      vec3 Pm = P2 + T2 * ((vBead.x + hl * 0.5 - P2.y) / T2.y);
      vec2 c0 = floor(Pm.xz / 0.17);
      float hm = 0.0;
      for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
        vec2 cc = c0 + vec2(float(x), float(y));
        if (h22(cc + 7.0).x > 0.45) continue;
        vec2 j = h22(cc);
        vec2 base = (cc + 0.2 + 0.6 * j) * 0.17;
        vec2 lean = normalize(base + 1e-3) * (0.55 + 0.5 * j.x) + (j - 0.5) * 0.6;
        vec3 A = vec3(base.x, vBead.x, base.y);
        vec3 Bh = A + vec3(lean.x * hl * 0.8, hl, lean.y * hl * 0.8);
        // Closest approach of the ray (from P2 along T2) and the hair's segment.
        vec3 ba = Bh - A, oa = P2 - A;
        float baba = dot(ba, ba), bard = dot(ba, T2), baoa = dot(ba, oa), rdoa = dot(T2, oa);
        float sh = clamp((baoa - bard * rdoa) / max(baba - bard * bard, 1e-6), 0.0, 1.0);
        float th = max(bard * sh - rdoa, 0.0);
        float dd = length(oa + T2 * th - ba * sh);
        float rr = 0.009 * (1.0 - 0.55 * sh);
        // A glass fibre seen through water: a soft, pale, translucent rod (no hard edges).
        float soft = rr * 0.8 + lp;
        float core = 1.0 - smoothstep(rr - soft, rr + soft, dd);
        hm = max(hm, core * smoothstep(0.2, 0.7, rr / lp) * (0.4 + 0.6 * sh));
      }
      c = mix(c, skyColor(vec3(0.0, 1.0, 0.0)) * 1.05 + uSun * 0.1, hm * 0.22 * m);
    }
    return c;
  }

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize(vWorld - ro);
    vec3 oc = ro - vC;
    float b = dot(oc, rd);
    float c = dot(oc, oc) - vR * vR;
    float h = b * b - c;
    float dc = sqrt(max(dot(oc, oc) - b * b, 0.0));
    float t = -b - sqrt(max(h, 0.0));
    float pw = max(t, 0.01) * uPxAngle; // mm per pixel at the surface
    float alpha = clamp((vR - dc) / pw + 0.5, 0.0, 1.0);
    if (alpha <= 0.0) discard;
    t = max(t, 0.0);
    vec3 P = ro + rd * t;
    vec3 N1 = normalize(P - vC);
    float cosi = clamp(dot(-rd, N1), 0.0, 1.0);

    vec3 T1 = refract(rd, N1, 1.0 / 1.333);
    float tear = 1.0 - step(0.5, vBead.y);
    float lum = 0.0;
    if (tear > 0.5 && uSchlieren > 0.0) {
      // The salt layers bend the light a little (salt water's index is higher): a smooth warp of
      // everything seen through the bead, and a soft +-2% in brightness where they are steepest.
      vec3 qm = (P + T1 * vR - vC) / vR;
      const float e = 0.09;
      float s0 = salt(qm, uTime);
      vec3 g = (vec3(salt(qm + vec3(e, 0, 0), uTime), salt(qm + vec3(0, e, 0), uTime), salt(qm + vec3(0, 0, e), uTime)) - s0) / e;
      T1 = normalize(T1 + uSchlieren * g * 0.05);
      lum = uSchlieren * 0.04 * (smoothstep(0.2, 1.6, length(g)) - 0.5);
    }
    float L = -2.0 * dot(T1, N1) * vR;
    vec3 P2 = P + T1 * L;
    vec3 N2 = normalize(P2 - vC);
    vec3 col = vec3(0.0);
    // Three indices for a faint dispersion; the blade below is traced once.
    vec3 T2g = refract(T1, -N2, 1.333);
    bool tir = dot(T2g, T2g) < 1e-4;
    if (tir) T2g = reflect(T1, -N2);
    vec3 thru = behind(P2, T2g, pw);
    vec3 T2r = refract(T1, -N2, 1.331), T2b = refract(T1, -N2, 1.336);
    if (!tir && dot(T2r, T2r) > 1e-4 && dot(T2b, T2b) > 1e-4) {
      vec3 e0 = envColor(P2 - uB, T2g);
      vec3 dr = envColor(P2 - uB, T2r) - e0;
      vec3 db = envColor(P2 - uB, T2b) - e0;
      float toBlade = step(0.02, -T2g.y) * (1.0 - step(1.5, vBead.y));
      thru += vec3(dr.r, 0.0, db.b) * (1.0 - toBlade);
    }
    // A mote drifting in the tear bead, off to one side: a speck of pollen-dust lit from the glow,
    // translucent, brighter on its glow side.
    if (tear > 0.5 && uDust > 0.0) {
      vec3 sp = vC + vR * vec3(-0.48 + 0.08 * sin(uTime * 0.11 + 1.0), 0.18 + 0.06 * sin(uTime * 0.07), 0.12 + 0.1 * cos(uTime * 0.09));
      vec3 w = sp - P;
      float tt = clamp(dot(w, T1), 0.0, L);
      vec3 off = P + T1 * tt - sp;
      float dd = length(off);
      const float mr = 0.045;
      float body = 1.0 - smoothstep(mr * 0.75, mr * 1.05, dd);
      float lit = 0.6 + 0.4 * dot(normalize(off + 1e-6), glowL());
      vec3 mote = (skyLight(vec3(0.0, 1.0, 0.0)) * 0.9 + uLightGlow * 1.6) * vec3(1.0, 0.94, 0.84) * lit;
      thru = mix(thru, mote, body * 0.6 * uDust);
    }
    thru *= (1.0 + lum) * mix(vec3(1.0), uWaterTint, clamp(L / (2.0 * vR), 0.0, 1.0));
    // Toward its edge a bead held up on hairs turns to quicksilver: rays that reach its underside
    // at a slant are turned back by the film of air the hairs hold under it, and show the sky.
    float rr = dc / vR;
    // Inside the rim a drop shows the dark, low world bent up into it: a deeper band, which gives
    // the bead its depth...
    thru *= 1.0 - 0.3 * smoothstep(0.5, 0.82, rr) * (1.0 - smoothstep(0.86, 0.95, rr));
    // ...and at the very edge, a bead held up on hairs turns to quicksilver: rays that reach its
    // underside at a slant are turned back by the film of air the hairs hold under it.
    vec2 gxz = normalize(uGlowDir.xz);
    float away = dot(normalize(N1.xz + 1e-5), -gxz) * 0.5 + 0.5;
    float qs = smoothstep(0.86, 0.95, rr) * (1.0 - smoothstep(0.975, 1.0, rr)) * (vBead.y < 1.5 ? 1.0 : 0.6) * pow(away, 1.6);
    vec3 silver = skyColor(normalize(vec3(-N1.x * 0.6, 1.0, -N1.z * 0.6))) * 1.3 + uSun * 0.15;
    thru = mix(thru, silver, qs * 0.7);
    // The glow, gathered by the bead as by a lens, lands inside it on the side away from the glow:
    // a warm, bright crescent (the second highlight every dewdrop has).
    float cres = smoothstep(0.45, 0.78, rr) * (1.0 - smoothstep(0.8, 0.93, rr)) * pow(away, 6.0);
    thru += uLightGlow * vec3(1.15, 1.0, 0.85) * cres * 1.6 * (vBead.y < 1.5 ? 1.0 : 0.7) * uExpo;
    // Reflection: Fresnel, a little stronger than clean water's 2% so the skin reads as a mirror of
    // sky; stronger still when we are pressed against it, and brighter at a ting.
    float F0 = mix(0.03, mix(0.12, 0.24, uSkin), uMirror * tear) * (1.0 + 0.2 * vBead.z);
    float F = F0 + (1.0 - F0) * pow(1.0 - cosi, 5.0);
    vec3 Rr = reflect(rd, N1);
    vec3 refl = envColor(P - uB, Rr);
    // The brightest part of the dawn, the sky just above the glow: a crisp highlight that makes
    // every bead the brightest thing round it, with a soft bloom of the glow about it.
    float hs = max(dot(Rr, uGlowDir), 0.0);
    vec3 W = normalize(uGlowDir + vec3(0.0, 0.42, 0.0));
    float hw = max(dot(Rr, W), 0.0);
    refl += uSun * (pow(hs, 70.0) * 9.0 + pow(hs, 700.0) * 30.0);
    col = mix(thru, refl, F);
    col += uSun * (smoothstep(0.9965, 0.9985, hw) * 2.6 + pow(hw, 260.0) * 0.5) * uExpo;
    // At a ting the rim brightens: the sky bends round the edge.
    col += skyColor(vec3(0.0, 1.0, 0.0)) * pow(1.0 - cosi, 3.0) * (0.06 + 0.4 * vBead.z);
    float dist = length(P - cameraPosition);
    col = mix(col, uHaze, 1.0 - exp(-dist * uHazeK));
    vec4 clip = projectionMatrix * viewMatrix * vec4(P, 1.0);
    gl_FragDepth = clamp(0.5 + 0.5 * clip.z / clip.w, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

// ------------------------------------------------------------------------- brass, skin, glass
const meshVertex = /* glsl */ `
  varying vec3 vWorld, vN, vObj;
  varying vec2 vUv;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vObj = position;
    vUv = uv;
    vN = normalize(transpose(inverse(mat3(modelMatrix))) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

// Worn brass mirroring the same dawn sky. tMap: r = engraved letters, g = scratches and wear.
// Old brass is not yellow paint: a pale gold mirror where hands have polished it, and a dark olive
// patina in the letters, the seat of the glass and the underside, where nothing has rubbed it.
const brassFragment = /* glsl */ `
  ${NOISE}
  ${SKY}
  ${CHILD}
  uniform sampler2D tMap;
  uniform float uUseMap, uRough, uGlint, uGlintAng;
  uniform vec3 uBrass, uPatina, uGlintCol;
  varying vec3 vWorld, vN, vObj;
  varying vec2 vUv;
  void main() {
    vec3 N = normalize(vN);
    if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(cameraPosition - vWorld);
    vec4 m = uUseMap > 0.5 ? texture2D(tMap, vUv) : vec4(0.0, 0.35, 0.0, 0.0);
    float letters = m.r;
    float scratch = m.g;
    // Where it is recessed: the glass's seat (the inner wall), the underside, the engraving.
    float rad = uUseMap > 0.5 ? length(vObj.xy) : length(vObj.xz);
    float ht = uUseMap > 0.5 ? 1.7 : vObj.y;
    float recess = (1.0 - smoothstep(15.25, 15.9, rad)) * 0.85 + (1.0 - smoothstep(-2.4, 0.2, ht)) * 0.55;
    float mottle = vn2(vObj.xz * 0.55 + vObj.y * 0.3) * 0.6 + vn2(vObj.xz * 2.1) * 0.4;
    float patina = clamp(letters * 1.1 + recess * 0.7 + (mottle - 0.55) * 0.45 - scratch * 0.7, 0.0, 1.0);
    float rough = clamp(uRough + 0.45 * patina - 0.2 * scratch, 0.06, 1.0);
    vec3 R = reflect(-V, N);
    float nv = clamp(dot(N, V), 0.0, 1.0);
    vec3 F = mix(uBrass, vec3(1.0), pow(1.0 - nv, 5.0));
    // Polished: a sharp mirror of the sky; rough: the sky's light spread out.
    vec3 spec = mix(min(skyColor(R), vec3(6.0)) * uExpo * 1.3, skyLight(N) * 0.95, rough);
    // The glow's crisp highlight on the polished edges.
    float g = max(dot(R, glowL()), 0.0);
    spec += uSun * (pow(g, 300.0) * 6.0 + pow(g, 40.0) * 0.5) * (1.0 - rough) * uExpo;
    vec3 col = spec * F;
    // Patina: dark, olive-brown, matte.
    vec3 dark = uPatina * (skyLight(N) * 0.75 + 0.05);
    col = mix(col, dark, patina * 0.75);
    // The engraving glints as the glass settles: a sweep of light along the letters' edges.
    float ang = atan(vUv.y - 0.5, vUv.x - 0.5);
    float sweep = exp(-pow((mod(ang - uGlintAng + PI, TAU) - PI) / 0.22, 2.0));
    col += uGlintCol * letters * (1.0 - letters * 0.5) * sweep * uGlint;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// A child's fingers: warm skin; light from the low glow passing through the thin edges and coming
// out warm red on the far side (the same warm glow the cell holds inside it); creases at the
// knuckles, a cuticle at each short bitten nail, a paper plaster, a smudge of ink. vL is the
// position in the loupe's own space, where the joints and the ink are placed.
const skinVertex = /* glsl */ `
  uniform mat4 uLoupeInv;
  varying vec3 vWorld, vN, vObj, vL;
  varying vec2 vUv;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vObj = position;
    vL = (uLoupeInv * wp).xyz;
    vUv = uv;
    vN = normalize(transpose(inverse(mat3(modelMatrix))) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const skinFragment = /* glsl */ `
  ${NOISE}
  ${SKY}
  uniform vec3 uSkin, uGlowSkin, uInkCol;
  uniform vec4 uInk;
  uniform vec4 uJoints[4];
  uniform vec3 uJointAx[4];
  uniform float uKind; // 0 skin, 1 nail, 2 plaster
  uniform float uThick; // the finger's radius (mm), for the light through it
  varying vec3 vWorld, vN, vObj, vL;
  varying vec2 vUv;
  void main() {
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vWorld);
    float nv = clamp(dot(N, V), 0.0, 1.0);
    vec3 alb = uSkin;
    if (uKind < 0.5) {
      alb *= 0.96 + 0.07 * vn2(vL.xz * 0.9 + vL.y * 0.5);
      // Knuckle creases: a few soft folds across the back of each joint (shading, not lines).
      for (int i = 0; i < 4; i++) {
        vec3 d = vL - uJoints[i].xyz;
        float along = dot(d, uJointAx[i]);
        float near = exp(-dot(d, d) / (uJoints[i].w * uJoints[i].w * 2.2));
        float folds = 0.5 + 0.5 * cos(along * 5.2);
        alb *= 1.0 - 0.13 * near * folds * exp(-along * along / 3.0);
      }
      // A smudge of violet ink, as from a fountain pen.
      vec3 dI = vL - uInk.xyz;
      dI.z *= 0.35; // smeared along the finger
      float ragged = vn2(vL.xz * 1.1 + 3.0) * 0.6 + vn2(vL.xz * 3.3) * 0.4;
      float ink = (1.0 - smoothstep(uInk.w * 0.25, uInk.w, length(dI) + (ragged - 0.5) * uInk.w * 0.9)) * (0.45 + 0.55 * ragged);
      alb = mix(alb, uInkCol, ink * 0.5);
      // Warmer, redder skin at the knuckles and the fingertips.
      float flush = 0.0;
      for (int i = 0; i < 4; i++) flush = max(flush, exp(-dot(vL - uJoints[i].xyz, vL - uJoints[i].xyz) / 30.0));
      alb *= mix(vec3(1.0), vec3(1.02, 0.9, 0.86), flush * 0.6);
    } else if (uKind > 1.5) {
      // Plaster: woven fabric, a row of tiny breathing holes, its gauze pad paler.
      float holes = smoothstep(0.32, 0.18, length(fract(vUv * vec2(22.0, 6.0)) - 0.5));
      alb *= 1.0 - 0.1 * holes - 0.05 * vn2(vUv * 90.0);
    }
    vec3 L = glowL();
    float nl = dot(N, L);
    vec3 E = skyLight(N);
    vec3 col = alb * E;
    if (uKind < 1.5) {
      // Skin scatters light under itself: the shaded side stays warm instead of going grey.
      col += alb * vec3(0.12, 0.04, 0.025) * (1.0 - clamp(nl * 0.5 + 0.5, 0.0, 1.0)) * uExpo;
      // Light through the finger from the glow: on the far side, where the chord through the finger
      // along the light is short, it comes out red-orange (red travels furthest in skin).
      float chord = 2.0 * uThick * max(-nl, 0.0) + 0.35;
      vec3 trans = exp(-chord / vec3(3.2, 1.15, 0.6));
      float far = smoothstep(0.05, -0.25, nl);
      col += uGlowSkin * trans * far * (0.4 + 0.6 * pow(1.0 - nv, 1.5)) * 3.2 * uExpo;
      // At the silhouette the finger is thin: the low light shines through its edges warm red,
      // strongest on the side turned from the glow, and a paler lit rim on the side facing it.
      float edgeT = pow(1.0 - nv, 2.2);
      col += uGlowSkin * vec3(1.0, 0.4, 0.2) * edgeT * (0.3 + 0.7 * smoothstep(0.35, -0.3, nl)) * 1.25 * uExpo;
      col += uLightGlow * vec3(1.0, 0.9, 0.8) * pow(1.0 - nv, 3.0) * smoothstep(-0.1, 0.4, nl) * 0.5 * uExpo;
    } else {
      col += uGlowSkin * pow(1.0 - nv, 3.0) * 0.05 * uExpo;
    }
    if (uKind > 0.5 && uKind < 1.5) {
      // Nail: a pale, short free edge (bitten), a pink cuticle at its base, and a soft sheen.
      col = mix(col, skyLight(N) * vec3(0.95, 0.92, 0.9), smoothstep(0.6, 0.9, vObj.z) * 0.3);
      col = mix(col, col * vec3(1.0, 0.86, 0.84), smoothstep(-0.6, -0.9, vObj.z) * 0.5);
      float gl = pow(max(dot(reflect(-V, N), glowL()), 0.0), 30.0);
      col += min(skyColor(reflect(-V, N)), vec3(1.5)) * 0.06 + uLightGlow * gl * 0.8;
    }
    gl_FragColor = vec4(col, 1.0);
  }
`;

// The glass: the mid layer seen through it, magnified by M about its axis (inverted when M < 0),
// with a little barrel distortion and colour fringing toward its rim, and the sky faint on its face.
const glassFragment = /* glsl */ `
  ${NOISE}
  ${SKY}
  uniform sampler2D tPortal, tPortalBlur;
  uniform float uBlurMix, uM, uDiscR, uBarrel, uFringe, uVignette;
  uniform vec2 uC, uRectC, uRectS;
  varying vec3 vWorld, vN, vObj;
  varying vec2 vUv;
  vec3 look(vec2 st) {
    return mix(texture2D(tPortal, st).rgb, texture2D(tPortalBlur, st).rgb, uBlurMix);
  }
  void main() {
    vec2 rel = gl_FragCoord.xy - uC;
    float r = length(rel) / uDiscR;
    vec2 relB = rel * (1.0 + uBarrel * r * r);
    // The target already holds the magnified window (the part of the disc that is on screen), so
    // only the sign of M matters here.
    float sg = sign(uM);
    vec2 st = 0.5 + sg * (relB - uRectC) / uRectS;
    float fr = uFringe * smoothstep(0.45, 1.0, r);
    vec2 stR = 0.5 + sg * (relB * (1.0 + fr) - uRectC) / uRectS;
    vec2 stB = 0.5 + sg * (relB * (1.0 - fr) - uRectC) / uRectS;
    vec3 col;
    col.r = look(stR).r;
    col.g = look(st).g;
    col.b = look(stB).b;
    col *= 1.0 - uVignette * smoothstep(0.6, 1.0, r);
    vec3 N = normalize(vN);
    vec3 V = normalize(cameraPosition - vWorld);
    float nv = abs(dot(N, V));
    col += skyColor(reflect(-V, N)) * (0.025 + 0.4 * pow(1.0 - nv, 5.0)) * uExpo;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// Simple lit matter for the far layer (soil, the pot's rim).
const litFragment = /* glsl */ `
  ${NOISE}
  ${SKY}
  uniform vec3 uColor, uColor2, uHaze;
  uniform float uNoise, uHazeK;
  varying vec3 vWorld, vN, vObj;
  varying vec2 vUv;
  void main() {
    vec3 N = normalize(vN);
    vec3 alb = mix(uColor, uColor2, vn2(vWorld.xz * uNoise) * 0.7 + vn2(vWorld.xz * uNoise * 4.0) * 0.3);
    vec3 col = alb * skyLight(N);
    col = mix(col, uHaze, 1.0 - exp(-length(vWorld - cameraPosition) * uHazeK));
    gl_FragColor = vec4(col, 1.0);
  }
`;

// The backdrop of the mid layer: the far layer, already blurred, looked up through the main camera.
const backdropFragment = /* glsl */ `
  uniform sampler2D tFar;
  uniform mat4 uMainVP;
  varying vec3 vWorld, vN, vObj;
  varying vec2 vUv;
  void main() {
    vec4 c = uMainVP * vec4(vWorld, 1.0);
    vec2 uv = clamp(c.xy / c.w * 0.5 + 0.5, 0.001, 0.999);
    gl_FragColor = vec4(texture2D(tFar, uv).rgb, 1.0);
  }
`;

// ------------------------------------------------------------------------------- blur helper
// A Gaussian blur of any size: the source is halved until the kernel fits in a few texels, then
// blurred in two passes. Premultiplied alpha blurs correctly.
const blurVertex = /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const downFragment = /* glsl */ `
  uniform sampler2D tSrc; uniform vec2 uTexel; varying vec2 vUv;
  void main() {
    vec4 a = texture2D(tSrc, vUv + uTexel * vec2(-0.5, -0.5)) + texture2D(tSrc, vUv + uTexel * vec2(0.5, -0.5));
    vec4 b = texture2D(tSrc, vUv + uTexel * vec2(-0.5, 0.5)) + texture2D(tSrc, vUv + uTexel * vec2(0.5, 0.5));
    gl_FragColor = (a + b) * 0.25;
  }
`;
const gaussFragment = /* glsl */ `
  uniform sampler2D tSrc; uniform vec2 uStep; uniform float uSigma; varying vec2 vUv;
  void main() {
    vec4 acc = vec4(0.0); float wsum = 0.0;
    for (int i = -7; i <= 7; i++) {
      float x = float(i);
      float w = exp(-0.5 * x * x / (uSigma * uSigma));
      acc += texture2D(tSrc, vUv + uStep * x) * w;
      wsum += w;
    }
    gl_FragColor = acc / wsum;
  }
`;

class Blur {
  constructor() {
    this.targets = [];
    this.down = new THREE.ShaderMaterial({ uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() } }, vertexShader: blurVertex, fragmentShader: downFragment, depthTest: false, depthWrite: false });
    this.gauss = new THREE.ShaderMaterial({ uniforms: { tSrc: { value: null }, uStep: { value: new THREE.Vector2() }, uSigma: { value: 1 } }, vertexShader: blurVertex, fragmentShader: gaussFragment, depthTest: false, depthWrite: false });
    this.quad = new FullScreenQuad(this.down);
  }

  target(i, w, h) {
    let t = this.targets[i];
    if (!t) t = this.targets[i] = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, depthBuffer: false });
    if (t.width !== w || t.height !== h) t.setSize(w, h);
    return t;
  }

  // Returns the texture of `src` (w x h) blurred by a Gaussian of `sigma` source pixels.
  run(renderer, src, w, h, sigma) {
    if (!(sigma > 0.35)) return src;
    let tex = src, cw = w, ch = h, scale = 1, k = 0;
    while (sigma * scale > 2.2 && scale > 1 / 32) {
      const nw = Math.max(1, Math.ceil(cw / 2)), nh = Math.max(1, Math.ceil(ch / 2));
      const t = this.target(k++, nw, nh);
      this.down.uniforms.tSrc.value = tex;
      this.down.uniforms.uTexel.value.set(1 / cw, 1 / ch);
      this.quad.material = this.down;
      renderer.setRenderTarget(t);
      this.quad.render(renderer);
      tex = t.texture;
      cw = nw;
      ch = nh;
      scale /= 2;
    }
    const s = Math.max(sigma * scale, 0.3);
    const a = this.target(10, cw, ch), b = this.target(11, cw, ch);
    this.quad.material = this.gauss;
    this.gauss.uniforms.uSigma.value = s;
    this.gauss.uniforms.tSrc.value = tex;
    this.gauss.uniforms.uStep.value.set(1 / cw, 0);
    renderer.setRenderTarget(a);
    this.quad.render(renderer);
    this.gauss.uniforms.tSrc.value = a.texture;
    this.gauss.uniforms.uStep.value.set(0, 1 / ch);
    renderer.setRenderTarget(b);
    this.quad.render(renderer);
    return b.texture;
  }

  dispose() {
    for (const t of this.targets) t?.dispose();
    this.down.dispose();
    this.gauss.dispose();
    this.quad.dispose();
  }
}

// ------------------------------------------------------------------------------ the composite
// GardenPass runs right after the scene pass while the Garden is on screen (scene-linear HDR):
// the mid layer's own blur (a focus pull, or the glass giving up in the dive), the glass's barrel
// distortion and fringing over the whole frame once the eye is at the glass, and the near layer
// (brass and fingers) laid over everything with its own depth of field.
const compositeFragment = /* glsl */ `
  uniform sampler2D tDiffuse, tBlur, tNear;
  uniform float uBlurMix, uNear, uGlass, uBarrel, uFringe, uDiscR, uExpo;
  uniform vec2 uRes;
  varying vec2 vUv;
  vec3 mid(vec2 uv) { return mix(texture2D(tDiffuse, uv).rgb, texture2D(tBlur, uv).rgb, uBlurMix); }
  void main() {
    vec2 uv = vUv;
    vec3 col;
    if (uGlass > 0.0) {
      vec2 rel = (uv - 0.5) * uRes;
      float r = length(rel) / uDiscR;
      // Barrel distortion, scaled so the frame's corners still sample its corners.
      float rc = length(0.5 * uRes) / uDiscR;
      vec2 relB = rel * (1.0 + uBarrel * r * r) / (1.0 + uBarrel * rc * rc);
      float fr = uFringe * smoothstep(0.35, 1.0, r);
      vec2 u0 = 0.5 + relB / uRes;
      col.r = mid(0.5 + (u0 - 0.5) * (1.0 + fr)).r;
      col.g = mid(u0).g;
      col.b = mid(0.5 + (u0 - 0.5) * (1.0 - fr)).b;
      col = mix(mid(uv), col, uGlass);
    } else col = mid(uv);
    vec4 n = texture2D(tNear, uv) * uNear;
    col = col * (1.0 - n.a) + n.rgb;
    gl_FragColor = vec4(col * uExpo, 1.0);
  }
`;

export class GardenPass extends Pass {
  constructor(garden) {
    super();
    this.garden = garden;
    this.blur = new Blur();
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        tBlur: { value: null },
        tNear: { value: null },
        uBlurMix: { value: 0 },
        uNear: { value: 1 },
        uGlass: { value: 0 },
        uBarrel: { value: 0.08 },
        uFringe: { value: 0.01 },
        uDiscR: { value: 500 },
        uExpo: { value: 1 },
        uRes: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: compositeFragment,
      depthTest: false,
      depthWrite: false,
    });
    this.quad = new FullScreenQuad(this.material);
  }

  render(renderer, writeBuffer, readBuffer) {
    const g = this.garden;
    const u = this.material.uniforms;
    const w = readBuffer.width, h = readBuffer.height;
    const sigma = g.midSigma * (h / 1080);
    if (g.useMidLow && g.midLow) {
      const t = g.midLow;
      u.tDiffuse.value = t.texture;
      u.tBlur.value = this.blur.run(renderer, t.texture, t.width, t.height, sigma * (t.height / h));
      u.uBlurMix.value = 1;
    } else {
      u.tDiffuse.value = readBuffer.texture;
      u.tBlur.value = this.blur.run(renderer, readBuffer.texture, w, h, sigma);
      u.uBlurMix.value = sigma > 0.35 ? 1 : 0;
    }
    u.tNear.value = g.nearTexture;
    u.uNear.value = g.nearTexture && g.loupeOn ? 1 : 0;
    u.uGlass.value = g.glass.on;
    u.uBarrel.value = g.glass.barrel;
    u.uFringe.value = g.glass.fringe;
    u.uDiscR.value = g.glass.discR;
    u.uExpo.value = 1;
    u.uRes.value.set(w, h);
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.render(renderer);
  }

  dispose() {
    this.blur.dispose();
    this.material.dispose();
    this.quad.dispose();
  }
}

// ---------------------------------------------------------------------------- the engraving
function engraving() {
  const S = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, S, S);
  const R = S / 2;
  const rnd = rng(7);
  // Wear: fine circular polishing lines and random scratches (green channel).
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 260; i++) {
    const r = R * (0.83 + 0.17 * rnd());
    const a0 = rnd() * TAU, a1 = a0 + 0.2 + rnd() * 1.4;
    g.strokeStyle = `rgba(0, ${Math.floor(40 + 90 * rnd())}, 0, 0.5)`;
    g.lineWidth = 0.8 + rnd() * 1.4;
    g.beginPath();
    g.arc(R, R, r, a0, a1);
    g.stroke();
  }
  for (let i = 0; i < 70; i++) {
    const a = rnd() * TAU, r = R * (0.84 + 0.15 * rnd());
    const x = R + Math.cos(a) * r, y = R + Math.sin(a) * r;
    const b = rnd() * TAU, l = 10 + rnd() * 50;
    g.strokeStyle = `rgba(0, ${Math.floor(120 + 120 * rnd())}, 0, 0.7)`;
    g.lineWidth = 0.6 + rnd();
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(b) * l, y + Math.sin(b) * l);
    g.stroke();
  }
  g.globalCompositeOperation = 'source-over';
  // The maker's engraving along the top of the bezel, read from the eye (red channel). Drawn the
  // way the eye sees it, then turned half round: the face is seen from above with +z up.
  g.save();
  g.translate(S, S);
  g.rotate(Math.PI);
  const text = 'HOLARKY  ·  10×';
  g.font = `600 44px "Avenir Next", "Futura", "Century Gothic", "Helvetica Neue", "DejaVu Sans", sans-serif`;
  g.fillStyle = '#f00';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const rText = R * 0.915;
  let total = 0;
  const widths = [...text].map((ch) => {
    const w = g.measureText(ch).width + 6;
    total += w;
    return w;
  });
  let a = -Math.PI / 2 - total / rText / 2;
  [...text].forEach((ch, i) => {
    const aa = a + widths[i] / 2 / rText;
    g.save();
    g.translate(R + Math.cos(aa) * rText, R + Math.sin(aa) * rText);
    g.rotate(aa + Math.PI / 2);
    g.fillText(ch, 0, 0);
    g.restore();
    a += widths[i] / rText;
  });
  // "G." scratched by another hand, lower right, crude and shallow.
  g.save();
  g.translate(R + Math.cos(0.95) * rText, R + Math.sin(0.95) * rText);
  g.rotate(0.95 - Math.PI / 2 + 0.25);
  g.strokeStyle = '#f00';
  g.lineCap = 'round';
  const jit = () => (rnd() - 0.5) * 3;
  for (let pass = 0; pass < 2; pass++) {
    g.lineWidth = 3.2 - pass;
    g.beginPath();
    for (let k = 0; k <= 14; k++) {
      const t = 0.35 + (k / 14) * 1.65 * Math.PI;
      const x = -14 + Math.cos(t + Math.PI) * 20 + jit(), y = Math.sin(t + Math.PI) * 24 + jit();
      if (k === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.lineTo(-6 + jit(), 4 + jit());
    g.lineTo(6 + jit(), 3 + jit());
    g.stroke();
    g.beginPath();
    g.arc(22 + jit() * 0.3, 20, 3.2, 0, TAU);
    g.stroke();
  }
  g.restore();
  g.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.NoColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// ------------------------------------------------------------------------------- the Garden
export class Garden {
  constructor(renderer) {
    this.renderer = renderer;
    this.time = 0;
    this.camera = new THREE.PerspectiveCamera(FOV, 16 / 9, 0.5, 3000);
    this.camera.up.set(0, 0, 1);
    this.camera.position.set(0, B.y + EYE_H, 0);
    this.camera.lookAt(B);
    this.scene = new THREE.Scene();
    this.emptyScene = new THREE.Scene(); // what the scene pass draws while the mid layer is drawn at half size
    this.farScene = new THREE.Scene();
    this.nearScene = new THREE.Scene();
    this.size = new THREE.Vector2(16, 9);

    // State the director drives.
    this.focus = EYE_H - BEAD_R; // focus distance (mm from the eye)
    this.pupil = 4.5; // the child's pupil at dawn (mm): the aperture of every depth of field here
    this.midSigma = 0; // extra blur of the mid layer (px at 1080p): a focus pull or the glass in the dive
    this.loupeOn = false;
    this.loupePos = new THREE.Vector3(0, B.y + LOUPE.rest, 0);
    this.portalM = null; // override of the glass's magnification (the dive eases it toward 1)
    this.focusBlur = null; // override of the glass's focus blur (px at 1080p)
    this.glass = { on: 0, barrel: 0.08, fringe: 0.012, discR: 500 };
    this.glint = 0; // the engraving's sweep, 0..1 through it
    this.skyOcc = 0; // the child leaning in: the sky dims 15%
    this.expo = 1;
    this.schlieren = 0.5;
    this.skin = 0; // pressed against the tear bead's skin: it reads as a mirror
    this.mirror = 0; // the tear bead's skin as a curved mirror of sky (the dive)
    this.nearTexture = null;
    this.optics = { M: 1, blurPx: 0, flip: false, dFlip: 36, d: LOUPE.rest, discR: 0, discC: new THREE.Vector2() };

    this.u = this.sharedUniforms();
    this.buildLeaf();
    this.buildBeads();
    this.buildFar();
    this.buildLoupe();
    this.buildPortal();
    this.pass = new GardenPass(this);
    this.blurFar = new Blur();
    this.blurNear = new Blur();
    this.blurPortal = new Blur();
    this.setSize(...renderer.getDrawingBufferSize(new THREE.Vector2()).toArray());
  }

  sharedUniforms() {
    const c = (hex, gain) => sceneColor(hex, gain);
    return {
      uZenith: { value: c(DAWN.zenith) },
      uSkyC: { value: c(DAWN.sky) },
      uHorizon: { value: c(DAWN.horizon) },
      uGlow: { value: c(DAWN.glow) },
      uGround: { value: c(DAWN.ground) },
      uSun: { value: c(DAWN.sun) },
      uGlowDir: { value: GLOW_DIR.clone() },
      // A clear dawn: a lilac dome for fill and the warm glow low in the east as a real key, so the
      // pleats facing it are bright and those turned away go cool and deep.
      uLightUp: { value: new THREE.Color(0.7, 0.7, 0.86) },
      uLightDown: { value: new THREE.Color(0.26, 0.27, 0.3) },
      uLightGlow: { value: new THREE.Color(0.58, 0.45, 0.3) },
      uSkyOcc: { value: 0 },
      uExpo: { value: 1 },
      uHaze: { value: c(DAWN.haze) },
      uHazeK: { value: 0.00022 },
      uTime: { value: 0 },
      // The child, relative to the tear bead: head over it, shoulders back toward the step, an arm
      // reaching down to the glass.
      uHeadC: { value: new THREE.Vector3(0, EYE_H + 55, -40) },
      uHeadR: { value: new THREE.Vector3(68, 82, 92) },
      uBodyC: { value: new THREE.Vector3(0, EYE_H + 70, -250) },
      uBodyR: { value: new THREE.Vector3(185, 95, 120) },
      uArmA: { value: new THREE.Vector3(-120, EYE_H + 40, -190) },
      uArmB: { value: new THREE.Vector3(-8, 30, -40) },
      uChildCol: { value: c(DAWN.child) },
      uChild: { value: 1 },
      uB: { value: B.clone() },
    };
  }

  bladeUniforms() {
    const c = (hex) => sceneColor(hex);
    return {
      uR0: { value: LEAF.R0 },
      uLobes: { value: LEAF.lobes },
      uSinus: { value: LEAF.sinus },
      uTooth: { value: LEAF.tooth },
      uTeeth: { value: LEAF.teeth },
      uBend: { value: LEAF.bend },
      uBendPhase: { value: LEAF.phase },
      uLeafA: { value: c(0x78ad8c) },
      uLeafB: { value: c(0x9fc99a) },
      uVein: { value: c(0xd4e8cc) },
      uLeafEdge: { value: c(0xd0dc9e) },
      uLeafDeep: { value: c(0x4f8577) },
    };
  }

  buildLeaf() {
    const L = LEAF;
    this.leafGeo = leafGeometry(L);
    const blade = this.bladeUniforms();
    this.beadUniform = Array.from({ length: NB }, () => new THREE.Vector4(0, -1000, 0, 0));
    const leafU = {
      ...this.u,
      ...blade,
      uBeads: { value: this.beadUniform },
      uNB: { value: 0 },
      uLilac: { value: new THREE.Color(0.66, 0.6, 0.86) },
      uCaustic: { value: new THREE.Color(0.55, 0.5, 0.42) },
      uHair: { value: sceneColor(0xeef0f4) },
      uSheen: { value: new THREE.Color(0.55, 0.55, 0.6) },
      uFocus: { value: EYE_H },
      uPupil: { value: 0 },
      uPxScale: { value: 1 },
      uShell: { value: 0 },
    };
    this.leafMat = new THREE.ShaderMaterial({ uniforms: leafU, vertexShader: leafVertex, fragmentShader: leafFragment, alphaToCoverage: true, side: THREE.DoubleSide });
    this.leaf = new THREE.Mesh(this.leafGeo, this.leafMat);
    this.scene.add(this.leaf);

    // Six shells of hair, 0.2 mm apart.
    this.shells = [];
    const hairLen = 1.2;
    for (let i = 1; i <= 6; i++) {
      const h = (i / 6) * hairLen;
      const m = new THREE.ShaderMaterial({
        uniforms: { ...this.u, ...blade, uShell: { value: h }, uShellH: { value: h }, uHairLen: { value: hairLen }, uTop: { value: i === 6 ? 1 : 0 }, uHair: { value: sceneColor(0xf4f4f8) } },
        vertexShader: leafVertex,
        fragmentShader: shellFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(this.leafGeo, m);
      mesh.renderOrder = 1 + i;
      this.shells.push(mesh);
      this.scene.add(mesh);
    }
  }

  // The tear bead in the central cup, guttation beads at the tooth tips, and beads held up on the
  // hairs, rolled into the valleys of the pleats.
  buildBeads() {
    const rnd = rng(11);
    const L = LEAF;
    const beads = [{ c: B.clone(), r: BEAD_R, kind: 0, leafY: leafHeight(0, 0) }];
    // On the hairs, in the valleys of the pleats.
    const valleys = [1, 2, 4, 5, 6, 7, 3, 8, 2, 5, 7, 0];
    for (let i = 0; i < valleys.length; i++) {
      const k = valleys[i];
      const phi = L.sinus + ((k + 0.5 + (rnd() - 0.5) * 0.16) * TAU) / L.lobes;
      const rho = 9 + rnd() * 25;
      const r = 0.6 + Math.pow(rnd(), 1.4) * 1.3;
      const x = rho * Math.cos(phi), z = rho * Math.sin(phi);
      const y = leafHeight(x, z);
      beads.push({ c: new THREE.Vector3(x, y + r + 0.75, z), r, kind: 1, leafY: y });
    }
    // At the tips of teeth (hydathodes).
    const used = new Set();
    for (let n = 0; n < 18; n++) {
      let k, j, key;
      do {
        k = Math.floor(rnd() * L.lobes);
        j = 1 + Math.floor(rnd() * (L.teeth - 2));
        key = k * 100 + j;
      } while (used.has(key) || (k === 0 && j < 3) || (k === L.lobes - 1 && j > L.teeth - 4));
      used.add(key);
      const phi = L.sinus + ((k + (j + 0.5) / L.teeth) * TAU) / L.lobes;
      const R = marginR(phi);
      const r = 0.42 + rnd() * 0.4;
      const rr = R - r * 0.35;
      const x = rr * Math.cos(phi), z = rr * Math.sin(phi);
      const y = leafHeight(x, z);
      beads.push({ c: new THREE.Vector3(x, y + r * 0.72, z), r, kind: 1, leafY: y - 0.1 });
    }
    this.beads = beads;
    this.tear = 0;
    this.leafMat.uniforms.uNB.value = Math.min(beads.length, NB);
    beads.forEach((b, i) => i < NB && this.beadUniform[i].set(b.c.x, b.c.y, b.c.z, b.r));

    this.beadMat = new THREE.ShaderMaterial({
      uniforms: {
        ...this.u,
        ...this.bladeUniforms(),
        uPxAngle: { value: 0.001 },
        uSchlieren: { value: 0.5 },
        uSkin: { value: 0 },
        uMirror: { value: 0 },
        uDust: { value: 1 },
        uBladeLight: { value: new THREE.Color(1.08, 1.06, 1.08) },
        uWaterTint: { value: new THREE.Color(0.97, 0.99, 1.0) },
      },
      vertexShader: beadVertex,
      fragmentShader: beadFragment,
      side: THREE.BackSide,
      alphaToCoverage: true,
    });
    this.beadMesh = this.beadInstances(beads, this.beadMat);
    this.scene.add(this.beadMesh);
  }

  beadInstances(list, mat) {
    const geo = new THREE.IcosahedronGeometry(1.09, 3);
    const data = new Float32Array(list.length * 4);
    list.forEach((b, i) => data.set([b.leafY, b.kind, 0, i * 0.37], i * 4));
    geo.setAttribute('aBead', new THREE.InstancedBufferAttribute(data, 4));
    const mesh = new THREE.InstancedMesh(geo, mat, list.length);
    const m = new THREE.Matrix4();
    list.forEach((b, i) => {
      m.makeScale(b.r, b.r, b.r).setPosition(b.c);
      mesh.setMatrixAt(i, m);
    });
    mesh.frustumCulled = false;
    mesh.renderOrder = 10;
    return mesh;
  }

  // The rest of the plant below the leaf, the soil and the pot's rim: a far layer, drawn sharp and
  // then blurred by depth of field, shown as the mid layer's backdrop.
  buildFar() {
    const rnd = rng(23);
    const far = this.farScene;
    far.background = sceneColor(0x2a2638);
    const blade = this.bladeUniforms();
    blade.uLeafA.value = sceneColor(0x5f9274);
    blade.uLeafB.value = sceneColor(0x86b48a);
    blade.uVein.value = sceneColor(0xa9cfa9);
    blade.uLeafDeep.value = sceneColor(0x3f6a64);
    this.farExpo = { value: 0.62 };
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        ...this.u,
        ...blade,
        uExpo: this.farExpo,
        uBeads: { value: Array.from({ length: NB }, () => new THREE.Vector4(0, -1000, 0, 0)) },
        uNB: { value: 0 },
        uLilac: { value: new THREE.Color(0.7, 0.66, 0.85) },
        uCaustic: { value: new THREE.Color(0, 0, 0) },
        uHair: { value: sceneColor(0xeef0f4) },
        uSheen: { value: new THREE.Color(0.5, 0.5, 0.55) },
        uFocus: { value: EYE_H },
        uPupil: { value: 0 },
        uPxScale: { value: 1 },
        uShell: { value: 0 },
      },
      defines: { LITE: 1 },
      vertexShader: leafVertex,
      fragmentShader: leafFragment,
      side: THREE.DoubleSide,
      alphaToCoverage: true,
    });
    this.farLeafMat = mat;
    // Three kinds of leaf below, so no two read as copies: younger, fuller, more deeply lobed.
    const variants = [
      { ...LEAF, R0: 37, lobes: 9, bend: 0.13, phase: 1.3, cup: 7, pleat: 2.6 },
      { ...LEAF, R0: 46, lobes: 11, bend: 0.07, phase: 2.6, cup: 9.5, pleat: 3.0, teeth: 8 },
      { ...LEAF, R0: 32, lobes: 7, bend: 0.1, phase: 4.1, cup: 6, pleat: 2.2, teeth: 10, sinus: -Math.PI / 2 - 0.3 },
    ].map((L) => {
      const m = mat.clone();
      m.uniforms = { ...mat.uniforms, uR0: { value: L.R0 }, uLobes: { value: L.lobes }, uBend: { value: L.bend }, uBendPhase: { value: L.phase }, uTeeth: { value: L.teeth }, uSinus: { value: L.sinus } };
      return { L, geo: leafGeometry(L, 64, 160), mat: m };
    });
    this.farVariants = variants;
    const farBeads = [];
    const spots = [
      [-66, -14, 30, 1.05, 2.1, 0.12],
      [70, -18, -12, 1.12, -0.6, -0.1],
      [-48, -26, -52, 0.95, 0.4, 0.15],
      [56, -30, 52, 1.0, 3.6, -0.12],
      [8, -34, 70, 1.1, 1.2, 0.1],
      [-20, -40, -78, 1.15, -1.9, -0.08],
      [96, -44, 34, 0.9, 2.8, 0.14],
      [-98, -40, -24, 0.95, -2.6, -0.1],
    ];
    for (let si = 0; si < spots.length; si++) {
      const [x, y, z, s, ry, tilt] = spots[si];
      const V = variants[si % 3];
      const m = new THREE.Mesh(V.geo, V.mat);
      m.position.set(x, y, z);
      m.rotation.set(tilt, ry, -tilt * 0.6);
      m.scale.setScalar(s);
      far.add(m);
      m.updateMatrixWorld();
      for (let i = 0; i < 4; i++) {
        const phi = rnd() * TAU, rho = 6 + rnd() * (V.L.R0 - 14), r = 0.6 + rnd() * 1.2;
        const lx = rho * Math.cos(phi), lz = rho * Math.sin(phi);
        const p = new THREE.Vector3(lx, leafHeight(lx, lz, V.L) + r + 0.6, lz).applyMatrix4(m.matrixWorld);
        farBeads.push({ c: p, r: r * s, kind: 2, leafY: p.y - r });
      }
    }
    this.farBeadMat = this.beadMat.clone();
    this.farBeadMat.uniforms = { ...this.beadMat.uniforms, uSchlieren: { value: 0 }, uDust: { value: 0 }, uSkin: { value: 0 }, uMirror: { value: 0 } };
    far.add(this.beadInstances(farBeads, this.farBeadMat));

    const vert = meshVertex;
    const lit = (c1, c2, noise) =>
      new THREE.ShaderMaterial({ uniforms: { ...this.u, uExpo: this.farExpo, uColor: { value: sceneColor(c1) }, uColor2: { value: sceneColor(c2) }, uNoise: { value: noise } }, vertexShader: vert, fragmentShader: litFragment });
    const soil = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), lit(0x3a3348, 0x4a4058, 0.08));
    soil.rotation.x = -Math.PI / 2;
    soil.position.y = -78;
    far.add(soil);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(132, 8, 20, 160), lit(0xc79a84, 0xb98a78, 0.05));
    rim.rotation.x = -Math.PI / 2;
    rim.position.set(18, -52, 8);
    far.add(rim);

    // The backdrop: a plane far below in the mid layer that shows the blurred far layer.
    this.farTarget = null;
    this.backdropMat = new THREE.ShaderMaterial({
      uniforms: { tFar: { value: null }, uMainVP: { value: new THREE.Matrix4() } },
      vertexShader: meshVertex,
      fragmentShader: backdropFragment,
      depthWrite: false,
    });
    this.backdrop = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), this.backdropMat);
    this.backdrop.rotation.x = -Math.PI / 2;
    this.backdrop.position.y = -90;
    this.backdrop.renderOrder = -10;
    this.scene.add(this.backdrop);
  }

  // G.'s loupe: a worn brass bezel round a 15 mm glass, a little ring to hang it by, and the child's
  // fingertips holding it from the near side (-z, where the child is).
  buildLoupe() {
    const group = new THREE.Group();
    this.loupe = group;
    this.nearScene.add(group);
    const brassU = (useMap, rough) => ({
      ...this.u,
      tMap: { value: this.engraveTex ?? null },
      uUseMap: { value: useMap ? 1 : 0 },
      uRough: { value: rough },
      uGlint: { value: 0 },
      uGlintAng: { value: 0 },
      uBrass: { value: sceneColor(0xe8d2a0) },
      uPatina: { value: sceneColor(0x56523c) },
      uGlintCol: { value: new THREE.Color(3.2, 2.6, 1.9) },
    });
    this.engraveTex = engraving();
    const brass = new THREE.ShaderMaterial({ uniforms: brassU(false, 0.2), vertexShader: meshVertex, fragmentShader: brassFragment });
    const prof = [
      [15.0, -2.4], [15.5, -2.9], [18.0, -2.9], [18.7, -2.3], [18.9, -1.0], [18.9, 0.8], [18.4, 1.6], [18.2, 1.7], [15.7, 1.7], [15.25, 1.3], [15.0, 0.6],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const bezel = new THREE.Mesh(new THREE.LatheGeometry(prof, 160), brass);
    group.add(bezel);
    const faceMat = new THREE.ShaderMaterial({ uniforms: brassU(true, 0.16), vertexShader: meshVertex, fragmentShader: brassFragment });
    faceMat.uniforms.tMap.value = this.engraveTex;
    this.faceMat = faceMat;
    const face = new THREE.Mesh(new THREE.RingGeometry(15.7, 18.2, 160, 1), faceMat);
    face.rotation.x = -Math.PI / 2;
    face.position.y = 1.72;
    group.add(face);
    // The ring to hang it by, on the far side.
    const loop = new THREE.Mesh(new THREE.TorusGeometry(3.4, 1.05, 14, 40), brass);
    loop.position.set(-21.6, 0, 7.5);
    loop.rotation.set(0, 0.35, 0);
    group.add(loop);
    const lug = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, 3.2, 16), brass);
    lug.rotation.z = Math.PI / 2;
    lug.position.set(-19.6, 0, 6.8);
    lug.rotation.y = 0.35;
    group.add(lug);

    // The child's fingers (loupe space: glass centre at the origin, axis +y toward the eye, the child
    // toward -z, which is the bottom of the frame; +x is the frame's left). The right hand comes in
    // from the bottom right: the index finger arches over the bezel and rests its pad on the brass
    // face, a plaster round its last knuckle; the middle finger curls under the rim beside it; the
    // thumb is hidden under the glass.
    this.loupeInv = { value: new THREE.Matrix4() };
    const joints = [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()];
    const jointAx = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    const skinU = (kind, color, thick = 5.5) => ({
      ...this.u,
      uLoupeInv: this.loupeInv,
      uSkin: { value: sceneColor(color) },
      uGlowSkin: { value: sceneColor(ORGANELLE.jellyGlow, 0.9).lerp(new THREE.Color(1.0, 0.36, 0.2), 0.45) },
      uInkCol: { value: sceneColor(0x4f5aa8) },
      uInk: { value: new THREE.Vector4(0, 0, 0, 0) },
      uJoints: { value: joints },
      uJointAx: { value: jointAx },
      uKind: { value: kind },
      uThick: { value: thick },
    });
    const skinMat = (kind, color) => new THREE.ShaderMaterial({ uniforms: skinU(kind, color), vertexShader: skinVertex, fragmentShader: skinFragment });
    const skin = skinMat(0, 0xe9c9b1);
    const nail = skinMat(1, 0xf0d9cf);
    const plaster = skinMat(2, 0xcfa577);
    const gauze = skinMat(2, 0xe8dcc6);
    const fingers = new THREE.Group();
    group.add(fingers);
    const seg = (a, b, r0, r1, mat) => {
      const A = new THREE.Vector3(...a), Bv = new THREE.Vector3(...b);
      const len = A.distanceTo(Bv);
      const geo = new THREE.CapsuleGeometry(1, 1, 10, 24);
      // Taper the capsule from r0 at A to r1 at B, its core length len; a finger is a little
      // flatter than round (wider than deep).
      const p = geo.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const y = p.getY(i);
        const t = clamp(y + 0.5, 0, 1);
        const r = r0 + (r1 - r0) * t;
        const yy = y > 0.5 ? len / 2 + (y - 0.5) * r1 : y < -0.5 ? -len / 2 + (y + 0.5) * r0 : y * len;
        p.setXYZ(i, p.getX(i) * r * 1.06, yy, p.getZ(i) * r * 0.92);
      }
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, mat);
      m.position.copy(A).add(Bv).multiplyScalar(0.5);
      // Keep the finger's flat side facing up (toward the eye).
      const ax = Bv.clone().sub(A).normalize();
      const up = new THREE.Vector3(0, 1, 0).addScaledVector(ax, -ax.y).normalize();
      const side = new THREE.Vector3().crossVectors(ax, up).normalize();
      m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(side, ax, new THREE.Vector3().crossVectors(side, ax)));
      fingers.add(m);
      return m;
    };
    const chain = (pts, radii, mat) => {
      const out = [];
      for (let i = 0; i < pts.length - 1; i++) out.push(seg(pts[i], pts[i + 1], radii[i], radii[i + 1], mat));
      return out;
    };
    // Index: knuckle (out of frame), arching up over the middle joint, down onto the face.
    const idx = [[-46, 3, -60], [-31, 13.5, -39], [-19.5, 11.5, -24.5], [-11.0, 7.0, -14.2]];
    chain(idx, [6.4, 6.0, 5.5, 5.0], skin);
    // Middle: lower, from further round, curling in under the rim below the index.
    const mdl = [[-27, -11, -66], [-19, -6.5, -44], [-14, -8, -31], [-9.5, -6.5, -22.5]];
    chain(mdl, [6.6, 6.2, 5.7, 5.1], skin);
    // Joints for the creases: index PIP and DIP, middle PIP and DIP.
    [[idx, 1], [idx, 2], [mdl, 1], [mdl, 2]].forEach(([c, i], k) => {
      joints[k].set(c[i][0], c[i][1], c[i][2], 5.8);
      jointAx[k].set(c[i + 1][0] - c[i - 1][0], c[i + 1][1] - c[i - 1][1], c[i + 1][2] - c[i - 1][2]).normalize();
    });
    // Plaster round the index's last knuckle, its gauze pad on the back of the joint.
    const A2 = new THREE.Vector3(...idx[1]), B2 = new THREE.Vector3(...idx[3]);
    const ax2 = B2.clone().sub(A2).normalize();
    const up2 = new THREE.Vector3(0, 1, 0).addScaledVector(ax2, -ax2.y).normalize();
    const band = new THREE.Mesh(new THREE.CylinderGeometry(5.95, 6.0, 7.5, 48, 1, true), plaster);
    band.position.set(...idx[2]).addScaledVector(ax2, -0.6);
    band.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ax2);
    band.scale.set(1.06, 1, 0.92);
    band.quaternion.multiply(new THREE.Quaternion());
    fingers.add(band);
    const pad = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), gauze);
    pad.scale.set(3.0, 0.5, 2.6);
    pad.position.copy(band.position).addScaledVector(up2, 5.55);
    pad.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up2);
    fingers.add(pad);
    // Short, bitten nails on the fingertips, lying on the top of each last joint.
    const nailOn = (a, b, r, size) => {
      const A = new THREE.Vector3(...a), Bv = new THREE.Vector3(...b);
      const ax = Bv.clone().sub(A).normalize();
      const up = new THREE.Vector3(0, 1, 0).addScaledVector(ax, -ax.y).normalize();
      const n = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), nail);
      n.scale.set(size * 0.7, 0.3, size * 0.82);
      n.position.copy(Bv).addScaledVector(ax, -size * 0.25).addScaledVector(up, r * 0.92 - 0.12);
      n.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3().crossVectors(up, ax), up, ax));
      fingers.add(n);
    };
    nailOn(idx[2], idx[3], 4.6, 3.6);
    nailOn(mdl[2], mdl[3], 4.75, 3.7);
    // The ink, a fountain pen's smudge on the side of the middle finger, where it shows.
    skin.uniforms.uInk.value.set(-15.5, -1.6, -34, 2.6);
    this.fingers = fingers;
    for (const o of group.children) o.renderOrder = 2;
  }

  buildPortal() {
    this.portalCam = new THREE.PerspectiveCamera(FOV, 1, 0.5, 3000);
    this.portalCam.up.set(0, 0, 1);
    this.portalTarget = null;
    this.glassMat = new THREE.ShaderMaterial({
      uniforms: {
        ...this.u,
        tPortal: { value: null },
        tPortalBlur: { value: null },
        uBlurMix: { value: 0 },
        uM: { value: 1 },
        uRectC: { value: new THREE.Vector2() },
        uRectS: { value: new THREE.Vector2(512, 512) },
        uDiscR: { value: 200 },
        uBarrel: { value: 0.08 },
        uFringe: { value: 0.012 },
        uVignette: { value: 0.12 },
        uC: { value: new THREE.Vector2() },
      },
      vertexShader: meshVertex,
      fragmentShader: glassFragment,
    });
    this.disc = new THREE.Mesh(new THREE.CircleGeometry(LOUPE.R + 0.3, 128), this.glassMat);
    this.disc.renderOrder = 20;
    this.scene.add(this.disc);
  }

  setSize(w, h) {
    this.size.set(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    // The far layer is always blurred: half resolution is plenty. The near layer is sharp only
    // during the focus pull onto the glass.
    const fw = Math.max(1, Math.ceil(w / 2)), fh = Math.max(1, Math.ceil(h / 2));
    if (!this.farTarget) {
      this.farTarget = new THREE.WebGLRenderTarget(fw, fh, { type: THREE.HalfFloatType });
      this.nearTarget = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 2 });
    } else {
      this.farTarget.setSize(fw, fh);
      this.nearTarget.setSize(w, h);
    }
  }

  // Where the loupe sits and which way it faces: toward the eye, tilted 8 degrees toward the child.
  placeLoupe() {
    const g = this.loupe;
    const n = _n.copy(this.camera.position).sub(this.loupePos).normalize();
    n.z -= TILT8;
    n.normalize();
    const x = _x.crossVectors(n, _Z).normalize();
    const z = _z.crossVectors(x, n);
    g.matrix.makeBasis(x, n, z).setPosition(this.loupePos);
    g.matrix.decompose(g.position, g.quaternion, g.scale);
    g.updateMatrixWorld(true);
    this.loupeInv.value.copy(g.matrixWorld).invert();
    // The glass sits in the bezel's seat; the disc in the mid layer copies its pose.
    this.disc.position.copy(this.loupePos).addScaledVector(n, -0.4);
    this.disc.quaternion.setFromRotationMatrix(_m4.makeBasis(x, _y.copy(z).negate(), n));
  }

  // Thin-lens optics of the loupe seen from the eye (story §6.3, shot 4). H: eye above the bead
  // plane; d: glass above it. M = m H / (H + (m - 1) d), m = f / (f - d). The image flips where the
  // denominator crosses zero (about 36 mm at H = 117), where the real image passes the eye.
  computeOptics() {
    const o = this.optics;
    const f = LOUPE.f;
    const H = Math.max(this.camera.position.y - B.y, 1);
    const d = clamp(this.loupePos.y - B.y, 0.5, H - 0.5);
    let M;
    if (Math.abs(f - d) < 1e-3) M = H / d;
    else {
      const m = f / (f - d);
      const den = H + (m - 1) * d;
      M = Math.abs(den) < 1e-6 ? 30 : (m * H) / den;
    }
    if (!Number.isFinite(M)) M = 30;
    M = Math.sign(M || 1) * Math.min(Math.abs(M), 30);
    const disc = H * H - 4 * H * f;
    const dFlip = disc > 0 ? (H - Math.sqrt(disc)) / 2 : f;
    let blur = 14 * smooth(0.03 * f, 0.25 * f, Math.abs(d - 0.92 * f));
    if (d > dFlip) blur = 14 + (6 - 14) * smooth(dFlip, LOUPE.max, d);
    o.d = d;
    o.dFlip = dFlip;
    o.M = this.portalM ?? M;
    o.blurPx = this.focusBlur ?? blur;
    o.flip = o.M < 0;
    // The disc on screen: centre and radius in drawing-buffer pixels.
    const cam = this.camera;
    const c = _p.copy(this.loupePos).project(cam);
    o.discC.set((c.x * 0.5 + 0.5) * this.size.x, (c.y * 0.5 + 0.5) * this.size.y);
    const dist = Math.max(cam.position.distanceTo(this.loupePos), 0.01);
    const ang = Math.atan(LOUPE.R / dist);
    const pxPerTan = this.size.y / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    o.discR = Math.tan(Math.min(ang, 1.5)) * pxPerTan;
    return o;
  }

  // Screen position (drawing-buffer px) of a world point through the main camera.
  // Screen position (drawing-buffer px) of a world point through the main camera. Allocates nothing.
  toScreen(p, out = _s2) {
    const v = _p.copy(p).project(this.camera);
    return out.set((v.x * 0.5 + 0.5) * this.size.x, (v.y * 0.5 + 0.5) * this.size.y);
  }

  // Is bead i centred in the glass (within 0.15 of its radius, after magnification)?
  beadCentred(i) {
    const o = this.optics;
    const s = this.toScreen(this.beads[i].c);
    return s.distanceTo(o.discC) * Math.abs(o.M) <= 0.15 * o.discR;
  }

  // The bead nearest the glass's axis (in the magnified view), or -1.
  beadInGlass() {
    const o = this.optics;
    let best = -1, bd = Infinity;
    for (let i = 0; i < this.beads.length; i++) {
      const dd = this.toScreen(this.beads[i].c).distanceTo(o.discC) * Math.abs(o.M);
      if (dd < bd && dd < o.discR) {
        bd = dd;
        best = i;
      }
    }
    return best;
  }

  setRim(i, v) {
    const a = this.beadMesh.geometry.attributes.aBead;
    a.setZ(i, v);
    a.needsUpdate = true;
  }

  update(real) {
    this.time += real;
    const u = this.u;
    u.uTime.value = this.time;
    u.uSkyOcc.value = this.skyOcc;
    u.uExpo.value = this.expo;
    this.farExpo.value = this.expo * 0.44;
    const cam = this.camera;
    const focus = Math.max(this.focus, 0.05);
    cam.near = clamp(0.05 * focus, 0.02, 2);
    cam.far = 3000;
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
    const pxPerTan = this.size.y / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    this.beadMat.uniforms.uPxAngle.value = 1 / pxPerTan;
    this.beadMat.uniforms.uSchlieren.value = this.schlieren;
    this.beadMat.uniforms.uSkin.value = this.skin;
    this.beadMat.uniforms.uMirror.value = this.mirror;
    // The leaf's analytic defocus (mm at the leaf per unit of |1 - z/focus|).
    this.leafMat.uniforms.uFocus.value = focus;
    this.leafMat.uniforms.uPupil.value = this.pupil;
    if (this.loupeOn) this.placeLoupe();
    this.loupe.visible = this.loupeOn;
    this.disc.visible = this.loupeOn;
    this.computeOptics();
    this.faceMat.uniforms.uGlint.value = Math.sin(Math.PI * clamp(this.glint, 0, 1)) * 1.0;
    this.faceMat.uniforms.uGlintAng.value = -Math.PI / 2 - 1.3 + 2.6 * clamp(this.glint, 0, 1);
  }

  // Circle of confusion (px at the current resolution) for something `z` mm from the eye.
  coc(z) {
    const pxPerTan = this.size.y / (2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)));
    return this.pupil * pxPerTan * Math.abs(1 / Math.max(z, 0.1) - 1 / Math.max(this.focus, 0.1));
  }

  // Everything the composer's frame needs before it renders the mid layer: the far layer blurred,
  // the image in the glass, and the near layer blurred.
  prerender(renderer) {
    this.setMidVisible(true);
    const cam = this.camera;
    const { x: w, y: h } = this.size;
    const prevTarget = renderer.getRenderTarget();
    const prevAuto = renderer.autoClear;
    renderer.autoClear = true;
    // Far layer.
    const farZ = cam.position.y - (-35);
    renderer.setRenderTarget(this.farTarget);
    renderer.render(this.farScene, cam);
    // The backdrop is blurred as by a wider aperture than the eye's, the way a macro lens isolates
    // its subject: the leaf in front stays the clear one.
    const farSigma = (this.coc(farZ) * 2.2 / 2.4 + 1.2 * (h / 1080)) / 2;
    this.backdropMat.uniforms.tFar.value = this.blurFar.run(renderer, this.farTarget.texture, this.farTarget.width, this.farTarget.height, farSigma);
    this.backdropMat.uniforms.uMainVP.value.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);

    // The glass: the mid layer drawn again from the eye, magnified, into a target that covers only
    // the part of the disc that is on screen (with a margin for the barrel and the fringe).
    const o = this.optics;
    this.covered = false;
    if (this.loupeOn && o.discR > 1) {
      const mg = 0.06 * o.discR + 4;
      const x0 = Math.max(o.discC.x - o.discR - mg, 0), x1 = Math.min(o.discC.x + o.discR + mg, w);
      const y0 = Math.max(o.discC.y - o.discR - mg, 0), y1 = Math.min(o.discC.y + o.discR + mg, h);
      const rw = Math.max(x1 - x0, 8), rh = Math.max(y1 - y0, 8);
      const scale = Math.min(1, 1600 / Math.max(rw, rh));
      const Sx = Math.max(64, Math.ceil((rw * scale) / 16) * 16), Sy = Math.max(64, Math.ceil((rh * scale) / 16) * 16);
      if (!this.portalTarget) this.portalTarget = new THREE.WebGLRenderTarget(Sx, Sy, { type: THREE.HalfFloatType, samples: 2 });
      else if (this.portalTarget.width !== Sx || this.portalTarget.height !== Sy) this.portalTarget.setSize(Sx, Sy);
      const pc = this.portalCam;
      pc.position.copy(cam.position);
      pc.quaternion.copy(cam.quaternion);
      pc.fov = cam.fov;
      pc.aspect = w / h;
      pc.near = cam.near;
      pc.far = cam.far;
      const aM = Math.abs(o.M);
      const rcx = (x0 + x1) / 2 - o.discC.x, rcy = (y0 + y1) / 2 - o.discC.y;
      const sx = o.discC.x + rcx / o.M, sy = o.discC.y + rcy / o.M;
      const ww = rw / aM, wh = rh / aM;
      pc.setViewOffset(w, h, sx - ww / 2, h - sy - wh / 2, ww, wh);
      pc.updateMatrixWorld();
      this.disc.visible = false;
      renderer.setRenderTarget(this.portalTarget);
      renderer.render(this.scene, pc);
      this.disc.visible = true;
      const gu = this.glassMat.uniforms;
      gu.tPortal.value = this.portalTarget.texture;
      // The focus blur, in portal pixels.
      const blurPx = o.blurPx * (h / 1080);
      const sigma = (blurPx / 2) * (Sx / rw);
      gu.tPortalBlur.value = this.blurPortal.run(renderer, this.portalTarget.texture, Sx, Sy, sigma);
      gu.uBlurMix.value = sigma > 0.35 ? 1 : 0;
      gu.uM.value = o.M;
      gu.uRectC.value.set(rcx, rcy);
      gu.uRectS.value.set(rw, rh);
      gu.uDiscR.value = o.discR;
      gu.uC.value.copy(o.discC);
      // When the glass fills the whole frame, nothing behind it can be seen: the scene pass draws
      // only the disc (the leaf, hairs, beads and backdrop are hidden until the next frame).
      const far2 = Math.max(o.discC.x, w - o.discC.x) ** 2 + Math.max(o.discC.y, h - o.discC.y) ** 2;
      this.covered = far2 < (o.discR * 0.985) ** 2;

      // Near layer: brass and fingers, blurred by their circle of confusion.
      const cc = renderer.getClearColor(_col), ca = renderer.getClearAlpha();
      renderer.setClearColor(0x000000, 0);
      renderer.setRenderTarget(this.nearTarget);
      renderer.render(this.nearScene, cam);
      renderer.setClearColor(cc, ca);
      // A smaller aperture for the brass and the fingers than the eye's own: they stay soft, but
      // the bezel keeps its form and the plaster stays legible while the eye is on the bead.
      const nz = cam.position.distanceTo(this.loupePos);
      const nearSigma = Math.min((this.coc(nz) * 0.5) / 2.4, 60 * (h / 1080));
      this.nearTexture = this.blurNear.run(renderer, this.nearTarget.texture, w, h, nearSigma);
    } else this.nearTexture = null;
    // The blurred push (the glass giving up): the mid layer is drawn at half resolution here, and
    // the scene pass draws an empty scene (the director swaps it in); GardenPass blurs from this.
    this.useMidLow = this.glass.on > 0 && this.midSigma * (h / 1080) > 3;
    if (this.useMidLow) {
      const lw = Math.max(1, Math.ceil(w / 2)), lh = Math.max(1, Math.ceil(h / 2));
      if (!this.midLow) this.midLow = new THREE.WebGLRenderTarget(lw, lh, { type: THREE.HalfFloatType });
      else if (this.midLow.width !== lw || this.midLow.height !== lh) this.midLow.setSize(lw, lh);
      renderer.setRenderTarget(this.midLow);
      renderer.render(this.scene, cam);
    }
    if (this.covered) this.setMidVisible(false);
    renderer.setRenderTarget(prevTarget);
    renderer.autoClear = prevAuto;
  }

  // Shows or hides everything of the mid layer but the glass's disc.
  setMidVisible(on) {
    if (this.midHidden === !on) return;
    this.midHidden = !on;
    this.leaf.visible = on;
    for (const m of this.shells) m.visible = on;
    this.beadMesh.visible = on;
    this.backdrop.visible = on;
  }

  dispose() {
    const all = [this.scene, this.farScene, this.nearScene];
    for (const s of all)
      s.traverse((o) => {
        o.geometry?.dispose?.();
        o.material?.dispose?.();
      });
    this.engraveTex.dispose();
    this.farTarget?.dispose();
    this.nearTarget?.dispose();
    this.portalTarget?.dispose();
    this.midLow?.dispose();
    this.blurFar.dispose();
    this.blurNear.dispose();
    this.blurPortal.dispose();
    this.pass.dispose();
  }
}

const TILT8 = Math.tan(THREE.MathUtils.degToRad(8));
const _Z = new THREE.Vector3(0, 0, 1);
const _n = new THREE.Vector3();
const _x = new THREE.Vector3();
const _y = new THREE.Vector3();
const _z = new THREE.Vector3();
const _p = new THREE.Vector3();
const _m4 = new THREE.Matrix4();
const _s2 = new THREE.Vector2();
const _col = new THREE.Color();
