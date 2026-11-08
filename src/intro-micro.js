import * as THREE from 'three';
import { clock, mulberry32 } from './materials.js';
import { Bacterium, Coccus, createHusk } from './bacterium.js';
import { Crowd } from './crowd.js';
import { LOOK, DAWN, lerpDrop, applyDrop, lerpHex, sceneColor } from './lens.js';

// The micro half of the first-launch opening (docs/design/story.md, shots 5e, 6 and 7): from the
// moment the dive crosses under the meniscus to the prototype's own first frame.
//
//   0-3 s   (0:27-0:30) under the meniscus, 200 -> 40 µm, steeply downward: the water goes on and
//           on, a leaf hair rises from below like a fluted glass tower, a pollen grain hangs like a
//           planet, a faint crowd of resident bacteria, and the tear's salt front, a broad band of
//           brighter, faintly warm, layered water that we sink into.
//   3-17 s  (0:30-0:44) the soft one. Six walled rods run and tumble in the mixed water beyond one
//           rod at the front's edge; one of them divides. 6-12 s is an honest time-lapse (x8): the
//           caustic net races, dawn-lilac warms to the morning, the rods slow, swell, round up and
//           fade as ghosts; the rod at the edge slows, its wall splits along one side, a soft cell
//           squeezes out sideways, trembles, and its insides bloom into the hero's colours while the
//           empty wall turns beside it. Nothing points at it. From 12 s the gaze test may hand over.
//   17-19 s (0:44-0:46) the glide to EXACTLY the prototype's start pose, ending at zero velocity;
//           the interface fades in; the flagella stiffen and bundle.
//
// Times are real seconds since start(). The intro owns the camera, the hero, the extra rods, the
// water and CellPass while it runs; world time runs at `timeScale` (main.js feeds clock.uTime with
// real * timeScale). Everything the intro adds is gone, or faded to the game's own values, by the
// last frame of the glide, so dispose() changes nothing visible.

const D2R = Math.PI / 180;
const TAN = Math.tan(21 * D2R);
export const START_OFFSET = new THREE.Vector3(5.6, 1.8, 2.1); // the prototype's camera, from the hero
export const START_YAW = -0.35; // the hero's rotation.y at the start
const START_D = START_OFFSET.length();
const START_E = Math.asin(START_OFFSET.y / START_D) / D2R;
const START_A = Math.atan2(START_OFFSET.z, START_OFFSET.x) / D2R;

// The timeline (real seconds since start()).
const T = {
  lapse: [6, 12], // the time-lapse window (x8 inside, 0.8 s eased ends)
  lapseScale: 8,
  divide: [3, 7], // the long rod pinches in two
  wall: 8, // the wall crossfades onto the husk (0.6 s)
  split: [8, 9], // the slit opens
  exit: [9, 11.6], // the soft cell squeezes out
  tremble: [9, 12.5],
  bloom: [10.4, 12.6], // its insides bloom into the hero's colours
  settle: [12, 17], // eased to the start pose
  gaze: 12, // from here the gaze test may hand over
  glide: 17,
  glideLen: 2,
  hud: 0.6, // into the glide
};

// Camera, relative to its target: distance (µm), elevation and azimuth (degrees; azimuth from +x
// toward +z). Interpolated with a monotone cubic (distance in log space), so the camera never
// stops at a key and never overshoots one. From 17 s the glide takes over.
const CAM = [
  [0, 260, 65, START_A],
  [3, 52, 25, START_A],
  [6, 22, -24, START_A + 1],
  [8.4, 10, -20, START_A + 3],
  [10.3, 5.4, -13, START_A + 4],
  [12.4, 6.1, -8, START_A + 4],
  [14.6, 7.0, -2, START_A + 3],
  [17, 7.5, 7, START_A + 2],
];

// Reduced motion: three still framings joined by soft dips through the water's pale colour.
const CAM_STILL = [
  [0, 52, 22, START_A],
  [6, 11, -17, START_A + 4],
];

const smooth = (a, b, x) => THREE.MathUtils.smoothstep(x, a, b);
const smoother = (a, b, x) => THREE.MathUtils.smootherstep(x, a, b);
const dir = (e, a, out = new THREE.Vector3()) => out.set(Math.cos(e * D2R) * Math.cos(a * D2R), Math.sin(e * D2R), Math.cos(e * D2R) * Math.sin(a * D2R));

// Monotone cubic interpolation (Fritsch-Carlson) through (xs, ys). Clamped at both ends.
function pchip(xs, ys) {
  const n = xs.length;
  const h = [], d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) {
    h[i] = xs[i + 1] - xs[i];
    d[i] = (ys[i + 1] - ys[i]) / h[i];
  }
  m[0] = d[0];
  m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0;
    else {
      const w1 = 2 * h[i] + h[i - 1], w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i]);
    }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0;
    while (x > xs[i + 1]) i++;
    const t = (x - xs[i]) / h[i], t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h[i] * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h[i] * m[i + 1];
  };
}

// ------------------------------------------------------------------------------------------ props
// A few big things seen through the drop at the top of the descent, all lit by the drop itself:
// they read the dome's own colour uniforms, so they warm with the palette.
const DOME_GLSL = /* glsl */ `
  uniform vec3 uMeniscus, uSky, uHorizon, uDeep, uAbyss, uSun, uSunDir;
  vec3 envDome(vec3 d) {
    float y = d.y;
    vec3 col = mix(uHorizon, uDeep, smoothstep(-0.02, -0.6, y));
    col = mix(col, uAbyss, smoothstep(-0.35, -0.95, y));
    col = mix(col, uSky, smoothstep(0.0, 0.3, y));
    col = mix(col, uMeniscus, smoothstep(0.22, 0.75, y));
    return col;
  }
`;

const propVertex = /* glsl */ `
  #include <common>
  #include <fog_pars_vertex>
  varying vec3 vWorld, vN, vLocal;
  void main() {
    vLocal = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

// A leaf hair (trichome): a tall clear tower, fluted, glassy. It is drawn opaque (so it occludes
// properly and the cells composite over it) but looks clear: what it shows is the drop behind it,
// bent, tinted a little celadon, with the drop mirrored in its edges.
const towerFragment = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  ${DOME_GLSL}
  uniform vec3 uTint, uAxis;
  uniform float uFade;
  varying vec3 vWorld, vN, vLocal;
  void main() {
    vec3 n = normalize(vN);
    vec3 v = normalize(cameraPosition - vWorld);
    if (dot(n, v) < 0.0) n = -n;
    float th = atan(vLocal.z, vLocal.x);
    vec3 tng = normalize(cross(uAxis, n) + 1e-5);
    float flute = sin(th * 16.0 + vLocal.y * 0.004);
    n = normalize(n + 0.03 * flute * tng);
    float c = clamp(dot(n, v), 0.0, 1.0);
    float e = 1.0 - c;
    float fres = 0.06 + 0.94 * pow(e, 3.0);
    // A glass rod in water, as a lens draws one: a bright core where it focuses the light behind
    // it, a deeper band just inside each edge where it bends darker water toward you, and a rim
    // that mirrors the bright drop. Tone, never a contour line.
    vec3 behind = envDome(-v);
    vec3 bent = envDome(refract(-v, n, 0.86));
    vec3 thru = mix(behind, bent, 0.7) * uTint * (1.0 + 0.025 * flute);
    thru *= 1.0 + 0.1 * pow(c, 6.0) - 0.16 * smoothstep(0.45, 0.8, e) * (1.0 - smoothstep(0.86, 0.97, e));
    vec3 refl = max(envDome(reflect(-v, n)), behind) * 1.12;
    vec3 col = mix(thru, refl, fres);
    // the sun's glint running along the flutes
    col += uSun * 0.45 * pow(max(dot(reflect(-v, n), uSunDir), 0.0), 50.0);
    // the far end sinks into the deep
    col = mix(col, envDome(-v), uFade);
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`;

