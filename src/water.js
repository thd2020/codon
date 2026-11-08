import * as THREE from 'three';
import { Pass } from 'three/addons/postprocessing/Pass.js';
import { clock } from './materials.js';
import { LOOK, sceneColor } from './lens.js';

// The inside of a water drop, light theme. Overhead, the underside of the surface carries a crisp
// net of caustic light and a bright window round the sun; below, a pale aqua body goes down to teal
// and lilac depth. A few defined light rays slant down from the surface. Fine motes ride slow
// coherent currents (neighbours move together, like water, not a swarm), with depth of field
// around whatever you look at; glints sparkle in the focal plane. Distance fades into the water's
// own colour (FogExp2), and the cells get the same light and fog through LOOK.cellEnvironment.
//
// Everything is in scene-linear colour picked through sceneColor(), so after tone mapping the drop
// shows exactly the display colours in LOOK.drop.

const D = LOOK.drop;
const ENV = LOOK.cellEnvironment;
// Depth of field. The far aperture grows with the focus distance squared, which keeps the blur
// under ~3 px (at 540 px height) within a micrometre of the focus at any orbit distance, so the
// water round the hero is as sharp as the hero. In front of that slab the lens opens up.
const APERTURE_K = 0.0042;
const APERTURE_NEAR = 0.25;

const domeVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vDir = wp.xyz - cameraPosition;
    gl_Position = projectionMatrix * viewMatrix * wp;
    gl_Position.z = gl_Position.w * 0.99999;
  }
