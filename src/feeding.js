import * as THREE from 'three';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { organicMaterial, tokenMaterial, capsuleSd, flowPoint, mulberry32, MAX_DENTS, DENT_GAP, DENT_RIM } from './materials.js';
import { METABOLITE } from './palette.js';

// Food, oxygen and endocytosis.
//
// Glucose: patches of tiny pale champagne motes in the water (the metabolism's glucose bead: one
// molecule, one colour, outside the cell and in), drifting with the drop's currents and recycled
// around the hero. A mote that comes within 0.12 µm of the outer membrane slips through a
// porin and is drawn to a PTS transporter in the inner membrane, where the metabolism takes it
// (uptakeGlucose). Uptake is limited to about one glucose a second (the transporters are the
// bottleneck) and scales with the local concentration. Each mote stands for many molecules, like
// the metabolism's beads. The water round the cell holds as many motes as the patch model says:
// where the cell has emptied it, motes diffuse back in from the patch's far side. The
// chemoreceptors at the front pole flash when the sugar rises.
//
// Oxygen comes from the drop's surface: 1 at y >= 0, falling to ~0 by y = -30 µm.
//
// Food particles: coral protein clumps (digested to amino acids) and champagne glycogen fragments
// (digested to glucose), soft opaque lumps drifting in the water. Real E. coli can't eat them; this
// wall-less cell has evolved endocytosis. Press R with one within 0.6 µm of the membrane:
//   approach (0.6 s): the particle is drawn onto the membrane, to a pole's shoulder, and presses a
//     dimple into it;
//   invagination (1.4 s): the membrane sinks into a pocket round it (hero.setDent): a round cup
//     whose floor follows the particle's sphere at a small gap (materials.js), the particle sinking
//     to its bottom;
//   seal (0.4 s): the neck of the pocket narrows and closes over the particle (pinch -> 1) while it
//     is drawn on in, leaving it in a sealed bubble with its own double film;
//   pinch-off: the bubble becomes a free vesicle (hero.volume.vesicles, the same double film turned
//     inside out; its outer film is the bubble's), and where the neck closed the surface quivers in
//     a few damped dips;
//   transport (1.5 s) inward, to open cytoplasm on the side the player looks from;
//   digestion (3 s): the particle brightens and, each time a monomer leaves it
//     (metabolism.deliver), steps smaller and turns toward the colour of what it is broken into;
//   then the emptied vesicle goes back to the envelope (its membrane is recycled) and fades.
// Two at a time at most (the cell has two dent slots and two vesicle slots).
//
// Pockets go on the shoulders of the pole caps: there the cell is long behind the pocket, so a
// pocket half a µm deep has room, where mid-body it would reach the axis and cut the nucleoid.
//
// Everything that happens to the cell happens in its REFERENCE body space, drawn through the flow
// warp (materials.js), so the particle, the pocket and the vesicle always line up.
//
// Sizes: food particles are 0.1-0.128 µm in radius (the spec allowed up to 0.22). A sealed pocket
// is two cup radii and SEAL_BRIDGE deep (0.45-0.51 µm), reaching about the middle of a pole cap;
// a bigger particle would need a pocket that cuts deep into the nucleoid, and its vesicle (as large
// again by its double film) would fill the cytoplasm.
//
// Debug URL switches (for screenshots without a keyboard):
//   ?feed=near          a food particle starts right next to the hero, within reach
//   &feedkind=protein   or glycogen: its kind
//   &feedskip=S         once an engulf starts, jump S seconds into it (shows later stages)
//   &keys=KeyR          (main.js) holds R, so the particle is engulfed at once
//   &feedcam=D          start the camera D µm from the hero (same direction), to judge close up
//   &feedview=x,y,z     ...from this direction in the hero's body space instead (e.g. -0.4,0.8,0.5
//                       looks at the glucose transporters on the upper flank)
//   &feedwarm=S         run the water, glucose, uptake and metabolism for S seconds before the
//                       first frame
//   &oxygen=x           hold the oxygen level at x (0..1), as the metabolism's own switch does, so
//                       the inspect ledger shows the level the cell is running on

const REACH = 0.6; // µm from the outer membrane to the particle's surface
const CAPTURE = 0.12; // a glucose mote this close to the outer membrane is taken in
const DENT_R = 0.17; // the pocket's footprint (µm): DENT_RIM of it is how softly its walls meet the surface
const T_APPROACH = 0.6;
const T_INVAGINATE = 1.4;
const T_SEAL = 0.4;
const T_TRANSPORT = 1.5;
const T_DIGEST = 3.0;
const T_FADE = 0.9;
const T_PINCH = T_APPROACH + T_INVAGINATE + T_SEAL;

// How deep the pocket is: its floor (the bottom of the cup round the particle, which is the
// particle's sphere plus DENT_GAP: radius rc) is D_LAND under the surface when the particle has
// landed; at the end of the invagination the particle's top is OPEN_BRIDGE under it (depth
// 2 rc + OPEN_BRIDGE); and while the neck seals the bubble is drawn on in to SEAL_BRIDGE, where
// its double film comes clear of the envelope's. Measured from the dent field (materials.js
// dentOffset, CellPass dents()) at pinch 1: from a bridge of 0.22 µm the cytoplasm between the
// bubble's inner film and the envelope's is at least 0.014 µm deep (the field below -0.094 on the
// axis), for every particle size and alike on the cylinder and on a pole's shoulder; the surface
// over it is flat again.
const D_LAND = 0.06;
const OPEN_BRIDGE = 0.08;
const SEAL_BRIDGE = 0.22;
// Pinch-off: the sealed bubble shrinks away inside the new vesicle's films over T_HAND (its outer
// film is where the vesicle's is born), then for T_RELAX the surface where the neck closed dips a
// few times, ever less, the first up to RELAX µm deep.
const T_HAND = 0.12;
const T_RELAX = 1.2;
const RELAX = 0.03;

// The vesicle closes round its load: its radius is the particle's plus this. CellPass draws the
// vesicle's inner film 0.045 µm inside its outer one (half-thickness 0.0065), and the particle's
// lumps reach 0.97-0.98 of its radius, so any tighter and the inner membrane would cut them.
const VES_PAD = 0.055;
// A newborn vesicle's radius over its load's: its outer membrane, drawn 0.045 inside, is then just
// where the sealed bubble's was (DENT_GAP off the particle), so the one takes over from the other.
const VES_BORN = DENT_GAP + 0.045;
// The lumen's glow while digesting: a faint blush, so the particle inside stays crisp.
const VES_GLOW = 0.3;

const PATCHES = 4;
const PER_PATCH = 48;
const FOOD = 6;
const BEADS = 24;
const HUG = 0.07; // how far outside the outer membrane a mote glides on its way to a porin
// The first patch: its centre FIRST_OUT µm out from the transporters it lies over and FIRST_UP µm
// upstream of them, FIRST_SIGMA wide.
const FIRST_OUT = 0.5;
const FIRST_UP = 0.3;
const FIRST_SIGMA = 1.2;

// The metabolism's beads (metabolism.js STYLE): [radius up close (µm), smallest size on screen (px),
// brightness]. The monomers leaving a vesicle and the motes coming in through a PTS are drawn to
// match, so where the metabolism's own bead takes over nothing changes size.
const C_BEAD = { glucose: [0.0095, 2.2, 1.1], aminoAcid: [0.0085, 2.8, 1.4] };
// The glucose motes are that bead's colour and value; out in the water, unveiled by the cell's
// films, they are drawn this much brighter so the two read alike (matched on screen).
const MOTE_LIFT = 1.0;

// Protein food is coral, turned off METABOLITE.protein's pink so it never merges with the pinks of
// the plasmid and the vesicle's lumen.
const PROTEIN_FOOD = (() => {
  const c = new THREE.Color(METABOLITE.protein);
  const hsl = c.getHSL({}, THREE.SRGBColorSpace);
  return c.setHSL((hsl.h + 0.11) % 1, hsl.s, hsl.l - 0.03, THREE.SRGBColorSpace);
})();

const POCKET_TITLE = 'Endocytic pocket';
const POCKET_SUB = 'the membrane folds in round the particle · its neck will close and pinch off a vesicle';
const VESICLE_TITLE = 'Endocytic vesicle';
const VESICLE_SUB = 'E. coli can’t do this. The planctomycete Gemmata obscuriglobus takes up proteins in a similar way; here it is a trait this wall-less cell has evolved.';

const params = typeof location !== 'undefined' ? new URLSearchParams(location.search) : new URLSearchParams();
const OXYGEN = params.has('oxygen') ? +params.get('oxygen') : null;

const _v = new THREE.Vector3();
const _w = new THREE.Vector3();
const _p = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _d = new THREE.Vector3();
const _o = new THREE.Vector3();
const _m = new THREE.Matrix4();
const _inv = new THREE.Matrix4();
const _bodyInv = new THREE.Matrix4();
const _c = new THREE.Color();
const UP = new THREE.Vector3(0, 1, 0);
const NO_KEYS = new Set();

const ease = (x) => {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
};
const easeOut = (x) => 1 - (1 - Math.min(Math.max(x, 0), 1)) ** 3;
const smooth = (a, b, x) => ease((x - a) / (b - a));

