import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { clock, MAX_DENTS, DENT_RIM, DENT_SHUT } from './materials.js';

// The cell renderer. Every cell is drawn as one continuous volume of living matter, raymarched in
// a single pass after the rest of the scene: its membranes are thin films in that volume, and its
// large structures (nucleoid, plasmid, granules, the TCA cycle, glycolysis, the receptor patch,
// the periplasm's proton glow, endocytic vesicles) are matter in the same medium. Everything is lit
// by the same sky and sun and fogged like the water, and solid matter is lit by the same curve as
// the meshes (organicMaterial), so nothing looks like a separate layer. The cytoplasm has the same
// (near-zero) density as the water outside: what you see of a cell is its membranes and what
// floats in it.
//
// Sharpness: every structure has a crisp, flat-topped profile with about a one-pixel antialiased
// edge. Thin things (membranes, DNA, the receptor lattice) are sized against the pixel they land
// on: never thinner than about a pixel (so they do not shimmer or break up), never wider than their
// drawn size (so they never go soft). Membranes are slabs whose crossing is integrated exactly
// between two samples, so a film costs a few steps and its edge stays sharp at any distance; they
// REFLECT the drop (a bright window overhead, the sun's glint, teal below) through thin-film
// interference, which is what makes them read as 3D surfaces rather than outlines.
//
// Small things (beads, ribosomes, membrane complexes, flagella) are ordinary opaque meshes drawn
// before this pass. The volume is composited over them up to their depth, so a bead inside the cell
// is veiled by the membrane in front of it exactly as volume matter would be.
//
// Each cell is described in its own REFERENCE body space (see materials.js): a capsule of radius R
// and core half-length H along +Z. The flow warp moves where things are drawn; the raymarch undoes
// it (two fixed-point steps of the inverse), so the volume flows exactly like the meshes that use
// flowPoint/FLOW.

export const MAX_CELLS = 12; // drawn at once: the hero plus the nearest visible neighbours
const MAX_GRANULES = 6;
const MAX_VESICLES = 2;
export const MAX_RAFTS = 8; // membrane patches where the hero's complexes gather
export const TCA_ENZYMES = 7; // the cytoplasmic ones; succinate dehydrogenase sits in the membrane
export const GLYCOLYSIS_ENZYMES = 9; // glucose arrives as G6P through the PTS, so no hexokinase step
const GLYCO_PATH = 25; // points on the metabolite thread through the glycolysis enzymes