`;

const domeFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uMeniscus, uSky, uHorizon, uHaze, uDeep, uAbyss, uSun, uSunDir, uWindow, uWin;
  uniform vec4 uSunShape;
  uniform float uScale;   // caustic net frequency: >1 makes the net finer (seen from further away)
  uniform vec4 uShade;    // a shadow across the sky (the watcher leaning over): direction, strength
  uniform vec2 uShadeR;   // its inner and outer cosine
  uniform float uFlash;   // 0..1 toward white (the crossing under the meniscus)
  uniform float uCaustic; // strength of the caustic net (1 normal)
  uniform float uCausThread; // how much of its sharp threads show (1 normal; the soft glow stays)
  // A broad band of salty tear water (the salt front), integrated along each view ray: x is the
  // distance into the band from its mixed edge along uFrontN; x = dot(p, n) - uFrontP.x.
  uniform vec3 uFrontN, uFrontCol;
  uniform vec4 uFrontP;   // plane offset, width w, edge width e, strength
  uniform vec2 uFrontT;   // how far along the ray it counts (µm), layer spacing (µm)
  uniform float uFrontK;  // µm of band water a ray needs to show about 63% of the tint
  varying vec3 vDir;

  float h12(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec2 h22(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
  float n2(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h12(i), h12(i + vec2(1, 0)), f.x), mix(h12(i + vec2(0, 1)), h12(i + vec2(1, 1)), f.x), f.y);
  }

  // Distance to the nearest border of a slowly moving cell pattern (Voronoi F2 - F1).
  float border(vec2 p, float t) {
    vec2 i = floor(p), f = fract(p);
    float F1 = 8.0, F2 = 8.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 g = vec2(float(x), float(y));
        vec2 o = 0.5 + 0.42 * sin(t * vec2(0.9, 0.7) + 6.2831853 * h22(i + g));
        float d = length(g + o - f);
        if (d < F1) { F2 = F1; F1 = d; } else F2 = min(F2, d);
      }
    }
    return F2 - F1;
  }

  // The caustic net: light focused by the rippling surface into bright, connected, curving threads.
  // Threads are drawn at least ~1.5 px wide (so the net never breaks into wisps) and the whole net
  // gives way to its average where its cells shrink to a few pixels. x: threads, y: their glow.
  vec2 caustic(vec2 uv, float t) {
    vec2 p = uv * 3.2;
    p += 0.32 * vec2(sin(p.y * 1.9 + t * 0.5), sin(p.x * 2.1 - t * 0.4));
    p += 0.12 * vec2(sin(p.y * 4.7 - t * 0.7), sin(p.x * 5.3 + t * 0.6));
    float e = border(p, t);
    float aa = fwidth(e);
    // Brighter, slightly wider stretches and dimmer, finer ones, as the surface focuses more or
    // less light.
    float k = n2(p * 0.8 + t * 0.15);
    float w = max(0.006 + 0.008 * k, aa * 0.7);
    float thread = (1.0 - smoothstep(w - aa * 0.5, w + aa * 0.5, e)) * (0.45 + 0.8 * k);
    // Seen from further off (uScale > 1) the threads give way to their glow, which widens into a
    // soft mottled veil: the net never turns into a web of hairlines.
    float glow = exp(-e / (0.07 * (1.0 + 3.0 * smoothstep(1.05, 2.0, uScale)))) * (0.5 + 0.5 * k);
    float far = smoothstep(0.05, 0.12, length(fwidth(p)));
    return mix(vec2(thread, glow), vec2(0.1, 0.2), far);
  }

  // Integral of smoothstep(a, b, s) ds from -inf to x.
  float rampInt(float x, float a, float b) {
    float u = clamp((x - a) / (b - a), 0.0, 1.0);
    return (b - a) * (u * u * u - 0.5 * u * u * u * u) + max(x - b, 0.0);
  }
  // The band's profile S(x) = smoothstep(0, e, x) - smoothstep(w - 150, w, x), integrated. The edge
  // e is widened with distance (gBandE), so seen edge-on from far off it is a soft gradient, never
  // a line.
  float gBandE;
  float bandInt(float x) {
    return rampInt(x, -0.5 * (gBandE - uFrontP.z), uFrontP.z + 0.5 * (gBandE - uFrontP.z)) - rampInt(x, uFrontP.y - 150.0, uFrontP.y);
  }
  float bandAt(float x) {
    return smoothstep(-0.5 * (gBandE - uFrontP.z), uFrontP.z + 0.5 * (gBandE - uFrontP.z), x) - smoothstep(uFrontP.y - 150.0, uFrontP.y, x);
  }
  // A gentle bend of the band, so its layers curve instead of running dead straight.
  float bandWarp(vec3 p) {
    return 26.0 * sin(p.x * 0.0061 + p.y * 0.0023 + 1.3) + 14.0 * sin(p.z * 0.0087 - p.y * 0.0041);
  }
  // How much band water a ray passes through (0..1) and the layering seen along it (-1..1).
  vec2 saltFront(vec3 d) {
    vec3 o = cameraPosition;
    float T = uFrontT.x;
    float dn = dot(d, uFrontN);
    float x0 = dot(o, uFrontN) - uFrontP.x + bandWarp(o);
    float x1 = dot(o + d * T, uFrontN) - uFrontP.x + bandWarp(o + d * T);
    float slope = (x1 - x0) / T;
    gBandE = max(uFrontP.z, 0.08 * abs(x0));
    float L = abs(slope) > 1e-4 ? (bandInt(x1) - bandInt(x0)) / slope : bandAt(x0) * T;
    // Layers: the integral of sin along the ray, so they show where the ray runs along them (where
    // you see the band edge-on) and average away where it cuts across them, like real schlieren.
    float k = 6.2831853 / uFrontT.y;
    float ph = 2.2 * sin(d.x * 7.0 + d.y * 5.0 + uTime * 0.05) + 1.4 * sin(d.z * 11.0 - d.x * 6.0 - uTime * 0.04);
    float lay = abs(slope) * k * T > 0.05 ? (cos(k * x0 + ph) - cos(k * x1 + ph)) / (k * (x1 - x0)) : sin(k * x0 + ph);
    // where the ray runs along the layers (a grazing view) they would stack into one line: there
    // they fade, and only show where the ray crosses them at a slant
    lay *= smoothstep(0.02, 0.15, abs(slope));
    float amount = 1.0 - exp(-max(L, 0.0) / uFrontK);
    return vec2(amount, lay);
  }

  void main() {
    vec3 d = normalize(vDir);
    float y = d.y;
    // The body of the drop, from the deep up to the meniscus.
    vec3 col = mix(uHorizon, uDeep, smoothstep(-0.02, -0.6, y));
    col = mix(col, uAbyss, smoothstep(-0.35, -0.95, y));
    col = mix(col, uSky, smoothstep(0.0, 0.3, y));
    col = mix(col, uMeniscus, smoothstep(0.22, 0.75, y));
    col = mix(col, uHaze, exp(-pow((y + 0.1) / 0.13, 2.0)) * 0.5);
    // Slow, broad variations of light far away, so the water breathes instead of being a flat fill.
    vec2 a = vec2(atan(d.z, d.x) * 2.0, y * 3.0);
    float drift = n2(a * 1.3 + vec2(uTime * 0.02, -uTime * 0.012)) * 0.6 + n2(a * 2.7 - uTime * 0.017) * 0.4;
    col *= 1.0 + (drift - 0.5) * 0.07 * (1.0 - smoothstep(0.2, 0.7, y));

    // The sun's window: a bright disc of sky with a crisp rim. CellPass's films reflect the same
    // window and sun (LOOK.cellEnvironment.window / .sun).
    float s = max(dot(d, uSunDir), 0.0);
    float win = smoothstep(uWin.y, uWin.x, s);
    float shade = uShade.w * smoothstep(uShadeR.y, uShadeR.x, dot(d, uShade.xyz));
    // Caustics on the meniscus: threads well above the water (the meniscus sits a step below white
    // to leave them room), the water between them slightly darker, so the net reads both ways.
    if (y > 0.06) {
      vec2 uv = d.xz / y * 0.8 * uScale + vec2(uTime * 0.006, uTime * 0.004);
      vec2 ca = caustic(uv, uTime * 0.35);
      float m = smoothstep(0.1, 0.45, y) * (1.0 - 0.6 * win) * (1.0 - 0.8 * shade) * uCaustic;
      col *= 1.0 - 0.09 * m * (1.0 - min(ca.y, 1.0));
      col += uSun * (ca.x * 1.6 * uCausThread * (1.0 - smoothstep(1.2, 2.0, uScale)) + ca.y * 0.3) * m;
    }
    col += uWindow * uWin.z * win;
    col += uSun * (pow(s, uSunShape.x) * uSunShape.y + pow(s, uSunShape.z) * uSunShape.w);
    col *= 1.0 - 0.22 * shade;
    // The salt front: brighter, faintly warm water, layered like heat haze.
    if (uFrontP.w > 0.0) {
      vec2 sf = saltFront(d);
      // tear water is a touch brighter and warmer than the water round it: a tint, so the drop's
      // own depth still shows through it
      col *= mix(vec3(1.0), uFrontCol, sf.x * uFrontP.w);
      col *= 1.0 + 0.06 * sf.y * sf.x * uFrontP.w;
    }
    col = mix(col, uWindow * 1.05, uFlash);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function domeMaterial() {
  const { window: w, sun } = ENV;
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: clock.uTime,
      uMeniscus: { value: sceneColor(D.meniscus) },
      uSky: { value: sceneColor(D.sky) },
      uHorizon: { value: sceneColor(D.horizon) },
      uHaze: { value: sceneColor(D.haze) },
      uDeep: { value: sceneColor(D.deep) },
      uAbyss: { value: sceneColor(D.abyss) },
      // Copies, so a palette change (dawn) never touches LOOK itself.
      uSun: { value: ENV.sunColor.clone() },
      uSunDir: { value: ENV.sunDir.clone() },
      uWindow: { value: ENV.sky.clone() },
      uWin: { value: new THREE.Vector3(w.cosIn, w.cosOut, w.gain) },
      uSunShape: { value: new THREE.Vector4(sun.power, sun.gain, sun.glowPower, sun.glowGain) },
      uScale: { value: 1 },
      uShade: { value: new THREE.Vector4(0, 1, 0, 0) },
      uShadeR: { value: new THREE.Vector2(0.95, 0.75) },
      uFlash: { value: 0 },
      uCaustic: { value: 1 },
      uCausThread: { value: 1 },
      uFrontK: { value: 140 },
      uFrontN: { value: new THREE.Vector3(1, 0, 0) },
      uFrontCol: { value: new THREE.Color(1.1, 1.06, 1.0) },
      uFrontP: { value: new THREE.Vector4(0, 500, 20, 0) },
      uFrontT: { value: new THREE.Vector2(600, 22) },
    },
    vertexShader: domeVertex,
    fragmentShader: domeFragment,
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
  });
}

// ------------------------------------------------------------------------------------------------
// Particles. Each layer is drawn twice from the same geometry: the part behind the subject goes in
// the main scene (so cells veil it like anything else in the water), the part in front goes in
// `water.front`, drawn after CellPass by frontPass(), so a mote between you and the cell is really
// in front of it. Until frontPass() is called the front halves stay in the main scene, so nothing
// silently disappears.
//
// Every particle is either distinct or absent: in focus a mote is a small clear speck, a vesicle a
// clear bubble with a bright film; as soon as the blur outgrows it, it fades out instead of leaving
// a faint grey ghost disc. The only bokeh is a sparse layer of specks right in front of the lens,
// kept to the edges of the frame.
// ------------------------------------------------------------------------------------------------
const KIND = { mote: 0, vesicle: 1, glint: 2, bokeh: 3 };

const particleVertex = /* glsl */ `
  attribute float aSize;
  attribute vec4 aSeed;
  attribute vec3 aColor;
  uniform float uTime, uBox, uFocus, uScale, uApK, uApNear, uFog, uFront, uOpacity, uSplit;
  uniform vec3 uCentre, uSunDir;
  // The salt front (the dome's own uniforms, shared): motes in tear water are warmer.
  uniform vec3 uSaltN, uSaltCol;
  uniform vec4 uSaltP;
  varying vec3 vColor;
  varying float vAlpha, vDiam, vSharp, vSeed, vDist, vFlash;
  varying vec2 vSun, vHl;

  // The drop's slow circulation: a steady drift and broad lazy eddies. The displacement is a smooth
  // function of where a mote started, so neighbours travel together, as in a current.
  vec3 current(vec3 p, float t) {
    vec3 q = p * 0.19;
    vec3 e = vec3(
      sin(q.y * 1.3 + t * 0.071) + 0.6 * sin(q.z * 2.1 - t * 0.053 + 1.7),
      0.55 * sin(q.z * 1.1 + t * 0.061 + 0.4) + 0.4 * sin(q.x * 1.7 - t * 0.047),
      sin(q.x * 1.2 - t * 0.067 + 2.3) + 0.6 * sin(q.y * 1.9 + t * 0.059));
    return vec3(0.11, -0.025, 0.05) * t + e * 1.1;
  }

  // Brownian motion, slowed right down: a wandering path built from a few random wobbles whose
  // amplitude falls as 1/frequency (the spectrum of a random walk), reaching further for smaller
  // particles (as 1/sqrt(size)). The real thing would carry a 50 nm particle micrometres a second.
  vec3 brownian(vec4 s, float size, float t) {
    vec3 b = vec3(0.0);
    float w = 0.35;
    for (int k = 0; k < 4; k++) {
      vec3 ph = fract(s.xyz * (13.7 + float(k) * 7.1)) * 6.2831853;
      b += sin(t * w * vec3(1.0, 1.13, 0.91) + ph) / w;
      w *= 2.3;
    }
    return b * 0.014 * sqrt(0.05 / max(size, 0.005));
  }

  void main() {
    vec3 p = position + current(position, uTime) + brownian(aSeed, aSize, uTime);
    p = mod(p - uCentre + uBox * 0.5, uBox) - uBox * 0.5 + uCentre;

    vec4 mv = viewMatrix * vec4(p, 1.0);
    float dist = max(-mv.z, 0.05);
    float sizePx = aSize * uScale / dist;
    // Thin-lens blur circle (px). In front of the sharp slab the aperture opens wide, so a speck
    // near the lens becomes soft and faint, never a big sharp flake pasted over the view.
    float ap = uApK * uFocus * uFocus;
    ap = mix(ap, max(ap, uApNear), smoothstep(uFocus - 0.8, uFocus - 1.6, dist));
    float coc = ap * uScale * abs(1.0 / dist - 1.0 / uFocus);
    float diam = clamp(sqrt(sizePx * sizePx + coc * coc), 1.0, 160.0);
    vSharp = clamp(sizePx / diam, 0.0, 1.0);
    vFlash = 0.0;

    float energy;
#if KIND == 2
    // A glint is a point of light seen only in the focal plane (defocused, it would be a smudge):
    // a crisp 1-2 px core, faint most of the time, flaring briefly as a facet turns to the sun.
    energy = 1.0 - smoothstep(2.5, 4.0, coc);
    float ph = sin(uTime * (0.5 + aSeed.y * 0.8) + aSeed.x * 60.0);
    vFlash = pow(max(ph, 0.0), 24.0);
    energy *= 0.07 + vFlash * 3.0;
    diam = 11.0 * uScale / 700.0;
#elif KIND == 3
    energy = 1.0;
#else
    // Specks under ~1.5 px are culled rather than drawn as grey dust.
    energy = vSharp * vSharp * smoothstep(1.3, 2.2, diam);
  #if KIND == 0
    energy *= smoothstep(0.35, 0.7, vSharp);
    // A mote never grows into a big flat flake: close up, it fades out.
    energy *= 1.0 - smoothstep(9.0, 13.0, diam);
  #else
    // A vesicle's film only reads in focus; blurred, it would be a faint ring.
    energy *= smoothstep(0.7, 0.9, vSharp) * (1.0 - smoothstep(48.0, 64.0, diam));
  #endif
#endif

    float side = smoothstep(uFocus - uSplit - 0.15, uFocus - uSplit + 0.15, dist);
    side = uFront > 0.5 ? 1.0 - side : side;
    float f = uFog * dist;
    float edgeFade = 1.0 - smoothstep(uBox * 0.34, uBox * 0.5, length(p - uCentre));
    vAlpha = uOpacity * energy * side * edgeFade * exp(-f * f) * smoothstep(0.25, 0.6, dist);
    vDiam = diam;
    vDist = dist;
    vColor = aColor;
    if (uSaltP.w > 0.0) {
      // the same gentle bend as the dome's band
      float sx = dot(p, uSaltN) - uSaltP.x + 26.0 * sin(p.x * 0.0061 + p.y * 0.0023 + 1.3) + 14.0 * sin(p.z * 0.0087 - p.y * 0.0041);
      float salt = uSaltP.w * (smoothstep(0.0, uSaltP.z, sx) - smoothstep(uSaltP.y - 150.0, uSaltP.y, sx));
      vColor = mix(aColor, aColor * 0.55 + uSaltCol * (0.45 * max(max(aColor.r, aColor.g), aColor.b) + 0.1), 0.6 * salt);
    }
    vSeed = aSeed.w;
    // Where the sun is, seen from here: the lit side of a body, and the spot on a sphere that
    // mirrors the sun (its normal halfway between the view and the sun).
    vec3 sv = normalize((viewMatrix * vec4(uSunDir, 0.0)).xyz);
    vSun = normalize(sv.xy + 1e-4);
    vHl = normalize(sv + vec3(0.0, 0.0, 1.0)).xy;
    gl_PointSize = diam;
    gl_Position = projectionMatrix * mv;
#if KIND == 3
    // Lens bokeh frames the view from the edges and never veils the subject.
    vec2 ndc = gl_Position.xy / gl_Position.w;
    vAlpha *= smoothstep(0.5, 0.85, length(ndc * vec2(1.0, 0.8)));
    // Either a defined disc or nothing: no barely-there ghost circles.
    if (vAlpha < 0.025) vAlpha = 0.0;
#endif
    if (vAlpha < 0.002) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  }