// ------------------------------------------------------------------------------------- the water
// The drop's slow circulation as a velocity (µm/s): the time derivative of water.js current(), so
// motes and food drift with the water's own particles.
function currentVel(p, t, out) {
  const qx = p.x * 0.19, qy = p.y * 0.19, qz = p.z * 0.19;
  const ex = 0.071 * Math.cos(qy * 1.3 + t * 0.071) - 0.6 * 0.053 * Math.cos(qz * 2.1 - t * 0.053 + 1.7);
  const ey = 0.55 * 0.061 * Math.cos(qz * 1.1 + t * 0.061 + 0.4) - 0.4 * 0.047 * Math.cos(qx * 1.7 - t * 0.047);
  const ez = -0.067 * Math.cos(qx * 1.2 - t * 0.067 + 2.3) + 0.6 * 0.059 * Math.cos(qy * 1.9 + t * 0.059);
  return out.set(0.11 + 1.1 * ex, -0.025 + 1.1 * ey, 0.05 + 1.1 * ez);
}

// A slow wandering offset (Brownian, slowed right down), amplitude ~amp µm.
function wander(seed, t, amp, out) {
  return out.set(
    Math.sin(t * 0.61 + seed * 5.1) + 0.5 * Math.sin(t * 1.43 + seed * 9.7),
    Math.sin(t * 0.53 + seed * 7.3) + 0.5 * Math.sin(t * 1.21 + seed * 3.9),
    Math.sin(t * 0.67 + seed * 2.9) + 0.5 * Math.sin(t * 1.37 + seed * 6.1),
  ).multiplyScalar(amp);
}

// ------------------------------------------------------------------------------------- geometry
// A food particle is one soft body: a smooth union of balls polygonised once with marching cubes,
// with a fine lumpiness on top, normalised to a bounding radius of 1. A particle is ~70 px across
// at the closest view, so a grid of 36 cells keeps every facet to a couple of pixels.
const _dummy = new THREE.MeshBasicMaterial();
function bakeBlob(balls, { blend, lump, freq, res = 36 }) {
  const S = 1.3;
  const mc = new MarchingCubes(res, _dummy, false, false, 40000);
  mc.isolation = 0;
  const step = (2 * S) / res;
  const nb = balls.length;
  for (let k = 0; k < res; k++) {
    const z = (k - res / 2) * step;
    for (let j = 0; j < res; j++) {
      const y = (j - res / 2) * step;
      for (let i = 0; i < res; i++) {
        const x = (i - res / 2) * step;
        let d = Infinity;
        for (let q = 0; q < nb; q++) {
          const b = balls[q];
          const e = Math.sqrt((x - b.x) ** 2 + (y - b.y) ** 2 + (z - b.z) ** 2) - b.r;
          if (d === Infinity) d = e;
          else {
            const h = Math.max(blend - Math.abs(d - e), 0) / blend;
            d = Math.min(d, e) - h * h * blend * 0.25;
          }
        }
        d += lump * Math.sin(x * freq + 1.3) * Math.sin(y * freq * 1.17 + 0.4) * Math.sin(z * freq * 0.89 + 2.2);
        mc.field[i + j * res + k * res * res] = -d;
      }
    }
  }
  mc.update();
  const n = mc.count;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
  let rMax = 0;
  for (let i = 0; i < n * 3; i += 3) {
    pos[i] = S * mc.positionArray[i];
    pos[i + 1] = S * mc.positionArray[i + 1];
    pos[i + 2] = S * mc.positionArray[i + 2];
    rMax = Math.max(rMax, Math.hypot(pos[i], pos[i + 1], pos[i + 2]));
    _v.set(mc.normalArray[i], mc.normalArray[i + 1], mc.normalArray[i + 2]).normalize();
    nor[i] = _v.x;
    nor[i + 1] = _v.y;
    nor[i + 2] = _v.z;
  }
  for (let i = 0; i < pos.length; i++) pos[i] /= rMax;
  mc.geometry.dispose();
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  return mergeVertices(g, 1e-6);
}

// A clump of denatured protein: globules stuck together where they touched, melted into one lumpy
// body with a fine bumpy skin (each bump a protein or two).
function proteinGeo(seed) {
  const rng = mulberry32(seed);
  const balls = [{ x: 0, y: 0, z: 0, r: 0.42 }];
  const count = 9 + Math.floor(rng() * 4);
  for (let tries = 0; balls.length < count && tries < 400; tries++) {
    const b = balls[Math.floor(rng() * balls.length)];
    const r = 0.2 + rng() * 0.18;
    _v.set(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize().multiplyScalar((b.r + r) * 0.72);
    const c = { x: b.x + _v.x, y: b.y + _v.y, z: b.z + _v.z, r };
    if (Math.hypot(c.x, c.y, c.z) + r > 1.05) continue;
    balls.push(c);
  }
  return bakeBlob(balls, { blend: 0.16, lump: 0.028, freq: 13, res: 34 });
}

// A glycogen fragment: a rosette of beta-particles (each ~20-30 nm of branched glucose chains)
// packed round a core, a little cauliflower whose beads stay distinct.
function glycogenGeo(seed) {
  const rng = mulberry32(seed);
  const balls = [{ x: 0, y: 0, z: 0, r: 0.4 }];
  const outer = 18 + Math.floor(rng() * 6);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < outer; i++) {
    const y = 1 - (2 * (i + 0.5)) / outer;
    const rr = Math.sqrt(1 - y * y);
    const a = i * golden + rng() * 0.5;
    const d = 0.62 + rng() * 0.1;
    const r = 0.22 + rng() * 0.07;
    // a fragment, not a whole granule: shave off one side
    if (y * 0.6 + rr * Math.cos(a) * 0.8 > 0.92 && rng() < 0.7) continue;
    balls.push({ x: Math.cos(a) * rr * d, y: y * d * 0.9, z: Math.sin(a) * rr * d, r });
  }
  return bakeBlob(balls, { blend: 0.045, lump: 0.012, freq: 21, res: 38 });
}

// ------------------------------------------------------------------------------------- the cell's surface
// The nearest point of the reference capsule (radius 0.5) to p, and the outward normal there.
function onSurface(p, pos, normal) {
  const z = THREE.MathUtils.clamp(p.z, -0.5, 0.5);
  normal.set(p.x, p.y, p.z - z);
  if (normal.lengthSq() < 1e-10) normal.set(1, 0, 0);
  normal.normalize();
  return pos.set(0, 0, z).addScaledVector(normal, 0.5);
}

// Where pockets may go: points round the reference capsule with their normals, on the cylinder and
// on both caps (tilt: how far the normal leans from the side toward the pole).
const SITES = [];
for (let k = 0; k < 24; k++) {
  const a = (k / 24) * Math.PI * 2;
  const ca = Math.cos(a), sa = Math.sin(a);
  for (const z of [-0.4, -0.2, 0, 0.2, 0.4]) SITES.push({ n: new THREE.Vector3(ca, sa, 0), p: new THREE.Vector3(0.5 * ca, 0.5 * sa, z), tilt: 0 });
  for (const end of [-1, 1]) {
    for (const deg of [15, 30, 40, 50, 60, 70]) {
      const t = (deg * Math.PI) / 180;
      const n = new THREE.Vector3(ca * Math.cos(t), sa * Math.cos(t), end * Math.sin(t));
      SITES.push({ n, p: new THREE.Vector3(0, 0, 0.5 * end).addScaledVector(n, 0.5), tilt: deg });
    }
  }
}

// Distance from point c to the line through a and b (squared), and where along it (0 at a, 1 at b).
function lineDist2(a, b, c, out) {
  _d.subVectors(b, a);
  const L2 = Math.max(_d.lengthSq(), 1e-9);
  const t = ((c.x - a.x) * _d.x + (c.y - a.y) * _d.y + (c.z - a.z) * _d.z) / L2;
  const x = a.x + _d.x * t - c.x, y = a.y + _d.y * t - c.y, z = a.z + _d.z * t - c.z;
  out.t = t;
  return x * x + y * y + z * z;
}
const _line = { t: 0 };

// Where a vesicle may be digested: points through the cytoplasm (rings round the axis, slice by
// slice), tested against the cell's contents when the spot is picked.
const SPOTS = (() => {
  const out = [];
  for (let z = -0.75; z <= 0.751; z += 0.05) {
    out.push(0, 0, z);
    for (const rr of [0.06, 0.12, 0.18]) for (let k = 0; k < 12; k++) out.push(Math.cos((k / 12) * Math.PI * 2) * rr, Math.sin((k / 12) * Math.PI * 2) * rr, z);
  }
  return new Float32Array(out);
})();

