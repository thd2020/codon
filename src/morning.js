import * as THREE from 'three';
import { Intro } from './intro.js';

// The child on the step: a figure of tapered capsules, a head and the hair gathered at its back,
// posed by joints, set into the Garden's shared uniforms (uSitA, uSitB, uSitHead, uSitHair,
// uSitGlint). The drops show them sharp, small and upside down against the lit back door; the eye,
// focused on the bead, sees the same figure only as a soft dark shape in the door's glow. No face:
// it is a silhouette.
//
// Local frame (mm): origin on the step under the hips, +x the way the child faces, +y up, +z the
// child's left. A nine-year-old: thigh about 330, shin 300, hips to shoulders 330, head radius 86.
// Drawn for the silhouette, which is all the drops ever show, small and upside down: a clear head
// with its hair gathered at the back, a rounded back, the shins and feet on the step, and light
// between the parts (under the thighs, between the chest and the knees, inside the raised arm).
const POSE = {
  // P0: sitting with the knees drawn up, arms round the shins, the head bowed onto the knees.
  hug: {
    pelvis: [0, 108, 0], back: [22, 262, 0], shoulder: [72, 392, 0], head: [228, 482, 0], hair: [170, 548, 0],
    knee: [292, 336, 0], ankle: [318, 48, 0], toe: [418, 28, 0],
    elbow: [128, 232, -46], hand: [372, 236, -46],
  },
  // P2: leaning forward, the head lifted off the knees, one hand raised to the face, its elbow on the
  // knee.
  wipe: {
    pelvis: [0, 108, 0], back: [34, 266, 0], shoulder: [104, 398, 0], head: [214, 560, 0], hair: [150, 610, 0],
    knee: [292, 336, 0], ankle: [318, 48, 0], toe: [418, 28, 0],
    elbow: [318, 392, -46], hand: [300, 548, -46],
  },
  // P3: turned to the leaf and leaning right over it (by then out of the drops' sight).
  lean: {
    pelvis: [0, 108, 0], back: [140, 240, 0], shoulder: [300, 300, 0], head: [450, 300, 0], hair: [400, 380, 0],
    knee: [300, 300, 0], ankle: [352, 46, 0], toe: [446, 28, 0],
    elbow: [420, 200, -60], hand: [520, 160, -60],
  },
};
const POSES = ['hug', 'wipe', 'lean'];
const JOINTS = Object.keys(POSE.hug);
const SOB_JOINTS = ['shoulder', 'head', 'hair', 'elbow'];
// The capsules: [from, radius, to, radius]. The trunk in two (so the back rounds), the neck, a
// thigh, a shin, a foot (these six melt into one mass), then the near arm in two (kept distinct).
const CAPS = [
  ['pelvis', 86, 'back', 78],
  ['back', 78, 'shoulder', 68],
  ['shoulder', 48, 'head', 40],
  ['pelvis', 60, 'knee', 52],
  ['knee', 50, 'ankle', 37],
  ['ankle', 36, 'toe', 27],
  ['shoulder', 38, 'elbow', 32],
  ['elbow', 31, 'hand', 27],
];

export class ChildFigure {
  constructor(uniforms) {
    this.u = uniforms;
    this.j = {};
    for (const k of JOINTS) this.j[k] = new THREE.Vector3();
    // Where the child sits, relative to the tear bead: on the top step, beyond the plant, side-on to
    // the low camera and in front of the lit window as the drop sees them.
    this.root = SIT_ROOT.clone();
    this.facing = Math.PI; // the way the child faces in the xz-plane (pi: toward -x)
    this.glint = 0;
    this._m = new THREE.Matrix4();
    this._q = new THREE.Quaternion();
  }

  // weights: { hug, wipe, lean } (summing to 1); sob: 0..1 lift of the shoulders (a sob's catch).
  pose(w, sob = 0) {
    for (const k of JOINTS) {
      const v = this.j[k].set(0, 0, 0);
      for (const name of POSES) {
        const a = w[name] ?? 0;
        if (a) v.x += POSE[name][k][0] * a, v.y += POSE[name][k][1] * a, v.z += POSE[name][k][2] * a;
      }
    }
    if (sob) {
      // The shoulders catch up and back, the head with them; the hands stay on the shins.
      for (const k of SOB_JOINTS) this.j[k].add(_t.set(-14 * sob, 26 * sob, 0));
      this.j.back.add(_t.set(-6 * sob, 12 * sob, 0));
    }
    return this;
  }

  // A joint, in the bead's frame.
  at(k, out = _w) {
    return out.copy(this.j[k]).applyMatrix4(this._m);
  }