// A pollen grain: a pale amber sphere netted with raised ridges (reticulate), lit by the low sun,
// with the water's own haze round its limb, like an atmosphere.
const pollenFragment = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  ${DOME_GLSL}
  uniform vec3 uLumen, uMurus;
  varying vec3 vWorld, vN, vLocal;
  vec3 hash3(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.xxy + p.yxx) * p.zyx);
  }
  void main() {
    vec3 n = normalize(vN);
    vec3 v = normalize(cameraPosition - vWorld);
    vec3 q = normalize(vLocal) * 5.2;
    vec3 i = floor(q), f = fract(q);
    float F1 = 8.0, F2 = 8.0;
    for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec3 g = vec3(float(x), float(y), float(z));
      float d = length(g + hash3(i + g) * 0.85 - f);
      if (d < F1) { F2 = F1; F1 = d; } else F2 = min(F2, d);
    }
    float e = F2 - F1;
    float aa = fwidth(e) + 1e-4;
    float ridge = 1.0 - smoothstep(0.07 - aa, 0.07 + aa, e);
    float lumen = smoothstep(0.1, 0.5, e);
    float wrap = dot(n, uSunDir) * 0.5 + 0.5;
    vec3 alb = mix(uLumen * (0.82 + 0.18 * (1.0 - lumen)), uMurus, ridge);
    vec3 col = alb * (0.38 + 0.62 * wrap * wrap) + alb * envDome(n) * 0.25;
    float c = clamp(dot(n, v), 0.0, 1.0);
    col = mix(col, envDome(reflect(-v, n)) * 1.05, 0.5 * pow(1.0 - c, 3.0));
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }
`;

function propMaterial(fragmentShader, dome, extra) {
  const u = dome.material.uniforms;
  const uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, extra]);
  // the dome's own colour uniforms, shared (not copied), so a palette change reaches the props
  for (const k of ['uMeniscus', 'uSky', 'uHorizon', 'uDeep', 'uAbyss', 'uSun', 'uSunDir']) uniforms[k] = u[k];
  return new THREE.ShaderMaterial({ uniforms, vertexShader: propVertex, fragmentShader, fog: true });
}

// A tall tapering tower along +y from its base (radius r0) through r1 to a fine point, with
// shallow flutes that twist slowly round it (a hair is one long cell; its wall is ridged).
function towerGeometry(length, r0, r1) {
  const pts = [];
  const N = 64;
  const tip = 6 * r1; // the last stretch draws in to a point
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    const y = (length + tip) * s;
    let r = r0 + (r1 - r0) * Math.pow(Math.min(y / length, 1), 0.8);
    if (y > length) r = r1 * Math.sqrt(Math.max(1 - (y - length) / tip, 0));
    pts.push(new THREE.Vector2(Math.max(r, 0.05), y));
  }
  const g = new THREE.LatheGeometry(pts, 96);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    const k = 1 + 0.01 * Math.cos(16 * Math.atan2(z, x) + y * 0.004);
    p.setXYZ(i, x * k, y, z * k);
  }
  g.computeVertexNormals();
  return g;
}

// ------------------------------------------------------------------------------------------ audio
// The micro half's sound, synthesised (no assets). The walled rods' thin, high glass harmonics drop
// out one by one as they fade; the rod at the front's edge keeps its harmonic until its wall splits,
// then breaks into a warmer, slightly detuned wobble (the hero's timbre); the glide resolves into a
// held chord, and a soft click-ripple marks the interface arriving. attachAudio(ctx, destination)
// before start(); without it the intro is silent.
class MicroAudio {
  constructor(ctx, destination) {
    this.ctx = ctx;
    this.out = ctx.createGain();
    this.out.gain.value = 0;
    this.out.connect(destination);
    this.voices = [];
    this.hero = null;
  }

  // A held glass tone: a sine and two quiet partials, with a slow shimmer.
  tone(freq, level, detune = 0) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.connect(this.out);
    const oscs = [];
    for (const [mult, amp] of [[1, 1], [2.76, 0.18], [5.4, 0.05]]) {
      if (freq * mult > 12000) continue;
      const o = ctx.createOscillator();
      o.frequency.value = freq * mult;
      o.detune.value = detune;
      const a = ctx.createGain();
      a.gain.value = amp;
      o.connect(a).connect(g);
      o.start();
      oscs.push(o);
    }
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.3 + Math.random() * 0.5;
    const depth = ctx.createGain();
    depth.gain.value = level * 0.25;
    lfo.connect(depth).connect(g.gain);
    lfo.start();
    oscs.push(lfo);
    return { g, oscs, level };
  }

  start(rods) {
    const now = this.ctx.currentTime;
    this.out.gain.setTargetAtTime(0.5, now, 0.8);
    this.voices = rods.map((_, i) => this.tone(1760 * Math.pow(2, (i * 2 + (i % 2 ? 7 : 0)) / 12), 0.025));
    this.hero = this.tone(1318.5, 0.03);
  }

  // Levels follow each rod's life (0..1) and the hero's wall (1 walled glass, 0 soft wobble);
  // `presence` brings them all in as the cells come into view (shot 6).
  update(levels, heroWall, presence = 1) {
    const now = this.ctx.currentTime;
    this.voices.forEach((v, i) => v.g.gain.setTargetAtTime(v.level * (levels[i] ?? 0) * presence, now, 0.15));
    if (this.hero) this.hero.g.gain.setTargetAtTime(this.hero.level * heroWall * presence, now, 0.1);
    if (heroWall < 0.5 && !this.soft) {
      // the wall splits: a warmer, slightly detuned pair with a wobble
      this.soft = [this.tone(523.25, 0.035, 0), this.tone(523.25, 0.03, 14)];
      for (const s of this.soft) s.g.gain.setTargetAtTime(s.level, now, 0.4);
      const vib = this.ctx.createOscillator();
      vib.frequency.value = 4.6;
      const vd = this.ctx.createGain();
      vd.gain.value = 9;
      vib.connect(vd);
      for (const s of this.soft) for (const o of s.oscs.slice(0, 3)) vd.connect(o.detune);
      vib.start();
      this.soft[0].oscs.push(vib);
    }
  }

  chord() {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    // G, D, A, B: the motif's last note under its first, held
    for (const [f, a] of [[196, 0.03], [293.66, 0.025], [440, 0.022], [493.88, 0.018]]) {
      const t = this.tone(f, a);
      t.g.gain.setTargetAtTime(a, now, 0.6);
      (this.held ??= []).push(t);
    }
  }

  ripple() {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const len = Math.floor(ctx.sampleRate * 0.02);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.15));
    for (let k = 0; k < 6; k++) {
      const s = ctx.createBufferSource();
      s.buffer = buf;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 2600 + k * 380;
      f.Q.value = 6;
      const g = ctx.createGain();
      g.gain.value = 0.12 * Math.pow(0.7, k);
      s.connect(f).connect(g).connect(this.out);
      s.start(now + k * 0.045);
    }
  }

  // Fade out and let go (the game's own sound takes over).
  stop(fade = 2.5) {
    const now = this.ctx.currentTime;
    this.out.gain.setTargetAtTime(0, now, fade / 4);
    const all = [...this.voices, this.hero, ...(this.soft ?? []), ...(this.held ?? [])].filter(Boolean);
    setTimeout(() => {
      for (const v of all) for (const o of v.oscs) o.stop();
      this.out.disconnect();
    }, fade * 1000 + 200);
  }
}

// ------------------------------------------------------------------------------------------ intro
export class MicroIntro {
  constructor({ renderer, scene, camera, controls, cellPass, water, hero, neighbours, hud, look, reducedMotion }) {
    Object.assign(this, { renderer, scene, camera, controls, cellPass, water, hero, neighbours, hud, look });
    this.reducedMotion = reducedMotion ?? (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.t = 0;
    this.started = false;
    this.done = false;
    this.disposed = false;
    this.timeScale = 1;
    this.frameHeight = 2 * 260 * TAN;
    this.focus = 260;
    this.glideAt = null;
    this.audio = null;
    this.autoGaze = true; // run the 0.8 s rest test here (the director may run its own)
    this.look_ = { yaw: 0, pitch: 0, dragging: false, looked: false, rest: 0, x: 0, y: 0 };
    this.rng = mulberry32(2027);
    // (built either way: the director may switch reducedMotion after construction)
    this.camPath = ['D', 'e', 'a'].map((_, k) => pchip(CAM.map((c) => c[0]), CAM.map((c) => (k === 0 ? Math.log(c[1]) : c[k + 1]))));
    this._v = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    this.layout();
    this._q = new THREE.Quaternion();
    // the world-time clock of the time-lapse, tabulated: how far the morning has come at time t
    this.lapseTable = [];
    let w = 0;
    for (let i = 0; i <= 600; i++) {
      const t = T.lapse[0] + ((T.lapse[1] - T.lapse[0]) * i) / 600;
      this.lapseTable.push(w);
      w += this.scaleAt(t) * ((T.lapse[1] - T.lapse[0]) / 600);
    }
  }

  // ---------------------------------------------------------------- the world's layout
  // Everything is placed relative to the start pose, so the last frame is the prototype's: the hero
  // ends at the origin, turned START_YAW, and squeezes out of its wall along `exit`, so its wall is
  // left 1.3 µm behind it. The salt front's mixed edge lies 10 µm beyond the hero as the shot 6
  // camera looks up at it; the walled rods are out there in the mixed water.
  layout() {
    const L = (this.L = {});
    L.qFinal = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, START_YAW, 0));
    const axis = new THREE.Vector3(0, 0, 1).applyQuaternion(L.qFinal);
    // The squeeze is seen in profile: the exit runs up toward the light, square to the view.
    const view = dir(-17, START_A + 4).negate();
    const exit = new THREE.Vector3(0, 1, 0).addScaledVector(view, -view.y);
    exit.addScaledVector(axis, -exit.dot(axis)).normalize();
    L.exit = exit;
    L.qEsc = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3().crossVectors(exit, axis), exit, axis));
    // Where the wall is shed, and stays: in the last frame it lies a little beyond the hero, low on
    // the right, clear of the vitals ring and the scale bar. The soft cell swims the rest of the
    // way to its start pose.
    const fF = START_OFFSET.clone().negate().normalize();
    const rF = new THREE.Vector3().crossVectors(fF, new THREE.Vector3(0, 1, 0)).normalize();
    const uF = new THREE.Vector3().crossVectors(rF, fF);
    L.pEsc = fF.multiplyScalar(2.5).addScaledVector(rF, 3.7).addScaledVector(uF, -1.9);
    L.pOut = L.pEsc.clone().addScaledVector(exit, 1.3); // where the escape leaves the soft cell
    // The salt front: normal into the tear water, toward the shot 6 camera.
    L.n = dir(-22, START_A + 2);
    L.frontOffset = L.pEsc.dot(L.n) - 10; // the hero's isohaline 10 µm inside the mixed edge
    // Upstream along the isohaline: where the descent's target starts.
    L.up = new THREE.Vector3().crossVectors(L.n, new THREE.Vector3(0, 1, 0)).normalize();
    L.t0 = L.pEsc.clone().addScaledVector(L.up, -70);
    // A frame for placing things as the shot 6 camera sees them: beyond (away from the camera), right, up.
    const f = dir(-21, START_A + 3).negate();
    L.beyond = f.clone();
    L.right = new THREE.Vector3().crossVectors(f, new THREE.Vector3(0, 1, 0)).normalize();
    L.upS = new THREE.Vector3().crossVectors(L.right, f).normalize();
    L.at = (depth, x, y) => L.pEsc.clone().addScaledVector(L.beyond, depth).addScaledVector(L.right, x).addScaledVector(L.upS, y);
    // The descent's opening view, for placing the props.
    const c0 = L.t0.clone().addScaledVector(dir(CAM[0][2], CAM[0][3]), CAM[0][1]);
    L.cam0 = c0;
    const f0 = L.t0.clone().sub(c0).normalize();
    L.r0 = new THREE.Vector3().crossVectors(f0, new THREE.Vector3(0, 1, 0)).normalize();
    L.u0 = new THREE.Vector3().crossVectors(L.r0, f0).normalize();
    L.f0 = f0;
  }

  scaleAt(t) {
    if (this.reducedMotion) return 1 + 2 * (smooth(T.lapse[0], T.lapse[0] + 0.8, t) - smooth(T.lapse[1] - 0.8, T.lapse[1], t));
    return 1 + (T.lapseScale - 1) * (smooth(T.lapse[0], T.lapse[0] + 0.8, t) - smooth(T.lapse[1] - 0.8, T.lapse[1], t));
  }

  // 0 dawn .. 1 morning: how much world time has passed in the time-lapse, as a share of all of it.
  morningAt(t) {
    if (t <= T.lapse[0]) return 0;
    if (t >= T.lapse[1]) return 1;
    const k = ((t - T.lapse[0]) / (T.lapse[1] - T.lapse[0])) * 600;
    const i = Math.min(Math.floor(k), 599);
    const w = this.lapseTable[i] + (this.lapseTable[i + 1] - this.lapseTable[i]) * (k - i);
    return w / this.lapseTable[600];
  }

  // Sound: an AudioContext (resumed by the director's gesture) and where to send it.
  attachAudio(ctx, destination = ctx.destination) {
    if (ctx) this.audio = new MicroAudio(ctx, destination);
  }

  // ---------------------------------------------------------------- start
  start() {
    if (this.started) return;
    this.started = true;
    const { scene, water, cellPass, hero, neighbours, camera, controls, L } = this;
    this.saved = {
      near: camera.near,
      far: camera.far,
      controls: controls?.enabled,
      flowSpeed: hero.shape.uFlowSpeed.value,
      flowAmp: hero.shape.uFlowAmp.value,
      nearFade: [],
    };
    if (controls) controls.enabled = false;
    this.hud?.show?.(false, 0);

    // The crossing's flash, left at its peak by the director: it decays here over 0.35 s.
    this.flash0 = Math.max(this.look?.lens?.uniforms.uFlash?.value ?? 0, water.flash ?? 0);

    // The ordinary neighbours step out; the opening brings its own.
    neighbours.held = true;
    neighbours.hide(true);
    this.group = new THREE.Group();
    scene.add(this.group);
    this.buildRods();
    this.buildProps();

    // The hero starts walled, a plain rod at the front's edge, swimming on a short tether.
    hero.wall = 1;
    hero.mute = 1;
    hero.squeeze = { normal: new THREE.Vector3(0, 1, 0), offset: 0.5, depth: 0, width: 0.16 };
    hero.shape.uFlowAmp.value = hero.flowAmp * 0.25;
    // Its flow keeps real time through the time-lapse (the escape is on real-time keys).
    this.flowPhase = clock.uTime.value * this.saved.flowSpeed + hero.shape.uSeed.value;
    this.flowSeed0 = hero.shape.uSeed.value;
    hero.shape.uFlowSpeed.value = 0;
    this.free = { obj: new THREE.Object3D(), state: null };
    this.free.obj.position.copy(L.pEsc).add(new THREE.Vector3(0.6, -0.4, 0.5));
    this.free.obj.quaternion.copy(L.qEsc).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.9));
    hero.group.position.copy(this.free.obj.position);
    hero.group.quaternion.copy(this.free.obj.quaternion);
    this.heroParts(0);

    // the salt front
    water.setFront({ normal: L.n, offset: L.frontOffset, width: 500, edge: 20, strength: 1, reach: 1200, layers: 15, tint: [1.08, 1.06, 1.035] });

    this.bindInput();
    if (this.audio) this.audio.start(this.rods);
    this.update(0, 0);
  }

  // The insides the CellPass volume doesn't draw (complexes, polysomes, free proteins) dissolve
  // while the hero is walled and come back with its bloom (dithered, like the near-lens fade).
  heroParts(presence) {
    const hero = this.hero;
    if (!this.parts) {
      const keep = new Set();
      for (const f of hero.flagella) keep.add(f.filament);
      for (const m of [hero.motors?.mesh, hero.motors?.rotor, hero.motors?.mark]) if (m) keep.add(m);
      this.parts = [];
      hero.body.traverse((o) => {
        if (o.isMesh && !keep.has(o) && o.material.uniforms?.uNearFade) this.parts.push(o);
      });
      this.saved.nearFade = this.parts.map((o) => o.material.uniforms.uNearFade.value.clone());
    }
    // smoothstep(a, b, depth) is ~constant at the share we want when a and b are far apart
    const p = THREE.MathUtils.clamp(presence, 0, 1);
    this.parts.forEach((o, i) => {
      const u = o.material.uniforms.uNearFade.value;
      if (p >= 1) u.copy(this.saved.nearFade[i]);
      else if (p <= 0) u.set(1e6, 1e6 + 1);
      else {
        // solve 3s^2 - 2s^3 = p for s, then place the edges so every depth sits at s
        let s = p;
        for (let k = 0; k < 6; k++) s -= (3 * s * s - 2 * s * s * s - p) / Math.max(6 * s - 6 * s * s, 1e-3);
        s = THREE.MathUtils.clamp(s, 1e-3, 1 - 1e-3);
        u.set(-1e5, 1e5 * (1 / s - 1));
      }
    });
  }

  buildRods() {
    const { L, neighbours } = this;
    // depth beyond the hero, right, up (µm, in the shot 6 view), stagger (s), scale
    const spots = [
      [10, -7, 2.4, 0.2, 1.0],
      [13, 7.5, 3.6, 0.9, 0.92],
      [17, -12.5, -1.2, 0.5, 1.05],
      [9.5, 5, -3.2, 1.3, 0.95],
      [21, 13, 6.5, 0.7, 1.1],
    ];
    this.rods = spots.map(([d, x, y, lag, scale], i) => {
      const home = L.at(d, x, y);
      const b = neighbours.spawnAt({ position: home }, { seed: 400 + i, scale, wall: 1 });
      b.group.quaternion.setFromEuler(new THREE.Euler(this.rng() * 6, this.rng() * 6, this.rng() * 6));
      b.home = home;
      b.lag = lag;
      return b;
    });
    // The long rod that divides (H = 1.5: two standard rods end to end).
    const home = L.at(8, -3.2, 5.2);
    const long = neighbours.spawnAt({ position: home }, { seed: 420, H: 1.5, scale: 1, wall: 1 });
    long.group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), L.right.clone().multiplyScalar(-1).addScaledVector(L.upS, 0.35).normalize());
    long.home = home;
    long.lag = 1.1;
    long.dividing = true;
    long.pinch = 0;
    this.rods.push(long);
    this.long = long;
    // A pair of cocci drifting high in the mixed water (out of the last frame).
    this.cocci = new Coccus({ seed: 230, count: 2 });
    this.cocci.group.position.copy(L.at(13, 2.5, 8.5));
    this.group.add(this.cocci.group);
    for (const d of this.cocci.cells) this.cellPass.add(d);
  }

  buildProps() {
    const { L, water, group } = this;
    // Two leaf hairs rising from below: the near one beside our path, its tip a little below the
    // target at the top of the descent; a second further off.
    this.towers = [];
    const mk = (tip, lean, length, r0, r1) => {
      const ax = lean.isVector3 && lean.lengthSq() > 0.5 ? lean.clone().normalize() : new THREE.Vector3(0, 1, 0).add(lean).normalize();
      const m = new THREE.Mesh(towerGeometry(length, r0, r1), propMaterial(towerFragment, water.dome, {
        uTint: { value: new THREE.Color(1.0, 1.04, 1.0) },
        uAxis: { value: ax },
        uFade: { value: 0 },
      }));
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ax);
      m.position.copy(tip).addScaledVector(ax, -length);
      group.add(m);
      this.towers.push(m);
      return m;
    };
    // the near hair leans across our view (hairs on lady's mantle lie low and silky), so it reads
    // as a long column rising from the depths rather than foreshortened to a spike
    const v = this.poseAt(1.25);
    const f1 = v.target.clone().sub(v.pos).normalize();
    const r1 = new THREE.Vector3().crossVectors(f1, new THREE.Vector3(0, 1, 0)).normalize();
    const u1 = new THREE.Vector3().crossVectors(r1, f1);
    mk(this.inView(1.25, 85, -22, -2), u1.multiplyScalar(0.85).addScaledVector(r1, 0.42).addScaledVector(f1, -0.3), 900, 9, 5);
    mk(this.inView(0.6, 330, 80, -30), new THREE.Vector3(-0.12, 0, 0.08), 900, 9, 5);
    // The pollen grain: a planet we pass on the way down.
    this.pollen = new THREE.Mesh(new THREE.SphereGeometry(6.5, 96, 64), propMaterial(pollenFragment, water.dome, {
      uLumen: { value: sceneColor(0xe2b46a) },
      uMurus: { value: sceneColor(0xf8ecc8) },
    }));
    this.pollen.position.copy(this.inView(1.3, 70, 25, 7));
    this.pollen.rotation.set(0.4, 1.1, 0.2);
    group.add(this.pollen);

    // The far crowd: resident bacteria clumped on and round the hairs, and loose in the water.
    const clusters = [];
    for (const tw of this.towers) {
      const ax = tw.material.uniforms.uAxis.value;
      const tip = tw.position.clone().addScaledVector(ax, 900);
      clusters.push({ center: tip.clone().addScaledVector(ax, -120), radius: 22, count: 260, along: ax, length: 220 });
    }
    const loose = [
      [this.inView(0.2, 230, 60, 30), 45, 240],
      [this.inView(0.6, 260, -90, -40), 50, 220],
      [this.inView(1.2, 120, 45, -25), 30, 160],
      [this.inView(2.0, 90, -40, 22), 24, 140],
      [this.inView(2.8, 70, 32, 14), 18, 110],
    ];
    for (const [center, radius, count] of loose) clusters.push({ center, radius, count, flat: 0.6 });
    this.crowd = new Crowd({ clusters, seed: 11, near: [24, 34], sunDir: water.sunDir });
    group.add(this.crowd.mesh);
  }

  bindInput() {
    const el = this.renderer.domElement;
    const lk = this.look_;
    this.onDown = (e) => {
      lk.dragging = true;
      lk.x = e.clientX;
      lk.y = e.clientY;
    };
    this.onMove = (e) => {
      if (!lk.dragging) return;
      const k = 0.12 * D2R;
      lk.yaw = THREE.MathUtils.clamp(lk.yaw - (e.clientX - lk.x) * k, -10 * D2R, 10 * D2R);
      lk.pitch = THREE.MathUtils.clamp(lk.pitch - (e.clientY - lk.y) * k, -10 * D2R, 10 * D2R);
      lk.x = e.clientX;
      lk.y = e.clientY;
      lk.looked = true;
    };
    this.onUp = () => {
      lk.dragging = false;
    };
    el.addEventListener('pointerdown', this.onDown);
    addEventListener('pointermove', this.onMove);
    addEventListener('pointerup', this.onUp);
    addEventListener('pointercancel', this.onUp);
  }

  // ---------------------------------------------------------------- the frame
  get canHandOver() {
    return this.started && !this.done && this.glideAt === null && this.t >= T.gaze;
  }

  // Is the hero within the central gaze region: its screen centre within 0.15 of the frame height
  // of `ndc` (the centre of the view by default)?
  gazeOnHero(ndc = { x: 0, y: 0 }) {
    const p = this._v[3].copy(this.hero.group.position).project(this.camera);
    if (p.z > 1) return false;
    const dx = ((p.x - ndc.x) * this.camera.aspect) / 2, dy = (p.y - ndc.y) / 2;
    return Math.hypot(dx, dy) <= 0.15;
  }

  // Start shot 7 now: the rest of the ease to the start pose folds into the 2 s glide.
  handOver() {
    if (!this.started || this.done || this.glideAt !== null) return;
    this.beginGlide(this.t);
  }

  beginGlide(t) {
    this.glideAt = t;
    const hero = this.hero.group;
    this.glide = {
      p0: hero.position.clone(),
      q0: hero.quaternion.clone(),
      o0: this.camera.position.clone().sub(hero.position),
      v0: this.camVel ? this.camVel.clone() : new THREE.Vector3(),
      target0: (this.target ?? hero.position).clone(),
      look0: { yaw: this.look_.yaw, pitch: this.look_.pitch },
    };
  }

  update(real, t) {
    if (!this.started || this.done) return;
    const prevT = this.t;
    this.t = t;
    const wdt = real * this.timeScale;
    this.timeScale = this.scaleAt(t);
    if (this.glideAt === null && t >= T.glide) this.beginGlide(T.glide);
    const gu = this.glideAt === null ? 0 : THREE.MathUtils.clamp((t - this.glideAt) / T.glideLen, 0, 1);

    this.updateLight(t, gu);
    this.updateHero(real, wdt, t, gu);
    this.updateHusk(real, t);
    this.updateRods(wdt, t);
    this.updateCamera(real, t, gu);
    this.updateWater(t, gu);
    this.updateGaze(real, t);
    this.updateSound(t, prevT);

    if (this.glideAt !== null && t >= this.glideAt + T.hud && !this.hudShown) {
      this.hudShown = true;
      this.hud?.show?.(true, 1.2);
    }
    if (gu >= 1) this.finish();
  }

  // Palette, sun, rays, the crossing's flash.
  updateLight(t, gu) {
    const s = Math.max(this.morningAt(t), this.glideAt !== null ? smooth(0, 1, gu) : 0);
    this.morning = s;
    const drop = lerpDrop(DAWN, LOOK.drop, s);
    // Early on, looking down, the deep shows the leaf through the bead's lower skin: celadon.
    const leaf = (1 - s) * (1 - smooth(3, 7, t));
    if (leaf > 0) {
      drop.deep = lerpHex(drop.deep, 0xb6d2c6, 0.6 * leaf);
      drop.abyss = lerpHex(drop.abyss, 0xcbdcc0, 0.65 * leaf);
    }
    applyDrop(drop, { water: this.water, cellPass: this.cellPass, lens: this.look?.lens });
    this.water.shaftGain = smooth(0.35, 0.8, s);
    // the crossing's flash: down from its peak over 0.35 s; reduced motion's dips between framings
    let flash = this.flash0 > 0 ? this.flash0 * (1 - smooth(0, 0.35, t)) : 0;
    if (this.reducedMotion) for (const at of [CAM_STILL[1][0], T.glide]) flash = Math.max(flash, 0.45 * (1 - Math.abs(t - at) / 0.5) * (Math.abs(t - at) < 0.5));
    this.water.flash = 0;
    if (this.look?.lens?.uniforms.uFlash) this.look.lens.uniforms.uFlash.value = Math.min(flash, 0.9);
    else this.water.flash = Math.min(flash, 0.9);
  }

  // The hero: a walled rod swimming on a tether, slowing, then the escape and the bloom, then
  // eased to the start pose.
  updateHero(real, wdt, t, gu) {
    const { hero, L } = this;
    const g = hero.group;
    // free swimming (walled) until it is gathered to the escape pose by 8 s
    const fo = this.free.obj;
    const pace = 0.45 * (1 - smooth(5.5, 7, t));
    const drive = this.swim(this.free, wdt, pace);
    const pull = this._v[0].copy(L.pEsc).sub(fo.position);
    const dist = pull.length();
    if (dist > 1.2) fo.position.addScaledVector(pull.normalize(), (dist - 1.2) * Math.min(1, 2 * wdt));
    const gather = smoother(5.8, 8, t);
    g.position.copy(fo.position).lerp(L.pEsc, gather);
    g.quaternion.copy(fo.quaternion).slerp(L.qEsc, gather);

    // the escape: up through the slit, slow to start (pressing), quick in the middle, easing out
    const ex = smoother(T.exit[0], T.exit[1], t);
    const dy = 1.3 * ex;
    g.position.addScaledVector(L.exit, dy);
    // after: a slight drift, then it swims (eased) to the start pose
    const settle = this.glideAt === null ? smoother(T.settle[0], T.settle[1], t) : 1;
    if (t > T.exit[1]) {
      const k = 1 - settle;
      g.position.x += 0.12 * Math.sin((t - T.exit[1]) * 0.9) * k;
      g.position.y += 0.08 * Math.sin((t - T.exit[1]) * 0.7 + 1) * k;
    }
    g.position.lerp(this._v[1].set(0, 0, 0), settle);
    g.quaternion.slerp(L.qFinal, settle);
    if (this.glideAt !== null) {
      // whatever is left of the ease folds into the glide
      const u = smoother(0, 1, gu);
      g.position.copy(this.glide.p0).lerp(this._v[1].set(0, 0, 0), u);
      g.quaternion.copy(this.glide.q0).slerp(L.qFinal, u);
    }

    // the wall: on the hero until 8 s, then on the husk
    hero.wall = 1 - smooth(T.wall, T.wall + 0.6, t);
    hero.mute = 1 - smooth(T.bloom[0], T.bloom[1], t);
    this.heroParts(smooth(T.bloom[0] + 0.3, T.bloom[1], t));
    // the waist where it passes the slit (body space: the slit plane is at y = 0.5 - dy)
    const sq = hero.squeeze;
    sq.offset = 0.52 - dy;
    sq.depth = 0.26 * smooth(0, 0.3, dy) * (1 - smooth(1.0, 1.3, dy));
    sq.width = 0.14;
    // soft now: the flow wakes, it trembles, then calms
    const soft = smooth(9.4, 11.6, t);
    hero.shape.uFlowAmp.value = hero.flowAmp * (0.25 + 0.75 * soft) * (1 + 0.35 * smooth(10.5, 11.5, t) * (1 - smooth(12, 14, t)));
    hero.wobbleBoost = 1 + 2 * smooth(T.tremble[0], T.tremble[0] + 0.4, t) * (1 - smooth(10.5, T.tremble[1], t));
    // its own flow on real time
    this.flowPhase += real * this.saved.flowSpeed;
    hero.shape.uSeed.value = this.flowPhase;

    // flagella: running bundle while walled, limp through the escape, stiffening into the game's
    // idle bundle in the glide
    let bundle, omega, thrust;
    if (t < T.wall) {
      bundle = drive.bundle;
      omega = drive.omega;
      thrust = drive.thrust;
    } else {
      // limp through the escape; a weak beat as it swims to its place; then the game's idle bundle
      const stiff = this.glideAt !== null ? smooth(0, 0.8, gu) : 0;
      const swim = smooth(12, 13, t) * (1 - smooth(15.5, 17, t)) * (1 - stiff);
      bundle = 0.12 + 0.25 * swim + (0.55 - 0.12) * stiff;
      omega = 2 + 6 * swim + 4 * stiff;
      thrust = 0.25 * swim;
    }
    hero.update(wdt, { thrust, bundle, omega });
  }

  // Run and tumble on a seeded clock (so ?t= jumps are repeatable). pace 0 stops it.
  swim(cell, dt, pace) {
    const s = (cell.state ??= { run: 1 + this.rng() * 2, tumble: 0, axis: new THREE.Vector3(1, 0, 0), thrust: 0, bundle: 1 });
    const o = cell.obj ?? cell.group;
    if (s.tumble > 0) {
      s.tumble -= dt;
      o.quaternion.premultiply(this._q.setFromAxisAngle(s.axis, 4 * Math.min(pace * 2, 1) * dt));
      s.thrust += (0 - s.thrust) * (1 - Math.exp(-dt / 0.1));
      s.bundle += (0 - s.bundle) * (1 - Math.exp(-dt / 0.15));
      if (s.tumble <= 0) s.run = 1 + this.rng() * 3;
    } else {
      s.run -= dt;
      s.thrust += (pace - s.thrust) * (1 - Math.exp(-dt / 0.12));
      s.bundle += (Math.min(pace * 2, 1) - s.bundle) * (1 - Math.exp(-dt / 0.2));
      if (s.run <= 0 && pace > 0.05) {
        s.tumble = 0.4 + this.rng() * 0.4;
        s.axis.set(this.rng() - 0.5, this.rng() - 0.5, this.rng() - 0.5).normalize();
      }
    }
    o.position.addScaledVector(this._v[2].set(0, 0, 1).applyQuaternion(o.quaternion), s.thrust * 4.5 * dt);
    return { thrust: s.thrust, bundle: s.bundle, omega: (8 + s.thrust * 22) * Math.min(pace * 3 + 0.15, 1) };
  }

  // The empty wall: appears as the hero's wall goes, opens its slit, then drifts and turns.
  updateHusk(real, t) {
    if (t < T.wall) return;
    const { hero, L } = this;
    if (!this.husk) {
      // made at the escape pose (whatever the hero is doing, its wall is left where it was)
      const ref = { body: new THREE.Object3D(), R: hero.R, H: hero.H };
      ref.body.position.copy(L.pEsc);
      ref.body.quaternion.copy(L.qEsc);
      this.husk = createHusk(ref);
      this.huskSpin = 0;
      this.scene.add(this.husk.group);
      this.cellPass.add(this.husk);
    }
    const h = this.husk;
    h.wall = smooth(T.wall, T.wall + 0.6, t);
    h.split = smoother(T.split[0], T.split[1], t);
    // drifting and turning slowly once the cell is out
    const free = Math.max(t - T.exit[1] + 0.5, 0);
    const turn = 0.15 * Math.max(free - 0.5, 0) + 0.075 * Math.min(free, 1) * Math.min(free, 1);
    h.group.position.copy(L.pEsc).addScaledVector(L.exit, -0.02 * free).addScaledVector(L.beyond, 0.02 * free);
    h.group.quaternion.copy(L.qEsc).multiply(this._q.setFromAxisAngle(this._v[0].set(0.25, 0, 1).normalize(), turn));
    h.update();
  }

  // The walled rods out in the mixed water: run and tumble on a tether, then slow, swell, round up
  // and fade (each on its own lag). The long rod pinches in two first.
  updateRods(wdt, t) {
    const { L, neighbours } = this;
    for (const b of [...this.rods]) {
      const lag = b.lag;
      const pace = 1 - smooth(6.5 + lag, 9 + lag, t);
      const drive = this.swim(b, wdt, pace);
      const off = this._v[0].copy(b.home).sub(b.group.position);
      const d = off.length();
      if (d > 3) b.group.position.addScaledVector(off.normalize(), (d - 3) * Math.min(1, 1.5 * wdt));
      // swelling, rounding, going hypodense
      const sw = smooth(7.5 + lag, 10.5 + lag, t);
      if (!b.dividing) {
        b.R = 0.5 + 0.18 * sw;
        b.H = (b.H0 ?? 0.5) - ((b.H0 ?? 0.5) - 0.26) * sw;
      }
      // hypodense through the time-lapse (pale, swollen ghosts by 12 s), then thinning to nothing
      const fade = 0.62 * smooth(8.4 + 0.8 * lag, 11.6 + 0.4 * lag, t) + 0.38 * smooth(12, 15 + lag, t);
      b.ghost = Math.max(fade, this.glideAt === null ? 0 : smooth(this.glideAt, this.glideAt + 1.8, t));
      for (const f of b.flagella) f.filament.visible = b.ghost < 0.55;
      for (const m of [b.motors.mesh, b.motors.rotor, b.motors.mark]) if (m) m.visible = b.ghost < 0.55;
      b.update(wdt, { thrust: drive.thrust, bundle: drive.bundle * (1 - sw), omega: drive.omega });
      if (b.ghost >= 1 && !b.gone) {
        b.gone = true;
        b.group.visible = false;
      }
    }
    // the division: the furrow deepens, then two standard rods take the long one's place
    const long = this.long;
    if (long && !long.split) {
      long.pinch = smoother(T.divide[0], T.divide[1], t);
      if (t >= T.divide[1]) {
        long.split = true;
        const ax = this._v[1].set(0, 0, 1).applyQuaternion(long.group.quaternion);
        for (const sgn of [1, -1]) {
          const pos = long.group.position.clone().addScaledVector(ax, sgn * 1.0 * long.group.scale.x);
          const b = neighbours.spawnAt({ position: pos, quaternion: long.group.quaternion }, { seed: 430 + (sgn > 0 ? 0 : 1), wall: 1 });
          b.home = long.home.clone().addScaledVector(ax, sgn * 1.0);
          b.lag = long.lag + (sgn > 0 ? 0.1 : 0.35);
          b.state = { run: 0.6 + (sgn > 0 ? 0.4 : 1.1), tumble: 0, axis: new THREE.Vector3(1, 0, 0), thrust: 0, bundle: 0.5 };
          this.rods.push(b);
        }
        neighbours.despawn(long);
        this.rods = this.rods.filter((r) => r !== long);
        this.long = null;
      }
    }
    this.cocci.group.rotation.x += 0.05 * wdt;
    this.cocci.group.rotation.y += 0.03 * wdt;
    // they drift off into the haze as the game's own water comes back
    const away = this.glideAt === null ? 0 : smooth(this.glideAt, this.glideAt + 1.8, t);
    for (const c of this.cocci.cells) c.ghost = away;
    this.cocci.update(wdt);
  }

  // Where the keyed path (or reduced motion's stills) puts the camera and what it looks at, at t.
  poseAt(t, pos = new THREE.Vector3(), target = new THREE.Vector3()) {
    const L = this.L;
    // the target: from upstream on the isohaline to the hero's wall, then along its way out, then
    // with the hero to its start pose (the hero stays about the same share of the frame off-centre
    // as the frame shrinks, then the target settles on it)
    const D0 = this.reducedMotion ? 1 : Math.exp(this.camPath[0](t)) / CAM[0][1];
    target.copy(L.t0).lerp(L.pEsc, 1 - D0 * (1 - smoother(2.5, 6, t)));
    target.addScaledVector(L.exit, 1.3 * (0.62 * smoother(8.2, 11.2, t) + 0.38 * smoother(11, 13.5, t)));
    target.lerp(this._v[0].set(0, 0, 0), smoother(T.settle[0], T.settle[1], t));
    let D, e, a;
    if (this.reducedMotion) {
      const k = t < CAM_STILL[1][0] ? 0 : 1;
      [, D, e, a] = CAM_STILL[k];
    } else {
      D = Math.exp(this.camPath[0](t));
      e = this.camPath[1](t);
      a = this.camPath[2](t);
    }
    pos.copy(target).addScaledVector(dir(e, a, this._v[3]), D);
    return { pos, target };
  }

  // A point placed in the view the camera has at time t: `ahead` µm along its line of sight, then
  // right and up (µm) across it.
  inView(t, ahead, right, up) {
    const { pos, target } = this.poseAt(t);
    const f = target.clone().sub(pos).normalize();
    const r = new THREE.Vector3().crossVectors(f, new THREE.Vector3(0, 1, 0)).normalize();
    const u = new THREE.Vector3().crossVectors(r, f);
    return pos.addScaledVector(f, ahead).addScaledVector(r, right).addScaledVector(u, up);
  }

  // The camera: the keyed path (or reduced motion's stills), then the glide; look-around on top.
  updateCamera(real, t, gu) {
    const { camera, L, hero } = this;
    const target = this._v[1];
    const pos = this._v[2];
    if (this.glideAt === null) {
      this.poseAt(t, pos, target);
      // velocity, for a seamless glide
      if (real > 0) (this.camVel ??= new THREE.Vector3()).copy(pos).sub(camera.position).divideScalar(real);
    } else {
      const G = this.glide;
      // cubic Hermite in the offset from the hero: from where it was (and how it moved) to the start
      // pose, arriving at zero velocity
      const u = gu, u2 = u * u, u3 = u2 * u;
      const h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2;
      const off = this._v[0].copy(G.o0).multiplyScalar(h00).addScaledVector(START_OFFSET, h01);
      if (!this.reducedMotion) off.addScaledVector(G.v0, h10 * T.glideLen * 0.6);
      else off.copy(gu > 0 ? START_OFFSET : G.o0);
      pos.copy(hero.group.position).add(off);
      // the look settles onto the hero early in the glide (it already is there unless handed over early)
      target.copy(G.target0).lerp(hero.group.position, smoother(0, 0.6, u));
    }
    camera.position.copy(pos);
    camera.up.set(0, 1, 0);
    camera.lookAt(target);
    // look-around: up to 10° off, springing back (0.6 s), gone by the end of the glide
    const lk = this.look_;
    if (!lk.dragging) {
      const k = Math.exp(-real / 0.6);
      lk.yaw *= k;
      lk.pitch *= k;
    }
    const fade = this.glideAt === null ? 1 : 1 - smooth(0, 0.7, gu);
    if (lk.yaw || lk.pitch) {
      camera.rotateOnWorldAxis(this._v[3].set(0, 1, 0), lk.yaw * fade);
      camera.rotateX(lk.pitch * fade);
    }
    const D = camera.position.distanceTo(target);
    this.focus = D;
    this.frameHeight = 2 * D * TAN;
    (this.target ??= new THREE.Vector3()).copy(target);
  }

  // Haze, caustics, the clip planes and the intro's own things, all scaled to the distance so the
  // drop looks equally deep at every scale.
  updateWater(t, gu) {
    const { camera, water, cellPass } = this;
    const D = this.focus;
    const fog = 0.02 * Math.min(1, 12 / D);
    water.setFogDensity(fog);
    cellPass.setEnvironment({ fogDensity: fog });
    water.setScale(THREE.MathUtils.clamp(D / START_D, 1, 40));
    camera.near = Math.max(0.02, 0.0032 * D);
    camera.far = Math.max(800, 8 * D);
    camera.updateProjectionMatrix();
    // Everything of the intro's own is gone by the end of the glide, however early it starts.
    const late = (a, b) => Math.max(smooth(a, b, t), smooth(0, 0.9, gu));
    // the salt front thins away as the glide brings the game's water back
    water.dome.material.uniforms.uFrontP.value.w = 1 - late(13, 17.5);
    water.dome.material.uniforms.uFrontT.value.x = Math.min(1200, 1.4 / fog);
    // the crowd and the props sink into the haze, then go
    this.crowd.opacity = 0.7 * (1 - late(3, 5));
    const sink = smooth(2.6, 4.2, t);
    for (const tw of this.towers) {
      tw.material.uniforms.uFade.value = sink;
      tw.visible = sink < 1;
    }
    this.pollen.visible = t < 4;
    // looking up into the light, the caustic net is a soft veil behind the cells, not a web of
    // lines (the game's own strength is back by the end of the glide)
    water.caustics = 1 - 0.9 * smooth(4, 6.5, t) * (1 - late(13, 17.5));
    this.crowd.resize(this.renderer.getDrawingBufferSize(this._size ??= new THREE.Vector2()).y, camera.fov);
  }

  updateGaze(real, t) {
    if (!this.autoGaze || !this.canHandOver) return;
    const lk = this.look_;
    if (lk.looked && !lk.dragging && this.gazeOnHero()) lk.rest += real;
    else lk.rest = 0;
    if (lk.rest >= 0.8) this.handOver();
  }

  updateSound(t, prevT) {
    const a = this.audio;
    if (!a) return;
    a.update(this.rods.map((b) => (b.gone ? 0 : 1 - b.ghost)), this.hero.wall, smooth(2.6, 4.2, t));
    if (this.glideAt !== null && !this.chorded) {
      this.chorded = true;
      a.chord();
    }
    if (this.hudShown && !this.rippled) {
      this.rippled = true;
      a.ripple();
    }
  }

  // ---------------------------------------------------------------- the end
  // The last frame: exactly the prototype's start pose, the morning, the game's water.
  finish() {
    if (this.done) return;
    const { camera, controls, hero, water, cellPass } = this;
    hero.group.position.set(0, 0, 0);
    hero.group.quaternion.copy(this.L.qFinal);
    hero.group.rotation.set(0, START_YAW, 0);
    hero.wall = 0;
    hero.mute = 0;
    hero.squeeze = null;
    hero.wobbleBoost = 1;
    hero.shape.uFlowAmp.value = this.saved.flowAmp;
    // hand the flow back to world time without a jump in its phase
    hero.shape.uFlowSpeed.value = this.saved.flowSpeed;
    hero.shape.uSeed.value = this.flowPhase - clock.uTime.value * this.saved.flowSpeed;
    this.heroParts(1);
    camera.position.copy(START_OFFSET);
    camera.up.set(0, 1, 0);
    camera.near = this.saved.near;
    camera.far = this.saved.far;
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
    if (controls) {
      controls.target.set(0, 0, 0);
      controls.update();
      controls.enabled = this.saved.controls ?? true;
    }
    applyDrop(LOOK.drop, { water, cellPass, lens: this.look?.lens });
    water.shaftGain = 1;
    water.setScale(1);
    water.setFogDensity(LOOK.cellEnvironment.fogDensity);
    cellPass.setEnvironment({ fogDensity: LOOK.cellEnvironment.fogDensity });
    water.setFront({ strength: 0 });
    water.flash = 0;
    water.caustics = 1;
    if (this.look?.lens?.uniforms.uFlash) this.look.lens.uniforms.uFlash.value = 0;
    this.crowd.opacity = 0;
    for (const b of this.rods) b.group.visible = false;
    this.cocci.group.visible = false;
    this.timeScale = 1;
    this.focus = START_D;
    this.frameHeight = 2 * START_D * TAN;
    if (!this.hudShown) {
      this.hudShown = true;
      this.hud?.show?.(true, 1.2);
    }
    this.audio?.stop();
    this.done = true;
  }

  // Land in shot 7's end state at once (the director plays a blink over the cut).
  skip() {
    if (!this.started) this.start();
    if (this.done) return;
    this.t = Math.max(this.t, T.glide + T.glideLen);
    if (this.husk && this.husk.wall > 0) {
      this.husk.wall = 1;
      this.husk.split = 1;
    } else if (this.husk) {
      this.scene.remove(this.husk.group);
      this.cellPass.remove(this.husk);
      this.husk = null;
    }
    this.finish();
  }

  // Removes everything the intro added and gives the game back its drop. The husk stays: it is the
  // first run's first landmark (dispose({ keepHusk: false }) takes it too).
  dispose({ keepHusk = true } = {}) {
    if (this.disposed) return;
    if (!this.done) this.skip();
    this.disposed = true;
    const { scene, neighbours, cellPass } = this;
    for (const b of this.rods) neighbours.despawn(b);
    this.rods = [];
    if (this.long) neighbours.despawn(this.long);
    for (const d of this.cocci.cells) cellPass.remove(d);
    scene.remove(this.group);
    this.group.traverse((o) => {
      if (o.isMesh) {
        o.geometry.dispose();
        o.material.dispose();
      }
    });
    this.crowd.dispose();
    if (this.husk && !keepHusk) {
      scene.remove(this.husk.group);
      cellPass.remove(this.husk);
      this.husk = null;
    }
    neighbours.held = false;
    neighbours.hide(false);
    neighbours.scatter();
    const el = this.renderer.domElement;
    el.removeEventListener('pointerdown', this.onDown);
    removeEventListener('pointermove', this.onMove);
    removeEventListener('pointerup', this.onUp);
    removeEventListener('pointercancel', this.onUp);
  }
}