export const CELL_KIND = { hero: 0, rod: 1, coccus: 2 };

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  #define MAXC ${MAX_CELLS}
  #define MAXG ${MAX_GRANULES}
  #define MAXV ${MAX_VESICLES}
  #define MAXD ${MAX_DENTS}
  #define MAXR ${MAX_RAFTS}
  #define NTCA ${TCA_ENZYMES}
  #define NGLY ${GLYCOLYSIS_ENZYMES}
  #define NGP ${GLYCO_PATH}
  #define NF 6              // film slots: cell outer/wall, cell inner, and two per vesicle
  #define WALL_H 0.028      // half the thickness of a coccus's wall (µm)
  #define DENT_RIM ${DENT_RIM.toFixed(4)}
  #define DENT_SHUT ${DENT_SHUT.toFixed(4)}
  #ifndef CELL_DEBUG
  #define CELL_DEBUG 0
  #endif

  uniform sampler2D tDepth;
  uniform mat4 uProjInv;
  uniform mat4 uViewInv;
  uniform vec3 uCamPos;
  uniform float uTime;
  uniform float uPixelAngle;    // radians per pixel (vertical)
  uniform float uQuality;       // 1 full; lower takes longer strides and stops sooner
  uniform vec2 uStepCap;        // most steps per pixel: hero, neighbours

  uniform int uCount;
  uniform mat4 uInv[MAXC];      // world -> reference body space
  uniform vec4 uSphere[MAXC];   // world bounding sphere: centre, radius
  uniform vec4 uGeom[MAXC];     // R, H (core half-length), kind, scale (world units per body unit)
  uniform vec4 uFlow[MAXC];     // amp, speed, seed, thrust
  uniform vec4 uTurnW[MAXC];    // turn.x, turn.y, wobble, proton glow (0..1)
  uniform vec3 uTint[MAXC];
  uniform vec4 uCellX[MAXC];    // wall, pinch (division), husk, split (husks) or ghost (others)
  uniform vec4 uHeroX;          // interior mute, squeeze depth (µm), squeeze plane offset, squeeze width
  uniform vec3 uSqueezeN;       // the squeeze plane's normal (hero body space)
  uniform float uCellS[MAXC];   // tear water round the cell (the opening's salt front): 0..1, < 0 none
  uniform vec3 uSaltWarm, uSaltCool; // what a cell in tear water / in the mixed water is tinted by

  // Hero cell detail (cell 0 when uHero == 1), all in reference body space.
  uniform int uHero;
  uniform vec4 uDentC[MAXD];       // pocket: point on the surface, footprint
  uniform vec4 uDentN[MAXD];       // outward normal, floor depth (0 = off)
  uniform float uDentP[MAXD];      // pinch
  uniform vec4 uDentB[MAXD];       // the cup's sphere: centre, radius (materials.js setDent)
  uniform vec4 uNucleoid;          // centre, size scale
  uniform vec4 uPlasmid;           // centre, ring radius
  uniform vec4 uGranule[MAXG];     // centre, radius
  uniform float uGranuleKind[MAXG];// 0 glycogen, 1 polyphosphate
  uniform int uGranuleCount;
  uniform vec4 uTca;               // loop centre, radius
  uniform vec4 uTcaAxis;           // axis, activity
  uniform float uTcaStream;        // how much of the loop's own stream of beads is drawn (0..1)
  uniform vec4 uTcaE[NTCA * 4];    // the enzymes' subunits: centre, radius (0 = none); 4 per enzyme
  uniform vec4 uGlyco;             // centre, activity
  uniform float uGlycoBound;       // radius round the centre that holds the whole chain
  uniform vec4 uGlycoE[NGLY * 4];  // subunits as for the TCA, G6P end first
  uniform vec3 uGlycoPath[NGP];    // the metabolite thread through them
  uniform vec4 uReceptor;          // patch direction from the front pole's centre, glow
  uniform float uReceptorR;        // patch radius (µm along the membrane)
  uniform vec4 uRaft[MAXR];        // membrane patch centre, radius
  uniform vec3 uRaftN[MAXR];       // its outward normal
  uniform int uRaftCount;
  uniform vec4 uVesicle[MAXV];     // centre, radius (0 = none)
  uniform vec4 uVesicleState[MAXV];// digestion glow, membrane presence, kind (0 glycogen, 1 protein), -

  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uLight;   // overall brightness of scattered light
  uniform float uEmit;    // overall strength of self-glow
  uniform vec3 uSky;
  uniform vec3 uDeep;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform vec4 uWindow;   // the sky's bright window round the sun: cosIn, cosOut, gain
  uniform vec2 uSunLook;  // the sun's glint in films: power, gain
  uniform vec4 uFilm;     // outer membrane body, inner membrane body, film half-width (µm), periplasm body
  uniform vec2 uFilmShine;// how strongly the outer and inner membranes reflect
  uniform vec3 uInnerTint;
  uniform vec3 uDnaColor, uPlasmidColor, uGlycogenColor, uPolyPColor, uTcaColor, uGlycoColor, uReceptorColor, uProtonColor, uVesicleColor;

  varying vec2 vUv;

  // Per-cell, per-step state shared by the field functions.
  vec3 gUp, gSun, gView;  // world up, sun and view directions in reference body space
  float gFp;              // body µm per pixel here
  float gSig;             // film half-width at this pixel size
  float gDensK;           // keeps a widened film's total opacity unchanged
  float gEdge;            // antialiased edge of solid things: about half a pixel
  float gT;
  float gR, gH, gOff;     // body radius, core half-length, depth of the inner film below the outer
  int gKind;
  float gFd[NF];          // signed distance (µm) to each film at this sample; 1e3 = none
  vec4 gX;                // this cell's uCellX
  vec3 gTintC;            // this cell's tint
  float gInK, gDesat;     // interior matter: strength, and how far its colour is muted to the tint

  // ---------------------------------------------------------------- noise
  float hash13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
  }
  vec3 hash33(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.xxy + p.yxx) * p.zyx) * 2.0 - 1.0;
  }
  float vnoise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash13(i), hash13(i + vec3(1,0,0)), f.x), mix(hash13(i + vec3(0,1,0)), hash13(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash13(i + vec3(0,0,1)), hash13(i + vec3(1,0,1)), f.x), mix(hash13(i + vec3(0,1,1)), hash13(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  // Gradient noise with its gradient (value, d/dx, d/dy, d/dz). Its zero set is a smooth surface
  // with an even slope, so two of them cross in clean curves: the DNA.
  vec4 gnoised(vec3 x) {
    vec3 i = floor(x), f = fract(x);
    vec3 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    vec3 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
    vec3 ga = hash33(i), gb = hash33(i + vec3(1,0,0)), gc = hash33(i + vec3(0,1,0)), gd = hash33(i + vec3(1,1,0));
    vec3 ge = hash33(i + vec3(0,0,1)), gf = hash33(i + vec3(1,0,1)), gg = hash33(i + vec3(0,1,1)), gh = hash33(i + vec3(1,1,1));
    float va = dot(ga, f), vb = dot(gb, f - vec3(1,0,0)), vc = dot(gc, f - vec3(0,1,0)), vd = dot(gd, f - vec3(1,1,0));
    float ve = dot(ge, f - vec3(0,0,1)), vf = dot(gf, f - vec3(1,0,1)), vg = dot(gg, f - vec3(0,1,1)), vh = dot(gh, f - vec3(1,1,1));
    float k7 = -va + vb + vc - vd + ve - vf - vg + vh;
    float v = va + u.x * (vb - va) + u.y * (vc - va) + u.z * (ve - va) + u.x * u.y * (va - vb - vc + vd)
            + u.y * u.z * (va - vc - ve + vg) + u.z * u.x * (va - vb - ve + vf) + u.x * u.y * u.z * k7;
    vec3 g = ga + u.x * (gb - ga) + u.y * (gc - ga) + u.z * (ge - ga) + u.x * u.y * (ga - gb - gc + gd)
           + u.y * u.z * (ga - gc - ge + gg) + u.z * u.x * (ga - gb - ge + gf) + u.x * u.y * u.z * (-ga + gb + gc - gd + ge - gf - gg + gh)
           + du * vec3(vb - va + u.y * (va - vb - vc + vd) + u.z * (va - vb - ve + vf) + u.y * u.z * k7,
                       vc - va + u.z * (va - vc - ve + vg) + u.x * (va - vb - vc + vd) + u.z * u.x * k7,
                       ve - va + u.x * (va - vb - ve + vf) + u.y * (va - vc - ve + vg) + u.x * u.y * k7);
    return vec4(v, g);
  }

  // ---------------------------------------------------------------- the flow warp (twin of flowPoint in materials.js)
  float capsuleSdH(vec3 p, float R, float H) {
    vec3 q = vec3(p.xy, max(abs(p.z) - H, 0.0));
    return length(q) - R;
  }
  vec3 flowWarpC(vec3 p, vec4 fl, vec2 turn) {
    float sd = capsuleSdH(p, 0.5, 0.5);
    float reach = 1.0 - smoothstep(0.15, 0.9, sd);
    float core = smoothstep(-0.45, 0.0, sd);
    float t = uTime * fl.y + fl.z;
    float thrust = fl.w;
    float rear = smoothstep(0.2, -1.1, p.z);
    float front = smoothstep(-0.2, 1.1, p.z);
    float sxy = 1.0 + (0.06 * front - 0.24 * rear) * thrust * reach;
    vec3 q;
    q.xy = p.xy * sxy + turn * p.z * p.z * 0.35 * reach;
    q.z = p.z + p.z * 0.1 * thrust * reach;
    float a = fl.x * (0.35 + 0.65 * core) * reach;
    q.x += a * sin(p.z * 2.1 + t * 1.3) * cos(p.y * 2.7 - t * 0.9);
    q.y += a * sin(p.z * 1.7 - t * 1.1 + 1.3) * cos(p.x * 2.3 + t * 0.7);
    q.z += a * 0.6 * sin(p.x * 2.5 + t * 0.8 + 2.1) * cos(p.y * 1.9 - t * 1.2);
    return q;
  }
  // Undo the warp: where was this drawn point in reference space? Two fixed-point steps.
  vec3 unwarp(vec3 q, vec4 fl, vec2 turn) {
    vec3 p = q;
    p = q - (flowWarpC(p, fl, turn) - p);
    p = q - (flowWarpC(p, fl, turn) - p);
    return p;
  }

  // ---------------------------------------------------------------- light
  // What a direction sees of the drop: the pearly meniscus overhead with the bright window round
  // the sun, teal depth below, and the sun as one small glint (capped, so it stays a point).
  vec3 envSky(vec3 d) {
    return mix(uDeep, uSky, smoothstep(-0.6, 0.8, dot(d, gUp)));
  }
  vec3 envRef(vec3 d) {
    float s = dot(d, gSun);
    vec3 c = envSky(d) + uSky * uWindow.z * smoothstep(uWindow.y, uWindow.x, s);
    c += uSunColor * pow(max(s, 0.0), uSunLook.x) * uSunLook.y;
    return c * uLight;
  }
  // Solid matter, lit exactly like organicMaterial lights the meshes: wrapped sun, light bleeding
  // through thin edges. (Its own glow is added by the caller.)
  vec3 shade(vec3 alb, vec3 n) {
    float wrap = dot(n, gSun) * 0.5 + 0.5;
    float facing = abs(dot(n, gView));
    return alb * (0.42 + 0.58 * wrap * wrap + 0.35 * pow(1.0 - facing, 1.6)) * uLight;
  }
  // Diffuse matter with no surface (the periplasm's glow, a vesicle's lumen).
  vec3 shadeFine(vec3 alb) {
    return alb * (mix(uDeep, uSky, 0.7) * 0.55 + uSunColor * 0.42) * uLight;
  }
  vec3 glint(vec3 n, float pw) {
    return uSunColor * pow(max(dot(reflect(-gView, n), gSun), 0.0), pw) * uLight;
  }

  // ---------------------------------------------------------------- thin-film interference
  vec3 thinFilm(float cosT, float nm) {
    float s2 = 1.0 - cosT * cosT;
    float opd = 2.0 * 1.33 * nm * sqrt(max(1.0 - s2 / (1.33 * 1.33), 0.0));
    vec3 ph = opd / vec3(640.0, 530.0, 450.0);
    return 0.5 + 0.5 * cos(6.2831853 * ph);
  }

  // ---------------------------------------------------------------- the field
  // Density (per body µm), the colour of the matter where it is dense (already lit), light it
  // emits, and a distance below which nothing changes much (so the march can stride through
  // empty cytoplasm and slow down only at structures). Films are not in here: field() leaves their
  // distances in gFd and the march integrates each crossing exactly.
  struct S { float sigma; vec3 rad; vec3 emit; float hint; };

  void addD(inout S s, float sigma, vec3 rad, vec3 emit) {
    // A walled or dying cell's insides are fainter and paler (gInK, gDesat; 1 and 0 normally).
    sigma *= gInK;
    emit *= gInK;
    rad = mix(rad, dot(rad, vec3(0.2126, 0.7152, 0.0722)) * gTintC, gDesat);
    float w = sigma / max(s.sigma + sigma, 1e-6);
    s.rad = mix(s.rad, rad, w);
    s.emit += emit;
    s.sigma += sigma;
  }

  // Endocytic pockets on the hero (materials.js setDent; its dentOffset() is this same field in JS:
  // keep the two identical). A pocket is a cup carved out of the cell: the swallowed particle's
  // sphere a little larger (uDentB) swept outward along the normal, so its floor hugs the particle,
  // its walls rise to the surface and turn into it over a soft rim (uDentC.w * DENT_RIM), and the
  // double film lines it like the rest of the envelope. Pinching (uDentP) narrows the neck above the
  // sphere until it shuts, leaving the particle in a sealed bubble with its own double film.
  float dentSmax(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return max(a, b) + h * h * k * 0.25;
  }
  // Distance to pocket k's water (negative inside it): the cup's sphere, and the neck rising from it
  // out past the surface, narrowing as it pinches (to DENT_SHUT past closed).
  float dentCarve(int k, vec3 p) {
    vec3 c = uDentC[k].xyz, dn = uDentN[k].xyz;
    vec4 b = uDentB[k];
    float pinch = uDentP[k];
    vec3 d = p - b.xyz;
    float sphere = length(d) - b.w;
    float top = max(-dot(b.xyz - c, dn), 0.0) + DENT_RIM * uDentC[k].w + 0.1;
    float h = clamp(dot(d, dn), 0.0, top);
    float neck = length(d - dn * h) - (b.w - pinch * (b.w + DENT_SHUT));
    float kn = 0.5 * max(b.w, 0.0) * pinch;
    float hn = kn > 0.0 ? max(kn - abs(sphere - neck), 0.0) / kn : 0.0;
    return min(sphere, neck) - hn * hn * kn * 0.25;
  }
  // How far the pockets raise the field at p (>= 0, added to the capsule's distance). The carved
  // field's slope is never above 1, so the march needs no extra care; slope is nudged just above 1
  // where a pocket is, so the films there are measured by the real gradient (the rim's blend runs
  // a little shallower than a true distance).
  float dents(vec3 p, inout float slope) {
    float o = 0.0;
    for (int k = 0; k < MAXD; k++) {
      if (uDentN[k].w <= 0.0) continue;
      float base = capsuleSdH(p, 0.5, 0.5);
      float f = dentSmax(base, -dentCarve(k, p), DENT_RIM * uDentC[k].w) - base;
      if (f > 0.0) { o += f; slope = max(slope, 1.001); }
    }
    return o;
  }
  // How much of a pocket's wall (x: how far the membrane here has sunk into it) and of its closing
  // neck (y) the membrane at p is.
  vec2 dentLook(vec3 p) {
    vec2 w = vec2(0.0);
    for (int k = 0; k < MAXD; k++) {
      if (uDentN[k].w <= 0.0) continue;
      float base = capsuleSdH(p, 0.5, 0.5);
      float f = dentSmax(base, -dentCarve(k, p), DENT_RIM * uDentC[k].w) - base;
      w.x += smoothstep(0.0, 0.08, f);
      // the neck: round the axis, between the cup's sphere and the surface, while it closes
      vec3 dn = uDentN[k].xyz;
      vec4 b = uDentB[k];
      vec3 d = p - b.xyz;
      float h = dot(d, dn);
      float l = length(d - dn * h);
      float rc = max(b.w, 0.02);
      float surf = -dot(b.xyz - uDentC[k].xyz, dn);   // the surface's height over the sphere's centre
      float mid = 0.5 * (rc + surf), hw = max(0.5 * (surf - rc), 0.03) + 0.04;
      float pin = uDentP[k];
      float z = (h - mid) / hw, lr = l / (rc + 0.1);
      w.y += 4.0 * pin * (1.0 - pin) * exp(-z * z - lr * lr);
    }
    return min(w, vec2(1.0));
  }
  bool nearDent(vec3 p) {
    float s = 1.0;
    return dents(p, s) > 0.0;
  }

  // Binary fission (pinch 0..1): a furrow at z = 0 deepens until the rod is two. The two daughter
  // capsules tile the parent exactly, so at pinch 1 a rod of core half-length H is two rods of
  // (H - R) / 2, centred at +-(H + R) / 2.
  float divideSd(vec3 p, float R, float H, float pinch) {
    float zc = 0.5 * (H + R), hd = max(0.5 * (H - R), 0.0);
    float a = capsuleSdH(p - vec3(0.0, 0.0, zc), R, hd);
    float b = capsuleSdH(p + vec3(0.0, 0.0, zc), R, hd);
    float k = max((1.0 - pinch) * 1.2 * R, 1e-4);
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    float d = mix(b, a, h) - k * h * (1.0 - h);
    return mix(capsuleSdH(p, R, H), d, smoothstep(0.0, 0.3, pinch));
  }

  float bodySd(bool hero, vec3 p, float R, float H, float wob, inout float slope) {
    float sd = gX.y > 0.0 ? divideSd(p, R, H, gX.y) : capsuleSdH(p, R, H);
    sd += (sin(p.z * 4.1 + gT * 2.3) * 0.5 + sin(p.x * 6.3 - gT * 1.7 + p.y * 5.2) * 0.35 + sin(p.y * 7.7 + gT * 2.9) * 0.25) * wob;
    if (hero) {
      sd += dents(p, slope);
      // Squeezing through a slit: a waist where the body passes the plane, deepest mid-slit and
      // easing to nothing toward the poles (the slit is a lens along the rod).
      if (uHeroX.y > 0.0) {
        float w = uHeroX.w;
        float s = (dot(p, uSqueezeN) - uHeroX.z) / w;
        if (abs(s) < 4.0) {
          float Lt = H + R + 0.3;
          float zt = p.z / Lt;
          sd += uHeroX.y * max(1.0 - zt * zt, 0.0) * exp(-s * s);
          slope = max(slope, 1.0 + uHeroX.y * (0.86 / w + 2.0 / Lt));
        }
      }
    }
    return sd;
  }
  vec3 bodyGrad(bool hero, vec3 p, float R, float H, float wob) {
    const float e = 0.004;
    const vec2 k = vec2(1.0, -1.0);
    float sl = 1.0;
    vec3 g = k.xyy * bodySd(hero, p + k.xyy * e, R, H, wob, sl) + k.yyx * bodySd(hero, p + k.yyx * e, R, H, wob, sl)
           + k.yxy * bodySd(hero, p + k.yxy * e, R, H, wob, sl) + k.xxx * bodySd(hero, p + k.xxx * e, R, H, wob, sl);
    return g / (4.0 * e);
  }

  // ---------------------------------------------------------------- films as slabs
  // A film is a slab |d| < sg with a one-pixel antialiased edge (w). Between two samples d is
  // close to linear, so the length of ray spent inside the slab, and how many of its two faces the
  // ray went through, are exact: a film costs a step or two and stays crisp however it is crossed.
  float rampI(float x, float w) {        // integral of clamp(x / w + 0.5, 0, 1)
    float h = 0.5 * w;
    if (x <= -h) return 0.0;
    if (x >= h) return x;
    float u = x + h;
    return u * u / (2.0 * w);
  }
  float slabProfile(float d, float sg, float w) {
    return clamp((d + sg) / w + 0.5, 0.0, 1.0) - clamp((d - sg) / w + 0.5, 0.0, 1.0);
  }
  float slabFrac(float d0, float d1, float sg, float w) {
    float dd = d1 - d0;
    if (abs(dd) < 1e-6) return slabProfile(0.5 * (d0 + d1), sg, w);
    return ((rampI(d1 + sg, w) - rampI(d1 - sg, w)) - (rampI(d0 + sg, w) - rampI(d0 - sg, w))) / dd;
  }
  float slabFaces(float d0, float d1, float sg, float w) {
    float a = abs(clamp((d1 - sg) / w + 0.5, 0.0, 1.0) - clamp((d0 - sg) / w + 0.5, 0.0, 1.0));
    float b = abs(clamp((d1 + sg) / w + 0.5, 0.0, 1.0) - clamp((d0 + sg) / w + 0.5, 0.0, 1.0));
    return 0.5 * (a + b);
  }
  float filmSig(int f) {
    return (f == 0 && gKind == 2) ? max(WALL_H, gSig) : gSig;
  }

  // A shed wall (husk): the slit it split along, on its +y side, a lens along the rod (1 = open).
  // lip: how near the cut edge this point is (1 on the lip, 0 a little way off), where the torn
  // wall curls and catches the light.
  float huskCut(vec3 p, out float lip) {
    lip = 0.0;
    if (p.y <= 0.0) return 0.0;
    float L = gH + 0.62 * gR;
    float hw = 0.5 * gR * gX.w * sqrt(max(1.0 - (p.z * p.z) / (L * L), 0.0));
    float d = abs(p.x) - hw;
    lip = exp(-pow(max(d, 0.0) / max(0.05, 1.5 * gFp), 2.0)) * smoothstep(0.0, 0.06, hw);
    return clamp(-d / max(gFp, 1e-4) + 0.5, 0.0, 1.0);
  }

  // What a film looks like where the ray crosses it: how dense it is (body, per µm of the slab), the
  // colour of its matter, and the light it reflects (per crossing). Each film reflects the drop
  // through thin-film interference; its matter takes the colour of what it mirrors (sky above, teal
  // below), so it varies along its length instead of tracing an even line.
  void filmLook(int i, bool hero, int f, vec3 p, out float body, out vec3 rad, out vec3 refl, out vec3 nOut) {
    vec3 n;
    float shine, tintMix, thick;
    float satin = 0.0;
    vec3 tint;
    if (f < 2) {
      bool nearWaist = uHeroX.y > 0.0 && abs(dot(p, uSqueezeN) - uHeroX.z) < 3.0 * uHeroX.w;
      if ((hero && (nearDent(p) || nearWaist)) || gX.y > 0.0) n = normalize(bodyGrad(hero, p, gR, gH, uTurnW[i].z));
      else n = normalize(vec3(p.xy, p.z - clamp(p.z, -gH, gH)) + vec3(1e-5, 0.0, 0.0));
      // film thickness swirls like a soap film: a slow drift and a finer eddy on top
      vec3 sp = p * 3.4 + vec3(0.0, gT * 0.11, gT * 0.07) + 0.7 * sin(p.yzx * 4.0 + gT * 0.23);
      float sw = vnoise(sp) * 0.68 + vnoise(sp * 2.7 + 5.1) * 0.32;
      thick = mix(230.0, 700.0, sw);
      if (gKind == 2) {
        if (f == 0) {   // a Gram-positive coccus's thick wall: a satin band, no interference
          body = 2.2; shine = 0.35; tint = uTint[i]; tintMix = 1.0;
        } else {        // ...and the one membrane under it
          body = uFilm.y; shine = uFilmShine.y; tint = uInnerTint; tintMix = 0.18; thick += 60.0;
        }
      } else if (f == 0 && gX.z > 0.5) {
        // A shed wall: a clear glassy shell (x: how present it is) with a faint woven mesh, the
        // glycan strands running round the rod, and the slit the cell left through.
        float wv = smoothstep(0.82, 1.0, abs(sin(atan(p.y, p.x) * 18.0))) * smoothstep(0.7, 1.0, abs(sin(p.z * 22.0)));
        wv *= smoothstep(0.03, 0.012, gFp);
        float lip;
        float keep = gX.x * (1.0 - huskCut(p, lip));
        body = uFilm.x * 1.1 * (1.0 + 0.8 * wv + 1.6 * lip) * keep; shine = uFilmShine.x * 1.15 * (1.0 + 2.0 * lip) * keep; tint = uTint[i]; tintMix = 0.42 * (1.0 - 0.6 * lip);
        thick = mix(thick, 480.0, 0.6) + 140.0 * wv + 260.0 * lip;
      } else if (f == 0) {
        body = uFilm.x; shine = uFilmShine.x; tint = uTint[i]; tintMix = 0.36;
        // The wall (peptidoglycan sacculus): a calm satin band instead of a swirling soap film.
        body *= 1.0 + 0.8 * gX.x;
        shine *= mix(1.0, 0.55, gX.x);
        thick = mix(thick, 520.0, 0.5 * gX.x);
        tintMix = mix(tintMix, 0.6, 0.5 * gX.x);
        satin = gX.x;
        // The furrow of a dividing rod: a bright iridescent collar.
        if (gX.y > 0.0) {
          float collar = gX.y * exp(-p.z * p.z / (0.04 * gR * gR));
          shine *= 1.0 + 2.0 * collar;
          thick += 240.0 * collar;
        }
      } else {
        body = uFilm.y; shine = uFilmShine.y; tint = uInnerTint; tintMix = 0.18; thick += 60.0;
        // Lipid rafts: where the hero's complexes gather, the inner membrane is thicker and
        // differently coloured, so each complex visibly sits in a patch of membrane.
        if (hero) {
          float rw = 0.0;
          for (int r = 0; r < MAXR; r++) {
            if (r >= uRaftCount) break;
            vec3 dr = p - uRaft[r].xyz;
            float al = dot(dr, uRaftN[r]);
            float lat = length(dr - uRaftN[r] * al);
            rw += smoothstep(uRaft[r].w, uRaft[r].w * 0.55, lat) * smoothstep(0.16, 0.06, abs(al));
          }
          rw = min(rw, 1.0);
          body *= 1.0 + 3.0 * rw;
          shine *= 1.0 + 0.6 * rw;
          thick += 170.0 * rw;
          tintMix += 0.22 * rw;
        }
      }
      // Pockets: the walls of an endocytic cup are drawn denser and shinier so the cup reads at a
      // slant; the pinching neck gets a bright iridescent collar.
      if (hero) {
        vec2 dw = dentLook(p);
        body *= 1.0 + 1.5 * dw.x;
        shine *= 1.0 + 1.5 * dw.x + 2.0 * dw.y;
        thick += 240.0 * dw.y;
      }
    } else {
      int k = f < 4 ? 0 : 1;
      vec3 qv = p - uVesicle[k].xyz;
      n = normalize(qv + vec3(1e-6, 0.0, 0.0));
      thick = mix(260.0, 640.0, vnoise(qv * 9.0 + vec3(0.0, gT * 0.15, gT * 0.1)));
      float pres = uVesicleState[k].y;
      // a vesicle's envelope is the cell's, turned inside out: inner membrane facing the
      // cytoplasm, outer membrane facing the lumen. Small bubbles curve fast, so their films are
      // drawn denser to read as clearly as the cell's.
      if (f == 2 || f == 4) { body = uFilm.y * 4.0 * pres; shine = uFilmShine.y * 1.3; tint = uInnerTint; tintMix = 0.28; }
      else { body = uFilm.x * 4.0 * pres; shine = uFilmShine.x * 1.3; tint = vec3(1.0); tintMix = 0.22; }
    }
    float c = dot(n, gView);
    float ac = abs(c);
    vec3 nn = c < 0.0 ? -n : n;
    vec3 rdir = reflect(-gView, nn);
    vec3 hue = mix(thinFilm(ac, thick), tint, tintMix);
    // a wall's sheen is satin: pearly, with little of a soap film's colour
    hue = mix(hue, vec3(dot(hue, vec3(0.3333))) * 0.35 + tint * 0.65, 0.7 * satin);
    rad = hue * (envSky(rdir) * 0.82 + uSunColor * 0.18 * max(dot(nn, gSun), 0.0)) * uLight;
    // One crossing reflects its Fresnel share. A film seen from inside the cell reflects only
    // faintly, so the far side never clouds the view.
    float fres = 0.04 + 0.96 * pow(1.0 - ac, 5.0);
    float side = c > 0.0 ? 1.0 : 0.3;
    refl = envRef(rdir) * hue * (fres * shine * side);
    nOut = n;
    // A dying cell thins toward the water like breath on glass: its envelope stays a while as a
    // pale, thinning bubble (its insides go first; see field()).
    float ghost = gX.z > 0.5 ? 0.0 : gX.w;
    if (ghost > 0.0) {
      float k = 1.0 - ghost * ghost;
      body *= k;
      refl *= k;
      rad = mix(rad, uFogColor * uLight * 1.04, 0.7 * ghost);
      refl = mix(refl, vec3(dot(refl, vec3(0.3333))), 0.7 * ghost);
    }
  }

  // ---------------------------------------------------------------- shapes inside the cell
  // A DNA thread: the curve where two gradient noises are both zero, drawn as a solid tube of radius
  // rT (µm). w: position in noise cells, F: cells per µm. The distance to the curve comes from both
  // gradients and the angle between them (the true distance to where two sloping planes meet), so
  // the tube stays round; where the two surfaces run nearly together the tube thins away instead of
  // flaring into a ribbon. Returns coverage 0..1; r: distance to the axis, n: the surface normal.
  float thread(vec3 w, float F, float rT, float cLim, out float r, out vec3 n) {
    vec4 a = gnoised(w), b = gnoised(w + vec3(19.1, 7.3, 31.7));
    float la = max(length(a.yzw), 0.3), lb = max(length(b.yzw), 0.3);
    vec3 na = a.yzw / la, nb = b.yzw / lb;
    float da = a.x / la, db = b.x / lb;
    float c = dot(na, nb);
    float s2 = max(1.0 - c * c, 0.3);
    vec3 off = ((da - c * db) * na + (db - c * da) * nb) / s2;
    float lo = length(off);
    r = lo / F;
    n = off / max(lo, 1e-6);
    float rr = rT * smoothstep(cLim, cLim - 0.18, abs(c));
    // a strand that would be thinner than about a pixel ends there, cleanly, instead of fraying
    if (rr < 0.45 * gFp) return 0.0;
    return clamp((rr - r) / gFp + 0.5, 0.0, 1.0);
  }

  // A lumpy blob (a subunit, a granule): distance to its surface and its normal. s: shape seed,
  // amp: how lumpy.
  float blob(vec3 q, float r, float s, float amp, out vec3 n) {
    float l = length(q);
    vec3 u = q / max(l, 1e-5);
    vec3 a = u * 3.1 + vec3(s, s * 1.7, s * 2.3);
    vec3 sa = sin(a), ca = cos(a);
    float L = sa.x * sa.y * sa.z;
    float A = amp * r;
    vec3 gL = vec3(ca.x * sa.y * sa.z, sa.x * ca.y * sa.z, sa.x * sa.y * ca.z) * (A * 3.1 / max(l, 1e-4));
    gL -= u * dot(gL, u);
    n = normalize(u - gL);
    return l - r - A * L;
  }

  // Enzymes: each is its subunits (a dimer, a tetramer...) melted into one lumpy body. Returns the
  // distance to the nearest enzyme, its normal, and which enzyme it is.
  float enzymes(vec3 p, int set, out vec3 nb, out float which) {
    float dm = 1e3;
    nb = vec3(0.0, 0.0, 1.0);
    which = 0.0;
    int count = set == 0 ? NTCA * 4 : NGLY * 4;
    for (int j = 0; j < NGLY * 4; j++) {
      if (j >= count) break;
      vec4 L = set == 0 ? uTcaE[j] : uGlycoE[j];
      if (L.w <= 0.0) continue;
      vec3 q = p - L.xyz;
      float k = 0.45 * L.w;
      if (length(q) - 1.2 * L.w > dm + k) continue;
      vec3 n;
      float d = blob(q, L.w, float(j) * 1.37 + float(set) * 5.1 + 0.7, 0.14, n);
      float h = clamp(0.5 + 0.5 * (dm - d) / k, 0.0, 1.0);
      dm = mix(dm, d, h) - k * h * (1.0 - h);
      nb = normalize(mix(nb, n, h) + vec3(1e-6));
      if (h > 0.5) which = float(j / 4);
    }
    return dm;
  }

  void heroInterior(inout S s, vec3 p, float sdi) {
    float t = gT;
    // Nucleoid: the chromosome as a loose tangle of distinct fine strands, gold with a luminous
    // pale core.
    vec3 qn0 = p - uNucleoid.xyz;
    vec3 qn = qn0 / (vec3(0.2, 0.2, 0.45) * uNucleoid.w);
    float e = dot(qn, qn);
    if (e < 1.4) {
      const float F = 6.5;
      vec3 w = qn0 * F + 0.25 * sin(qn0.yzx * 4.0 + vec3(0.21, 0.17, 0.13) * t + vec3(1.7, 4.1, 2.9));
      float rT = max(0.004, 0.75 * gFp);
      float r; vec3 n;
      float cov = thread(w, F, rT * smoothstep(1.4, 0.95, e), 0.88, r, n);
      if (cov > 0.0) {
        float facing = abs(dot(n, gView));
        vec3 col = shade(uDnaColor, n) * 0.92 + uDnaColor * 0.12 + vec3(1.0, 0.88, 0.6) * pow(facing, 4.0) * 0.5 * uLight;
        addD(s, 1200.0 * cov, col, vec3(0.0));
      }
      s.hint = min(s.hint, max(r - rT, 0.0) * 0.35);
    } else {
      s.hint = min(s.hint, (sqrt(e) - 1.18) * 0.2);
    }

    // Plasmid: a small supercoiled ring, two strands twisted round each other.
    vec3 qp = p - uPlasmid.xyz;
    float rp = uPlasmid.w;
    float bp = length(qp) - rp - 0.03;
    if (bp < 0.0) {
      vec3 A = normalize(vec3(0.35, 0.85, 0.4));
      vec3 U = normalize(cross(A, vec3(0.0, 0.0, 1.0)));
      vec3 V = cross(A, U);
      float x = dot(qp, U), y = dot(qp, V);
      float lxy = max(length(vec2(x, y)), 1e-5);
      float ang = atan(y, x);
      float h = dot(qp, A) - 0.012 * sin(2.0 * ang + t * 0.4);
      float rr = lxy - rp - 0.007 * sin(3.0 * ang - t * 0.3);
      float ph = ang * 6.0 + t * 0.5;
      vec2 c1 = 0.0105 * vec2(cos(ph), sin(ph));
      vec2 o1 = vec2(rr, h) - c1, o2 = vec2(rr, h) + c1;
      bool first = dot(o1, o1) < dot(o2, o2);
      vec2 o = first ? o1 : o2;
      float d = length(o);
      float rs = max(0.0055, 0.6 * gFp);
      float cov = clamp((rs - d) / gFp + 0.5, 0.0, 1.0);
      if (cov > 0.0) {
        vec3 er = (U * x + V * y) / lxy;
        vec3 n = normalize(er * o.x + A * o.y + vec3(1e-6));
        vec2 cs = first ? c1 : -c1;
        // the strand behind the ring's axis a little lighter, so the twist reads
        float back = 0.5 - 0.5 * dot(normalize(er * cs.x + A * cs.y), gView);
        vec3 col = mix(shade(uPlasmidColor, n) + uPlasmidColor * 0.1, shadeFine(vec3(1.0)), 0.25 * back);
        addD(s, 900.0 * cov, col, vec3(0.0));
      }
      s.hint = min(s.hint, max(d - rs, 0.0) * 0.6);
    } else s.hint = min(s.hint, bp);

    // Storage granules. Glycogen: a rosette of small beads that glints. Polyphosphate: a dense,
    // slightly lumpy pearl.
    for (int k = 0; k < MAXG; k++) {
      if (k >= uGranuleCount) break;
      vec3 qg = p - uGranule[k].xyz;
      float rg = uGranule[k].w;
      float dg = length(qg);
      if (dg > rg * 1.35) { s.hint = min(s.hint, dg - rg * 1.3); continue; }
      vec3 n;
      float dsurf;
      vec3 col;
      if (uGranuleKind[k] > 0.5) {
        dsurf = blob(qg, rg, 3.7 + float(k), 0.07, n);
        vec3 alb = mix(uPolyPColor, vec3(1.0), 0.3);
        col = shade(alb, n) + alb * 0.12 + glint(n, 60.0) * 0.5;
      } else {
        // seven beta-particles clumped together
        dsurf = 1e3;
        vec3 best = vec3(0.0);
        for (int j = 0; j < 7; j++) {
          float fj = float(j);
          vec3 o = j == 0 ? vec3(0.0) : normalize(vec3(sin(fj * 2.4 + float(k)), cos(fj * 1.7 + 0.5), sin(fj * 3.1 + 1.0))) * rg * 0.52;
          float rj = rg * (j == 0 ? 0.52 : 0.44 + 0.06 * sin(fj * 5.0));
          float dj = length(qg - o) - rj;
          if (dj < dsurf) { dsurf = dj; best = o; }
        }
        n = normalize(qg - best);
        col = shade(uGlycogenColor, n) + uGlycogenColor * 0.1 + glint(n, 30.0) * 0.5;
      }
      addD(s, smoothstep(gEdge, -gEdge, dsurf) * 260.0, col, vec3(0.0));
      s.hint = min(s.hint, max(dsurf, 0.0) * 0.8);
    }

    // TCA cycle: seven lumpy enzymes on a loose loop that runs past succinate dehydrogenase in the
    // membrane (the gap), with the intermediates as a stream of luminous beads hopping from one
    // enzyme to the next, faster and brighter when acetyl-CoA is fed in. The cycle reads through
    // the flow. uTcaStream scales that stream: the game's energy route draws the intermediates as
    // its own counted beads and turns this one off, so they are not drawn twice (the enzymes stay).
    vec3 qt = p - uTca.xyz;
    vec3 Ax = uTcaAxis.xyz;
    float ax = dot(qt, Ax);
    vec3 inP = qt - Ax * ax;
    float rIn = length(inP);
    float ringT = length(vec2(rIn - uTca.w, ax));
    if (ringT < 0.05) {
      float act = uTcaAxis.w;
      vec3 nb; float kb;
      float dm = enzymes(p, 0, nb, kb);
      vec3 alb = uTcaColor * (0.92 + 0.12 * sin(kb * 2.3));
      addD(s, smoothstep(gEdge, -gEdge, dm) * 260.0, shade(alb, nb) + alb * 0.12 + glint(nb, 40.0) * 0.3, vec3(0.0));
      float dsp = 1e3;   // with no stream the march need not slow down for its beads
      if (uTcaStream > 0.0) {
        vec3 U = normalize(cross(Ax, abs(Ax.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
        vec3 V = cross(Ax, U);
        float ang = atan(dot(inP, V), dot(inP, U));
        float spin = t * (0.3 + 1.1 * act);
        float sseg = 6.2831853 / 21.0;
        float aj = floor((ang - spin) / sseg + 0.5) * sseg + spin;
        vec3 sc = (U * cos(aj) + V * sin(aj)) * uTca.w;
        float rb = max(0.0052, 0.6 * gFp);
        dsp = length(qt - sc) - rb;
        vec3 beadCol = mix(uTcaColor, vec3(1.0, 0.9, 0.95), 0.5);
        float bead = smoothstep(gEdge, -gEdge, dsp) * (0.35 + 0.65 * act) * uTcaStream;
        addD(s, 260.0 * bead, shade(beadCol, normalize(qt - sc)) * 1.1, beadCol * bead * (4.0 + 10.0 * act));
      }
      s.hint = min(s.hint, max(min(dm, dsp), 0.0) * 0.8);
    } else s.hint = min(s.hint, ringT - 0.045);

    // Glycolysis: nine lumpy enzymes (G6P end first, at the glucose transporters) joined by a fine
    // luminous thread of metabolites; a wave of light runs down it as glucose is broken down.
    vec3 qgl = p - uGlyco.xyz;
    float dgl = length(qgl);
    if (dgl < uGlycoBound) {
      float act = uGlyco.w;
      vec3 nb; float kb;
      float dm = enzymes(p, 1, nb, kb);
      float dth = 1e3, uth = 0.0;
      for (int k = 0; k < NGP - 1; k++) {
        vec3 a = uGlycoPath[k], b = uGlycoPath[k + 1];
        vec3 pa = p - a, ba = b - a;
        float hh = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-8), 0.0, 1.0);
        float d = length(pa - ba * hh);
        if (d < dth) { dth = d; uth = (float(k) + hh) / float(NGP - 1); }
      }
      float ue = kb / float(NGLY - 1);
      vec3 alb = mix(uGlycoColor, uGlycoColor * vec3(1.0, 0.62, 0.42), ue);
      float waveE = act * pow(0.5 + 0.5 * sin(ue * 12.0 - t * 3.0), 6.0);
      float solid = smoothstep(gEdge, -gEdge, dm);
      addD(s, solid * 260.0, (shade(alb, nb) + alb * 0.12) * (1.0 + 0.5 * waveE) + glint(nb, 40.0) * 0.3, alb * solid * waveE * 3.0);
      // the thread: a fine wisp of light about a pixel wide up close, mostly see-through, brightest
      // where the wave is; it fades out at a distance before it would shimmer
      float rth = max(0.0014, 0.45 * gFp);
      float cov = clamp((rth - dth) / gFp + 0.5, 0.0, 1.0) * smoothstep(0.009, 0.0045, gFp);
      if (cov > 0.0) {
        float wave = act * pow(0.5 + 0.5 * sin(uth * 12.0 - t * 3.0), 6.0);
        vec3 tc = mix(vec3(1.0, 0.84, 0.42), vec3(1.0, 0.6, 0.32), uth);
        addD(s, (90.0 + 400.0 * wave) * cov, tc * (0.8 + wave) * uLight, tc * cov * (1.5 + 10.0 * wave));
      }
      s.hint = min(s.hint, max(min(dm, dth - rth), 0.0) * 0.8);
    } else s.hint = min(s.hint, dgl - uGlycoBound + 0.005);

    // Chemoreceptor array: one patch of the hexagonal lattice just inside the inner membrane, a
    // little off the front pole, about 0.3 µm across. Each receptor cluster sits a little off its
    // lattice point and has its own size, and clusters drop out at random round the rim, so the
    // patch reads as living and frays at its edge. Where the lattice would be finer than a few
    // pixels it turns into its own average (a faint cyan sheet), so it never beats into moiré.
    vec3 cq = p - vec3(0.0, 0.0, gH);
    if (cq.z > -0.06) {
      vec3 P = uReceptor.xyz;
      vec3 dir = normalize(cq + vec3(0.0, 0.0, 1e-5));
      float rm = gR - gOff;
      float rho = acos(clamp(dot(dir, P), -1.0, 1.0)) * rm;
      float layer = sdi + 0.022;
      float pr = uReceptorR;
      if (rho < pr + 0.02 && abs(layer) < 0.03) {
        vec3 Ue = normalize(cross(P, vec3(0.0, 1.0, 0.0)));
        vec3 Ve = cross(P, Ue);
        vec2 uv = vec2(dot(dir, Ue), dot(dir, Ve)) * rm;
        const float a = 0.035;
        vec2 g = uv / a;
        vec2 rr = vec2(1.0, 1.7320508), hh = 0.5 * rr;
        vec2 ca = mod(g, rr) - hh, cb = mod(g - hh, rr) - hh;
        vec2 off = dot(ca, ca) < dot(cb, cb) ? ca : cb;
        vec2 cc = g - off;                      // this cluster's lattice point
        vec2 id = floor(cc * 2.0 + 0.5);
        float h1 = hash13(vec3(id, 3.1)), h2 = hash13(vec3(id, 7.7)), h3 = hash13(vec3(id, 11.3));
        vec2 o2 = (off - (vec2(h1, h2) - 0.5) * 0.26) * a;     // from this cluster's centre, on the membrane
        float rad = a * (0.24 + 0.12 * h3);
        float d3 = length(vec3(o2, layer));
        float rc = length(cc) * a;
        float edgeC = smoothstep(pr, pr - 0.09, rc + 0.035 * sin(5.0 * atan(cc.y, cc.x) + 1.3));
        float keep = step(h2 * 0.9 + 0.05, edgeC);
        float cosV = max(abs(dot(dir, gView)), 0.15);
        float bead = clamp((rad - d3) / gFp + 0.5, 0.0, 1.0) * keep;
        float lp = smoothstep(3.0, 5.0, a * cosV / gFp);
        float sheet = 0.33 * smoothstep(pr, pr - 0.09, rho) * clamp((0.01 - abs(layer)) / gFp + 0.5, 0.0, 1.0);
        float dens = mix(20.0 * sheet, 500.0 * bead, lp);
        float glowW = mix(sheet, bead, lp);
        vec3 nr = normalize(Ue * o2.x + Ve * o2.y + dir * layer + vec3(1e-6));
        float ripple = 0.5 + 0.5 * sin(rho * 55.0 - t * 4.0);
        addD(s, dens, shade(uReceptorColor, nr) + uReceptorColor * 0.12, uReceptorColor * glowW * (0.6 + 6.0 * uReceptor.w * ripple));
        s.hint = min(s.hint, max(abs(layer) - 0.012, 0.0) * 0.8);
      } else s.hint = min(s.hint, max(max(rho - pr - 0.02, abs(layer) - 0.03) * 0.7, 0.0));
    }

    // Digesting vesicles glow from inside (their films are integrated by the march).
    for (int k = 0; k < MAXV; k++) {
      float rv = uVesicle[k].w;
      if (rv <= 0.0 || uVesicleState[k].x < 0.01) continue;
      float dv = length(p - uVesicle[k].xyz);
      if (dv > rv) { s.hint = min(s.hint, dv - rv); continue; }
      float inside = smoothstep(rv - 0.04, rv * 0.3, dv) * uVesicleState[k].x;
      addD(s, 3.0 * inside, shadeFine(uVesicleColor), uVesicleColor * inside * 1.4);
      s.hint = min(s.hint, 0.012);
    }
  }

  // Neighbours: the same films, and a simpler tangle of nucleoid strands drawn a little coarser.
  void simpleInterior(inout S s, int i, vec3 p) {
    float R = gR, H = gH;
    vec3 qn = p / vec3(0.2 * R / 0.5, 0.2 * R / 0.5, 0.36 * R / 0.5 + H * 0.4);
    float e = dot(qn, qn);
    // From far off (a cell only a few pixels across) the strands would swell to a blob: the
    // nucleoid fades instead, and a distant cell is its pale films.
    float far = smoothstep(0.06, 0.15, gFp);
    if (e < 1.3 && far < 1.0) {
      const float F = 6.5;
      vec3 w = p * F + float(i) * 13.7 + 0.25 * sin(p.yzx * 4.0 + gT * 0.15);
      float rT = max(0.004, 0.8 * gFp);
      float r; vec3 n;
      float cov = thread(w, F, rT * smoothstep(1.3, 1.1, e), 0.94, r, n);
      if (cov > 0.0) {
        // walled, the insides are quieter: a paler, sparser nucleoid
        vec3 alb = mix(uDnaColor, uTint[i], 0.2 + 0.35 * gX.x);
        addD(s, 1200.0 * cov * (1.0 - far) * (1.0 - 0.45 * gX.x), shade(alb, n) + alb * 0.12, vec3(0.0));
      }
      s.hint = min(s.hint, max(r - rT, 0.0) * 0.4);
    } else s.hint = min(s.hint, (sqrt(e) - 1.14) * 0.18);
  }

  S field(int i, bool hero, vec3 p) {
    S s; s.sigma = 0.0; s.rad = vec3(0.0); s.emit = vec3(0.0); s.hint = 1e3;
    float wob = uTurnW[i].z * (1.0 - 0.85 * gX.x);   // a wall holds the skin still
    float slope = 1.0;
    float sd0 = bodySd(hero, p, gR, gH, wob, slope);
    float sd = sd0 / slope, sdi = (sd0 + gOff) / slope;   // safe (under-) estimates
    // Near a pocket the field is stretched: make the distances true by its real gradient.
    if (slope > 1.0 && min(abs(sd), abs(sdi)) < gSig + gFp + 0.02) {
      float gl = clamp(length(bodyGrad(hero, p, gR, gH, wob)), 0.3, 6.0);
      sd = sd0 / gl; sdi = (sd0 + gOff) / gl;
    }
    gFd[0] = gKind == 2 ? sd + WALL_H : sd;
    gFd[1] = gX.z > 0.5 ? 1e3 : sdi;
    for (int k = 0; k < MAXV; k++) {
      float rv = uVesicle[k].w;
      if (!hero || rv <= 0.0 || uVesicleState[k].y < 0.01) { gFd[2 + 2 * k] = 1e3; gFd[3 + 2 * k] = 1e3; continue; }
      float dv = length(p - uVesicle[k].xyz);
      gFd[2 + 2 * k] = dv - rv;
      gFd[3 + 2 * k] = dv - rv + 0.045;
    }

    if (gX.z > 0.5) return s;   // a husk is its wall alone

    // A dying cell (ghost) goes hypodense: everything inside it fades first, and pales toward the
    // water, so a dead cell is its thinning envelope, never its nucleoid.
    gInK = pow(1.0 - gX.w, 2.5);
    // Periplasm: faintly lit by the proton gradient across the inner membrane.
    if (gKind != 2 && sd < 0.0 && sdi > 0.0) {
      float peri = smoothstep(0.0, -gSig, sd) * smoothstep(0.0, gSig, sdi);
      addD(s, uFilm.w * peri, shadeFine(uProtonColor), uProtonColor * peri * uTurnW[i].w * 0.22);
    }

    if (sdi < 0.02) {
      if (hero) {
        // Walled (or still recovering from it), the hero's insides are muted to a plain rod's.
        float mute = max(gX.x, uHeroX.x);
        gInK *= mix(1.0, 0.35, mute);
        gDesat = 0.6 * mute;
        heroInterior(s, p, sdi);
      } else {
        // a dividing rod has two nucleoids, one in each half
        vec3 pn = p;
        float hn = gH;
        if (gX.y > 0.0) {
          float sep = smoothstep(0.05, 0.6, gX.y);
          pn.z = mix(p.z, abs(p.z) - 0.5 * (gH + gR), sep);
          hn = mix(gH, max(0.5 * (gH - gR), 0.0), sep);
        }
        float h0 = gH;
        gH = hn;
        if (gX.w > 0.0) {
          gDesat = gX.w;
          gTintC = mix(gTintC, uFogColor * 1.25, gX.w);
        }
        simpleInterior(s, i, pn);
        gH = h0;
        gTintC = uTint[i];
      }
      gDesat = 0.0;
    }
    gInK = 1.0;
    return s;
  }

  float fogFactor(float dist) {
    float f = uFogDensity * dist;
    return 1.0 - exp(-f * f);
  }

  vec3 worldPosFromDepth(vec2 uv, float depth) {
    vec4 ndc = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    vec4 view = uProjInv * ndc;
    view /= view.w;
    return (uViewInv * view).xyz;
  }

  // Ray against a capsule along z (core half-length H, radius r): entry and exit, body units.
  vec2 sphereIv(vec3 ro, vec3 rd, vec3 c, float r) {
    vec3 oc = ro - c;
    float b = dot(oc, rd);
    float h = b * b - dot(oc, oc) + r * r;
    if (h < 0.0) return vec2(1e9, -1e9);
    h = sqrt(h);
    return vec2(-b - h, -b + h);
  }
  vec2 capsuleIv(vec3 ro, vec3 rd, float H, float r) {
    vec2 a = sphereIv(ro, rd, vec3(0.0, 0.0, -H), r);
    vec2 b = sphereIv(ro, rd, vec3(0.0, 0.0, H), r);
    vec2 iv = vec2(min(a.x, b.x), max(a.y, b.y));
    float qa = dot(rd.xy, rd.xy);
    if (H > 1e-3 && qa > 1e-8) {
      float qb = dot(ro.xy, rd.xy);
      float h = qb * qb - qa * (dot(ro.xy, ro.xy) - r * r);
      if (h > 0.0) {
        h = sqrt(h);
        vec2 c = vec2(-qb - h, -qb + h) / qa;
        if (abs(rd.z) > 1e-8) {
          float z1 = (-H - ro.z) / rd.z, z2 = (H - ro.z) / rd.z;
          c = vec2(max(c.x, min(z1, z2)), min(c.y, max(z1, z2)));
        } else if (abs(ro.z) > H) c = vec2(1e9, -1e9);
        if (c.x < c.y) iv = vec2(min(iv.x, c.x), max(iv.y, c.y));
      }
    }
    return iv;
  }

  void main() {
    vec3 ro = uCamPos;
    vec3 rd = normalize(worldPosFromDepth(vUv, 1.0) - ro);
    float depth = texture2D(tDepth, vUv).x;
    float tMax = depth >= 1.0 ? 1e6 : length(worldPosFromDepth(vUv, depth) - ro);
    gT = uTime;

    vec3 accum = vec3(0.0);
    float trans = 1.0;
    // a fixed per-pixel offset (interleaved gradient noise): breaks up step banding without flicker
    float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
    #if CELL_DEBUG == 1
      float exhausted = 0.0;
    #elif CELL_DEBUG == 2
      float stepsAll = 0.0, stepsHero = 0.0;
    #endif

    // Cells in the order the ray meets them (the list is short, so a simple selection order).
    float doneT = -1.0;
    for (int pass = 0; pass < MAXC; pass++) {
      if (pass >= uCount) break;
      int best = -1; float bestT = 1e9; float bestT1 = 0.0;
      for (int i = 0; i < MAXC; i++) {
        if (i >= uCount) break;
        vec3 oc = ro - uSphere[i].xyz;
        float b = dot(oc, rd);
        float c = dot(oc, oc) - uSphere[i].w * uSphere[i].w;
        float h = b * b - c;
        if (h <= 0.0) continue;
        h = sqrt(h);
        float t0 = max(-b - h, 0.0), t1 = min(-b + h, tMax);
        if (t1 <= t0 || t0 <= doneT) continue;
        if (t0 < bestT) { bestT = t0; bestT1 = t1; best = i; }
      }
      if (best < 0) break;
      doneT = bestT;
      int i = best;
      bool hero = i == 0 && uHero == 1;

      mat4 inv = uInv[i];
      vec3 ob = (inv * vec4(ro, 1.0)).xyz;
      vec3 db = mat3(inv) * rd;          // body units per world unit along the ray
      float bodyPerWorld = length(db);
      vec3 dirB = db / bodyPerWorld;
      vec4 g = uGeom[i];
      vec4 fl = uFlow[i];
      vec2 turn = uTurnW[i].xy;
      gR = g.x; gH = g.y; gKind = int(g.z + 0.5);
      gX = uCellX[i];
      gTintC = uTint[i];
      gInK = 1.0;
      gDesat = 0.0;
      gOff = gKind == 2 ? 2.0 * WALL_H + 0.004 : 0.08 * gR / 0.5;   // periplasm: real ~25 nm, drawn 3.2x

      // March only inside a capsule that holds the cell however far the flow pushes it.
      float L = g.x + g.y;
      float pad = fl.x + 0.35 * max(abs(turn.x), abs(turn.y)) * L * L + 0.1 * fl.w * L + 0.04;
      vec2 iv = capsuleIv(ob, dirB, g.y * (1.0 + 0.1 * fl.w), g.x + pad);
      float tb = max(iv.x, bestT * bodyPerWorld);
      float tb1 = min(iv.y, bestT1 * bodyPerWorld);
      if (tb1 <= tb) continue;

      gView = -dirB;
      gUp = normalize(mat3(inv) * vec3(0.0, 1.0, 0.0));
      gSun = normalize(mat3(inv) * uSunDir);

      vec3 cellAccum = vec3(0.0);
      float cellTrans = 1.0;
      int maxSteps = int((hero ? uStepCap.x : uStepCap.y) * uQuality);
      float baseSig = uFilm.z;
      float dPrev[NF];
      for (int f = 0; f < NF; f++) dPrev[f] = 1e3;
      tb += 0.002 * jitter;
      float tPrev = tb;
      int used = 0;
      vec3 pLast = ob;
      for (int k = 0; k < 600; k++) {
        if (k >= maxSteps || tb >= tb1 || cellTrans < 0.01) break;
        used = k + 1;
        // Size thin things to the pixel they land on (body µm per pixel at this distance).
        float fp = tb * uPixelAngle;
        gFp = fp;
        gSig = max(baseSig, 0.6 * fp);
        gDensK = baseSig / gSig;
        gEdge = max(0.0015, 0.5 * fp);
        float minStep = (hero ? max(0.0019, 0.45 * fp) : max(0.004, 0.8 * fp)) / sqrt(uQuality);

        vec3 q = ob + dirB * tb;
        vec3 p = unwarp(q, fl, turn);
        pLast = p;
        S s = field(i, hero, p);

        // 1. Films crossed since the last sample, integrated exactly; and how far the next stride
        //    may go: straight to a film's edge, then across it in one go.
        float segL = tb - tPrev;
        float stepB = s.hint * 0.75;
        for (int f = 0; f < NF; f++) {
          float d1 = gFd[f], d0 = dPrev[f];
          dPrev[f] = d1;
          if (d1 > 900.0) continue;
          float sg = filmSig(f);
          float env = sg + 0.5 * fp;
          bool had = d0 < 900.0;
          if (had && (min(abs(d0), abs(d1)) < env || d0 * d1 < 0.0)) {
            float frac = slabFrac(d0, d1, sg, fp);
            float faces = slabFaces(d0, d1, sg, fp);
            if (frac > 1e-4 || faces > 1e-4) {
              float body; vec3 rad, refl, n;
              filmLook(i, hero, f, p, body, rad, refl, n);
              float a = 1.0 - exp(-body * frac * segL * (sg > gSig ? 1.0 : gDensK));
              cellAccum += cellTrans * (a * rad + faces * refl);
              cellTrans *= 1.0 - a;
            }
          }
          float ad = abs(d1);
          float rate = had ? abs(d1 - d0) / max(segL, 1e-5) : 1.0;
          stepB = min(stepB, ad > env ? (ad - env) * 0.7 : min((ad + env) / max(rate, 0.15), 0.025));
        }
        stepB = clamp(stepB, minStep, 0.06);

        // 2. The volume's own matter over the next stride.
        vec3 add = s.emit * uEmit * stepB;
        float a = 0.0;
        if (s.sigma > 1e-4) {
          a = 1.0 - exp(-s.sigma * stepB);
          add += a * s.rad;
        }
        cellAccum += cellTrans * add;
        cellTrans *= 1.0 - a;
        tPrev = tb;
        tb += stepB;
      }
      bool outOfSteps = used >= maxSteps && tb < tb1 && cellTrans > 0.02;
      #if CELL_DEBUG == 1
        if (outOfSteps) exhausted = max(exhausted, hero ? 1.0 : 0.5);
      #elif CELL_DEBUG == 2
        stepsAll += float(used);
        if (hero) stepsHero += float(used);
      #endif
      // Out of steps with light still coming through: finish the far side of the envelope in one
      // go (the inner film, then the outer), so a cell never loses its back.
      if (outOfSteps) {
        for (int f = 1; f >= 0; f--) {
          if (gFd[f] > 0.0) continue;
          float rf = gR - (f == 1 ? gOff : (gKind == 2 ? WALL_H : 0.0));
          float te = capsuleIv(pLast, dirB, gH, rf).y;
          if (te <= 0.0 || te > 10.0) continue;
          vec3 pe = pLast + dirB * te;
          float body; vec3 rad, refl, n;
          filmLook(i, hero, f, pe, body, rad, refl, n);
          float sg = filmSig(f);
          float aa = 1.0 - exp(-body * 2.0 * sg * (sg > gSig ? 1.0 : gDensK) / max(abs(dot(n, dirB)), 0.25));
          cellAccum += cellTrans * (aa * rad + refl);
          cellTrans *= 1.0 - aa;
        }
      }
      // The cell sits in the same water as everything else: fog it like the rest of the scene. In
      // the opening, a cell in tear water is warmer and a touch more luminous, one in the mixed
      // water cooler and greyer.
      float fogF = fogFactor(bestT);
      vec3 fogC = uFogColor;
      float salt = uCellS[i];
      if (salt >= 0.0) {
        vec3 k = mix(uSaltCool, uSaltWarm, salt);
        cellAccum *= k;
        fogC *= mix(vec3(1.0), k, 0.6);
      }
      cellAccum = mix(cellAccum, fogC * (1.0 - cellTrans), fogF);
      accum += trans * cellAccum;
      trans *= cellTrans;
      if (trans < 0.01) break;
    }
    #if CELL_DEBUG == 1
      gl_FragColor = exhausted > 0.75 ? vec4(1.0, 0.0, 0.0, 0.0) : exhausted > 0.25 ? vec4(0.0, 0.0, 1.0, 0.0) : vec4(accum, trans);
    #elif CELL_DEBUG == 2
      gl_FragColor = vec4(stepsAll / 1000.0, stepsHero / 1000.0, 0.0, 1.0);
    #else
      gl_FragColor = vec4(accum, trans);
    #endif
  }
`;

const compositeShader = {
  uniforms: { tScene: { value: null }, tCells: { value: null } },
  vertexShader,
  fragmentShader: /* glsl */ `
    uniform sampler2D tScene;
    uniform sampler2D tCells;
    varying vec2 vUv;
    void main() {
      vec4 sc = texture2D(tScene, vUv);
      vec4 cl = texture2D(tCells, vUv);
      gl_FragColor = vec4(sc.rgb * cl.a + cl.rgb, 1.0);
    }
  `,
};

const _center = new THREE.Vector3();
const _scale = new THREE.Vector3();
const _sphere = new THREE.Sphere();
const _frustum = new THREE.Frustum();
const _pv = new THREE.Matrix4();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _U = new THREE.Vector3();
const _V = new THREE.Vector3();
const _Z = new THREE.Vector3(0, 0, 1);
const _Y = new THREE.Vector3(0, 1, 0);

// Where the enzymes sit when a descriptor does not say: seven round the TCA loop leaving a gap
// for succinate dehydrogenase, nine glycolysis enzymes on a gentle curl.
function defaultTcaEnzymes(tca) {
  const A = tca.axis;
  _U.crossVectors(A, Math.abs(A.y) < 0.9 ? _Y : _Z).normalize();
  _V.crossVectors(A, _U);
  return Array.from({ length: TCA_ENZYMES }, (_, k) => {
    const a = 0.5 + (k * (Math.PI * 2 - 1)) / (TCA_ENZYMES - 1);
    const pos = tca.center.clone().addScaledVector(_U, Math.cos(a) * tca.radius).addScaledVector(_V, Math.sin(a) * tca.radius);
    return { pos, radius: 0.013 + 0.005 * ((k * 0.618) % 1) };
  });
}
function defaultGlycolysisEnzymes(c) {
  return Array.from({ length: GLYCOLYSIS_ENZYMES }, (_, k) => {
    const a = k * 0.6 - 2.4;
    const pos = new THREE.Vector3(Math.cos(a) * (0.06 + 0.007 * k), Math.sin(a) * (0.06 + 0.007 * k) * 0.75, (k - 4) * 0.02).add(c);
    return { pos, radius: 0.011 + 0.004 * ((k * 0.618) % 1) };
  });
}

// How an enzyme's subunits sit round its centre: one, a bent dimer, a triangle or a tetrahedron,
// turned its own way, each subunit a little different in size. Offsets are in units of its radius.
const LOBE_DIRS = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(([x, y, z]) => new THREE.Vector3(x, y, z).normalize());
const LOBE_SIZE = [1, 0.7, 0.62, 0.58];
function lobeLayout(n, seed) {
  n = THREE.MathUtils.clamp(Math.round(n ?? 1), 1, 4);
  const rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(Math.sin(seed * 12.9), Math.cos(seed * 7.3), Math.sin(seed * 3.1 + 1)).normalize(), seed * 2.4);
  const rs = LOBE_SIZE[n - 1];
  return Array.from({ length: n }, (_, j) => ({
    o: n === 1 ? new THREE.Vector3() : LOBE_DIRS[j].clone().applyQuaternion(rot).multiplyScalar(1 - rs),
    r: rs * (1 + 0.08 * Math.sin(seed * 5.7 + j * 2.3)),
  }));
}

let warnedSun = false;

// A cell registered with the pass. `cell` must provide:
//   body: Object3D (reference body space -> world through body.matrixWorld)
//   shape: from createCellShape (flow params, thrust, turn, wobble, dents)
//   kind: CELL_KIND.*, R (0.5 for rods), H (core half-length, 0.5 for rods, 0 for cocci)
//   tint: THREE.Color (the outer film's own faint colour; a coccus's wall colour)
//   visible (optional): false skips it
//   wall (optional, 0..1): a peptidoglycan wall, drawn as a calm satin band with a still skin and,
//     on the hero, muted insides. Default 1 for rods, 0 for the hero and cocci (whose Gram-positive
//     wall is drawn by their kind).
//   pinch (optional, 0..1): binary fission. A rod with core half-length H divides at z = 0 into two
//     rods of (H - R) / 2 at +-(H + R) / 2 (H = 1.5 makes two standard rods).
//   ghost (optional, 0..1): dying hypodense, its insides and films fading toward the water; at 1
//     it is no longer drawn.
//   husk (optional): true for a shed wall: one glassy film with a faint hoop weave and nothing
//     inside; `wall` is then how present it is (0 not drawn), `split` (0..1) how far open the slit
//     along its +y side is.
//   hero only, intro: mute (0..1) mutes the insides as a wall does; squeeze { normal, offset, depth,
//     width } draws a waist where the body passes the plane dot(p, normal) = offset (body space),
//     deepest mid-rod and easing to nothing at the poles.
//   salt (optional, 0..1; the opening): how much tear water the cell sits in. A cell in tear water
//     is tinted warm and luminous (uSaltWarm), one in the mixed water cool and grey (uSaltCool);
//     undefined leaves the cell as it is (the game). setSaltTints(warm, cool) changes the two.
//   hero only: cell.volume = { nucleoid, nucleoidScale, plasmid, plasmidRadius, granules[{pos, radius,
//     kind}], tca{center, radius, axis, activity, stream? (0..1, default 1: how much of the loop's own
//     stream of beads is drawn; 0 when something else draws the intermediates), enzymes?[{pos, radius,
//     lobes}] (7; lobes = subunits drawn, 1..4)}, glycolysis (centre), glycolysisEnzymes?[{pos,
//     radius, lobes}] (9, G6P end first), glycolysisActivity, receptorDir?
//     (patch direction from the front pole's centre), receptorRadius?, receptorZ (used when there is
//     no receptorDir), receptorGlow, receptorFlash, protonGlow, rafts?[{pos, normal, radius}],
//     vesicles[{pos, radius, glow, membrane, kind}] }
// Any number of cells can be registered; each frame the hero and the nearest MAX_CELLS - 1 cells
// that are on screen and not lost in the fog are drawn.
//
// Knobs: `quality` (0.35..1) shortens the march (fewer, longer steps) without lowering the
// resolution, so the image stays sharp; `debug` = 'exhaust' paints pixels that ran out of steps
// (red: hero, blue: neighbours), 'steps' writes steps per pixel (R all cells, G hero, /1000) into
// this.target.
export class CellPass extends Pass {
  constructor(scene, camera, { resolutionScale = 1 } = {}) {
    super();
    this.scene = scene;
    this.camera = camera;
    this.cells = [];
    this._list = [];
    this.resolutionScale = resolutionScale;
    this.target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, depthBuffer: false });
    const C = (h) => new THREE.Color(h);
    const v4 = (n) => Array.from({ length: n }, () => new THREE.Vector4());
    this.uniforms = {
      tDepth: { value: null },
      uProjInv: { value: new THREE.Matrix4() },
      uViewInv: { value: new THREE.Matrix4() },
      uCamPos: { value: new THREE.Vector3() },
      uTime: clock.uTime,
      uPixelAngle: { value: 0.001 },
      uQuality: { value: 1 },
      uStepCap: { value: new THREE.Vector2(420, 260) },
      uCount: { value: 0 },
      uInv: { value: Array.from({ length: MAX_CELLS }, () => new THREE.Matrix4()) },
      uSphere: { value: v4(MAX_CELLS) },
      uGeom: { value: v4(MAX_CELLS) },
      uFlow: { value: v4(MAX_CELLS) },
      uTurnW: { value: v4(MAX_CELLS) },
      uTint: { value: Array.from({ length: MAX_CELLS }, () => new THREE.Color(1, 1, 1)) },
      uCellX: { value: v4(MAX_CELLS) },
      uHeroX: { value: new THREE.Vector4(0, 0, 0, 0.16) },
      uSqueezeN: { value: new THREE.Vector3(0, 1, 0) },
      uCellS: { value: new Array(MAX_CELLS).fill(-1) },
      uSaltWarm: { value: new THREE.Vector3(1.07, 1.03, 0.95) },
      uSaltCool: { value: new THREE.Vector3(0.95, 0.98, 1.03) },
      uHero: { value: 0 },
      uDentC: { value: v4(MAX_DENTS) },
      uDentN: { value: v4(MAX_DENTS) },
      uDentP: { value: new Array(MAX_DENTS).fill(0) },
      uDentB: { value: v4(MAX_DENTS) },
      uNucleoid: { value: new THREE.Vector4(0, 0, 0, 1) },
      uPlasmid: { value: new THREE.Vector4(0, 0, 0, 0.08) },
      uGranule: { value: v4(MAX_GRANULES) },
      uGranuleKind: { value: new Array(MAX_GRANULES).fill(0) },
      uGranuleCount: { value: 0 },
      uTca: { value: new THREE.Vector4(0, 0, -0.5, 0.1) },
      uTcaAxis: { value: new THREE.Vector4(0, 0, 1, 0.5) },
      uTcaStream: { value: 1 },
      uTcaE: { value: v4(TCA_ENZYMES * 4) },
      uGlyco: { value: new THREE.Vector4(0, 0, 0.45, 0.5) },
      uGlycoBound: { value: 0 },
      uGlycoE: { value: v4(GLYCOLYSIS_ENZYMES * 4) },
      uGlycoPath: { value: Array.from({ length: GLYCO_PATH }, () => new THREE.Vector3()) },
      uReceptor: { value: new THREE.Vector4(0, 0, 1, 0.2) },
      uReceptorR: { value: 0.14 },
      uRaft: { value: v4(MAX_RAFTS) },
      uRaftN: { value: Array.from({ length: MAX_RAFTS }, () => new THREE.Vector3(0, 0, 1)) },
      uRaftCount: { value: 0 },
      uVesicle: { value: v4(MAX_VESICLES) },
      uVesicleState: { value: v4(MAX_VESICLES) },
      uSunDir: { value: new THREE.Vector3(0.35, 1, 0.45).normalize() },
      uSunColor: { value: C(0xfff3dc) },
      uLight: { value: 1.0 },
      uEmit: { value: 1.0 },
      uSky: { value: C(0xf4fbfa) },
      uDeep: { value: C(0x9cc6cf) },
      uFogColor: { value: C(0xd8eeec) },
      uFogDensity: { value: 0.03 },
      uWindow: { value: new THREE.Vector4(0.9865, 0.9845, 0, 0) },
      uSunLook: { value: new THREE.Vector2(1400, 4) },
      uFilm: { value: new THREE.Vector4(2.6, 2.0, 0.0065, 0.35) },
      uFilmShine: { value: new THREE.Vector2(1.4, 0.9) },
      uInnerTint: { value: C(0x5cc9b5) },
      uDnaColor: { value: C(0xf0a51e) },
      uPlasmidColor: { value: C(0xf2668b) },
      uGlycogenColor: { value: C(0xf5d77a) },
      uPolyPColor: { value: C(0x6a3fd0) },
      uTcaColor: { value: C(0xd8327a) },
      uGlycoColor: { value: C(0xf0a92a) },
      uReceptorColor: { value: C(0x22b8d6) },
      uProtonColor: { value: C(0x14b8d8) },
      uVesicleColor: { value: C(0xf59ac4) },
    };
    this.quad = new FullScreenQuad(new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader, fragmentShader, defines: { CELL_DEBUG: 0 }, depthTest: false, depthWrite: false }));
    this.composite = new FullScreenQuad(new THREE.ShaderMaterial({ ...compositeShader, uniforms: THREE.UniformsUtils.clone(compositeShader.uniforms), depthTest: false, depthWrite: false }));
    this._enz = new WeakMap();
    this._lobes = new WeakMap();
    this._path = Array.from({ length: GLYCOLYSIS_ENZYMES }, () => new THREE.Vector3());
  }

  get quality() {
    return this.uniforms.uQuality.value;
  }

  // The two tints a cell's `salt` (the opening's salt front) mixes between: [r, g, b] multipliers.
  setSaltTints(warm, cool) {
    if (warm) this.uniforms.uSaltWarm.value.set(...warm);
    if (cool) this.uniforms.uSaltCool.value.set(...cool);
  }
  set quality(q) {
    this.uniforms.uQuality.value = THREE.MathUtils.clamp(q, 0.35, 1);
  }

  get debug() {
    return this._debug ?? null;
  }
  set debug(mode) {
    this._debug = mode;
    const d = mode === 'exhaust' ? 1 : mode === 'steps' ? 2 : 0;
    const m = this.quad.material;
    if (m.defines.CELL_DEBUG !== d) {
      m.defines.CELL_DEBUG = d;
      m.needsUpdate = true;
    }
  }

  add(cell) {
    this.cells.push(cell);
    return cell;
  }

  remove(cell) {
    this.cells = this.cells.filter((c) => c !== cell);
  }

  setSize(w, h) {
    this.target.setSize(Math.max(1, Math.round(w * this.resolutionScale)), Math.max(1, Math.round(h * this.resolutionScale)));
  }

  // Colours and light of the water, so cells are lit and fogged exactly like the world around them.
  // window {cosIn, cosOut, gain} and sun {power, gain}: the sky's bright window and the sun's disc,
  // as the dome draws them, so the films mirror what is there. The sun's glint in a film is capped
  // at 4x so it stays a point and does not bloom into a streak.
  setEnvironment({ sunDir, sunColor, sky, deep, fogColor, fogDensity, window, sun } = {}) {
    const u = this.uniforms;
    if (sunDir) u.uSunDir.value.copy(sunDir).normalize();
    if (sunColor !== undefined) {
      u.uSunColor.value.set(sunColor);
      // A sun far brighter than the sky (a display white pushed through an inverse tone curve
      // goes to infinity) would blow every lit structure out to white: keep it a warm light, and
      // say so, because then the cells and the water are lit by different suns.
      const c = u.uSunColor.value;
      if (Math.max(c.r, c.g, c.b) > 3) {
        if (!warnedSun) {
          warnedSun = true;
          console.warn('CellPass.setEnvironment: sunColor', c.toArray().map((x) => +x.toFixed(2)), 'is far brighter than the sky; clamped to a warm white. Fix the sun colour at its source.');
        }
        c.set(0xfff3dc).multiplyScalar(1.15);
      }
    }
    if (sky !== undefined) u.uSky.value.set(sky);
    if (deep !== undefined) u.uDeep.value.set(deep);
    if (fogColor !== undefined) u.uFogColor.value.set(fogColor);
    if (fogDensity !== undefined) u.uFogDensity.value = fogDensity;
    if (window) u.uWindow.value.set(window.cosIn, window.cosOut, window.gain, 0);
    if (sun) u.uSunLook.value.set(Math.min(sun.power ?? 1400, 4000), Math.min(sun.gain ?? 4, 4));
  }

  // Structure colours (keys match the uniform names without the u...Color wrapping, e.g. dna, tca).
  setColors(colors) {
    for (const [k, v] of Object.entries(colors)) {
      const name = `u${k[0].toUpperCase()}${k.slice(1)}Color`;
      if (this.uniforms[name]) this.uniforms[name].value.set(v);
    }
  }

  // The hero first, then the nearest cells that are on screen and not lost in the fog.
  pick() {
    const cam = this.camera;
    _pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
    _frustum.setFromProjectionMatrix(_pv);
    const fog = this.uniforms.uFogDensity.value;
    const list = this._list;
    list.length = 0;
    let hero = null;
    for (const cell of this.cells) {
      if (cell.visible === false || (!cell.husk && (cell.ghost ?? 0) >= 1) || (cell.husk && !(cell.wall > 0))) continue;
      cell.body.updateWorldMatrix(true, false);
      _center.setFromMatrixPosition(cell.body.matrixWorld);
      const scale = _scale.setFromMatrixScale(cell.body.matrixWorld).x;
      _sphere.set(_center, (cell.R + cell.H + 0.45) * scale);
      if (!_frustum.intersectsSphere(_sphere)) continue;
      const dist = _center.distanceTo(cam.position);
      const fd = fog * Math.max(dist - _sphere.radius, 0);
      if (1 - Math.exp(-fd * fd) > 0.985) continue;
      if (cell.kind === CELL_KIND.hero && !hero) hero = cell;
      else {
        cell._passDist = dist;
        list.push(cell);
      }
    }
    list.sort((a, b) => a._passDist - b._passDist);
    if (hero) list.unshift(hero);
    if (list.length > MAX_CELLS) list.length = MAX_CELLS;
    return list;
  }

  updateUniforms() {
    const u = this.uniforms;
    const cam = this.camera;
    cam.updateMatrixWorld();
    u.uProjInv.value.copy(cam.projectionMatrixInverse);
    u.uViewInv.value.copy(cam.matrixWorld);
    u.uCamPos.value.setFromMatrixPosition(cam.matrixWorld);
    u.uPixelAngle.value = (2 * Math.tan(THREE.MathUtils.degToRad(cam.fov ?? 40) / 2)) / (cam.zoom ?? 1) / Math.max(1, this.target.height);
    const order = this.pick();
    u.uHero.value = 0;
    let n = 0;
    for (const cell of order) {
      const body = cell.body;
      u.uInv.value[n].copy(body.matrixWorld).invert();
      const scale = _scale.setFromMatrixScale(body.matrixWorld).x;
      _center.setFromMatrixPosition(body.matrixWorld);
      const sh = cell.shape;
      const reach = (cell.R + cell.H + 0.3 + sh.uFlowAmp.value + 0.35 * sh.uTurn.value.length() * (cell.R + cell.H) ** 2) * scale;
      u.uSphere.value[n].set(_center.x, _center.y, _center.z, reach);
      u.uGeom.value[n].set(cell.R, cell.H, cell.kind, scale);
      u.uFlow.value[n].set(sh.uFlowAmp.value, sh.uFlowSpeed.value, sh.uSeed.value, sh.uThrust.value);
      u.uTurnW.value[n].set(sh.uTurn.value.x, sh.uTurn.value.y, sh.uWobble.value, cell.volume?.protonGlow ?? 0.3);
      u.uTint.value[n].copy(cell.tint);
      // wall: rods are walled unless they say otherwise, the hero is not; a husk carries its split,
      // any other cell its ghost (how far it has faded).
      const husk = cell.husk ? 1 : 0;
      u.uCellX.value[n].set(cell.wall ?? (cell.kind === CELL_KIND.rod ? 1 : 0), cell.pinch ?? 0, husk, husk ? (cell.split ?? 0) : (cell.ghost ?? 0));
      u.uCellS.value[n] = cell.salt ?? -1;
      if (cell.kind === CELL_KIND.hero && n === 0) {
        u.uHero.value = 1;
        // Intro only: interior muted after the wall is shed, and the waist of a squeeze through a slit.
        const sq = cell.squeeze;
        u.uHeroX.value.set(cell.mute ?? 0, sq?.depth ?? 0, sq?.offset ?? 0, sq?.width ?? 0.16);
        if (sq?.normal) u.uSqueezeN.value.copy(sq.normal);
        for (let k = 0; k < MAX_DENTS; k++) {
          u.uDentC.value[k].copy(sh.uDentC.value[k]);
          u.uDentN.value[k].copy(sh.uDentN.value[k]);
          u.uDentP.value[k] = sh.uDentP.value[k];
          u.uDentB.value[k].copy(sh.uDentB.value[k]);
        }
        const v = cell.volume;
        if (v) this.heroUniforms(v);
      }
      n++;
    }
    u.uCount.value = n;
  }

  heroUniforms(v) {
    const u = this.uniforms;
    const t = u.uTime.value;
    u.uNucleoid.value.set(v.nucleoid.x, v.nucleoid.y, v.nucleoid.z, v.nucleoidScale ?? 1);
    u.uPlasmid.value.set(v.plasmid.x, v.plasmid.y, v.plasmid.z, v.plasmidRadius ?? 0.07);
    const gs = v.granules ?? [];
    u.uGranuleCount.value = Math.min(gs.length, MAX_GRANULES);
    for (let k = 0; k < Math.min(gs.length, MAX_GRANULES); k++) {
      const gr = gs[k];
      u.uGranule.value[k].set(gr.pos.x, gr.pos.y, gr.pos.z, gr.radius);
      u.uGranuleKind.value[k] = gr.kind === 'polyphosphate' ? 1 : 0;
    }
    // The enzymes drift a little, each on its own slow path.
    const drift = (k, out) => out.set(Math.sin(t * 0.5 + k * 2.1), Math.sin(t * 0.43 + k * 1.3), Math.sin(t * 0.37 + k * 2.9)).multiplyScalar(0.004);
    const tca = v.tca;
    u.uTca.value.set(tca.center.x, tca.center.y, tca.center.z, tca.radius);
    u.uTcaAxis.value.set(tca.axis.x, tca.axis.y, tca.axis.z, tca.activity ?? 0.5);
    u.uTcaStream.value = THREE.MathUtils.clamp(tca.stream ?? 1, 0, 1);
    let te = tca.enzymes;
    if (!te) {
      te = this._enz.get(tca) ?? defaultTcaEnzymes(tca);
      this._enz.set(tca, te);
    }
    let ge = v.glycolysisEnzymes;
    if (!ge) {
      ge = this._enz.get(v) ?? defaultGlycolysisEnzymes(v.glycolysis);
      this._enz.set(v, ge);
    }
    // Each enzyme's subunits, drifting with it.
    const lobes = (list, n, out, seed0, centres) => {
      let bound = 0;
      for (let k = 0; k < n; k++) {
        const e = list[Math.min(k, list.length - 1)];
        let lay = this._lobes.get(e);
        if (!lay) {
          lay = lobeLayout(e.lobes, seed0 + k * 1.618);
          this._lobes.set(e, lay);
        }
        const c = drift(seed0 + k, centres ? centres[k] : _b).add(e.pos);
        for (let j = 0; j < 4; j++) {
          const L = lay[j];
          if (L) out[k * 4 + j].set(c.x + L.o.x * e.radius, c.y + L.o.y * e.radius, c.z + L.o.z * e.radius, L.r * e.radius);
          else out[k * 4 + j].w = 0;
        }
        bound = Math.max(bound, c.distanceTo(v.glycolysis) + e.radius * 1.3 + 0.01);
      }
      return bound;
    };
    lobes(te, TCA_ENZYMES, u.uTcaE.value, 0, null);
    const bound = lobes(ge, GLYCOLYSIS_ENZYMES, u.uGlycoE.value, 7, this._path);
    u.uGlyco.value.set(v.glycolysis.x, v.glycolysis.y, v.glycolysis.z, v.glycolysisActivity ?? 0.5);
    u.uGlycoBound.value = bound;
    // the metabolite thread: a smooth (Catmull-Rom) curve through the enzymes
    const P = this._path;
    const per = (GLYCO_PATH - 1) / (GLYCOLYSIS_ENZYMES - 1);
    for (let j = 0; j < GLYCO_PATH; j++) {
      const s = Math.min(j / per, GLYCOLYSIS_ENZYMES - 1 - 1e-6);
      const i = Math.floor(s);
      const f = s - i;
      const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, GLYCOLYSIS_ENZYMES - 1)];
      const f2 = f * f, f3 = f2 * f;
      const cr = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f2 + (-a + 3 * b - 3 * c + d) * f3);
      // between enzymes the stream wanders a little, as metabolites diffuse
      const w = Math.sin(Math.PI * f) * 0.005;
      u.uGlycoPath.value[j].set(cr(p0.x, p1.x, p2.x, p3.x) + w * Math.sin(t * 0.9 + j * 1.9), cr(p0.y, p1.y, p2.y, p3.y) + w * Math.sin(t * 0.7 + j * 2.6), cr(p0.z, p1.z, p2.z, p3.z) + w * Math.cos(t * 0.8 + j * 1.3));
    }
    const glow = (v.receptorGlow ?? 0.2) + (v.receptorFlash ?? 0);
    if (v.receptorDir) _a.copy(v.receptorDir).normalize();
    else _a.set(0, 0, 1);
    u.uReceptor.value.set(_a.x, _a.y, _a.z, glow);
    u.uReceptorR.value = v.receptorRadius ?? (v.receptorDir ? 0.14 : Math.max(0.08, (1 - Math.min(v.receptorZ ?? 0.78, 0.99)) * 0.65));
    const rafts = v.rafts ?? [];
    u.uRaftCount.value = Math.min(rafts.length, MAX_RAFTS);
    for (let k = 0; k < Math.min(rafts.length, MAX_RAFTS); k++) {
      const r = rafts[k];
      u.uRaft.value[k].set(r.pos.x, r.pos.y, r.pos.z, r.radius);
      u.uRaftN.value[k].copy(r.normal);
    }
    for (let k = 0; k < MAX_VESICLES; k++) {
      const ves = v.vesicles?.[k];
      if (ves && ves.radius > 0) {
        u.uVesicle.value[k].set(ves.pos.x, ves.pos.y, ves.pos.z, ves.radius);
        u.uVesicleState.value[k].set(ves.glow ?? 0, ves.membrane ?? 1, ves.kind === 'protein' ? 1 : 0, 0);
      } else u.uVesicle.value[k].set(0, 0, 0, 0);
    }
  }

  render(renderer, writeBuffer, readBuffer) {
    this.updateUniforms();
    this.uniforms.tDepth.value = readBuffer.depthTexture;
    renderer.setRenderTarget(this.target);
    renderer.setClearColor(0x000000, 1);
    renderer.clear();
    this.quad.render(renderer);
    const cm = this.composite.material.uniforms;
    cm.tScene.value = readBuffer.texture;
    cm.tCells.value = this.target.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.composite.render(renderer);
  }

  dispose() {
    this.target.dispose();
    this.quad.dispose();
    this.composite.dispose();
  }
}