`;

// Shared by every particle fragment shader: disc coordinates (y up) and, for the layers drawn in
// front of the cells, hiding behind opaque meshes using the scene's depth.
const particleCommon = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha, vDiam, vSharp, vSeed, vDist, vFlash;
  varying vec2 vSun, vHl;
#ifdef FRONT
  uniform sampler2D tDepth;
  uniform vec2 uRes;
  uniform float uNear, uFar, uOcclude;
  float occlusion() {
    if (uOcclude < 0.5) return 1.0;
    float z = texture2D(tDepth, gl_FragCoord.xy / uRes).x;
    if (z >= 1.0) return 1.0;
    float sceneDist = (uNear * uFar) / (uFar - (uFar - uNear) * z);
    return smoothstep(0.0, 0.12, sceneDist - vDist);
  }
#else
  float occlusion() { return 1.0; }
#endif
  vec2 discCoord() { return vec2(gl_PointCoord.x * 2.0 - 1.0, 1.0 - gl_PointCoord.y * 2.0); }
`;

// Motes: small tinted specks. Above ~4 px one reads as a tiny translucent body: clearer inside,
// a little denser toward its edge, and lighter on the side the sun comes from. Never a flat fill.
const moteFragment = /* glsl */ `
  ${particleCommon}
  void main() {
    vec2 c = discCoord();
    float r = length(c);
    float disc = 1.0 - smoothstep(1.0 - min(3.0 / vDiam, 0.9), 1.0, r);
    if (disc <= 0.0) discard;
    float body = smoothstep(3.5, 6.0, vDiam) * vSharp;
    float rim = smoothstep(0.45, 0.95, r);
    float lit = rim * max(dot(c / max(r, 1e-3), vSun), 0.0);
    vec3 col = mix(vColor, vColor * 1.6 + 0.12, body * lit * 0.8);
    float a = disc * mix(0.85, 0.42 + 0.43 * rim, body);
    gl_FragColor = vec4(col, a * vAlpha * occlusion());
  }
`;