  // Writes the figure into the Garden's uniforms (relative to the bead). Allocates nothing.
  apply() {
    const u = this.u;
    const q = this._q.setFromAxisAngle(_Y, -this.facing);
    this._m.makeRotationFromQuaternion(q).setPosition(this.root);
    for (let i = 0; i < CAPS.length; i++) {
      const [a, ra, b, rb] = CAPS[i];
      const pa = this.at(a);
      u.uSitA.value[i].set(pa.x, pa.y, pa.z, ra);
      const pb = this.at(b);
      u.uSitB.value[i].set(pb.x, pb.y, pb.z, rb);
    }
    u.uSitA.value[8].w = 0;
    const h = this.at('head');
    u.uSitHead.value.set(h.x, h.y, h.z, 102);
    const hr = this.at('hair');
    u.uSitHair.value.set(hr.x, hr.y, hr.z, 44);
    // The brass loupe in the lap, on the near side, between the chest and the thighs.
    const g = _w.set(0, 0, 0).add(this.j.pelvis).lerp(this.j.knee, 0.55).add(_t.set(10, 30, -60)).applyMatrix4(this._m);
    u.uSitGlint.value.set(g.x, g.y, g.z, this.glint);
  }
}

const _Y = new THREE.Vector3(0, 1, 0);
const _w = new THREE.Vector3();
const _t = new THREE.Vector3();
// Where the child sits (on the top step) and where they lean in to (over the leaf), relative to the bead.
const SIT_ROOT = new THREE.Vector3(560, -74, -1400);
const LEAN_ROOT = new THREE.Vector3(40, 0, -400);

// ================================================================================ The First Morning
// The notebook's first page, a drawing of a falling tear, plays this (story §5.1, shots 0 -> 1 -> 2
// -> 3): 33 s on its own clock, then the hub with the lens in hand, the run select for the next
// morning.
//
//   0:00  Before light. Black, a blackbird, someone crying quietly, a wet-glass A; a dawn gradient,
//         then one point of light: the bead in the leaf's cup catching the brightest of the sky.
//   0:04  The leaf. Low across the lady's mantle, pushing in on the central bead (42 -> 21 mm by
//         0:10, then on to 11 mm, until it fills two fifths of the frame); behind, in soft bokeh, the
//         house's lit back door with a soft dark shape in its glow. Inside the bead the world hangs
//         upside down and sharp, and the shape resolves: a child on the step in front of the door,
//         knees up, head down (honest optics: the drop and the eye look the same way). 0:12 the
//         shoulders shake once; something brass glints in the lap. 0:14 the figure leans forward
//         and raises a hand to its face.
//   0:16  The tear. The camera eases back and tilts up into the space above the bead; the top of the
//         frame darkens (the child leaning over, too close to be anything but shadow). Time slows
//         to a high-speed camera's: a bright point drops from the dark, 1/500 at contact, a neck
//         bridges tear and bead, the merged bead rings in its first two shape modes, a satellite
//         hops off and falls back; time returns; salt curls through the bigger bead. Sound: no
//         splash, a deep pitched-down dumm, U (a breath out), glass G. A-U-G: start.
//   0:26  Into their gaze. A spiral rise round the bead to straight above, where the child's eyes
//         are; the light dims as they lean in; 0:30 the loupe slides in held by fingertips with a
//         plaster, a fingernail clicks on brass, the engraving glints, the breathing steadies, the
//         glass settles into a drone on A. 0:33 the hub's first frame: the cursor becomes the lens.
//
// The tear's physics runs on world time (story §6.1): the director's time scale is integrated once,
// ahead, so the tear released 120 mm up lands (about 1.5 m/s) exactly at contact whatever the frame
// rate, and the bead rings on Lamb's decay times. Rayleigh's frequencies for a free drop of 2.15 mm,
// omega_l^2 = l(l-1)(l+2) sigma/(rho R^3), give 240 and 466 rad/s for l = 2, 3; their decay times
// R^2/((l-1)(2l+1) nu) about 0.9 and 0.33 s. At full speed the modes would be a shimmer, so they are
// let down as time returns (Codon staging, story §7: 'High-speed camera').