// ------------------------------------------------------------------------------------- Feeding
export class Feeding {
  constructor(scene, hero, metabolism, camera) {
    this.scene = scene;
    this.hero = hero;
    this.metabolism = metabolism;
    this.camera = camera;
    this.rng = mulberry32(917);
    this.time = 0;
    this.state = { glucose: 0, oxygen: 1, engulfing: false, prompt: null, promptAnchor: null, engulfCount: 0, phase: null };
    this.anchors = [];
    this.engulfs = new Array(MAX_DENTS).fill(null);
    this.cooldown = 0;
    this.tokens = 0.6;
    this.conc = 0;
    this.concRate = 0;
    this.receptorWait = 0;
    this.refillWait = 0;
    this.backlog = []; // monomers the metabolism has not taken yet and no bead was free to show
    this.backlogWait = 0;
    this.lost = 0;
    this.skip = +(params.get('feedskip') || 0);
    this.warm = +(params.get('feedwarm') || 0);
    this.camRef = new THREE.Vector3(); // the camera in the hero's reference space
    this.camDir = new THREE.Vector3(1, 0, 0); // ...as a direction from the cell's centre
    this.px = 0.0085; // µm per pixel at the hero's distance

    // The metabolism's own colours for the beads Feeding hands over (its legend rows are its beads').
    const legend = (key, hex) => new THREE.Color(metabolism?.legend?.find?.((x) => x.key === key)?.color ?? hex);
    this.cGlucose = legend('glucose', METABOLITE.glucose);
    this.cAmino = legend('aminoAcid', METABOLITE.aminoAcid);
    // What a digesting particle turns toward: amino-acid green, glucose's champagne.
    this.cDigest = { protein: new THREE.Color(METABOLITE.aminoAcid), glycogen: this.cGlucose };

    hero.group.updateWorldMatrix(true, true);
    if (params.get('feedcam')) {
      const d = +params.get('feedcam');
      const g = hero.group.position;
      camera.position.sub(g);
      if (params.get('feedview')) camera.position.set(...params.get('feedview').split(',').map(Number)).transformDirection(hero.body.matrixWorld);
      camera.position.setLength(d).add(g);
      camera.lookAt(g);
    }
    this.syncCamera();
    // Every mesh Feeding draws (the motes, the food, the monomers leaving a vesicle) lives in this one
    // group, in world space, so it can be hidden and shown as one (the opening does).
    this.group = new THREE.Group();
    this.group.name = 'feeding';
    scene.add(this.group);
    this.buildGlucose();
    this.buildFood();
    this.buildBeads();

    this.promptAnchor = new THREE.Object3D();
    scene.add(this.promptAnchor);

    // Inspect tags. Their objects are hidden (visible = false) while there is nothing to show.
    const tag = (key, title, sub, obj, angle, len, interior = false) => {
      obj.visible = false;
      const a = { key, title, sub, obj, angle, len, interior };
      this.anchors.push(a);
      return a;
    };
    this.vesicleAnchor = tag('vesicle', POCKET_TITLE, POCKET_SUB, new THREE.Object3D(), -35, 110, true);
    this.vesicleTag = this.vesicleAnchor.obj;
    hero.body.add(this.vesicleTag);
    this.glucoseTag = tag('glucose', 'Glucose', 'a patch of sugar in the water · taken in by the PTS, one at a time', new THREE.Object3D(), -140, 70).obj;
    this.proteinTag = tag('protein', 'Protein clump', 'food · R to engulf · digested to amino acids', new THREE.Object3D(), 35, 70).obj;
    this.glycogenTag = tag('glycogenFood', 'Glycogen fragment', 'food · R to engulf · digested to glucose', new THREE.Object3D(), 145, 70).obj;
    for (const o of [this.glucoseTag, this.proteinTag, this.glycogenTag]) scene.add(o);
    this.glucoseTagMote = -1;
  }

  // The camera in the hero's reference space, and how many µm a pixel spans at the hero.
  syncCamera() {
    const hero = this.hero;
    hero.body.updateWorldMatrix(true, false);
    _inv.copy(hero.body.matrixWorld).invert();
    this.camRef.copy(this.camera.position).applyMatrix4(_inv);
    this.camDir.copy(this.camRef).normalize();
    const cam = this.camera;
    const h = typeof innerHeight !== 'undefined' ? innerHeight * Math.min(typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1, 2) : 540;
    const angle = this.metabolism?.pxAngle ?? (2 * Math.tan(((cam.fov ?? 42) * Math.PI) / 360)) / Math.max(h, 1);
    hero.body.getWorldPosition(_v);
    this.px = (angle * cam.position.distanceTo(_v)) / (hero.group.scale.x || 1);
  }

  // ----------------------------------------------------------------------------------- glucose
  buildGlucose() {
    const n = PATCHES * PER_PATCH;
    const geo = new THREE.IcosahedronGeometry(1, 2);
    this.motes = new THREE.InstancedMesh(geo, tokenMaterial({ shape: this.hero.shape }), n);
    this.motes.frustumCulled = false;
    // nothing is drawn until the first update places the motes (an instance starts as a 1 µm ball at
    // the origin)
    _m.makeScale(0, 0, 0);
    for (let i = 0; i < n; i++) this.motes.setMatrixAt(i, _m);
    this.group.add(this.motes);
    this.mBase = new Float32Array(n * 3); // where the current has carried it (world)
    this.mPos = new Float32Array(n * 3); // where it is drawn on its way in (world)
    this.mSeed = new Float32Array(n);
    this.mSize = new Float32Array(n);
    this.mTone = new Float32Array(n);
    this.mFade = new Float32Array(n); // 0..1 grows in after a patch is moved
    this.mU = new Float32Array(n); // how far along its way in (0..1)
    this.mGlide = new Float32Array(n); // ...and where the glide round the outside ends
    this.mLit = new Uint8Array(n); // its colour is not its own (brightened on the way in)
    // 0 gone, 1 in the water, 2 on its way in, 3 leaving the far edge of its patch to diffuse in
    this.mAlive = new Uint8Array(n);
    this.taken = []; // motes on their way to a transporter
    this.takenPool = [];
    // A mote is the metabolism's glucose bead out in the water: its colour (the legend's) at its
    // brightness, MOTE_LIFT more to make up for the water's veil over it
    this.sugar = this.cGlucose.clone().multiplyScalar(C_BEAD.glucose[2] * MOTE_LIFT);
    for (let i = 0; i < n; i++) {
      this.mSeed[i] = this.rng() * 100;
      this.mSize[i] = 0.014 + this.rng() * 0.005;
      // a little spread in tone so the patch has life, never in hue
      this.mTone[i] = 0.92 + this.rng() * 0.22;
      this.motes.setColorAt(i, _c.copy(this.sugar).multiplyScalar(this.mTone[i]));
    }
    this.patches = Array.from({ length: PATCHES }, (_, k) => ({ k, c: new THREE.Vector3(), sigma: 2, axis: new THREE.Vector3(1, 0, 0), n0: PER_PATCH, alive: 0 }));
    // Start in sugar: one patch round the hero, the others a little way off. The first lies over the
    // glucose transporters that face the camera most, a little upstream of them (the drop's current
    // carries it on across the cell), so its nearest motes are a few tenths of a µm off the membrane
    // there: the first is taken in within about two seconds of the start, and the energy route
    // lights up at once.
    const g = this.hero.group.position;
    const body = this.hero.body;
    const toCam = _w.copy(this.camera.position).sub(g).normalize();
    let at = null, facing = -Infinity;
    for (const s of this.hero.sites?.pts ?? []) {
      const face = _v.copy(s.normal).transformDirection(body.matrixWorld).dot(toCam);
      if (face > facing) {
        facing = face;
        at = s;
      }
    }
    if (at) {
      _d.copy(at.normal).transformDirection(body.matrixWorld);
      _p.copy(at.pos).applyMatrix4(body.matrixWorld).addScaledVector(_d, FIRST_OUT);
      _p.addScaledVector(currentVel(_p, 0, _v).normalize(), -FIRST_UP);
    } else {
      const side = _v.crossVectors(UP, _w.setY(0).normalize()).normalize();
      _p.copy(g).addScaledVector(side, -0.9).addScaledVector(_w, -0.8).add(_s.set(0, -0.2, 0));
    }
    this.placePatch(this.patches[0], _p, FIRST_SIGMA, true);
    for (let k = 1; k < PATCHES; k++) this.placePatch(this.patches[k], this.aroundHero(6, 12, _p), 1.3 + this.rng() * 0.7, true);
    this.motes.instanceColor.needsUpdate = true;
  }

  // A point dist0..dist1 µm from the hero, ahead of it more often than behind.
  aroundHero(dist0, dist1, out) {
    const g = this.hero.group;
    const fwd = _w.set(0, 0, 1).applyQuaternion(g.quaternion);
    _v.set(this.rng() - 0.5, (this.rng() - 0.5) * 0.6, this.rng() - 0.5).normalize().addScaledVector(fwd, 0.6).normalize();
    return out.copy(g.position).addScaledVector(_v, dist0 + this.rng() * (dist1 - dist0));
  }

  // Seed a patch's motes round centre. Motes already on their way into the cell finish their way.
  placePatch(patch, centre, sigma, now = false) {
    patch.c.copy(centre);
    patch.sigma = sigma;
    // a plume drawn out by the current, not a ball
    patch.axis.set(this.rng() - 0.5, (this.rng() - 0.5) * 0.4, this.rng() - 0.5).normalize();
    _bodyInv.copy(this.hero.body.matrixWorld).invert();
    let seeded = 0;
    for (let j = 0; j < PER_PATCH; j++) {
      const i = patch.k * PER_PATCH + j;
      if (this.mAlive[i] === 2) continue;
      // gaussian scatter (Box-Muller), stretched along the plume, never starting inside the hero or
      // where it would be taken in at once
      for (let tries = 0; tries < 8; tries++) {
        const r = sigma * Math.sqrt(-2 * Math.log(1 - this.rng() * 0.98));
        _v.set(this.rng() - 0.5, this.rng() - 0.5, this.rng() - 0.5).normalize().multiplyScalar(r);
        _v.addScaledVector(patch.axis, _v.dot(patch.axis) * 0.8).add(centre);
        if (capsuleSd(_o.copy(_v).applyMatrix4(_bodyInv)) > CAPTURE + 0.08) break;
      }
      this.mBase[i * 3] = _v.x;
      this.mBase[i * 3 + 1] = _v.y;
      this.mBase[i * 3 + 2] = _v.z;
      this.mAlive[i] = 1;
      this.mFade[i] = now ? 1 : -this.rng() * 1.5;
      seeded++;
    }
    patch.alive = seeded;
  }