// Outer-membrane vesicles: Gram-negative bacteria shed bubbles of outer membrane (20-250 nm),
// a single bilayer (~8 nm) round each. Large enough on screen, one is a clear body with a thin
// bright film (thin-film colours of the sky it mirrors, lighter than the water, never a dark ring)
// and a pin-point of sun; under ~12 px the film is too thin to draw, so it is a soft pastel mote.
const vesicleFragment = /* glsl */ `
  ${particleCommon}
  uniform vec3 uFilmLight, uSunColor;
  vec3 thinFilm(float cosT, float nm) {
    float s2 = 1.0 - cosT * cosT;
    float opd = 2.0 * 1.33 * nm * sqrt(max(1.0 - s2 / 1.7689, 0.0));
    return 0.5 + 0.5 * cos(6.2831853 * opd / vec3(640.0, 530.0, 450.0));
  }
  void main() {
    vec2 c = discCoord();
    float r = length(c);
    float disc = 1.0 - smoothstep(1.0 - min(3.0 / vDiam, 0.9), 1.0, r);
    if (disc <= 0.0) discard;
    float big = smoothstep(13.0, 19.0, vDiam) * smoothstep(0.6, 0.85, vSharp);
    // Path length through a shell of inner radius 0.88, normalised to its maximum.
    float r2 = min(r * r, 0.999);
    float L = (sqrt(1.0 - r2) - sqrt(max(0.7744 - r2, 0.0))) / 0.475;
    vec3 film = thinFilm(sqrt(1.0 - r2), mix(280.0, 560.0, vSeed));
    float lit = max(dot(c / max(r, 1e-3), vSun), 0.0);
    // The film mirrors the bright sky, so it is always lighter than the water; it catches most light
    // on the sun's side (a crescent, not an even ring).
    vec3 filmCol = uFilmLight * (0.8 + 0.5 * film) * (0.9 + 0.3 * lit);
    vec2 h = c - vHl * 0.85;
    float hl = exp(-dot(h, h) * vDiam * vDiam / 9.0);
    vec3 bubble = mix(vColor, filmCol, smoothstep(0.15, 0.6, L)) + uSunColor * hl * 2.0;
    float bubbleA = disc * (max(0.045, L * 0.62 * (0.3 + 0.7 * lit)) + hl * 0.8);
    float soft = 1.0 - smoothstep(0.25, 1.0, r);
    vec3 col = mix(vColor, bubble, big);
    float a = mix(soft * 0.6, bubbleA, big);
    gl_FragColor = vec4(col, min(a, 1.0) * vAlpha * occlusion());
  }
`;