const HEADROOM = Math.tan(THREE.MathUtils.degToRad(2));
const D2R = Math.PI / 180;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const smoother = (x) => {
  const t = clamp(x, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const logLerp = (a, b, t) => Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t);
const ease = (dt, tau) => 1 - Math.exp(-dt / Math.max(tau, 1e-4));

// The bead before the tear, and after (garden.js's B and BEAD_R are the merged bead).
const PRE = { c: new THREE.Vector3(0, 3.4, 0), r: 2.0 };
const TEAR_R = 1.25;
// Real seconds on the morning's clock.
const M = {
  gradient: 1.5,
  point: 2.8,
  reveal: 4.0,
  parallax: 5.0,
  pushEnd: 15.6,
  sob: 12.0,
  wipe: 13.9,
  lean: 15.9,
  back: 16.0, // the camera eases back and tilts up
  slow: 17.9, // time starts to slow
  enter: 19.0, // the tear appears at the top of the frame
  contact: 21.2,
  hold: 23.4, // the neck has swallowed the tear: time eases from 1/500 to 1/30
  ring: 24.2, // and from 1/30 back to 1
  normal: 25.0,
  settle: 24.0, // the camera tilts back down onto the bead
  rise: 26.0,
  loupeIn: 30.0,
  loupeSettle: 32.0,
  click: 31.85,
  glint: 31.55,
  steady: 32.0,
  end: 33.0,
};
// The time scale (world seconds per real second) of the high-speed camera.
const K = { fast: 1 / 90, contact: 1 / 500, ring: 1 / 30 };
// Gravity and the tear's speed at impact (mm/s), from 120 mm.
const G = 9810;
const V_IMPACT = Math.sqrt(2 * G * 120);
const T_FALL = V_IMPACT / G; // world seconds from release to impact
// The merge, in world seconds after contact: the neck grows and the tear is swallowed.
const NECK = 0.0044;
// Ringing (story §6.3, shot 2): amplitudes, frequencies (rad/s) and decay times (s).
const RING = { a2: 0.12, w2: 240, tau2: 0.9, a3: 0.05, w3: 466, tau3: 0.33 };
// The camera's path, relative to the bead: distance (mm), elevation and azimuth (degrees from +z).
// The low push looks along a valley of the blade (a primary vein runs down it to the bead).
const AZ = -17;
const CAM = {
  start: { d: 42, el: 9, az: AZ - 2 },
  near: { d: 11, el: 4, az: AZ + 2 },
  back: { d: 19, el: 6 },
  rise: { d: 24, el: 18 },
  top: { d: 117, el: 90 },
};

// Reduced motion's held framings (no push, no rise): one per stage.
const RM_POSES = [
  { d: 30, el: 8, az: AZ, lookUp: 0 },
  { d: CAM.near.d, el: CAM.near.el, az: CAM.near.az, lookUp: 0 },
  { d: CAM.back.d, el: CAM.back.el, az: CAM.near.az, lookUp: 1 },
  { d: CAM.rise.d, el: CAM.rise.el, az: CAM.near.az, lookUp: 0 },
  { d: CAM.top.d, el: CAM.top.el, az: CAM.near.az + 180, lookUp: 0 },
];

export class Morning {
  // intro: the director (intro.js) that owns the Garden, the veil, the audio and the interface.
  constructor(intro) {
    this.intro = intro;
    this.garden = intro.garden;
    this.audio = intro.audio;
    this.reducedMotion = intro.reducedMotion;
    this.figure = new ChildFigure(this.garden.u);
    this.weights = { hug: 1, wipe: 0, lean: 0 };
    this.mergeDesc = { bead: new THREE.Vector4(), tear: new THREE.Vector4(), k: 0, merged: new THREE.Vector4(), ring: new THREE.Vector3() };
    this.timeScale = 1;
    this.world = 0;
    this.done = false;
    this.parallax = new THREE.Vector2();
    this.cam = { d: CAM.start.d, el: CAM.start.el, az: CAM.start.az, look: new THREE.Vector3(), up: new THREE.Vector3(0, 1, 0) };
    this.bead = PRE.c.clone();
    this.beadR = PRE.r;
    this.tableW = this.integrate();
    this.wContact = this.worldAt(M.contact);
  }

  // ------------------------------------------------------------------------------ the clocks
  // The time scale at real time t: 1, then a high-speed camera's ramp down to 1/90 as the tear
  // comes into the frame, easing on to 1/500 at contact; held while the neck grows; 1/30 while the
  // bead rings; back to 1 by 0:25.
  scaleAt(t) {
    if (t < M.slow) return 1;
    if (t < M.enter) return Math.exp(Math.log(K.fast) * smooth(M.slow, M.enter, t));
    if (t < M.contact) return K.fast * Math.pow(K.contact / K.fast, (t - M.enter) / (M.contact - M.enter));
    if (t < M.hold) return K.contact;
    if (t < M.ring) return K.contact * Math.pow(K.ring / K.contact, smooth(M.hold, M.ring, t));
    if (t < M.normal) return K.ring * Math.pow(1 / K.ring, smooth(M.ring, M.normal, t));
    return 1;
  }

  // World time against real time, integrated once ahead (1 ms steps), so the tear's fall is exact
  // whatever the frame rate.
  integrate() {
    const dt = 0.001;
    const n = Math.ceil((M.end + 2) / dt);
    const W = new Float64Array(n + 1);
    for (let i = 0; i < n; i++) W[i + 1] = W[i] + this.scaleAt((i + 0.5) * dt) * dt;
    return W;
  }

  worldAt(t) {
    const W = this.tableW;
    const x = clamp(t / 0.001, 0, W.length - 1.001);
    const i = Math.floor(x);
    return W[i] + (W[i + 1] - W[i]) * (x - i);
  }

  // ------------------------------------------------------------------------------- the cues
  // The morning's cue sheet (clock 'morning'): sounds and captions on its own clock.
  buildCues() {
    const a = this.audio;
    const cue = (at, name, fn, cap = null) => ({ clock: 'morning', at, name, fn, cap, done: false });
    return [
      cue(1.0, 'blackbird, distant', () => a.bird(0, { kind: 'blackbird', level: 0.05, pan: -0.55, dest: a.bedFilter }), ['[a bird]', 2.4]),
      cue(1.6, 'breath: unsteady', () => a.setBreathing('unsteady')),
      cue(2.6, 'a sniff', () => a.breath('sniff', 0, { level: 0.12 }), ['[someone crying quietly]', 3]),
      cue(3.2, 'glass A (the motif: A)', () => a.glassA(0, { level: 0.07 }), ['[a wet glass rings]', 2.6]),
      cue(3.6, 'garden bed in', () => a.gardenIn(4)),
      cue(5.5, 'the birds thicken', () => a.setBirdRate?.(2.2), ['[birds, more of them]', 2.4]),
      cue(7.6, 'a breeze', () => a.gust?.(0.07, 3.5), ['[a breeze]', 2.2]),
      cue(8.7, 'a glassy tick: the beads tremble', () => a.beadTick?.(), ['[a glassy tick]', 2]),
      cue(M.sob, 'a sob: the shoulders shake', () => a.sob?.(), ['[a catch of breath]', 2.4]),
      cue(M.lean + 0.4, 'the breath is held', () => a.setBreathing('held')),
      cue(M.slow, 'time slows: the garden holds still', () => a.setSlow?.(1, 1.2), ['[the garden goes quiet]', 2.4]),
      cue(M.contact, 'contact: a soft, deep dumm on A (no splash; the motif: A)', () => a.dumm(), ['[a soft, deep note]', 2.6]),
      cue(M.contact + 1.3, 'U: the child breathes out (the motif: U)', () => a.breath('u', 0, { dur: 2.6, level: 0.08 }), ['[a long breath out]', 2.8]),
      cue(M.ring - 0.3, 'glass G (A-U-G: start)', () => a.glassG(0, { level: 0.1 }), ['[a second glass note]', 2.6]),
      cue(M.normal, 'the birds return', () => {
        a.setSlow?.(0, 1.6);
        a.setBreathing('unsteady');
        a.setBirdRate?.(1.4);
      }, ['[birdsong returns]', 2.4]),
      cue(M.click, 'a fingernail clicks on brass', () => a.click(), ['[a fingernail taps brass]', 1.8]),
      cue(M.steady, 'the breathing steadies: looking calms them', () => a.setBreathing('steady'), ['[the breathing steadies]', 3]),
      cue(M.steady + 0.3, 'the glass settles into a drone on A', () => a.droneIn(0.035, 4), ['[a low glass hum]', 2.6]),
    ];
  }

  // ------------------------------------------------------------------------------- start
  start() {
    const g = this.garden;
    g.setMorning(true);
    g.setTearBead(PRE.c, PRE.r);
    g.setFall(null);
    g.setSatellite(null);
    g.setMerge(null);
    g.u.uChild.value = 0;
    g.u.uSit.value = 1;
    g.loupeOn = false;
    g.schlieren = 0;
    // Beads the low push would pass through or over (they would fill the frame as blurred blobs)
    // stay off for the morning.
    const a = THREE.MathUtils.degToRad(AZ);
    const dir = _a.set(Math.sin(a), 0, Math.cos(a));
    this.hidden = [];
    g.beads.forEach((b, i) => {
      if (i === 0) return;
      const along = b.c.x * dir.x + b.c.z * dir.z;
      const across = Math.abs(b.c.x * dir.z - b.c.z * dir.x);
      if (along > 6 && along < 48 && across < 5 + b.r) {
        g.setBeadInstance(i, null);
        this.hidden.push(i);
      }
    });
    g.glass.on = 0;
    g.portalM = null;
    g.focusBlur = null;
    g.mirror = 0;
    g.skin = 0;
    // Everything the morning will draw is compiled now, in the black before the first light (the
    // merge's sphere trace would otherwise first compile at the tear's contact).
    g.warmUp(this.intro.renderer);
    this.step(0);
  }

  // ------------------------------------------------------------------------------- frame
  // One step of the morning: t is the intro's clock (the morning's own), already advanced.
  step(real) {
    const t = this.intro.t;
    const g = this.garden;
    this.timeScale = this.scaleAt(t);
    const w = this.worldAt(t);
    const dw = Math.max(w - (this.world ?? w), 0);
    this.world = w;
    // Shaders run on world time: the salt's curls and the dust stand still at 1/500.
    g.update(dw);
    this.stepFigure(t);
    this.stepTear(t, w);
    this.stepCamera(t, real);
    this.stepLook(t);
    this.stepLoupe(t, real);
    this.stepVeil(t, real);
    if (t >= M.end) this.done = true;
  }

  // The grade of the light: exposure, the far layer, the leaf's sheen, depth of field, the shade.
  stepLook(t) {
    const g = this.garden;
    const up = smooth(M.rise, M.loupeIn, t); // the rise toward the hub's own settings
    // Dawn brightens as the image opens; the low views a little darker than the hub (they look
    // into the sky). Through the rise the pale blade fills the frame: the exposure holds, and comes
    // up to the hub's only as the dark ground round the leaf comes into view (the hub's exposure is
    // balanced for that ground), so the light never flares on the way up.
    const expoUp = smooth(M.loupeIn, M.end - 0.4, t);
    const low = 0.66 + 0.1 * smooth(M.reveal, 8, t);
    g.expo = low * (1 - expoUp) + 1.22 * expoUp;
    g.farGain = 0.8 + (0.37 - 0.8) * up;
    // A firmer curve for the low views (dawn light across the leaf has depth), held through the
    // rise; the hub's own once the hub's frame is nearly there.
    const lu = this.intro.look?.lens?.uniforms;
    if (lu) lu.uContrast.value = 0.36 + (0.32 - 0.36) * up + (0.24 - 0.32) * smooth(M.loupeIn + 1, M.end - 0.3, t);
    // The silver sheen of the hairs builds at grazing angles: let in only once the view is steep.
    g.u.uGraze.value = 0.1 + 0.9 * smooth(M.rise + 3, M.rise + 5.5, t);
    g.u.uYard.value = 1 - smooth(M.rise + 2.5, M.loupeIn + 1.5, t);
    // The child leans in: the sky dims (15% at most) and the top of the frame darkens; then, as we
    // come up into their gaze, they lean in close over the leaf and the sky dims by 15%, a visible
    // step before the glass arrives.
    g.skyOcc = 0.55 * smooth(M.lean + 0.5, M.enter, t) * (1 - smooth(M.settle, M.rise + 1, t)) + smooth(M.rise + 3, M.loupeIn + 0.6, t);
    g.shadeTop = 0.94 * smooth(M.lean + 0.9, M.enter, t) * (1 - smooth(M.settle + 0.5, M.rise + 1.5, t));
    // Depth of field: a macro lens's, focused on the bead; it closes as the camera rises (from
    // overhead the leaf lies all at one depth, as in the hub).
    const camD = this.cam.d;
    // (Wider while the camera is farther out, so the far margin and its teeth melt as they do close
    // in: the look holds through the push.)
    g.dof.A = 1.6 * clamp(Math.sqrt(camD / 13), 1, 1.7) * (1 - smooth(M.rise + 1.0, M.loupeIn - 0.4, t));
    g.dof.focus = Math.max(camD - this.beadR * 0.35, 1);
    // Keep a slab as deep as the bead sharp: the subject, never softened.
    g.dof.slab = Math.abs(1 / Math.max(camD - this.beadR, 0.5) - 1 / g.dof.focus);
    g.dof.maxR1080 = 90;
    g.leafPupil = g.dof.A > 0 ? 0 : null;
    // The far layer: a wide aperture's blur in the low views, the hub's own as the camera rises.
    const hubSigma = (g.coc(this.camHeight() + 35) * 2.2) / 2.4 + 1.2 * (g.size.y / 1080);
    g.farSigma1080 = 30 * (1 - up) + (hubSigma * 1080) / g.size.y * up;
    // Salt: none until the tear; then curling hard, settling to the hub's half strength.
    g.schlieren = t < M.contact ? 0 : 1.0 * smooth(M.contact, M.normal, t) * (1 - 0.5 * smooth(M.normal + 1, M.end, t));
  }

  camHeight() {
    return this.garden.camera.position.y - this.bead.y;
  }

  // The child on the step (sharp in the bead, a soft shape in the bokeh).
  stepFigure(t) {
    const f = this.figure;
    const u = this.garden.u;
    const wipe = smooth(M.wipe, M.wipe + 1.7, t);
    const lean = smooth(M.lean, M.lean + 2.8, t);
    // Breathing: a slow rise and fall of the shoulders; the sob, two catches.
    let sob = 0.12 * Math.sin((t * Math.PI * 2) / 3.2) * (1 - lean);
    const s = t - M.sob;
    if (s > 0 && s < 1.0) sob += Math.sin(Math.PI * clamp(s / 0.45, 0, 1)) * 0.9 + Math.sin(Math.PI * clamp((s - 0.45) / 0.5, 0, 1)) * 0.6;
    const w = this.weights;
    w.hug = (1 - wipe) * (1 - lean);
    w.wipe = wipe * (1 - lean);
    w.lean = lean;
    f.pose(w, sob);
    // Brass in the lap catches the sky as the shoulders shake.
    f.glint = Math.max(0, Math.sin(Math.PI * clamp((t - M.sob - 0.2) / 0.7, 0, 1))) * 0.9;
    // Leaning over the leaf: the child turns toward it and comes over it, out of the bead's sight.
    f.root.copy(SIT_ROOT).lerp(LEAN_ROOT, lean);
    f.facing = Math.PI - (Math.PI / 2) * lean;
    f.apply();
    // The sitting figure has gone from the drops before the leaning one comes in over the leaf (two
    // figures never share the drop).
    u.uSit.value = 1 - smooth(M.lean + 1.5, M.lean + 2.5, t);
    // Over the leaf the child is the hub's silhouette: head and shoulders over the bead.
    u.uChild.value = smooth(M.lean + 2.5, M.enter + 0.6, t);
  }

  // The tear: the fall (world time), the neck, the ringing, the satellite.
  stepTear(t, w) {
    const g = this.garden;
    const tau = w - this.wContact; // world seconds from contact
    const top = PRE.c.y + PRE.r;
    if (tau < 0) {
      // Falling: released 120 mm above, under gravity (the last 25 mm are in the frame).
      g.setTearBead(PRE.c, PRE.r);
      this.bead.copy(PRE.c);
      this.beadR = PRE.r;
      const since = tau + T_FALL; // world seconds since release
      if (since > 0) {
        const h = V_IMPACT * -tau - 0.5 * G * tau * tau;
        g.setFall(_v.set(0.18, top + TEAR_R + h, 0.12), TEAR_R);
        // Backlit: its rim glows, so it reads as a bright point against the dark above.
        if (!this.fallRim) g.setRim(g.fallIndex, 1.8), g.setRim(g.fallIndex + 1, 1.8), (this.fallRim = true);
      } else g.setFall(null);
      g.setMerge(null);
      g.setSatellite(null);
      return;
    }
    g.setFall(null);
    // The merged bead: radius from the volumes, resting a little higher on its hairs.
    const Rm = Math.cbrt(PRE.r ** 3 + TEAR_R ** 3);
    const Cm = _c.set(0, PRE.c.y + (Rm - PRE.r), 0);
    const u = clamp(tau / NECK, 0, 1);
    // The neck: the tear sinks into the bead as it is swallowed; volume is kept between them.
    const sink = smoother(u);
    const rT = TEAR_R * Math.cbrt(Math.max(1 - 0.92 * sink, 0.02));
    const rB = Math.cbrt(Math.max(Rm ** 3 - rT ** 3, PRE.r ** 3));
    const cB = _b.copy(PRE.c).lerp(Cm, sink);
    const cT = _a.set(0.18 * (1 - sink), top + TEAR_R - (TEAR_R + rT * 0.4) * sink * 1.15 + (Rm - PRE.r) * sink, 0.12 * (1 - sink));
    const k = TEAR_R * (0.06 + 1.1 * Math.sqrt(u));
    // Ringing: world time since the end of the neck, let down as time returns to normal.
    const tr = Math.max(tau - NECK * 0.8, 0);
    const let_ = 1 - smooth(0.1, 0.33, this.timeScale);
    const a2 = RING.a2 * Math.exp(-tr / RING.tau2) * Math.cos(RING.w2 * tr) * let_;
    const a3 = RING.a3 * Math.exp(-tr / RING.tau3) * Math.cos(RING.w3 * tr + 0.6) * let_;
    const blend = smooth(0.7, 1.0, u);
    const ringing = Math.abs(a2) + Math.abs(a3) > 0.002 || blend < 1;
    this.bead.copy(Cm);
    this.beadR = Rm;
    if (ringing) {
      g.setTearBead(null);
      const md = this.mergeDesc;
      md.bead.set(cB.x, cB.y, cB.z, rB);
      md.tear.set(cT.x, cT.y, cT.z, rT);
      md.k = k;
      md.merged.set(Cm.x, Cm.y, Cm.z, Rm);
      md.ring.set(a2, a3, blend);
      g.setMerge(md);
    } else {
      g.setMerge(null);
      g.setTearBead(Cm, Rm);
    }
    // The satellite: pinched off the top of the neck as the first stretch recoils (it grows out of
    // the surface, then parts from it), hops and falls back in.
    const s0 = M.hold + 0.25, s1 = M.ring + 0.55;
    if (t > s0 && t < s1) {
      const p = (t - s0) / (s1 - s0);
      const pinch = smooth(0, 0.14, p);
      const rs = 0.15 * pinch;
      const top = Cm.y + Rm * (1 + a2 + a3);
      const hop = 4 * p * (1 - p) * 1.7;
      g.setSatellite(_v.set(0.25 * p, top + rs * (2 * pinch - 1) + hop, 0.1 * p), Math.max(rs, 0.004));
    } else g.setSatellite(null);
  }

  // The camera: shot 1's low push, shot 2's tilt up and back, shot 3's spiral rise to the eye.
  stepCamera(t, real) {
    const g = this.garden;
    const c = this.cam;
    if (this.reducedMotion) this.reducedPose(t);
    else if (t < M.back) {
      // Shot 1: 42 -> 21 mm by 0:10 (the bead a quarter of the frame), on to 11 mm, lowering from 9 to 4
      // degrees, drifting 4.
      const u = smoother((t - M.reveal) / (M.pushEnd - M.reveal));
      c.d = logLerp(CAM.start.d, CAM.near.d, u);
      c.el = CAM.start.el + (CAM.near.el - CAM.start.el) * u;
      c.az = CAM.start.az + (CAM.near.az - CAM.start.az) * u;
      c.lookUp = 0;
    } else if (t < M.rise) {
      // Shot 2: ease back to 30 mm and tilt up into the space above the bead; settle back down.
      const u = smoother((t - M.back) / 2.6);
      const v = smoother((t - M.settle) / (M.rise - M.settle));
      c.d = logLerp(CAM.near.d, CAM.back.d, u);
      c.el = CAM.near.el + (CAM.back.el - CAM.near.el) * u + (CAM.rise.el - CAM.back.el) * v;
      c.az = CAM.near.az;
      c.lookUp = u * (1 - v);
    } else {
      // Shot 3: up the tear's path, 180 degrees round, to straight above (the child's eyes).
      const u = smoother((t - M.rise) / (M.end - M.rise));
      c.d = logLerp(CAM.rise.d, CAM.top.d, u);
      c.el = CAM.rise.el + (CAM.top.el - CAM.rise.el) * u;
      c.az = CAM.near.az + 180 * u;
      c.lookUp = 0;
    }
    // Mouse parallax from 0:05, up to 3 degrees, eased; it fades as the hub takes over.
    const p = this.intro.t >= M.parallax ? this.intro.cursor : _zero;
    this.parallax.lerp(p, ease(real, 0.5));
    const pk = 3 * (1 - smooth(M.loupeIn, M.end, t));
    const el = clamp(c.el + pk * this.parallax.y, -10, 90) * D2R;
    const az = (c.az - pk * this.parallax.x) * D2R;
    const C = this.bead;
    const cam = g.camera;
    const ce = Math.cos(el);
    cam.position.set(C.x + c.d * ce * Math.sin(az), C.y + c.d * Math.sin(el), C.z + c.d * ce * Math.cos(az));
    // Up: the world's, turning to +z (the top of the frame away from the child) once the view
    // passes 60 degrees, as in the hub.
    const tu = smooth(60, 88, c.el);
    c.up.set(0, 1 - tu, tu).normalize();
    cam.up.copy(c.up);
    // The tilt up: the target rises 4 mm above the bead (and 1.2 back). In the low views the bead sits
    // a little below the middle of the frame, for headroom: the doorway's glow and the soft figure
    // in it at the top of the frame.
    const head = c.d * HEADROOM * (1 - smooth(M.rise, M.rise + 2.5, t));
    c.look.copy(C).add(_a.set(0, 4.0 * c.lookUp + head, -1.2 * c.lookUp));
    cam.lookAt(c.look);
    cam.updateMatrixWorld();
    g.focus = Math.max(c.d - this.beadR, 0.5);
  }

  // Reduced motion: no push and no rise; each framing holds, joined by crossfades.
  reducedPose(t) {
    const c = this.cam;
    const stage = t < 10 ? 0 : t < M.back ? 1 : t < M.settle + 0.5 ? 2 : t < M.rise + 1 ? 3 : 4;
    const P = RM_POSES;
    // A new framing: keep this frame (as it is drawn now) to crossfade from, and cut on the next.
    if (this.rmStage === undefined) this.rmStage = stage;
    else if (stage !== this.rmStage && this.rmPending == null) {
      this.intro.veil.capture();
      this.rmPending = stage;
    } else if (this.rmPending != null) {
      this.rmStage = this.rmPending;
      this.rmPending = null;
    }
    Object.assign(c, P[this.rmStage]);
  }

  // Shot 3: the loupe slides in from the bottom edge, held by the fingertips, and settles over the
  // bead as in the hub's own arrival (the same path), so the last frame is the hub's first.
  stepLoupe(t) {
    const g = this.garden;
    const h = this.intro.hub;
    const s = smoother((t - M.loupeIn) / (M.loupeSettle - M.loupeIn));
    g.loupeOn = t >= M.loupeIn - 0.05;
    g.glint = clamp((t - M.glint) / 1.0, 0, 1);
    g.portalM = null;
    g.focusBlur = null;
    g.glass.on = 0;
    g.midSigma = 0;
    if (!g.loupeOn) return;
    const from = _a.set(-14, 34, -112);
    const via = _b.set(-6, 20, -38);
    const to = _c.set(0, 23, 0);
    _d.copy(from).multiplyScalar((1 - s) * (1 - s)).addScaledVector(via, 2 * s * (1 - s)).addScaledVector(to, s * s);
    _d.y += Math.sin(clamp((t - (M.loupeSettle - 0.4)) / 0.9, 0, 1) * Math.PI) * 0.8;
    h.loupe.set(_d.x, 0, _d.z);
    h.d = _d.y;
    h.dGoal = 23;
    h.tremor = (h.tremor ?? 0) + 1 / 60;
    g.loupePos.set(_d.x, this.bead.y + _d.y, _d.z);
    // The focus pulls onto the glass as it arrives (its engraving reads as it glints), then back
    // through it to the bead.
    const zBead = this.camHeight() - this.beadR;
    const zLoupe = g.camera.position.distanceTo(g.loupePos);
    const pull = smooth(M.loupeIn + 0.35, M.loupeIn + 1.0, t) * (1 - smooth(M.loupeSettle + 0.25, M.end - 0.05, t));
    g.focus = zBead + (zLoupe - zBead) * pull;
  }

  // Shot 0's veil: black, the dawn gradient, the point of light on the bead's highlight; then the
  // image opens round it. Reduced motion's crossfades let down here.
  stepVeil(t, real) {
    const v = this.intro.veil.uniforms;
    v.uGrad.value = smooth(M.gradient, 2.6, t);
    v.uPoint.value = smooth(M.point, 3.3, t) * (1 - smooth(4.6, 6.0, t));
    v.uReveal.value = smoother((t - M.reveal) / 1.9);
    v.uFlash.value = 0;
    v.uHold.value = Math.max(0, v.uHold.value - real / 1.0);
    // The point sits on the bead's brightest highlight: where its skin mirrors the sky just above
    // the glow, as seen from the first camera.
    const g = this.garden;
    const cam = g.camera;
    const W = _a.copy(g.u.uGlowDir.value).add(_b.set(0, 0.42, 0)).normalize();
    const V = _b.copy(cam.position).sub(this.bead).normalize();
    const N = V.add(W).normalize();
    const p = g.toScreen(_c.copy(this.bead).addScaledVector(N, this.beadR));
    v.uPointPos.value.set(p.x / g.size.x, p.y / g.size.y);
    // The low view's own mean tone (measured), which the dawn gradient settles to as the image opens.
    v.uFarTone.value.set(0.6, 0.63, 0.6);
  }

  // Leaves the Garden as the hub expects it: the merged bead, no yard, the hub's grade.
  end() {
    const g = this.garden;
    if (!g || this.done && this.ended) return;
    this.ended = true;
    for (const i of this.hidden ?? []) g.setBeadInstance(i, g.beads[i].c, g.beads[i].r);
    this.hidden = [];
    const lu = this.intro.look?.lens?.uniforms;
    if (lu) lu.uContrast.value = 0.24;
    g.setMorning(false);
    g.setTearBead(_c.set(0, PRE.c.y + (Math.cbrt(PRE.r ** 3 + TEAR_R ** 3) - PRE.r), 0), Math.cbrt(PRE.r ** 3 + TEAR_R ** 3));
    g.setFall(null);
    g.setSatellite(null);
    g.setMerge(null);
    g.dof.A = 0;
    g.shadeTop = 0;
    g.farSigma1080 = null;
    g.farGain = 0.37;
    g.leafPupil = null;
    g.u.uGraze.value = 1;
    g.u.uYard.value = 0;
    g.u.uSit.value = 0;
    g.u.uChild.value = 1;
    g.schlieren = 0.5;
    g.camera.up.set(0, 0, 1);
    this.timeScale = 1;
    this.done = true;
  }

  dispose() {}
}

const _zero = new THREE.Vector2();
const _v = new THREE.Vector3();
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _d = new THREE.Vector3();

// The notebook's first page: plays The First Morning in the game's own composer, then leaves the
// player in the hub with the lens in hand: the run select for the next morning. Takes what the Intro
// takes (story §6.1), plus:
//   onHub(intro)          the hub has taken over (the morning ended, or was skipped);
//   onDive(source, intro) the player dives from the hub; return true to run the dive yourself (the
//                         hub holds until you call intro.finish());
//   replay (true)         otherwise the dive is the 3 s replay dive (story §5.3): straight into the
//                         game at the crossing, never the first launch's MicroIntro scenes (the walled
//                         hero, the salt front, shot 6: the lineage's cell is already soft);
//   autoDive (false)      the glass waits in the hub for the player;
//   audio                 the first launch's IntroAudio, if it still plays (its tide): it gives way.
// Returns the Intro, which the game loop drives while `intro.active`. Call it from the page's click
// (or key) handler: it starts at once, with no pre-roll, and the sound starts inside that gesture.
export function playFirstMorning(deps) {
  return new Intro({ preroll: false, autoDive: false, replay: true, ...deps, Morning });
}