  patchConc(pa, p) {
    _w.copy(p).sub(pa.c);
    const along = _w.dot(pa.axis);
    const d2 = _w.lengthSq() - along * along + (along / 1.8) ** 2;
    return 0.95 * (pa.alive / pa.n0) * Math.exp(-d2 / (2 * pa.sigma * pa.sigma));
  }

  concentrationAt(p) {
    let c = 0;
    for (const pa of this.patches) c += this.patchConc(pa, p);
    return Math.min(1, c + 0.02);
  }

  updateGlucose(dt) {
    const hero = this.hero;
    const t = this.time;
    const body = hero.body;
    _inv.copy(body.matrixWorld).invert();
    const g = hero.group.position;
    const pts = hero.sites?.pts ?? [];

    // Patches drift with the water; those left far behind, or eaten, come back ahead of the hero.
    for (const pa of this.patches) {
      pa.c.addScaledVector(currentVel(pa.c, t, _v), dt);
      if (pa.c.distanceTo(g) > 18 || pa.alive < PER_PATCH * 0.15) this.placePatch(pa, this.aroundHero(8, 13, _p), 1.3 + this.rng() * 0.7);
    }

    // Uptake: about one glucose a second at most, in proportion to the sugar around the cell (and
    // none while a mote is still waiting at a busy transporter).
    const rate = Math.min(1, 1.5 * this.conc);
    this.tokens = Math.min(1.4, this.tokens + rate * dt);
    for (const m of this.taken) if (m.wait >= 0) this.tokens = Math.min(this.tokens, 0.99);

    let nearest = -1, nearestSd = Infinity, near = 0, arriving = 0;
    const n = this.mAlive.length;
    for (let i = 0; i < n; i++) {
      const alive = this.mAlive[i];
      if (alive !== 1 && alive !== 3) continue;
      const o = i * 3;
      _p.set(this.mBase[o], this.mBase[o + 1], this.mBase[o + 2]);
      _p.addScaledVector(currentVel(_p, t, _v), dt);
      let arrive = false;
      if (alive === 3) {
        // fading out at the far edge of its patch, to come back in near the cell
        arriving++;
        this.mFade[i] -= dt / 0.6;
        arrive = this.mFade[i] <= 0;
      } else this.mFade[i] = Math.min(1, this.mFade[i] + dt / 1.2);
      // where it sits in the hero's reference space
      _w.copy(_p).add(wander(this.mSeed[i], t, 0.05, _v)).applyMatrix4(_inv);
      const sd = capsuleSd(_w);
      if (alive === 1 && sd < 3 && pts.length && this.mFade[i] > 0.5) {
        if (sd < CAPTURE && this.tokens >= 1) {
          this.take(i, _w);
          continue;
        }
        if (sd < 1.4) {
          near++;
          if (this.mFade[i] >= 1 && sd < nearestSd) {
            nearestSd = sd;
            nearest = i;
          }
        }
        // The cell pushes the water aside: a mote it can't take slides round it.
        if (sd < CAPTURE + 0.02) {
          onSurface(_w, _s, _v);
          _w.addScaledVector(_v, CAPTURE + 0.02 - sd).applyMatrix4(body.matrixWorld);
          _p.add(_w.sub(_v.copy(_p).add(wander(this.mSeed[i], t, 0.05, _s)))); // shift the base by the push
        }
      } else if (alive === 1 && sd < 1.4 && this.mFade[i] > 0) near++;
      this.mBase[o] = _p.x;
      this.mBase[o + 1] = _p.y;
      this.mBase[o + 2] = _p.z;
      if (arrive) this.diffuseIn(i);
    }
    // Background uptake: with sugar all round, a mote close by diffuses in even without touching.
    if (this.tokens >= 1 && nearest >= 0) {
      const o = nearest * 3;
      _w.set(this.mBase[o], this.mBase[o + 1], this.mBase[o + 2]).add(wander(this.mSeed[nearest], t, 0.05, _v)).applyMatrix4(_inv);
      this.take(nearest, _w);
    }
    // The water round the cell holds as much sugar as the patch says: when the cell has emptied it,
    // motes diffuse back in (one at a time, from the patch's far edge, so the patch's count holds).
    this.refillWait -= dt;
    const want = this.conc > 0.08 ? Math.round(1 + 3 * this.conc) : 0;
    if (pts.length && this.refillWait <= 0 && near + arriving < want) {
      this.refillWait = 0.3;
      this.sendIn();
    }

    // Motes on their way in: round the membrane to just above the transporter, then through it.
    for (let k = this.taken.length - 1; k >= 0; k--) {
      const m = this.taken[k];
      m.t += dt;
      this.mFade[m.i] = Math.min(1, this.mFade[m.i] + dt / 1.2);
      const u = Math.min(m.t / m.dur, 1);
      this.mU[m.i] = u;
      this.pathPoint(m, u, _w);
      _w.applyMatrix4(body.matrixWorld);
      const o = m.i * 3;
      this.mPos[o] = _w.x;
      this.mPos[o + 1] = _w.y;
      this.mPos[o + 2] = _w.z;
      if (u < 1) continue;
      // At the transporter: hand it to the metabolism. A busy PTS (no PEP to hand) says no; the
      // mote waits in the channel, asks again every 0.2 s, and after 2.5 s drifts back out.
      if (m.wait >= 0) {
        m.wait += dt;
        m.retry -= dt;
        if (m.wait < 2.5 && m.retry > 0) continue;
      }
      const up = this.metabolism?.uptakeGlucose;
      const took = m.wait >= 2.5 ? false : up ? up.call(this.metabolism, m.pts) : null;
      if (took === false && m.wait < 2.5) {
        if (m.wait < 0) m.wait = 0;
        m.retry = 0.2;
        continue;
      }
      this.taken[k] = this.taken[this.taken.length - 1];
      this.taken.pop();
      this.takenPool.push(m);
      if (took === false) {
        // back into the water, just outside the porin
        _w.copy(m.above).applyMatrix4(body.matrixWorld).sub(wander(this.mSeed[m.i], t, 0.05, _v));
        this.mBase[o] = _w.x;
        this.mBase[o + 1] = _w.y;
        this.mBase[o + 2] = _w.z;
        this.mAlive[m.i] = 1;
        this.mFade[m.i] = 0.2;
        this.patches[Math.floor(m.i / PER_PATCH)].alive++;
        continue;
      }
      this.mAlive[m.i] = 0;
      if (took === null) pts[m.pts]?.flash?.(0.6); // no metabolism to light it
    }

    this.drawMotes();
    this.tagMote();
  }