// Glints (additive): a crisp core, and at a flash a faint prismatic halo whose hue drifts (a hue
// shift, not a ring); bloom adds the halation.
const glintFragment = /* glsl */ `
  ${particleCommon}
  void main() {
    vec2 c = discCoord();
    float rp = length(c) * vDiam * 0.5;
    float core = exp(-rp * rp / 0.8);
    vec3 hue = 0.55 + 0.45 * cos(6.2831853 * (vSeed + rp * 0.07 + vec3(0.0, 0.33, 0.67)));
    // At rest a small tinted spark; at a flash a white core with a coloured halo.
    vec3 col = vColor * (core * mix(hue * 1.3, vec3(1.0), vFlash) + hue * exp(-rp * rp / 9.0) * (0.04 + 0.12 * vFlash));
    float k = vAlpha * occlusion();
    if (k * max(col.r, col.g) < 0.004) discard;
    gl_FragColor = vec4(col * k, 1.0);
  }
`;

// Specks right in front of the lens, wide open: soft round discs with a defined edge, a clear
// pastel body and a slightly brighter rim on the sun's side.
const bokehFragment = /* glsl */ `
  ${particleCommon}
  void main() {
    vec2 c = discCoord();
    float r = length(c);
    float disc = 1.0 - smoothstep(1.0 - min(3.0 / vDiam, 0.5), 1.0, r);
    if (disc <= 0.0) discard;
    float rim = smoothstep(0.62, 0.96, r);
    float lit = 0.35 + 0.65 * max(dot(c / max(r, 1e-3), vSun), 0.0);
    vec3 col = vColor * (1.0 + 0.35 * rim * lit);
    float a = disc * (0.45 + 0.55 * rim * lit);
    gl_FragColor = vec4(col, a * vAlpha * occlusion());
  }
`;

const FRAGMENT = [moteFragment, vesicleFragment, glintFragment, bokehFragment];

function rng(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// count, box (µm, cube around the centre), size [min, max] µm, colours [[displayHex, weight], ...]
function particleGeometry({ count, box, size, colors, gain = 1, seed }) {
  const rnd = rng(seed);
  const pos = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count * 4);
  const col = new Float32Array(count * 3);
  const total = colors.reduce((s, [, w]) => s + w, 0);
  const sc = colors.map(([h]) => sceneColor(h, gain));
  for (let i = 0; i < count; i++) {
    for (let k = 0; k < 3; k++) pos[i * 3 + k] = (rnd() - 0.5) * box;
    sizes[i] = size[0] + Math.pow(rnd(), 3) * (size[1] - size[0]);
    for (let k = 0; k < 4; k++) seeds[i * 4 + k] = rnd();
    let pick = rnd() * total, j = 0;
    while (j < colors.length - 1 && (pick -= colors[j][1]) > 0) j++;
    sc[j].toArray(col, i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
  g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  return g;
}

function particleMaterial({ kind, box, opacity, front }) {
  const uniforms = {
    uTime: clock.uTime,
    uBox: { value: box },
    uFocus: { value: 4 },
    uScale: { value: 700 },
    uApK: { value: APERTURE_K },
    uApNear: { value: APERTURE_NEAR },
    uFog: { value: ENV.fogDensity },
    uFront: { value: front ? 1 : 0 },
    uOpacity: { value: opacity },
    uSplit: { value: 0.75 },
    uCentre: { value: new THREE.Vector3() },
    uSunDir: { value: ENV.sunDir },
  };
  if (kind === KIND.vesicle) {
    uniforms.uFilmLight = { value: ENV.sky.clone().multiplyScalar(1.05) };
    uniforms.uSunColor = { value: ENV.sunColor };
  }
  if (front) {
    Object.assign(uniforms, { tDepth: { value: null }, uRes: { value: new THREE.Vector2(1, 1) }, uNear: { value: 0.1 }, uFar: { value: 1000 }, uOcclude: { value: 0 } });
  }
  return new THREE.ShaderMaterial({
    uniforms,
    defines: front ? { KIND: kind, FRONT: 1 } : { KIND: kind },
    vertexShader: particleVertex,
    fragmentShader: FRAGMENT[kind],
    transparent: true,
    depthWrite: false,
    blending: kind === KIND.glint ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

// The pass that draws the particles lying between the camera and the subject, over the cells.
// With the scene's depth texture they hide behind opaque meshes that are nearer still (a flagellum
// streaming toward the camera, food, a neighbour's meshes).
class FrontPass extends Pass {
  constructor(scene, camera, layers, depth) {
    super();
    this.scene = scene;
    this.camera = camera;
    this.layers = layers;
    this.depth = depth;
    this.needsSwap = false;
  }

  render(renderer, writeBuffer, readBuffer) {
    const target = this.renderToScreen ? null : readBuffer;
    let tex = typeof this.depth === 'function' ? this.depth() : this.depth;
    // Drawing straight into the buffer that holds the scene's depth: plain depth testing works there.
    const inPlace = !!tex && target?.depthTexture === tex;
    if (inPlace) tex = null;
    for (const p of this.layers) {
      const u = p.material.uniforms;
      p.material.depthTest = inPlace;
      u.tDepth.value = tex ?? null;
      u.uOcclude.value = tex ? 1 : 0;
      if (target) u.uRes.value.set(target.width, target.height);
      u.uNear.value = this.camera.near;
      u.uFar.value = this.camera.far;
    }
    const auto = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setRenderTarget(target);
    renderer.render(this.scene, this.camera);
    renderer.autoClear = auto;
  }
}

// ------------------------------------------------------------------------------------------------
// Light rays: a few narrow, clean-edged rays slanting down from the surface, all parallel to the
// refracted sunlight, with the water between them a touch darker (two-sided contrast instead of an
// additive veil). Curtains sit on a world lattice and are drawn only in a ring 6-21 µm beyond the
// subject, so they show in any framing, stay behind the hero and keep their parallax.
// ------------------------------------------------------------------------------------------------
const shaftVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const shaftFragment = /* glsl */ `
  uniform float uTime, uSeed, uFade, uFog, uWidth;
  uniform vec3 uColor, uRayX, uRayW;
  varying vec2 vUv;
  varying vec3 vWorld;
  void main() {
    float dist = distance(vWorld, cameraPosition);
    // Strongest high up, gone by the time they reach the level of the camera.
    float elev = (vWorld.y - cameraPosition.y) / dist;
    float f = uFog * dist;
    float fade = uFade * smoothstep(-0.2, 0.15, elev) * exp(-f * f) * smoothstep(0.0, 0.3, vUv.y);
    float x = vUv.x * uWidth;
    float aa = fwidth(x);
    float ray = 0.0;
    for (int k = 0; k < 3; k++) {
      float xc = uRayX[k] * uWidth + sin(uTime * 0.11 + uSeed * 3.0 + float(k) * 2.1 + vUv.y * 1.7) * 0.1;
      float hw = uRayW[k] * 0.5;
      float along = 0.65 + 0.35 * sin(vUv.y * 11.0 + uTime * 0.2 + uSeed + float(k) * 1.3);
      ray = max(ray, (1.0 - smoothstep(hw - aa, hw + aa, abs(x - xc))) * along);
    }
    float env = sin(3.14159 * vUv.x);
    float gap = env * env * (1.0 - ray);
    // Premultiplied: rays add light, the water between them is multiplied down a little.
    gl_FragColor = vec4(uColor * ray * fade * 0.45, 0.045 * gap * fade);
  }
`;

const _h = new THREE.Vector3();

const SHAFT_GRID = 9; // µm between curtains on the lattice
const SHAFT_POOL = 40;

function hash(i, j, k) {
  const s = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

// ------------------------------------------------------------------------------------------------
export class Water {
  constructor(scene) {
    this.scene = scene;
    scene.fog = new THREE.FogExp2(ENV.fogColor.clone(), ENV.fogDensity);
    scene.background = null;
    this.front = new THREE.Scene();
    this._frontLayers = [];

    this.dome = new THREE.Mesh(new THREE.SphereGeometry(400, 48, 32), domeMaterial());
    this.dome.renderOrder = -10;
    this.dome.frustumCulled = false;
    scene.add(this.dome);

    // Fine motes around the subject: clear pastel teal, lilac, amber and mint.
    const motes = {
      count: 700, box: 16, size: [0.025, 0.075], seed: 7,
      colors: [[0x5fb4b8, 5], [0x9d8ed8, 1.6], [0xd9a258, 1.1], [0x62c29e, 1.4]],
    };
    // Outer-membrane vesicles: fewer, larger, clear.
    const vesicles = { count: 90, box: 24, size: [0.06, 0.2], seed: 11, colors: [[0x9cd8dc, 3], [0xc4b8ec, 1.2], [0xe6cf9c, 0.7]] };
    // Specks right in front of the lens (front only): wide-open bokeh, pale and luminous.
    const near = { count: 80, box: 7, size: [0.006, 0.018], seed: 31, colors: [[0xe3f7f2, 3], [0xece4ff, 1.5], [0xfff2e0, 1]] };
    // Glints are pure light: their colour sits far above the water's, so bloom gives them halation.
    const glints = { count: 450, box: 12, size: [0.02, 0.04], seed: 23, gain: 5, colors: [[0xffffff, 3], [0xfff0d8, 1], [0xe8f6ff, 1]] };
    this.layers = [];
    // the warm gold motes take in tear water (scene-linear)
    this.saltCol = { value: new THREE.Color(1.0, 0.78, 0.48) };
    const layer = (spec, kind, opacity, { sides = [false, true], ahead = 'focus' } = {}) => {
      const g = particleGeometry(spec);
      for (const front of sides) {
        const pts = new THREE.Points(g, particleMaterial({ kind, box: spec.box, opacity, front }));
        // the salt front's uniforms, shared with the dome (so setFront() reaches them too)
        const du = this.dome.material.uniforms;
        Object.assign(pts.material.uniforms, { uSaltN: du.uFrontN, uSaltP: du.uFrontP, uSaltCol: this.saltCol });
        pts.frustumCulled = false;
        pts.renderOrder = 5;
        pts.userData.ahead = ahead;
        // Front halves live in the main scene until frontPass() takes them.
        scene.add(pts);
        if (front) this._frontLayers.push(pts);
        this.layers.push(pts);
      }
    };
    layer(motes, KIND.mote, 0.9);
    layer(vesicles, KIND.vesicle, 1.0);
    layer(near, KIND.bokeh, 0.26, { sides: [true], ahead: 0.3 });
    layer(glints, KIND.glint, 1.0);
    // One sun direction for the dome and every particle, so setSun() moves them together.
    this.sunDir = this.dome.material.uniforms.uSunDir.value;
    for (const p of this.layers) p.material.uniforms.uSunDir.value = this.sunDir;
    this.shaftGain = 1; // the rays' strength (the opening brings them in as the sun climbs)
    this.scale = 1; // the world seen from further away: caustics finer, rays wider apart

    this.shafts = [];
    const shaftColor = new THREE.Color(0xfffaf0);
    const quad = new THREE.PlaneGeometry(1, 1);
    for (let i = 0; i < SHAFT_POOL; i++) {
      const m = new THREE.ShaderMaterial({
        uniforms: {
          uTime: clock.uTime,
          uSeed: { value: 0 },
          uFade: { value: 0 },
          uWidth: { value: 3 },
          uRayX: { value: new THREE.Vector3() },
          uRayW: { value: new THREE.Vector3() },
          uColor: { value: shaftColor },
          uFog: { value: ENV.fogDensity * 0.6 },
        },
        vertexShader: shaftVertex,
        fragmentShader: shaftFragment,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
      });
      const mesh = new THREE.Mesh(quad, m);
      mesh.matrixAutoUpdate = false;
      mesh.renderOrder = 4;
      mesh.visible = false;
      this.shafts.push(mesh);
      scene.add(mesh);
    }
    this._rayUp = new THREE.Vector3();
    this.setSun(ENV.sunDir);
    this._fwd = new THREE.Vector3();
    this._v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    this._cands = [];
  }

  // The sun's direction (world, toward the sun): the dome's window and disc, the particles' lit
  // side, and the rays, which run along the refracted sunlight (about 22° from vertical at the
  // morning sun).
  setSun(dir) {
    this.sunDir.copy(dir).normalize();
    const s = this.sunDir;
    const h = _h.set(s.x, 0, s.z).normalize().multiplyScalar(Math.tan(Math.asin(Math.sin(Math.acos(THREE.MathUtils.clamp(s.y, -1, 1))) / 1.33)));
    this._rayUp.set(h.x, 1, h.z).normalize();
  }

  // The drop's colours (display hex, keys as LOOK.drop: meniscus, sky, horizon, haze, deep, abyss,
  // sun; optional film: what membranes mirror overhead), and optionally the sun's direction.
  // The fog takes the horizon colour. CellPass and the lens are set by applyDrop() in lens.js.
  setPalette(drop, sunDir) {
    const u = this.dome.material.uniforms;
    sceneColor(drop.meniscus, 1, u.uMeniscus.value);
    sceneColor(drop.sky, 1, u.uSky.value);
    sceneColor(drop.horizon, 1, u.uHorizon.value);
    sceneColor(drop.haze, 1, u.uHaze.value);
    sceneColor(drop.deep, 1, u.uDeep.value);
    sceneColor(drop.abyss, 1, u.uAbyss.value);
    u.uSun.value.set(drop.sun);
    if (drop.film !== undefined) sceneColor(drop.film, 1, u.uWindow.value);
    this.scene.fog.color.copy(u.uHorizon.value);
    if (sunDir) this.setSun(sunDir);
  }

  // Fog density for the scene, the particles and the rays (CellPass's is set separately).
  setFogDensity(d) {
    this.scene.fog.density = d;
    for (const p of this.layers) p.material.uniforms.uFog.value = d;
    for (const s of this.shafts) s.material.uniforms.uFog.value = d * 0.6;
  }

  // Seen from k times further than usual (the shrinking opening): the caustic net is k times finer
  // and the rays k times wider and further apart.
  setScale(k) {
    this.scale = k;
    this.dome.material.uniforms.uScale.value = k;
    // The particles are sized for the cell's scale: seen from further off they are dust below a
    // pixel (and the lens's bokeh would balloon), so they fade out, and come back as you arrive.
    // The lens's own bokeh (specks right in front of it) waits until you are at the cell's scale.
    const show = 1 - THREE.MathUtils.smoothstep(k, 2.4, 4.2);
    const lens = 1 - THREE.MathUtils.smoothstep(k, 1.08, 1.6);
    for (const p of this.layers) {
      const u = p.material.uniforms.uOpacity;
      p.userData.opacity ??= u.value;
      const v = p.material.defines.KIND === KIND.bokeh ? lens : show;
      u.value = p.userData.opacity * v;
      p.visible = v > 0.001;
    }
  }

  // How strongly the caustic net shows (1 normal).
  set caustics(v) {
    this.dome.material.uniforms.uCaustic.value = v;
  }
  get caustics() {
    return this.dome.material.uniforms.uCaustic.value;
  }
  // How much of the net's sharp threads show (1 normal; 0 leaves only their soft glow).
  set causticThreads(v) {
    this.dome.material.uniforms.uCausThread.value = v;
  }
  get causticThreads() {
    return this.dome.material.uniforms.uCausThread.value;
  }

  // The crossing's flash (0..1, toward white); callers keep it within the flash limit.
  set flash(v) {
    this.dome.material.uniforms.uFlash.value = v;
  }
  get flash() {
    return this.dome.material.uniforms.uFlash.value;
  }

  // A soft shadow across the sky: dir (world, toward the shadow's centre), strength 0..1, edge as
  // the cosines [inner, outer]. The watcher leaning over, and the blink.
  setShade(dir, strength, inner = 0.95, outer = 0.75) {
    const u = this.dome.material.uniforms;
    const l = Math.hypot(dir.x, dir.y, dir.z) || 1;
    u.uShade.value.set(dir.x / l, dir.y / l, dir.z / l, strength);
    u.uShadeR.value.set(inner, outer);
  }

  // The salt front: a band of tear water w µm wide whose mixed edge is the plane dot(p, normal) =
  // offset, rising over e µm; strength 0 hides it. reach: how far along a ray it counts (µm);
  // layers: the spacing of its layers (µm).
  // tint: what the band multiplies the water by where it is thickest (scene-linear, [r, g, b]).
  // depth: µm of band water a ray must cross to show about 63% of the tint. motes: the colour
  // (scene-linear [r, g, b]) motes and glints warm toward inside the band.
  setFront({ normal, offset = 0, width = 500, edge = 20, strength = 0, reach = 600, layers = 22, tint, depth = 140, motes } = {}) {
    const u = this.dome.material.uniforms;
    if (normal) u.uFrontN.value.copy(normal).normalize();
    u.uFrontP.value.set(offset, width, edge, strength);
    u.uFrontT.value.set(reach, layers);
    u.uFrontK.value = depth;
    if (tint) u.uFrontCol.value.setRGB(...tint);
    if (motes) this.saltCol.value.setRGB(...motes);
  }

  // How much tear water there is at a world point (0..1, the band's own profile and bend, times its
  // strength): what the opening warms a cell by.
  saltAt(p) {
    const u = this.dome.material.uniforms;
    const P = u.uFrontP.value;
    if (P.w <= 0) return 0;
    const x = p.dot(u.uFrontN.value) - P.x + 26 * Math.sin(p.x * 0.0061 + p.y * 0.0023 + 1.3) + 14 * Math.sin(p.z * 0.0087 - p.y * 0.0041);
    const ss = THREE.MathUtils.smoothstep;
    return P.w * (ss(x, 0, P.z) - ss(x, P.y - 150, P.y));
  }

  // The drop's light as an environment map, for anything that reflects.
  environment(renderer) {
    const envScene = new THREE.Scene();
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(50, 48, 32), domeMaterial());
    envScene.add(mesh);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const tex = pmrem.fromScene(envScene, 0.02).texture;
    pmrem.dispose();
    mesh.geometry.dispose();
    mesh.material.dispose();
    return tex;
  }

  // The pass that draws particles lying between the camera and the subject, over the cells. Add it
  // right after CellPass (composeLook in lens.js does). `depth`: the scene's depth texture, or a
  // function returning it each frame, so those particles hide behind nearer opaque meshes.
  frontPass(camera, { depth = null } = {}) {
    for (const p of this._frontLayers) {
      this.scene.remove(p);
      this.front.add(p);
      p.material.depthTest = false;
    }
    return new FrontPass(this.front, camera, this._frontLayers, depth);
  }

  resize(height, fov) {
    const scale = height / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2));
    for (const p of this.layers) p.material.uniforms.uScale.value = scale;
  }

  // focus: distance from the camera to what is in focus (the hero).
  update(camera, focus) {
    this.dome.position.copy(camera.position);
    camera.getWorldDirection(this._fwd);
    for (const p of this.layers) {
      const u = p.material.uniforms;
      const ahead = p.userData.ahead === 'focus' ? focus : Math.min(focus, u.uBox.value * p.userData.ahead);
      u.uCentre.value.copy(camera.position).addScaledVector(this._fwd, ahead);
      u.uFocus.value = focus;
    }
    this.updateShafts(camera, focus);
  }

  updateShafts(camera, focus) {
    const k = this.scale;
    if (this.shaftGain <= 0) {
      for (const s of this.shafts) s.visible = false;
      return;
    }
    const G = SHAFT_GRID * k;
    const inner = Math.max(11 * k, focus + 6 * k);
    const outer = inner + 15 * k;
    const cp = camera.position;
    const cands = this._cands;
    cands.length = 0;
    const i0 = Math.floor((cp.x - outer) / G), i1 = Math.ceil((cp.x + outer) / G);
    const j0 = Math.floor((cp.z - outer) / G), j1 = Math.ceil((cp.z + outer) / G);
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const x = (i + 0.15 + 0.7 * hash(i, j, 1)) * G;
        const z = (j + 0.15 + 0.7 * hash(i, j, 2)) * G;
        const dist = Math.hypot(x - cp.x, z - cp.z);
        if (dist < inner || dist > outer) continue;
        cands.push({ i, j, x, z, dist });
      }
    }
    cands.sort((a, b) => a.dist - b.dist);
    const [up, toCam, right, normal, along] = this._v;
    up.copy(this._rayUp);
    for (let k = 0; k < this.shafts.length; k++) {
      const s = this.shafts[k];
      const c = cands[k];
      s.visible = !!c;
      if (!c) continue;
      const { i, j } = c;
      const u = s.material.uniforms;
      const width = (2.5 + 2.0 * hash(i, j, 3)) * k;
      const len = 64 * k;
      u.uFade.value = this.shaftGain * THREE.MathUtils.smoothstep(c.dist, inner, inner + 3 * k) * (1 - THREE.MathUtils.smoothstep(c.dist, outer - 4 * k, outer));
      u.uSeed.value = hash(i, j, 4) * 10;
      u.uWidth.value = width;
      const n = hash(i, j, 5);
      u.uRayX.value.set(0.22 + 0.1 * hash(i, j, 6), 0.5 + 0.1 * (hash(i, j, 7) - 0.5), n > 0.4 ? 0.72 + 0.1 * hash(i, j, 8) : -10);
      u.uRayW.value.set(0.18 + 0.27 * hash(i, j, 9), 0.18 + 0.27 * hash(i, j, 10), 0.18 + 0.27 * hash(i, j, 11));
      // Face the camera, turning only about the ray's own axis.
      toCam.set(cp.x - c.x, 0, cp.z - c.z);
      right.crossVectors(up, toCam);
      if (right.lengthSq() < 1e-6) right.set(1, 0, 0);
      right.normalize();
      normal.crossVectors(right, up);
      s.matrix.makeBasis(right.multiplyScalar(width), along.copy(up).multiplyScalar(len), normal);
      s.matrix.setPosition(c.x, cp.y + 0.5 * len * up.y - 6 * k, c.z);
      s.matrixWorldNeedsUpdate = true;
    }
  }
}

// Light for any lit (standard) materials: bright pearly sky above, teal bounce from below, and
// the sun from the same direction as everything else.
export function addLights(scene) {
  const hemi = new THREE.HemisphereLight(sceneColor(D.meniscus, 0.8), sceneColor(D.deep, 0.7), 1.6);
  const sun = new THREE.DirectionalLight(ENV.sunColor, 1.8);
  sun.position.copy(ENV.sunDir).multiplyScalar(10);
  const fill = new THREE.DirectionalLight(sceneColor(D.abyss, 0.6), 0.5);
  fill.position.set(-0.4, -1, -0.3).multiplyScalar(10);
  scene.add(hemi, sun, fill);
  return { hemi, sun, fill };
}