  drawMotes() {
    const t = this.time;
    const mesh = this.motes;
    const col = mesh.instanceColor.array;
    const sugar = this.sugar, cg = this.cGlucose;
    // As it is born at the transporter the metabolism's glucose bead is half grown (and brightened
    // by half): a mote on its way in ends at that size and brightness, then it takes over.
    const born = 0.5 * Math.max(C_BEAD.glucose[0], C_BEAD.glucose[1] * this.px);
    const bornB = C_BEAD.glucose[2] * 1.35;
    let lit = false;
    for (let i = 0, n = this.mAlive.length; i < n; i++) {
      const o = i * 3;
      const alive = this.mAlive[i];
      let s = 0;
      if (alive === 1 || alive === 3) {
        _p.set(this.mBase[o], this.mBase[o + 1], this.mBase[o + 2]).add(wander(this.mSeed[i], t, 0.05, _v));
        s = this.mSize[i] * ease(this.mFade[i]);
        if (this.mLit[i]) {
          const k = this.mTone[i];
          col[o] = sugar.r * k;
          col[o + 1] = sugar.g * k;
          col[o + 2] = sugar.b * k;
          this.mLit[i] = 0;
          lit = true;
        }
      } else if (alive === 2) {
        _p.set(this.mPos[o], this.mPos[o + 1], this.mPos[o + 2]);
        // Caught: it swells a little and brightens as it glides in (so the eye can tell it from the
        // drifting ones), then narrows through the porin and the transporter to the bead's size.
        // Through the membranes it settles to the bead's own brightness as the bead is born.
        const u = this.mU[i], gl = this.mGlide[i];
        const big = this.mSize[i] * (1 + 0.35 * ease(u / 0.3));
        const k = ease((u - gl) / (1 - gl));
        s = (big + (born - big) * k) * ease(this.mFade[i]);
        const tone = (this.mTone[i] + (1.3 - this.mTone[i]) * ease(u / 0.3)) * (1 - k);
        col[o] = sugar.r * tone + cg.r * bornB * k;
        col[o + 1] = sugar.g * tone + cg.g * bornB * k;
        col[o + 2] = sugar.b * tone + cg.b * bornB * k;
        this.mLit[i] = 1;
        lit = true;
      }
      _m.makeScale(s, s, s).setPosition(_p);
      mesh.setMatrixAt(i, _m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (lit) mesh.instanceColor.needsUpdate = true;
  }

  // The glucose tag rides one mote near the hero, kept until it is taken or drifts off.
  tagMote() {
    const g = this.hero.group.position;
    const n = this.mAlive.length;
    let tagged = this.glucoseTagMote;
    if (tagged >= 0) {
      const o = tagged * 3;
      const d = _p.set(this.mBase[o], this.mBase[o + 1], this.mBase[o + 2]).distanceTo(g);
      if (this.mAlive[tagged] !== 1 || d > 3.5 || d < 0.9) tagged = -1;
    }
    if (tagged < 0) {
      let best = Infinity;
      for (let i = 0; i < n; i++) {
        if (this.mAlive[i] !== 1 || this.mFade[i] < 1) continue;
        const o = i * 3;
        const d = _p.set(this.mBase[o], this.mBase[o + 1], this.mBase[o + 2]).distanceTo(g);
        if (d > 1.3 && d < 2.6 && d < best) {
          best = d;
          tagged = i;
        }
      }
    }
    this.glucoseTagMote = tagged;
    this.glucoseTag.visible = tagged >= 0;
    if (tagged >= 0) {
      const o = tagged * 3;
      this.glucoseTag.position.set(this.mBase[o], this.mBase[o + 1], this.mBase[o + 2]).add(wander(this.mSeed[tagged], this.time, 0.05, _v));
    }
  }

  // Sugar diffusing into the water the cell has emptied: the mote of the richest patch here that is
  // furthest from the cell (at least 3 µm off) fades out, to come back in close by (diffuseIn).
  sendIn() {
    const g = this.hero.group.position;
    let pa = null, best = 0.04;
    for (const p of this.patches) {
      const c = this.patchConc(p, g);
      if (c > best) {
        best = c;
        pa = p;
      }
    }
    if (!pa) return;
    let far = -1, fd = 3;
    for (let j = 0; j < PER_PATCH; j++) {
      const i = pa.k * PER_PATCH + j;
      if (this.mAlive[i] !== 1 || this.mFade[i] < 1) continue;
      const d = _s.set(this.mBase[i * 3], this.mBase[i * 3 + 1], this.mBase[i * 3 + 2]).distanceTo(g);
      if (d > fd) {
        fd = d;
        far = i;
      }
    }
    if (far >= 0) this.mAlive[far] = 3;
  }

  // ...and comes back in 1.0-1.4 µm off the membrane, on its patch's side of the cell.
  diffuseIn(i) {
    const pa = this.patches[Math.floor(i / PER_PATCH)];
    const body = this.hero.body;
    _d.copy(pa.c).sub(this.hero.group.position);
    if (_d.lengthSq() < 0.25) _d.set(0, 0, 0);
    _d.transformDirection(_inv).add(_s.set(this.rng() - 0.5, this.rng() - 0.5, this.rng() - 0.5).multiplyScalar(1.4));
    if (_d.lengthSq() < 1e-4) _d.set(0, 1, 0);
    _d.setLength(2);
    onSurface(_d, _s, _w);
    _s.addScaledVector(_w, 1 + 0.4 * this.rng()).applyMatrix4(body.matrixWorld).sub(wander(this.mSeed[i], this.time, 0.05, _w));
    this.mBase[i * 3] = _s.x;
    this.mBase[i * 3 + 1] = _s.y;
    this.mBase[i * 3 + 2] = _s.z;
    this.mAlive[i] = 1;
    this.mFade[i] = 0;
  }

  // Start a mote's way in: to a transporter, round the outside of the cell first. Any PtsG will
  // take it; of the nearer ones, one the camera can see, so the way in is seen.
  take(i, ref) {
    const pts = this.hero.sites.pts;
    let best = 0, bs = Infinity;
    for (let k = 0; k < pts.length; k++) {
      const s = pts[k];
      _v.copy(this.camRef).sub(s.pos).normalize();
      const score = s.pos.distanceTo(ref) - 0.45 * s.normal.dot(_v);
      if (score < bs) {
        bs = score;
        best = k;
      }
    }
    const site = pts[best];
    const m = this.takenPool.pop() ?? { from: new THREE.Vector3(), above: new THREE.Vector3(), to: new THREE.Vector3() };
    m.from.copy(ref);
    m.above.copy(site.pos).addScaledVector(site.normal, 0.5 - this.hero.R_INNER + HUG); // over the transporter, outside the outer membrane
    m.to.copy(site.pos).addScaledVector(site.normal, 0.012);
    const dist = m.from.distanceTo(m.above);
    m.i = i;
    m.t = 0;
    m.dur = 1.1 + dist; // never under a second, so the eye can follow it in
    m.pts = best;
    m.glide = dist / (dist + 0.2);
    m.wait = -1;
    m.retry = 0;
    this.taken.push(m);
    this.mAlive[i] = 2;
    this.mU[i] = 0;
    this.mGlide[i] = m.glide;
    this.tokens -= 1;
    const pa = this.patches[Math.floor(i / PER_PATCH)];
    pa.alive = Math.max(0, pa.alive - 1);
  }

  // Along the way in: hug the outside of the membrane (never through it) to the porin over the
  // transporter, then straight down through the periplasm.
  pathPoint(m, u, out) {
    const g = m.glide;
    if (u < g) {
      out.lerpVectors(m.from, m.above, easeOut(u / g));
      const sd = capsuleSd(out);
      if (sd < HUG) {
        onSurface(out, _s, _v);
        out.addScaledVector(_v, HUG - sd);
      }
      return out;
    }
    return out.lerpVectors(m.above, m.to, ease((u - g) / (1 - g)));
  }

  // ----------------------------------------------------------------------------------- food
  buildFood() {
    const geos = {
      protein: [proteinGeo(11), proteinGeo(23), proteinGeo(37)],
      glycogen: [glycogenGeo(5), glycogenGeo(17), glycogenGeo(29)],
    };
    this.food = [];
    for (let k = 0; k < FOOD; k++) {
      const kind = k % 2 ? 'glycogen' : 'protein';
      const mat = organicMaterial({ color: 0xffffff, glow: kind === 'protein' ? 0.16 : 0.2, translucency: 0.6, shape: this.hero.shape });
      const mesh = new THREE.Mesh(geos[kind][Math.floor(k / 2) % 3], mat);
      mesh.frustumCulled = false;
      this.group.add(mesh);
      const f = { kind, mesh, mat, radius: 0.12, base: new THREE.Vector3(), seed: this.rng() * 100, spin: new THREE.Vector3(), fade: 1, engulf: null, c0: new THREE.Color() };
      this.food.push(f);
      this.respawnFood(f, this.aroundHero(3, 11, _p), true);
    }
    // One in sight from the start, to the right of the cell; with ?feed=near one within reach.
    const g = this.hero.group.position;
    const toCam = _w.copy(this.camera.position).sub(g).normalize();
    const right = new THREE.Vector3().crossVectors(toCam, UP).normalize().negate();
    this.respawnFood(this.food[0], _p.copy(g).addScaledVector(right, 1.9).add(_v.set(0, 0.75, 0)).addScaledVector(toCam, -0.4), true);
    const near = params.get('feed');
    if (near === 'near') {
      const kind = params.get('feedkind') === 'glycogen' ? 'glycogen' : 'protein';
      const f = this.food.find((x) => x.kind === kind);
      // Over the front pole's upper shoulder (where a pocket goes, 50° toward the pole, clear of the
      // receptor patch that leans the other way), on the silhouette seen from the camera.
      const c = this.camDir;
      _v.set(-c.x * 0.18, 1, 0).normalize();
      const tilt = 0.87;
      const n = _v.multiplyScalar(Math.cos(tilt)).setZ(Math.sin(tilt));
      const ref = _s.set(0, 0, 0.5).addScaledVector(n, 0.5 + f.radius + 0.2);
      this.respawnFood(f, ref.applyMatrix4(this.hero.body.matrixWorld), true);
    }
  }

  respawnFood(f, at, now = false) {
    const kind = f.kind;
    f.radius = 0.1 + this.rng() * 0.028;
    f.c0.copy(kind === 'protein' ? PROTEIN_FOOD : _c.set(METABOLITE.glycogenFood)).offsetHSL((this.rng() - 0.5) * 0.02, 0, (this.rng() - 0.5) * 0.05);
    f.mat.uniforms.uColor.value.copy(f.c0);
    f.mat.uniforms.uNearFade.value.set(0.5, 1.6);
    f.mat.uniforms.uPulse.value = 1;
    f.base.copy(at);
    f.mesh.position.copy(at);
    f.mesh.quaternion.setFromEuler(new THREE.Euler(this.rng() * 6, this.rng() * 6, this.rng() * 6));
    f.mesh.scale.setScalar(f.radius);
    f.mesh.visible = true;
    f.spin.set(this.rng() - 0.5, this.rng() - 0.5, this.rng() - 0.5).normalize().multiplyScalar(0.15 + this.rng() * 0.2);
    f.fade = now ? 1 : 0;
    f.engulf = null;
  }

  updateFood(dt) {
    const t = this.time;
    const hero = this.hero;
    const body = hero.body;
    _inv.copy(body.matrixWorld).invert();
    const g = hero.group.position;
    let cand = null, candGap = Infinity;
    let np = null, ng = null, dp = 4, dg = 4;
    for (const f of this.food) {
      if (f.engulf) continue;
      f.base.addScaledVector(currentVel(f.base, t, _v), dt);
      if (f.base.distanceTo(g) > 15) {
        this.respawnFood(f, this.aroundHero(6, 11, _p));
        continue;
      }
      f.fade = Math.min(1, f.fade + dt / 1.5);
      f.mesh.position.copy(f.base).add(wander(f.seed, t * 0.7, 0.03, _v));
      f.mesh.quaternion.premultiply(_q.setFromAxisAngle(_s.copy(f.spin).normalize(), f.spin.length() * dt));
      f.mesh.scale.setScalar(f.radius * ease(f.fade));
      // In the hero's frame: is it in reach, or being pushed aside?
      _w.copy(f.mesh.position).applyMatrix4(_inv);
      const gap = capsuleSd(_w) - f.radius;
      if (gap < 0.03) {
        onSurface(_w, _s, _v);
        _w.addScaledVector(_v, 0.03 - gap).applyMatrix4(body.matrixWorld);
        f.base.add(_w.sub(f.mesh.position));
        f.mesh.position.add(_w);
      }
      if (gap < REACH && f.fade > 0.8 && gap < candGap) {
        candGap = gap;
        cand = f;
      }
      const d = f.mesh.position.distanceTo(g);
      if (f.kind === 'protein' && d < dp) {
        dp = d;
        np = f;
      } else if (f.kind === 'glycogen' && d < dg) {
        dg = d;
        ng = f;
      }
    }
    this.proteinTag.visible = !!np;
    if (np) this.proteinTag.position.copy(np.mesh.position);
    this.glycogenTag.visible = !!ng;
    if (ng) this.glycogenTag.position.copy(ng.mesh.position);
    return cand;
  }

  // ----------------------------------------------------------------------------------- endocytosis
  // The monomers leaving a digesting vesicle: beads that come off the particle and cross the
  // vesicle's film, then are handed over to the metabolism where they come out.
  buildBeads() {
    this.beads = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), tokenMaterial({ shape: this.hero.shape }), BEADS);
    this.beads.frustumCulled = false;
    this.group.add(this.beads);
    this.beadState = Array.from({ length: BEADS }, () => ({ on: false, from: new THREE.Vector3(), to: new THREE.Vector3(), at: new THREE.Vector3(), t: 0, th: 0, retry: 0, seed: this.rng() * 100, kind: 'glucose', handed: false }));
    _m.makeScale(0, 0, 0);
    for (let i = 0; i < BEADS; i++) {
      this.beads.setMatrixAt(i, _m);
      this.beads.setColorAt(i, this.cGlucose);
    }
  }

  // One monomer leaves the particle. The particle steps smaller and turns a little further toward
  // the monomer's colour. With no bead free to draw it, it is handed to the metabolism unseen.
  release(e) {
    const f = e.food;
    e.released++;
    const done = e.released / e.monomers;
    e.shrinkGoal = 1 - 0.8 * done;
    e.mixGoal = 0.85 * done;
    const kind = f.kind === 'protein' ? 'aminoAcid' : 'glucose';
    let b = null;
    for (const x of this.beadState) {
      if (!x.on) {
        b = x;
        break;
      }
    }
    if (!b) {
      this.queue(kind, e.ves.pos);
      return;
    }
    // Out toward where it is needed: glucose to glycolysis, amino acids toward the polysomes.
    const sites = this.hero.sites ?? {};
    const ribs = sites.ribosomes;
    const goal = kind === 'glucose' ? sites.glycolysis : ribs?.[(e.released * 7) % Math.max(1, ribs.length)]?.pos;
    const dir = _v.copy(goal ?? _w.set(0, 0, 0)).sub(e.ves.pos);
    if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1);
    dir.normalize();
    _s.set(this.rng() - 0.5, this.rng() - 0.5, this.rng() - 0.5).multiplyScalar(1.1);
    dir.add(_s).normalize();
    b.on = true;
    b.handed = false;
    b.retry = 0;
    b.t = 0;
    b.th = 0;
    b.kind = kind;
    b.from.copy(e.ves.pos).addScaledVector(dir, f.radius * e.shrink * 0.8);
    b.to.copy(e.ves.pos).addScaledVector(dir, e.ves.radius + 0.035);
  }

  // A monomer with no bead to show it waits here until the metabolism takes it.
  queue(kind, pos) {
    if (this.backlog.length >= 256) {
      this.backlog.shift();
      if (!this.lost++) console.warn('feeding: 256 monomers are waiting for the metabolism; dropping the oldest');
    }
    this.backlog.push({ kind, pos: pos.clone() });
  }

  updateBacklog(dt) {
    if (!this.backlog.length || (this.backlogWait -= dt) > 0) return;
    this.backlogWait = 0.2;
    const x = this.backlog[0];
    if (this.metabolism?.deliver?.(x.kind, x.pos) !== false) this.backlog.shift();
  }

  updateBeads(dt) {
    const col = this.beads.instanceColor.array;
    for (let i = 0; i < BEADS; i++) {
      const b = this.beadState[i];
      if (!b.on) {
        _m.makeScale(0, 0, 0);
        this.beads.setMatrixAt(i, _m);
        continue;
      }
      b.t += dt;
      const u = Math.min(b.t / 0.5, 1);
      if (!b.handed) {
        b.at.lerpVectors(b.from, b.to, ease(u));
        if (u >= 1) {
          // waiting by the vesicle for the metabolism, which may be too busy: it asks every 0.2 s
          b.at.add(wander(b.seed, this.time, 0.008, _v).multiplyScalar(Math.min((b.t - 0.5) / 0.4, 1)));
          b.retry -= dt;
          if (b.retry <= 0) {
            if (this.metabolism?.deliver?.(b.kind, b.at) === false) b.retry = 0.2;
            else b.handed = true;
          }
        }
      }
      // Drawn as the metabolism's own bead (its size, colour and the brightening of a bead being
      // born); once handed over it stays until that bead has grown in its place, then goes.
      const st = C_BEAD[b.kind];
      let s = Math.max(st[0], st[1] * this.px) * ease(b.t / 0.12);
      if (b.handed) {
        b.th += dt;
        s *= 1 - ease((b.th - 0.12) / 0.04);
        if (b.th >= 0.16) b.on = false;
      }
      // b.at is in the cell's reference space: drawn through its body
      _m.makeScale(s, s, s).setPosition(b.at).premultiply(this.hero.body.matrixWorld);
      this.beads.setMatrixAt(i, _m);
      const c = b.kind === 'glucose' ? this.cGlucose : this.cAmino;
      const k = st[2] * (1 + 0.5 * ease(u));
      col[i * 3] = c.r * k;
      col[i * 3 + 1] = c.g * k;
      col[i * 3 + 2] = c.b * k;
    }
    this.beads.instanceMatrix.needsUpdate = true;
    this.beads.instanceColor.needsUpdate = true;
  }

  // Where to pocket the membrane for a particle (centre ref, radius r): on a pole's shoulder (the
  // normal leaning 35-60° toward the pole) near the particle, off the flagellar motors (a pocket
  // there would drag the filament in), the receptor patch, the other pocket and, if it can, the
  // membrane's protein patches; facing the camera rather than away.
  pocketSite(ref, r, pos, normal) {
    const sites = this.hero.sites ?? {};
    const motors = sites.motors ?? [];
    const rafts = this.hero.volume?.rafts ?? [];
    const rec = sites.receptors?.pos;
    const other = this.engulfs.find((x) => x);
    let best = null, bs = Infinity;
    for (const c of SITES) {
      let blocked = false;
      for (const m of motors) if (c.p.distanceTo(m.pos) < 0.34) blocked = true;
      if (blocked || (rec && c.p.distanceTo(rec) < 0.3) || (other && c.p.distanceTo(other.C) < 0.62)) continue;
      // the particle's way there, to rest just over the membrane
      const travel = _v.copy(c.p).addScaledVector(c.n, r + 0.03).distanceTo(ref);
      // A mid-body pocket would reach the cell's axis, so the further along the profile from the
      // middle (to a 35° shoulder) the better; the cap's very tip is the receptors' (and a pocket
      // there would sink along the length of the cell).
      const arc = c.tilt > 0 ? 0.5 + 0.5 * THREE.MathUtils.degToRad(c.tilt) : Math.abs(c.p.z);
      const waist = 0.8 * (1 - smooth(0.3, 0.8, arc)) + 0.4 * smooth(60, 75, c.tilt);
      let patch = 0;
      for (const a of rafts) patch += 1.5 * Math.max(0, a.radius + 0.15 - c.p.distanceTo(a.pos));
      const away = 0.3 * Math.max(0, -c.n.dot(_w.copy(this.camRef).sub(c.p).normalize()));
      const score = travel + waist + patch + away;
      if (score < bs) {
        bs = score;
        best = c;
      }
    }
    if (best) {
      pos.copy(best.p);
      normal.copy(best.n);
    } else onSurface(ref, pos, normal);
  }

  start(f, slot) {
    const hero = this.hero;
    const body = hero.body;
    // a particle caught while still fading in is caught whole
    f.fade = 1;
    _inv.copy(body.matrixWorld).invert();
    const ref = f.mesh.position.clone().applyMatrix4(_inv);
    const C = new THREE.Vector3(), n = new THREE.Vector3();
    this.pocketSite(ref, f.radius, C, n);
    const rc = f.radius + DENT_GAP;
    const e = {
      food: f,
      slot,
      t: 0,
      C,
      n,
      rc,
      // the particle, in reference body space (it is drawn there through the body every frame), and
      // its turn relative to the body
      pos: ref.clone(),
      quat: body.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(f.mesh.quaternion),
      from: ref,
      ball: { center: ref.clone(), radius: f.radius }, // the sphere the pocket's floor hugs
      size: f.radius, // its radius as drawn (it shrinks as it is digested)
      ves: null,
      shrink: 1,
      shrinkGoal: 1,
      mix: 0,
      mixGoal: 0,
      cMono: this.cDigest[f.kind],
      released: 0,
      monomers: f.kind === 'protein' ? 5 + Math.round((f.radius - 0.1) * 60) : 4 + Math.round((f.radius - 0.1) * 50),
      repicked: false,
      repicking: false,
      search: null,
      pickCam: new THREE.Vector3(),
      home: null,
    };
    f.engulf = e;
    // inside the cell it is seen from close by: only dissolve it right at the lens
    f.mat.uniforms.uNearFade.value.set(0.08, 0.3);
    this.engulfs[slot] = e;
    this.cooldown = 0.35;
    if (this.skip > 0) {
      const skip = this.skip;
      this.skip = 0;
      for (let s = 0; s < skip; s += 1 / 60) {
        this.stepEngulf(e, 1 / 60);
        this.updateBeads(1 / 60);
      }
    }
  }

  // The approach: drawn onto the membrane on a curve that keeps clear of the cell, pressing into
  // its dimple at the end.
  approachPoint(e, u, target) {
    const keep = (e.food.radius + 0.03) * (1 - ease((u - 0.65) / 0.35));
    target.lerpVectors(e.from, target, ease(u));
    const sd = capsuleSd(target);
    if (sd < keep) {
      onSurface(target, _s, _v);
      target.addScaledVector(_v, keep - sd);
    }
    return target;
  }

  stepEngulf(e, dt) {
    const hero = this.hero;
    const f = e.food;
    e.t += dt;
    const t = e.t;
    const rc = e.rc;
    const vols = hero.volume.vesicles;

    // The particle, and the pocket: a cup whose floor is the particle's sphere DENT_GAP larger, so
    // wherever the particle goes the cup hugs it (hero.setDent with the particle).
    let pinch = 0, cup;
    if (t < T_PINCH) {
      let depth; // the cup's floor under the surface
      if (t < T_APPROACH) depth = D_LAND;
      else if (t < T_APPROACH + T_INVAGINATE) depth = D_LAND + (2 * rc + OPEN_BRIDGE - D_LAND) * ease((t - T_APPROACH) / T_INVAGINATE);
      else {
        // sealing: the neck closes over the particle while it is drawn on in
        pinch = ease((t - T_APPROACH - T_INVAGINATE) / T_SEAL);
        depth = 2 * rc + OPEN_BRIDGE + (SEAL_BRIDGE - OPEN_BRIDGE) * pinch;
        // where the vesicle will be born is known: the search for where to digest it can begin
        if (!e.search) this.beginSpot(e, _p.copy(e.C).addScaledVector(e.n, -rc - SEAL_BRIDGE), f.radius + VES_PAD);
        this.stepSpot(e.search, 150);
      }
      e.pos.copy(e.C).addScaledVector(e.n, rc - depth);
      if (t < T_APPROACH) this.approachPoint(e, t / T_APPROACH, e.pos);
      e.ball.center.copy(e.pos);
      e.size = f.radius;
    } else {
      if (!e.ves) this.pinchOff(e);
      const v = e.ves;
      const tt = t - T_PINCH;
      // birth: the film takes over from the bubble's, which shrinks away inside it
      v.membrane = Math.min(1, tt / T_HAND);
      if (tt < T_HAND) {
        pinch = 1;
        cup = rc + (-0.1 - rc) * ease(tt / T_HAND);
      } else {
        // Where the neck closed the surface dips a few times, ever less: the cup's sphere lowered
        // onto it and lifted off, so each dip is round. Lowered x below where its rim's blend first
        // reaches the surface, it dips the surface x^2 / (4 rim) deep (for dips up to the rim).
        const tb = tt - T_HAND;
        const dip = RELAX * Math.exp(-tb / 0.3) * Math.max(Math.sin((2 * Math.PI * tb) / 0.35), 0);
        const rim = DENT_RIM * DENT_R;
        e.ball.center.copy(e.C).addScaledVector(e.n, rc + rim - Math.sqrt(4 * rim * dip));
      }
      // If the player has swung the camera round since the spot was picked, pick again (once).
      if (!e.repicked && tt > T_TRANSPORT * 0.45) {
        e.repicked = true;
        if (e.pickCam.dot(this.camDir) < Math.cos(Math.PI / 6)) {
          this.beginSpot(e, e.v0, f.radius + VES_PAD);
          e.repicking = true;
        }
      }
      if (e.repicking) {
        this.stepSpot(e.search, 150);
        if (e.search.done) {
          e.repicking = false;
          e.v1Goal.copy(this.spotOf(e.search));
          e.pickCam.copy(e.search.toCam);
        }
      }
      e.v1.lerp(e.v1Goal, 1 - Math.exp(-dt / 0.2));
      // transport inward on a gentle curve
      const u = ease(tt / T_TRANSPORT);
      v.pos.lerpVectors(e.v0, e.v1, u).addScaledVector(e.n, -0.05 * Math.sin(Math.PI * u));
      // digestion: the particle brightens; each monomer that leaves takes a step off it, and what is
      // left turns toward the colour of what it is broken into
      const td = tt - T_TRANSPORT;
      if (td > 0) {
        v.glow = VES_GLOW * ease(td / 0.8);
        f.mat.uniforms.uPulse.value = 1 + 0.4 * ease(td / 0.8);
        const due = Math.min(e.monomers, Math.floor((td - 0.3) / ((T_DIGEST - 0.5) / e.monomers)) + 1);
        while (td > 0.3 && e.released < due) this.release(e);
      }
      e.shrink += (e.shrinkGoal - e.shrink) * (1 - Math.exp(-dt / 0.08));
      e.mix += (e.mixGoal - e.mix) * (1 - Math.exp(-dt / 0.15));
      f.mat.uniforms.uColor.value.copy(f.c0).lerpHSL(e.cMono, e.mix);
      // the film closes round its load as it travels, and as the load is eaten
      const snug = f.radius * e.shrink + VES_PAD;
      let radius = snug + (f.radius + VES_BORN - snug) * Math.max(0, 1 - tt / 0.5);
      // The emptied vesicle goes back to the envelope it came from (its membrane is recycled into
      // it, or the cell would lose membrane with every meal), shrinking as it fades.
      const tf = td - T_DIGEST;
      let k = 1;
      if (tf > 0) {
        if (!e.home) {
          e.home = onSurface(v.pos, new THREE.Vector3(), _v).addScaledVector(_v, -(0.5 - hero.R_INNER) - 0.07);
          e.v0.copy(v.pos);
        }
        k = 1 - ease(tf / T_FADE);
        v.membrane = k;
        v.glow = VES_GLOW * k;
        v.pos.lerpVectors(e.v0, e.home, ease(tf / (T_FADE * 0.9)));
        radius += (0.05 - radius) * ease(tf / T_FADE);
      }
      v.radius = radius;
      // a slight drift inside, never enough to touch the inner film
      e.pos.copy(v.pos).add(wander(f.seed, this.time, 0.003, _v));
      e.size = Math.max(f.radius * e.shrink * k, 1e-4);
      e.quat.premultiply(_q.setFromAxisAngle(_s.copy(f.spin).normalize(), f.spin.length() * 0.5 * dt));
      if (tf >= T_FADE) {
        this.finish(e);
        return;
      }
    }
    // the dent goes off once the surface has settled
    if (t >= T_PINCH + T_HAND + T_RELAX) hero.setDent(e.slot, { depth: 0, pinch: 0 });
    else hero.setDent(e.slot, { center: e.C, normal: e.n, radius: DENT_R, pinch, particle: e.ball, cup });
    if (vols && e.ves && this.engulfs[e.slot] === e) vols[e.slot] = e.ves;
    this.placeEngulfed(e);
  }

  // Draw an engulfed particle where it is in the cell: its reference place and turn, through the
  // body (Feeding's meshes all live in its own group, in the world).
  placeEngulfed(e) {
    const m = e.food.mesh;
    const body = this.hero.body;
    m.position.copy(e.pos).applyMatrix4(body.matrixWorld);
    m.quaternion.copy(body.getWorldQuaternion(_q)).multiply(e.quat);
    m.scale.setScalar(e.size * _s.setFromMatrixScale(body.matrixWorld).x);
  }

  // The bubble becomes a vesicle: a double film round the particle, centred where it sits, which
  // then travels inward to a spot of open cytoplasm in view (the search began during the seal).
  pinchOff(e) {
    const f = e.food;
    const pos = e.pos.clone();
    e.ves = { pos: pos.clone(), radius: f.radius + VES_BORN, glow: 0, membrane: 0, kind: f.kind === 'protein' ? 'protein' : 'glycogen' };
    e.v0 = pos.clone();
    if (!e.search) this.beginSpot(e, pos, f.radius + VES_PAD);
    this.stepSpot(e.search, Infinity);
    e.v1Goal = this.spotOf(e.search).clone();
    e.v1 = e.v1Goal.clone();
    e.pickCam.copy(e.search.toCam);
  }

  // Where to digest: open cytoplasm (clear of the membrane, the granules, the plasmid, the TCA and
  // glycolysis enzymes, the polysomes and the other vesicle), a short way in, and where the player
  // sees it: on the near side of the cell, with nothing in front of it or behind it on screen (the
  // plasmid, granules, the TCA loop, the nucleoid's tangle). The search runs a slice of the
  // candidates a frame (beginSpot, then stepSpot), so it never costs a frame much.
  digestSpot(from, radius, e) {
    const s = this.beginSpot({ slot: e.slot }, from, radius);
    this.stepSpot(s, Infinity);
    return this.spotOf(s).clone();
  }

  beginSpot(e, from, radius) {
    const vol = this.hero.volume;
    const sites = this.hero.sites ?? {};
    const s = (e.search ??= {
      from: new THREE.Vector3(),
      cam: new THREE.Vector3(),
      toCam: new THREE.Vector3(),
      nuc: new THREE.Vector3(),
      ca: new THREE.Vector3(),
      best: new THREE.Vector3(),
      fallback: new THREE.Vector3(),
      // things to keep clear of in 3D, and things not to be seen through or against: x, y, z, r
      keep: new Float32Array(4 * 64),
      occ: new Float32Array(4 * 8),
    });
    s.from.copy(from);
    s.radius = radius;
    s.cam.copy(this.camRef);
    s.toCam.copy(this.camDir);
    s.c = 0;
    s.done = false;
    s.bestScore = s.fallbackScore = Infinity;
    s.hasBest = s.hasFallback = false;
    const put = (buf, n, p, r) => {
      if (n >= buf.length) return n;
      buf[n] = p.x;
      buf[n + 1] = p.y;
      buf[n + 2] = p.z;
      buf[n + 3] = r;
      return n + 4;
    };
    let nk = 0, no = 0;
    for (const g of vol.granules ?? []) {
      nk = put(s.keep, nk, g.pos, g.radius + 0.03);
      no = put(s.occ, no, g.pos, g.radius + 0.01);
    }
    if (vol.plasmid) {
      const pr = vol.plasmidRadius ?? 0.07;
      nk = put(s.keep, nk, vol.plasmid, pr + 0.04);
      no = put(s.occ, no, vol.plasmid, pr + 0.04);
    }
    if (vol.tca) {
      nk = put(s.keep, nk, vol.tca.center, vol.tca.radius + 0.04);
      no = put(s.occ, no, vol.tca.center, vol.tca.radius + 0.03);
    }
    for (const z of vol.glycolysisEnzymes ?? []) nk = put(s.keep, nk, z.pos, z.radius + 0.01);
    for (const r of sites.ribosomes ?? []) nk = put(s.keep, nk, r.pos, 0.025);
    const other = this.engulfs[1 - e.slot]?.ves;
    if (other) {
      nk = put(s.keep, nk, other.pos, other.radius + 0.03);
      no = put(s.occ, no, other.pos, other.radius);
    }
    s.nk = nk;
    s.no = no;
    // the nucleoid's threads reach ~1.18x its nominal 0.2 x 0.2 x 0.45 µm (CellPass)
    s.nuc.copy(vol.nucleoid ?? _w.set(0, 0, 0));
    const ns = vol.nucleoidScale ?? 1;
    s.ax = 0.24 * ns + radius * 0.8;
    s.az = 0.53 * ns + radius * 0.8;
    s.ca.set((s.cam.x - s.nuc.x) / s.ax, (s.cam.y - s.nuc.y) / s.ax, (s.cam.z - s.nuc.z) / s.az);
    return s;
  }

  // Score up to `budget` more candidates.
  stepSpot(s, budget) {
    if (s.done) return;
    const { from, cam, toCam, nuc, ca, keep, occ, nk, no, radius, ax, az } = s;
    const q = _p, qn = _v, o = _o;
    const inner = -(0.5 - this.hero.R_INNER) - radius - 0.03;
    const end = Math.min(SPOTS.length, s.c + budget * 3);
    for (let c = s.c; c < end; c += 3) {
      // inside the inner membrane, the pole caps included
      q.set(SPOTS[c], SPOTS[c + 1], SPOTS[c + 2]);
      if (capsuleSd(q) > inner) continue;
      let clash = -0.1;
      for (let j = 0; j < nk; j += 4) {
        const reach = keep[j + 3] + radius + 0.1;
        const dx = keep[j] - q.x, dy = keep[j + 1] - q.y, dz = keep[j + 2] - q.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < reach * reach) clash = Math.max(clash, keep[j + 3] + radius - Math.sqrt(d2));
      }
      // a clear journey inward (~0.25 µm, never across the cell), toward the player, into open
      // cytoplasm out of the nucleoid's tangle
      const dist = q.distanceTo(from);
      let score =
        Math.abs(dist - 0.25) +
        1.5 * Math.max(0, dist - 0.6) +
        0.6 * (clash + 0.1) -
        0.8 * ((q.x - from.x) * toCam.x + (q.y - from.y) * toCam.y + (q.z - from.z) * toCam.z) +
        0.5 * (1 - smooth(0.75, 1.2, Math.hypot((q.x - nuc.x) / 0.2, (q.y - nuc.y) / 0.2, (q.z - nuc.z) / 0.45)));
      if (clash <= 0 ? score >= s.bestScore : s.hasBest || score + 4 * clash >= s.fallbackScore) continue;
      // Seen through something, or against it: the line from the camera to the vesicle passes
      // within reach of the plasmid, a granule, the TCA loop or the nucleoid (worse in front).
      for (let j = 0; j < no; j += 4) {
        const rk = occ[j + 3] + radius;
        const d2 = lineDist2(cam, q, o.set(occ[j], occ[j + 1], occ[j + 2]), _line);
        if (d2 < rk * rk) score += (rk - Math.sqrt(d2)) * (_line.t < 1 ? 3 : 1.2);
      }
      qn.set((q.x - nuc.x) / ax, (q.y - nuc.y) / ax, (q.z - nuc.z) / az);
      const dn = Math.sqrt(lineDist2(ca, qn, o.set(0, 0, 0), _line));
      if (dn < 1) score += (1 - dn) * (_line.t < 1 ? 1.2 : 0.6);
      if (clash <= 0) {
        if (score < s.bestScore) {
          s.bestScore = score;
          s.best.copy(q);
          s.hasBest = true;
        }
      } else if (score + 4 * clash < s.fallbackScore) {
        s.fallbackScore = score + 4 * clash;
        s.fallback.copy(q);
        s.hasFallback = true;
      }
    }
    s.c = end;
    s.done = end >= SPOTS.length;
  }

  spotOf(s) {
    return s.hasBest ? s.best : s.hasFallback ? s.fallback : _w.set(0, 0, s.from.z);
  }

  finish(e) {
    const f = e.food;
    this.hero.setDent(e.slot, { depth: 0, pinch: 0 });
    const vols = this.hero.volume.vesicles;
    if (vols) vols[e.slot] = undefined;
    this.engulfs[e.slot] = null;
    this.respawnFood(f, this.aroundHero(7, 11, _p));
  }

  // ----------------------------------------------------------------------------------- update
  update(dt, { keys } = {}) {
    const hero = this.hero;
    if (this.warm > 0) {
      const warm = this.warm;
      this.warm = 0;
      for (let s = 0; s < warm; s += 1 / 30) {
        this.metabolism?.update?.(1 / 30, { thrust: 0, oxygen: this.state.oxygen });
        this.update(1 / 30, { keys: NO_KEYS });
      }
    }
    this.time += dt;
    this.syncCamera();
    const g = hero.group.position;

    // Oxygen diffuses in from the drop's surface and is used up on the way down.
    this.state.oxygen = OXYGEN ?? (g.y >= 0 ? 1 : 1 - THREE.MathUtils.smoothstep(-g.y, 0, 30));

    // Glucose round the cell; the receptors light up when it is rising (the cell tastes the change,
    // not the level).
    const c = this.concentrationAt(g);
    const rate = dt > 0 ? (c - this.conc) / dt : 0;
    this.concRate += (rate - this.concRate) * (1 - Math.exp(-dt / 0.4));
    this.conc = c;
    this.state.glucose = c;
    this.receptorWait -= dt;
    if (this.concRate > 0.03 && this.receptorWait <= 0) {
      hero.sites?.receptors?.flash?.(Math.min(1, this.concRate * 6));
      this.receptorWait = 0.6;
    }

    this.updateGlucose(dt);
    const cand = this.updateFood(dt);

    // Engulfing.
    this.cooldown -= dt;
    let slot = -1;
    for (let k = 0; k < this.engulfs.length && hero.volume; k++) if (!this.engulfs[k] && slot < 0) slot = k;
    const canEat = cand && slot >= 0;
    if (canEat && keys?.has?.('KeyR') && this.cooldown <= 0) this.start(cand, slot);
    for (const e of this.engulfs) if (e) this.stepEngulf(e, dt);
    this.updateBeads(dt);
    this.updateBacklog(dt);

    const prompt = canEat && cand.engulf === null ? cand : null;
    this.state.prompt = prompt ? 'R · engulf' : null;
    this.state.promptAnchor = prompt ? this.promptAnchor : null;
    if (prompt) this.promptAnchor.position.copy(prompt.mesh.position);

    // The tag follows the newest engulf: its pocket, then its vesicle (named for what it is now).
    let newest = null, active = 0;
    for (const e of this.engulfs) {
      if (!e) continue;
      active++;
      if (!newest || e.t < newest.t) newest = e;
    }
    const a = this.vesicleAnchor;
    this.vesicleTag.visible = !!newest && newest.t > T_APPROACH;
    if (newest) {
      a.title = newest.ves ? VESICLE_TITLE : POCKET_TITLE;
      a.sub = newest.ves ? VESICLE_SUB : POCKET_SUB;
      flowPoint(hero.shape, newest.pos, this.vesicleTag.position);
    }
    this.state.engulfing = active > 0;
    this.state.engulfCount = active;
    this.state.phase = newest ? phaseName(newest.t) : null;
  }
}

function phaseName(t) {
  if (t < T_APPROACH) return 'approach';
  if (t < T_APPROACH + T_INVAGINATE) return 'invagination';
  if (t < T_PINCH) return 'seal';
  if (t < T_PINCH + T_TRANSPORT) return 'transport';
  if (t < T_PINCH + T_TRANSPORT + T_DIGEST) return 'digestion';
  return 'fade';
}
