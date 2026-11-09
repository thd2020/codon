import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { tokenMaterial, organicMaterial, flowPoint } from './materials.js';
import { METABOLITE } from './palette.js';

// The hero's energy route, as real E. coli runs it, drawn with beads inside the cell.
//
// Aerobic growth on glucose:
//   PTS: glucose (outside) + PEP -> glucose-6-P (inside) + pyruvate.
//   Glycolysis along the nine enzymes (G6P end first): phosphofructokinase spends 1 ATP, aldolase
//     splits the sugar into two trioses; per triose GAPDH makes 1 NADH and phosphoglycerate kinase
//     1 ATP, ending as PEP. One PEP goes back to the PTS to pay for the next glucose; the other gives
//     pyruvate kinase 1 ATP. Net +2 ATP, +2 NADH, 2 pyruvate.
//   Pyruvate dehydrogenase: pyruvate -> acetyl-CoA + CO2 + NADH.
//   TCA cycle in the cytoplasm: per acetyl-CoA 2 CO2, 3 NADH, 1 ATP (succinyl-CoA synthetase) and
//     1 QH2 made by succinate dehydrogenase, which sits in the inner membrane. (E. coli's isocitrate
//     dehydrogenase makes NADPH, not NADH; transhydrogenases swap the two, and the route counts it
//     as NADH.)
//   Per glucose: 10 NADH, 2 QH2, 4 ATP at the substrate level, 6 CO2.
//   NADH -> complex I: 4 H+ out, QH2 -> cytochrome bo3: 4 H+ out, using 1/2 O2. 8 H+ per NADH,
//     4 per SDH QH2: 88 H+ per glucose. Below 0.25 of air-saturated O2 cytochrome bd takes over
//     (2 H+ per QH2, no pumping: 64 per glucose). Below 0.05 the cell ferments (pyruvate
//     formate-lyase, then acetate +1 ATP or ethanol using 2 NADH: 3 ATP per glucose) and ATP synthase
//     runs backwards, burning ATP to hold the gradient up.
//   ATP synthase: a c-ring of 10, 36 degrees per H+, 3 ATP per turn. The flagellar motors run on the
//     same H+ gradient, not on ATP.
//
// Every bead is one quantum of the same size for every kind (think ~10^4 molecules), so the beads
// keep the real ratios exactly: one glucose bead gives exactly 10 NADH beads, 88 H+ beads and so
// on. The chemistry is counted by the Ledger below, which knows nothing about drawing and runs in
// node (see _dev/metabolism.test.mjs). The bead layer moves the quanta from enzyme to enzyme in the
// hero's reference body space, and calls the Ledger when a bead reaches the enzyme that changes it.
// H+ beads are the one exception on screen: when the camera is too far for them to be more than
// specks they are not drawn (the periplasm's proton glow shows Δp instead); the ledger still counts
// every one.
//
// Pools: H+ pumped into the periplasm and ATP join pools; the proton motive force is the number of
// H+ beads in the periplasm. ATP synthase and the motors draw from that pool, polysomes draw from the
// ATP pool. Pacing is for play (a bead every few hundred ms, the route takes several seconds); the
// motors' share of the H+ budget is exaggerated so that swimming costs something you can feel.

const TAU = Math.PI * 2;
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

// Calibration (numbers in bead quanta). With these the cell starts at about -150 mV and 70% ATP; full
// thrust with no food drains the gradient to a crawl in about 18 s; one glucose every second or two
// keeps it swimming.
export const CONFIG = {
  pmfPerProton: 0.5, // mV per H+ bead held in the periplasm
  maxProtons: 400, // -200 mV
  maxAtp: 400,
  start: { pmf: -150, atp: 0.7 },
  pep: 5, // PEP the PTS can draw on before glycolysis hands one back (sets the top uptake, ~1 glucose/s)
  motorDraw: 11, // H+ beads/s through all motors at full thrust and full power
  leak: 0.003, // /s: protons leaking back across the membrane at moderate Δp (it rises steeply past -185 mV)
  leakKnee: 182, // mV: above about this the membrane leaks (and the pumps slip) steeply, capping Δp near -200
  synthMax: 80, // H+ beads/s through all the ATP synthases at full drive
  synthSpan: 20, // mV above the equilibrium point for full drive
  reverseMax: 30, // H+ beads/s the synthases can pump by burning ATP
  reverseSetpoint: 115, // mV the reversed synthases hold when the cell ferments
  reverseFloor: 60, // mV below which a respiring cell lets its synthases run backwards a little
  reverseAerobic: 0.1, // their share of reverseMax then (the ε subunit holds hydrolysis back)
  translation: 8, // ATP beads/s the polysomes use when ATP and food are plentiful
  starved: 0.2, // share of that left when no food comes in (the stringent response idles ribosomes)
  wellFed: 0.4, // carbon arriving (glucose/s) for full-speed growth
  chemotaxis: 0.3, // ATP beads/s the receptor array (CheA) uses
  // Staged thresholds: real E. coli shifts to cytochrome bd nearer 0.1-0.2 of air saturation and
  // still respires below 0.05; these are set high so the drop's depths show each mode.
  lowOxygen: 0.25, // below this (air-saturated = 1) cytochrome bd takes over
  noOxygen: 0.05, // below this the cell ferments
};

// Motor power against Δp. Real motor speed rises roughly in proportion to Δp; this curve (nothing
// below 35 mV, full from 125 mV) is a staged simplification so a fed cell swims at full speed.
export const motorPowerAt = (pmf) => smooth(35, 125, -pmf);
// Δp at which ATP synthase is balanced (no net turning): it needs more push the fuller the ATP pool,
// and much more as ADP runs out near a full pool (past what respiration can reach, so a full cell's
// synthases stand still instead of making ATP it cannot hold).
const synthEquilibrium = (atp) => 120 + 60 * atp + 80 * smooth(0.85, 1, atp);

// ------------------------------------------------------------------------------------- the ledger
// Exact bookkeeping of the route, one method per reaction. `made` only ever counts up; `protons`,
// `atp`, `pep` and `nadhHeld` are pools.
export class Ledger {
  constructor({ synthases = 8, config = CONFIG } = {}) {
    this.config = config;
    this.protons = -config.start.pmf / config.pmfPerProton;
    this.atp = config.start.atp * config.maxAtp;
    this.pep = config.pep;
    this.nadhHeld = 0; // NADH waiting at alcohol dehydrogenase (fermentation)
    this.rotor = new Uint8Array(Math.max(synthases, 1)); // H+ through each c-ring this turn (0..9)
    this.paid = new Uint8Array(Math.max(synthases, 1)); // thirds of an H+ paid for by burnt ATP
    this.made = {
      glucose: 0, aminoAcids: 0, pyruvate: 0, acetylCoA: 0,
      nadh: 0, nadhOxidised: 0, qh2Sdh: 0, qh2ComplexI: 0, qh2Oxidised: 0,
      atpSubstrate: 0, atpInvested: 0, atpSynthase: 0, atpHydrolysed: 0, atpUsed: 0, atpSpilled: 0,
      co2: 0, o2: 0, formate: 0, acetate: 0, ethanol: 0, nh3: 0,
      protonsRespiration: 0, protonsReverse: 0, protonsSynthase: 0, protonsMotor: 0, protonsLeak: 0,
    };
  }

  get pmf() {
    return -this.protons * this.config.pmfPerProton;
  }

  get atpFraction() {
    return this.atp / this.config.maxAtp;
  }

  // Net ATP from substrate-level phosphorylation (what glycolysis, the TCA cycle and fermentation
  // make minus what glycolysis invests).
  get atpNetSubstrate() {
    return this.made.atpSubstrate - this.made.atpInvested;
  }

  // Glucose through the PTS: PEP gives it its phosphate and becomes pyruvate. False: no PEP to hand.
  pts() {
    if (this.pep < 1) return false;
    this.pep--;
    this.made.glucose++;
    this.made.pyruvate++;
    return true;
  }

  // Glucose freed inside the cell (a digesting vesicle): glucokinase phosphorylates it with ATP.
  glucokinase() {
    this.made.glucose++;
    this.invest();
  }

  invest() {
    this.made.atpInvested++;
    this.atp = Math.max(0, this.atp - 1);
  }

  substrateAtp() {
    this.made.atpSubstrate++;
    this.gainAtp();
  }

  // One ATP into the pool. What a full pool cannot hold is counted as spilled, not as made.
  gainAtp() {
    const max = this.config.maxAtp;
    this.made.atpSpilled += Math.max(this.atp + 1 - max, 0);
    this.atp = Math.min(this.atp + 1, max);
  }

  // ATP that reached the pool: made at the substrate level and by the synthases, less any spilled.
  get atpMade() {
    return this.made.atpSubstrate + this.made.atpSynthase - this.made.atpSpilled;
  }

  pepBack() {
    this.pep++;
  }

  gapdh() {
    this.made.nadh++;
  }

  pyruvateKinase() {
    this.made.pyruvate++;
    this.substrateAtp();
  }

  pdh() {
    this.made.nadh++;
    this.made.co2++;
    this.made.acetylCoA++;
  }

  // isocitrate and α-ketoglutarate dehydrogenase
  decarboxylate() {
    this.made.nadh++;
    this.made.co2++;
  }

  malateDehydrogenase() {
    this.made.nadh++;
  }

  sdh() {
    this.made.qh2Sdh++;
  }

  complexI() {
    this.made.nadhOxidised++;
    this.made.qh2ComplexI++;
    this.translocate(4);
  }

  bo3() {
    this.made.qh2Oxidised++;
    this.translocate(4);
  }

  bd() {
    this.made.qh2Oxidised++;
    this.translocate(2);
  }

  translocate(n) {
    this.made.protonsRespiration += n;
    this.protons += n;
  }

  oxygen() {
    this.made.o2++;
  }

  pfl() {
    this.made.formate++;
    this.made.acetylCoA++;
  }

  acetateKinase() {
    this.made.acetate++;
    this.substrateAtp();
  }

  nadhToAlcohol() {
    this.nadhHeld++;
  }

  // Oxygen is back: an NADH that waited at alcohol dehydrogenase goes to complex I after all.
  releaseNadh() {
    if (this.nadhHeld < 1) return false;
    this.nadhHeld--;
    return true;
  }

  // Acetyl-CoA -> ethanol takes two NADH. False: not enough NADH has arrived yet.
  alcohol() {
    if (this.nadhHeld < 2) return false;
    this.nadhHeld -= 2;
    this.made.ethanol++;
    this.made.nadhOxidised += 2;
    return true;
  }

  aminoAcid(toProtein) {
    this.made.aminoAcids++;
    if (toProtein) return;
    this.made.nh3++;
    this.made.pyruvate++;
  }

  // One H+ leaves the periplasmic pool for a synthase or a motor. False: the pool is empty.
  drawProton() {
    if (this.protons < 1) return false;
    this.protons--;
    return true;
  }

  // One H+ through synthase i's c-ring (36°). True when a β subunit lets go of an ATP: every 120°,
  // which with ten c-subunits is after the 4th, 7th and 10th proton of each turn.
  synthaseProton(i) {
    this.made.protonsSynthase++;
    const c = ++this.rotor[i];
    if (c >= 10) this.rotor[i] = 0;
    if (c !== 4 && c !== 7 && c !== 10) return false;
    this.made.atpSynthase++;
    this.gainAtp();
    return true;
  }

  takeAtp() {
    if (this.atp < 1) return false;
    this.atp--;
    return true;
  }

  // An ATP burnt by synthase i running backwards: 10/3 H+ pumped out per ATP. Returns how many H+
  // leave now (3 or 4, so that three ATP pump exactly ten).
  synthaseReverse(i) {
    this.made.atpHydrolysed++;
    const paid = this.paid[i] + 10;
    const n = Math.floor(paid / 3);
    this.paid[i] = paid - 3 * n;
    this.made.protonsReverse += n;
    this.protons += n;
    return n;
  }

  motorProton() {
    this.made.protonsMotor++;
  }

  // The slow, diffuse parts: proton leak, ATP used by translation and chemotaxis. fed (0..1): how
  // well the cell is eating; a starving cell slows translation right down (ppGpp, the stringent
  // response), which is what lets it sit out a famine.
  tick(dt, fed = 1) {
    const c = this.config;
    const mv = -this.pmf;
    const leak = Math.min(this.protons, c.leak * this.protons * (1 + Math.exp((mv - c.leakKnee) / 5)) * dt);
    this.protons -= leak;
    this.made.protonsLeak += leak;
    const a = this.atpFraction;
    const growth = c.translation * smooth(0.05, 0.45, a) * (c.starved + (1 - c.starved) * clamp(fed, 0, 1));
    const use = Math.min(this.atp, (growth + c.chemotaxis * smooth(0.02, 0.2, a)) * dt);
    this.atp -= use;
    this.made.atpUsed += use;
  }
}

// ------------------------------------------------------------------------------------- beads
const K = { glucose: 0, hexose: 1, triose: 2, pyruvate: 3, acetyl: 4, tca: 5, nadh: 6, qh2: 7, proton: 8, atp: 9, o2: 10, co2: 11, ferment: 12, amino: 13, nh3: 14 };
// How each kind is drawn: colour, radius up close (µm), smallest radius on screen (px of a view
// FLOOR_VIEW px tall, so a bead stays a clear dot from the default camera, 6 µm off, at any
// resolution; 0: none), brightness, form and a white-hot core.
// Beads are luminous pearls, drawn lighter than the darker enzyme lumps they visit. They are told
// apart by value and shape as well as hue:
//   ATP is the one saturated gold, bigger than the rest, with a white-hot core;
//   glucose is pale champagne (the glycogen family; Feeding's motes);
//   the sugar route, glucose-6-P to pyruvate, is light apricot (off the nucleoid's amber);
//   acetyl-CoA and the TCA intermediates are light rose pearls on the cycle's magenta enzymes;
//   NADH is blue; QH2 a lilac-white lozenge flat in the membrane (unlike the round polysome beads);
//   H+ cyan specks; the gases and NH3 plain greys and blues.
// A moving comet bead stretches into a teardrop along its path (one instance, no trailing pearls).
const ROUND = 0, COMET = 1, LOZENGE = 2;
const FLOOR_VIEW = 540; // px: the view height the smallest sizes below are given for
const STYLE = [
  [0xf3e6b0, 0.0095, 3.0, 1.1, COMET, 0], // glucose
  [0xffb27a, 0.009, 3.5, 1.3, COMET, 0], // glucose-6-P .. fructose-1,6-bisP
  [0xffb27a, 0.0085, 3.4, 1.3, COMET, 0], // trioses .. PEP
  [0xffb27a, 0.0085, 3.4, 1.3, COMET, 0], // pyruvate
  [0xff9cc8, 0.009, 3.5, 1.3, COMET, 0], // acetyl-CoA
  [0xff9cc8, 0.009, 3.5, 1.3, COMET, 0], // the TCA cycle's intermediates
  [0x2f6ff0, 0.0085, 3.5, 1.45, COMET, 0], // NADH
  [0xcdb8ff, 0.0085, 3.3, 1.3, LOZENGE, 0], // QH2
  [METABOLITE.proton, 0.0048, 0, 1.6, ROUND, 0], // H+: a fine sparkle, there are many (drawn only up close)
  [0xffcc1a, 0.011, 4.1, 1.75, COMET, 1], // ATP
  [0x7fc2f2, 0.007, 2.6, 1.15, ROUND, 0], // O2
  [0xb3bccb, 0.007, 2.6, 1.05, ROUND, 0], // CO2
  [METABOLITE.ferment, 0.0075, 3.1, 1.2, ROUND, 0], // formate, acetate, ethanol
  [METABOLITE.aminoAcid, 0.0085, 3.5, 1.4, COMET, 0], // amino acids
  [0xb3bccb, 0.0065, 2.6, 1.05, ROUND, 0], // NH3, grey like CO2
];
// The legend: one row per colour family, the colours exactly the beads'.
const LEGEND = [
  ['glucose', 'glucose', [K.glucose]],
  ['sugar', 'glucose-6-P → pyruvate', [K.hexose, K.triose, K.pyruvate]],
  ['acetylCoA', 'acetyl-CoA · TCA cycle', [K.acetyl, K.tca]],
  ['nadh', 'NADH', [K.nadh]],
  ['qh2', 'QH₂ (ubiquinol)', [K.qh2]],
  ['proton', 'H⁺', [K.proton]],
  ['atp', 'ATP', [K.atp]],
  ['o2', 'O₂', [K.o2]],
  ['co2', 'CO₂ · NH₃', [K.co2, K.nh3]],
  ['ferment', 'formate · acetate · ethanol', [K.ferment]],
  ['aminoAcid', 'amino acids', [K.amino]],
];

// What a bead is doing (its task decides what happens when it arrives).
const T = {
  glucose: 1, // crossing the envelope into a PTS (step 1: waiting there for a PEP)
  hexose: 2, // glucose-6-P down glycolysis (step = enzyme it is at)
  triose: 3,
  pep: 4, // PEP back to the PTS
  pyruvate: 5, // to the pyruvate node (PDH; pyruvate formate-lyase when fermenting)
  acetyl: 6, // acetyl-CoA to citrate synthase
  tca: 7, // round the cycle (step = place in LOOP)
  nadh: 8, // to complex I (site >= 0) or alcohol dehydrogenase (site -1)
  qh2: 9, // along the membrane to bo3 (flag 0) or bd (flag 1)
  o2: 10,
  hOut: 11, // just pumped into the periplasm (step 1: wandering, then gone into the pool)
  hSynth: 12, // into an ATP synthase
  hMotor: 13, // into a flagellar motor's stators
  atp: 14, // to a polysome
  spend: 15, // ATP into an enzyme that invests it
  atpBack: 16, // ATP into a synthase running backwards
  out: 17, // waste leaving the cell (CO2, formate, acetate, ethanol, NH3)
  ferment: 18, // acetyl-CoA to acetate kinase (flag 0) or alcohol dehydrogenase (flag 1)
  ethanolWait: 19, // at alcohol dehydrogenase for its two NADH (step: how many 0.2 s waits so far)
  amino: 20, // amino acid from a vesicle to a polysome (flag 0) or to deamination (flag 1)
  vesicleGlucose: 21, // glucose from a vesicle to glucokinase
  hSynthIn: 22, // (only a case label: the end of T.hSynth)
};
// Tasks whose arrival does chemistry the books depend on. The others only show something the
// ledger has already counted (or settles on the spot), so they can make way when the pool is full.
const CRITICAL = new Uint8Array(32);
for (const t of ['glucose', 'hexose', 'triose', 'pep', 'pyruvate', 'acetyl', 'tca', 'nadh', 'qh2', 'ferment', 'ethanolWait', 'amino', 'vesicleGlucose']) CRITICAL[T[t]] = 1;
const GAP = -1; // the TCA loop's place at succinate dehydrogenase
const LOOP = [3, 4, 5, 6, GAP, 0, 1]; // from citrate synthase (2): aconitase ... malate dehydrogenase
const E_INOUT = 0, E_OUT = 1, E_IN = 2, E_LIN = 3;
const SPIN = TAU / 10; // 36° per H+
const PERI = 0.462; // the middle of the drawn periplasm (inner membrane 0.42, outer 0.5)

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _e1 = new THREE.Vector3();
const _e2 = new THREE.Vector3();
const _w = new THREE.Vector3();
const _bx = new THREE.Vector3();
const _by = new THREE.Vector3();
const _bz = new THREE.Vector3();
const _ni = new Int16Array(4);
const _nd = new Float32Array(4);
const NEAR_W = [1, 0.3, 0.12, 0.05]; // mostly the nearest: the flows stay few and coherent

const depthOf = (x, y, z) => Math.hypot(x, y, Math.max(Math.abs(z) - 0.5, 0));
// The point at distance r from the reference capsule's core, in the direction of (x, y, z).
function atDepth(x, y, z, r, out) {
  const cz = clamp(z, -0.5, 0.5);
  let dx = x, dy = y, dz = z - cz;
  let l = Math.hypot(dx, dy, dz);
  if (l < 1e-6) {
    dx = 1;
    dy = dz = 0;
    l = 1;
  }
  return out.set((dx / l) * r, (dy / l) * r, cz + (dz / l) * r);
}
// Two unit vectors in the plane across `n`.
function across(n, e1, e2) {
  e1.set(0, 0, 1).cross(n);
  if (e1.lengthSq() < 1e-4) e1.set(1, 0, 0).cross(n);
  e1.normalize();
  e2.crossVectors(n, e1);
}
// A random one of the k sites nearest (x, y, z), nearer ones likelier. -1 if there are none.
function pickNear(list, x, y, z, k = 3, key = 'pos') {
  const n = list.length;
  if (!n) return -1;
  k = Math.min(k, n, 4);
  let m = 0;
  for (let i = 0; i < n; i++) {
    const p = list[i][key] ?? list[i].pos;
    const d = (p.x - x) ** 2 + (p.y - y) ** 2 + (p.z - z) ** 2;
    if (m === k && d >= _nd[k - 1]) continue;
    let j = m < k ? m++ : k - 1;
    while (j > 0 && _nd[j - 1] > d) {
      _nd[j] = _nd[j - 1];
      _ni[j] = _ni[j - 1];
      j--;
    }
    _nd[j] = d;
    _ni[j] = i;
  }
  let sum = 0;
  for (let j = 0; j < m; j++) sum += NEAR_W[j];
  let r = Math.random() * sum;
  for (let j = 0; j < m; j++) if ((r -= NEAR_W[j]) <= 0) return _ni[j];
  return _ni[0];
}

// A stand-in for a membrane machine bacterium.js did not provide, so the route still runs.
function looseSite(x, y, z) {
  const pos = atDepth(x, y, z, 0.42, new THREE.Vector3());
  const normal = atDepth(x, y, z, 1, new THREE.Vector3()).sub(atDepth(x, y, z, 0, new THREE.Vector3())).normalize();
  return { pos, normal, inner: pos.clone().addScaledVector(normal, -0.04), flash() {}, spin() {} };
}

// Pyruvate dehydrogenase: in E. coli a 4.6 MDa complex, a core of 24 E2 chains with E1 and E3
// clustered round it, about the size of a ribosome (drawn ~1.4x like the ribosomes). Drawn as the
// cytoplasm's other enzymes are, a cluster of soft lumps of different sizes melted together: the
// E2 core and seven E1/E3 lumps round it, with no cube in its silhouette.
const PDH_LUMPS = [
  [0, 0, 0, 0.62],
  [0.62, 0.22, 0.12, 0.42],
  [-0.48, 0.45, 0.2, 0.38],
  [0.08, -0.6, 0.36, 0.4],
  [-0.3, -0.18, -0.62, 0.36],
  [0.32, 0.5, -0.46, 0.33],
  [-0.58, -0.4, 0.04, 0.3],
  [0.22, 0.04, 0.66, 0.31],
];
function pdhGeometry(r) {
  let g = new THREE.IcosahedronGeometry(1, 4);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g);
  const pos = g.attributes.position;
  const k = 14; // how softly the lumps melt into each other
  for (let i = 0; i < pos.count; i++) {
    _a.fromBufferAttribute(pos, i).normalize();
    // How far out along this direction the lumps reach (a smooth maximum over them).
    let sum = 0;
    for (const [x, y, z, rad] of PDH_LUMPS) {
      const dc = _a.x * x + _a.y * y + _a.z * z;
      const disc = dc * dc - (x * x + y * y + z * z) + rad * rad;
      if (disc > 0) sum += Math.exp(k * (dc + Math.sqrt(disc)));
    }
    const reach = Math.log(Math.max(sum, 1e-9)) / k;
    const ripple = 1 + 0.03 * Math.sin(_a.x * 9.1 + 1.2) * Math.sin(_a.y * 8.3 + 0.4) * Math.sin(_a.z * 7.7 + 2.1);
    pos.setXYZ(i, _a.x * r * reach * ripple, _a.y * r * reach * ripple, _a.z * r * reach * ripple);
  }
  g.computeVertexNormals();
  return g;
}

// The beads' material: tokenMaterial (so they flow with the cell and share its light and fog) with
// two extras per bead from the attribute aShape: x stretches the back half (local -z) into a
// comet's tail, 1 = round; y lights a white-hot core (ATP), kept to the middle so the bead still
// reads as gold from afar rather than as a white disc in a gold ring. Normals follow non-uniform
// instance scales (QH2's lozenge). If tokenMaterial's shader ever changes so the patch no longer
// applies, the beads stay plain round pearls.
function beadMaterial(shape) {
  const m = tokenMaterial({ shape });
  const V0 = 'vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);';
  const N0 = 'vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);';
  const F0 = 'vec3 c = vColor * (0.55 + 0.75 * pow(facing, 1.2));';
  const VAR = 'varying vec3 vN;';
  if (![V0, N0, VAR].every((s) => m.vertexShader.includes(s)) || ![F0, VAR].every((s) => m.fragmentShader.includes(s))) {
    console.warn('metabolism: tokenMaterial changed, beads drawn round');
    return m;
  }
  m.vertexShader = m.vertexShader
    .replace(VAR, `attribute vec2 aShape; varying float vCore; ${VAR}`)
    .replace(
      V0,
      `vec3 pp = position, nn = normal;
        if (pp.z < 0.0) {
          float k = -pp.z, f = aShape.x;
          pp.z *= f;
          pp.xy *= 1.0 - 0.2 * (f - 1.0) * k * k;
          nn.z /= f;
        }
        vCore = aShape.y;
        vec4 wp = modelMatrix * instanceMatrix * vec4(pp, 1.0);`,
    )
    .replace(N0, 'vN = normalize(mat3(modelMatrix) * (transpose(inverse(mat3(instanceMatrix))) * nn));');
  m.fragmentShader = m.fragmentShader
    .replace(VAR, `varying float vCore; ${VAR}`)
    .replace(F0, `${F0}\n        c = mix(c, vec3(2.4, 2.3, 2.0), vCore * smoothstep(0.8, 0.98, facing));`);
  return m;
}

// Where the membrane at reference point (x, y, z) has sunk into an endocytic pocket, added to out.
// The same as bacterium.js's dentShift() (and CellPass's dents()), which carries the membrane
// complexes into a pocket; beads bound for them follow.
function addDent(shape, x, y, z, out) {
  for (let k = 0; k < shape.uDentN.value.length; k++) {
    const N = shape.uDentN.value[k];
    if (N.w <= 0) continue;
    const C = shape.uDentC.value[k];
    const r = C.w;
    const wx = x - C.x, wy = y - C.y, wz = z - C.z;
    const along = wx * N.x + wy * N.y + wz * N.z;
    const l2 = wx * wx + wy * wy + wz * wz - along * along;
    const near = THREE.MathUtils.smoothstep(along, -2.2 * r - N.w, -0.6 * r);
    const pocket = N.w * Math.exp(-l2 / (r * r)) * near;
    const lid = shape.uDentP.value[k] * pocket * Math.exp(-(((along + 0.35 * r) / (0.45 * r)) ** 2));
    const d = pocket - 1.1 * lid;
    out.x -= N.x * d;
    out.y -= N.y * d;
    out.z -= N.z * d;
  }
  return out;
}

// ------------------------------------------------------------------------------------- metabolism
export class Metabolism {
  // capacity: beads in the pool (one instance each)
  constructor(hero, { capacity = 420 } = {}) {
    this.hero = hero;
    this.layout();
    this.ledger = new Ledger({ synthases: this.syn.length });
    this.mode = 'respiration';
    this.oxygen = 1;
    this.halfO2 = 0; // half O2 molecules delivered to oxidases but not yet used
    this.aminoToggle = 0;
    this.hLod = 1; // how much of the H+ circuit is drawn (0 when the camera is too far for it)
    this.motorTurn = 0;
    this.fed = 0.5;
    this.carbonSeen = 0;
    this.acc = { motor: 0, synth: 0, reverse: 0, feed: 0 };
    this.spinPending = new Float32Array(this.syn.length);
    // How much H+ has just been pumped near each synthase. Protons spread through the whole
    // periplasm in reality; drawing them at the synthases next to the pumps keeps each patch's
    // circuit (pump -> H+ -> synthase -> ATP) together where you can follow it.
    this.heat = new Float32Array(this.syn.length);
    this.waiting = new Int16Array(160); // H+ beads just pumped out, free to be taken
    this.nWaiting = 0;
    this.activity = { glycolysis: 0.15, tca: 0.15, pdh: 0 };
    this.camera = null;
    // Radians per pixel of a view FLOOR_VIEW px tall, the unit of the beads' smallest sizes (Feeding
    // sizes its motes by it too, to match them), and per pixel of the real screen.
    this.pxAngle = (2 * Math.tan((42 * Math.PI) / 360)) / FLOOR_VIEW;
    this.screenAngle = this.pxAngle;
    this.rate = { glucose: 0, atp: 0, protons: 0 };
    this.last = { glucose: 0, atp: 0, protons: 0 };
    this.state = {
      atp: 0, atpCount: 0, nadh: 0, protons: 0, pmf: 0, pmfFraction: 0, motorPower: 1,
      mode: 'respiration', modeNote: null,
      totals: { glucose: 0, co2: 0, o2: 0, atpMade: 0, nadh: 0, protonsPumped: 0, ethanol: 0, acetate: 0, formate: 0 },
      rates: { glucosePerMin: 0, atpPerSec: 0, protonsPerSec: 0 },
    };
    this.buildBeads(capacity);
    this.buildPdh();
    this.buildAnchors();
    // count: beads of that family in the cell right now (drawn ones)
    this.legend = LEGEND.map(([key, label, kinds]) => {
      const color = STYLE[kinds[0]][0];
      return { key, label, color, css: `#${color.toString(16).padStart(6, '0')}`, count: 0 };
    });
    this.legendOf = new Uint8Array(STYLE.length); // bead kind -> legend row
    LEGEND.forEach(([, , kinds], row) => kinds.forEach((k) => (this.legendOf[k] = row)));

    // Debug switches (as ?frames in main.js): ?glucose=0.6 feeds that many glucose per second at the
    // PTS, ?oxygen=0.1 overrides the oxygen level, ?warm=8 runs the route for 8 s before the first
    // frame, so a screenshot shows it in full flow.
    const q = typeof location !== 'undefined' ? new URLSearchParams(location.search) : null;
    this.debugFeed = q && q.has('glucose') ? +q.get('glucose') || 0.6 : 0;
    this.debugOxygen = q && q.has('oxygen') ? +q.get('oxygen') : null;
    this.warm = q && q.has('warm') ? +q.get('warm') || 8 : 0;
    this.refresh(0, 0);
  }

  // ----------------------------------------------------------------------------------- layout
  layout() {
    const S = this.hero.sites ?? {};
    const list = (k) => (Array.isArray(S[k]) ? S[k] : []);
    this.pts = list('pts');
    this.cI = list('complexI');
    this.sdh = list('sdh');
    this.bo3 = list('bo3');
    this.bd = list('bd');
    this.syn = list('atpSynthase');
    this.mot = list('motors');
    this.rib = list('ribosomes');
    if (!this.pts.length) this.pts = [looseSite(-0.26, -0.33, 0.36)];
    if (!this.cI.length) this.cI = [looseSite(-0.14, -0.4, -0.41)];
    if (!this.sdh.length) this.sdh = [looseSite(-0.15, -0.39, -0.36)];
    if (!this.bo3.length && !this.bd.length) this.bo3 = [looseSite(-0.15, -0.39, -0.29)];
    if (!this.syn.length) this.syn = [looseSite(-0.11, -0.4, -0.32)];

    // Glycolysis: the nine enzymes, G6P end first (or a line under the first PTS if absent).
    const p0 = this.pts[0];
    const ge = Array.isArray(S.glycolysisEnzymes) && S.glycolysisEnzymes.length >= 9 ? S.glycolysisEnzymes : null;
    this.gly = [];
    for (let k = 0; k < 9; k++) {
      if (ge) this.gly.push(ge[k].pos.clone());
      else this.gly.push(p0.pos.clone().addScaledVector(p0.normal, -0.06 - 0.01 * k).add(_a.set(0, 0, -0.035 * k)));
    }
    // TCA: seven enzymes from fumarase to succinyl-CoA synthetase, and the gap at SDH.
    const tca = S.tca;
    this.tcaE = [];
    if (tca?.enzymes?.length >= 7) for (let k = 0; k < 7; k++) this.tcaE.push(tca.enzymes[k].pos.clone());
    else {
      const c = tca?.center ?? this.sdh[0].inner.clone().addScaledVector(this.sdh[0].normal, -0.1);
      const ax = tca?.axis ?? this.sdh[0].normal;
      const rad = tca?.radius ?? 0.1;
      across(ax, _e1, _e2);
      for (let k = 0; k < 7; k++) {
        const a = 0.55 + (k * (TAU - 1.1)) / 6;
        this.tcaE.push(c.clone().addScaledVector(_e1, Math.cos(a) * rad).addScaledVector(_e2, Math.sin(a) * rad));
      }
    }
    this.gap = (tca?.gap ?? this.sdh[0].inner).clone();
    // The SDH the loop runs past: the one nearest the gap.
    this.sdhAt = pickNear(this.sdh, this.gap.x, this.gap.y, this.gap.z, 1);

    // The pyruvate node, between the end of glycolysis and citrate synthase, where pyruvate
    // dehydrogenase sits (and pyruvate formate-lyase when there is no oxygen), kept clear of the
    // polysomes.
    const node = this.gly[8].clone().lerp(this.tcaE[2], 0.5);
    atDepth(node.x, node.y, node.z, 0.3, node);
    for (let it = 0; it < 8; it++) {
      let near = null, dmin = 0.065;
      for (const r of this.rib) {
        const d = r.pos.distanceTo(node);
        if (d < dmin) (dmin = d), (near = r.pos);
      }
      if (!near) break;
      node.addScaledVector(_a.subVectors(node, near).normalize(), 0.065 - dmin + 0.005);
    }
    this.node = node;
    // Fermentation: acetate kinase and alcohol dehydrogenase on either side of it.
    _a.subVectors(this.gly[8], this.tcaE[2]).normalize();
    atDepth(node.x, node.y, node.z, 1, _b).sub(atDepth(node.x, node.y, node.z, 0, _c)).normalize();
    _c.crossVectors(_b, _a).normalize();
    this.ack = node.clone().addScaledVector(_c, 0.055).addScaledVector(_b, -0.02);
    this.adh = node.clone().addScaledVector(_c, -0.055).addScaledVector(_b, -0.02);
  }

  buildBeads(n) {
    this.capacity = n;
    this.reserve = Math.round(n * 0.22); // kept free for the route's own steps; pool draws stop short of it
    this.alive = new Uint8Array(n);
    this.kind = new Uint8Array(n);
    this.task = new Uint8Array(n);
    this.step = new Int16Array(n);
    this.site = new Int16Array(n);
    this.flag = new Uint8Array(n);
    this.t = new Float32Array(n);
    this.dur = new Float32Array(n);
    this.dwell = new Float32Array(n);
    this.ease = new Uint8Array(n);
    this.wob = new Float32Array(n);
    this.ph = new Float32Array(n);
    this.age = new Float32Array(n);
    this.die = new Float32Array(n);
    this.dieDur = new Float32Array(n);
    this.size = new Float32Array(n);
    this.A = new Float32Array(n * 3);
    this.B = new Float32Array(n * 3);
    this.C = new Float32Array(n * 3);
    this.freeList = new Int16Array(n);
    for (let i = 0; i < n; i++) this.freeList[i] = n - 1 - i;
    this.nFree = n;
    this.hi = -1;
    this.critical = 0; // beads on route steps that matter to the books
    this.atPts = 0; // glucose in or on its way into a transporter
    this.taskCount = new Uint16Array(32);
    this.kindCount = new Uint16Array(16);
    this.base = STYLE.map(([hex]) => new THREE.Color(hex));
    this.mesh = null;
    if (!this.hero.body || !this.hero.shape) return; // headless: the ledger and the beads still run
    // One instance per bead. Beads are a few to a dozen pixels across in a 540 px view, and their
    // floor grows with the screen: 320 triangles keep a big one's edge round on a 4K display.
    const geo = new THREE.IcosahedronGeometry(1, 2);
    const shapeAttr = new THREE.InstancedBufferAttribute(new Float32Array(n * 2), 2);
    shapeAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aShape', shapeAttr);
    const mesh = new THREE.InstancedMesh(geo, beadMaterial(this.hero.shape), n);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3);
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceMatrix.array.fill(0);
    this.shapeAttr = shapeAttr;
    mesh.count = 1;
    mesh.frustumCulled = false;
    // The camera, for the beads' smallest size on screen (read on the next update).
    mesh.onBeforeRender = (renderer, scene, camera) => {
      this.camera = camera;
      if (camera.isPerspectiveCamera) {
        const span = 2 * Math.tan((camera.fov * Math.PI) / 360);
        this.pxAngle = span / FLOOR_VIEW;
        this.screenAngle = span / Math.max(renderer.domElement.height, 1);
      }
    };
    this.hero.body.add(mesh);
    this.mesh = mesh;
  }

  buildPdh() {
    this.pdhMesh = null;
    if (!this.hero.body || !this.hero.shape) return;
    // In the enzymes' family: between glycolysis's amber and the TCA cycle's magenta, a rose-red a
    // shade darker than the beads it turns over; it brightens as it works.
    this.pdhRest = new THREE.Color(0xc9466a);
    this.pdhVivid = new THREE.Color(0xe8506f);
    const mat = organicMaterial({ color: this.pdhRest, glow: 0.2, shape: this.hero.shape, translucency: 0.5, nearFade: [0.08, 0.3] });
    const m = new THREE.Mesh(pdhGeometry(0.023), mat);
    m.position.copy(this.node);
    m.rotation.set(0.6, 0.3, 0.9);
    m.frustumCulled = false;
    this.hero.body.add(m);
    this.pdhMesh = m;
  }

  buildAnchors() {
    this.anchors = [];
    this.anchorRefs = [];
    if (!this.hero.body) return;
    const at = (ref) => {
      const o = new THREE.Object3D();
      this.hero.body.add(o);
      this.anchorRefs.push({ obj: o, ref: ref.clone() });
      return o;
    };
    const add = (key, title, sub, ref, angle, len, interior = true) => this.anchors.push({ key, title, sub, obj: at(ref), angle, len, interior });
    const g = this.gap;
    const ci = this.cI[pickNear(this.cI, g.x, g.y, g.z, 1)];
    const ox = this.bo3.length ? this.bo3[pickNear(this.bo3, g.x, g.y, g.z, 1)] : this.bd[0];
    add('pts', 'Glucose transporter (PTS)', 'glucose in, phosphorylated by PEP on its way through', this.pts[0].pos, -100, 80);
    add('pdh', 'Pyruvate dehydrogenase', 'pyruvate → acetyl-CoA + CO₂ + NADH · without O₂, pyruvate formate-lyase', this.node, 125, 95);
    add('complexI', 'NADH dehydrogenase I', 'complex I · NADH → QH₂ · pumps 4 H⁺ out', ci.inner, 55, 95);
    add('oxidase', 'Cytochrome bo₃ oxidase', 'QH₂ + ½ O₂ → H₂O · 4 H⁺ out · low O₂: cytochrome bd, 2 H⁺', ox.pos, -65, 105);
    atDepth(g.x, g.y, g.z, PERI, _a);
    add('protons', 'Proton motive force', 'H⁺ pumped into the periplasm · drives ATP synthase and the motors', _a, 95, 70, false);
  }

  // ----------------------------------------------------------------------------------- API
  // One glucose arriving at a PTS (Feeding calls this). With an index, Feeding has already brought
  // it into that transporter, so the bead starts there; without one it comes in from the water to a
  // transporter of the uptake patch. False when the cell is too busy to take it.
  uptakeGlucose(ptsIndex) {
    // The PTS is saturated when glucose would queue for PEP (glycolysis hands one back per glucose).
    // Only the route itself can be too busy: beads that are only pictures make way (spawn evicts).
    if (this.atPts >= this.ledger.pep + 2) return false;
    if (this.critical > this.capacity * 0.45) return false;
    const given = Number.isInteger(ptsIndex) && ptsIndex >= 0 && ptsIndex < this.pts.length;
    const k = given ? ptsIndex : Math.floor(Math.random() * Math.min(4, this.pts.length));
    const s = this.pts[k];
    _a.copy(s.pos).addScaledVector(s.normal, given ? 0.012 : 0.17);
    const i = this.spawn(K.glucose, T.glucose, _a, k);
    if (i < 0) return false;
    this.atPts++;
    if (given) {
      // Feeding's mote has just narrowed into the channel: the bead takes over at its size
      this.age[i] = 0.07;
      this.line(i, s.pos, 0.12, E_INOUT, 0);
    } else this.line(i, s.pos, 0.8, E_INOUT, 0.1);
    return true;
  }

  // Monomers from a digesting vesicle, at posRef (reference body space).
  deliver(kind, posRef) {
    if (!posRef || this.critical > this.capacity * 0.5) return false;
    if (kind === 'glucose') {
      const i = this.spawn(K.glucose, T.vesicleGlucose, posRef);
      if (i < 0) return false;
      const d = this.travel(i, this.gly[0], 0.3, 0.6, 2.2, 0.03);
      this.spendInto(this.gly[0], d);
      return true;
    }
    if (kind === 'aminoAcid') {
      const i = this.spawn(K.amino, T.amino, posRef);
      if (i < 0) return false;
      this.aminoToggle ^= 1;
      const r = this.aminoToggle && this.rib.length ? pickNear(this.rib, posRef.x, posRef.y, posRef.z, 4) : -1;
      this.flag[i] = r >= 0 ? 0 : 1;
      this.site[i] = r;
      this.travel(i, r >= 0 ? this.rib[r].pos : this.node, 0.35, 0.6, 2.4, 0.03);
      return true;
    }
    return false;
  }

  // ----------------------------------------------------------------------------------- beads
  spawn(kind, task, p, site = -1, flag = 0) {
    if (!this.nFree && CRITICAL[task]) this.evict();
    if (!this.nFree) return -1;
    const i = this.freeList[--this.nFree];
    this.alive[i] = 1;
    this.kind[i] = kind;
    this.task[i] = task;
    this.step[i] = 0;
    this.site[i] = site;
    this.flag[i] = flag;
    this.t[i] = 0;
    this.dur[i] = 0;
    this.dwell[i] = 0;
    this.ease[i] = E_INOUT;
    this.wob[i] = 0.003;
    this.ph[i] = Math.random() * TAU;
    this.age[i] = 0;
    this.die[i] = -1;
    this.size[i] = 0.9 + 0.2 * Math.random();
    const o = i * 3;
    this.A[o] = this.B[o] = this.C[o] = p.x;
    this.A[o + 1] = this.B[o + 1] = this.C[o + 1] = p.y;
    this.A[o + 2] = this.B[o + 2] = this.C[o + 2] = p.z;
    if (i > this.hi) this.hi = i;
    return i;
  }

  // Make room for a step of the route: retire a bead that is only a picture, settling now whatever
  // it was going to do on arrival.
  evict() {
    for (let i = this.hi; i >= 0; i--) {
      if (!this.alive[i] || CRITICAL[this.task[i]]) continue;
      if (this.die[i] < 0) this.settle(i);
      this.free(i);
      return true;
    }
    return false;
  }

  settle(i) {
    const L = this.ledger, k = this.site[i];
    switch (this.task[i]) {
      case T.hOut:
        this.unwait(i);
        return;
      case T.hSynth:
        this.spinPending[k] += SPIN;
        L.synthaseProton(k);
        return;
      case T.hMotor:
        L.motorProton();
        return;
      case T.atpBack:
        this.spinPending[k] -= L.synthaseReverse(k) * SPIN;
        return;
      case T.o2:
        L.oxygen();
        return;
    }
  }

  free(i) {
    this.alive[i] = 0;
    this.freeList[this.nFree++] = i;
    if (this.mesh) this.mesh.instanceMatrix.array.fill(0, i * 16, i * 16 + 16);
    while (this.hi >= 0 && !this.alive[this.hi]) this.hi--;
  }

  end(i, time = 0.18) {
    this.die[i] = time;
    this.dieDur[i] = time;
  }

  // A new leg from where the bead is now to `to`. sag: hug the membrane at the depth of the shallower
  // end minus sag (an arc under the membrane); null: a gentle curve of `curl` of its length.
  leg(i, to, dur, ease, sag, curl, dwell) {
    const o = i * 3;
    const ax = (this.A[o] = this.B[o]), ay = (this.A[o + 1] = this.B[o + 1]), az = (this.A[o + 2] = this.B[o + 2]);
    this.B[o] = to.x;
    this.B[o + 1] = to.y;
    this.B[o + 2] = to.z;
    let mx = (ax + to.x) / 2, my = (ay + to.y) / 2, mz = (az + to.z) / 2;
    if (sag !== null) {
      const r = Math.min(depthOf(ax, ay, az), depthOf(to.x, to.y, to.z)) - sag;
      atDepth(mx, my, mz, Math.max(r, 0.05), _w);
      this.C[o] = 2 * _w.x - mx;
      this.C[o + 1] = 2 * _w.y - my;
      this.C[o + 2] = 2 * _w.z - mz;
    } else {
      const L = Math.hypot(to.x - ax, to.y - ay, to.z - az) * curl;
      _w.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(L);
      this.C[o] = mx + _w.x;
      this.C[o + 1] = my + _w.y;
      this.C[o + 2] = mz + _w.z;
    }
    this.t[i] = 0;
    this.dur[i] = dur + dwell;
    this.dwell[i] = dwell;
    this.ease[i] = ease;
  }

  hop(i, to, dur, ease = E_INOUT, sag = 0.006, dwell = 0) {
    this.leg(i, to, dur, ease, sag, 0, dwell);
  }

  line(i, to, dur, ease = E_INOUT, curl = 0.15, dwell = 0) {
    this.leg(i, to, dur, ease, null, curl, dwell);
  }

  // A hop whose time follows its length (speed µm/s), clamped. Returns the time to arrive.
  travel(i, to, speed, lo, hi, sag = 0.02, dwell = 0, ease = E_INOUT) {
    const o = i * 3;
    const d = Math.hypot(to.x - this.B[o], to.y - this.B[o + 1], to.z - this.B[o + 2]);
    const dur = clamp(d / speed, lo, hi);
    this.hop(i, to, dur, ease, sag, dwell);
    return dur + dwell;
  }

  hold(i, time, wob = 0.004) {
    const o = i * 3;
    _w.set(this.B[o], this.B[o + 1], this.B[o + 2]);
    this.line(i, _w, time, E_LIN, 0, 0);
    this.wob[i] = wob;
  }

  pos(i, out) {
    const o = i * 3;
    return out.set(this.B[o], this.B[o + 1], this.B[o + 2]);
  }

  // ----------------------------------------------------------------------------------- route
  // What happens when bead i reaches the end of its leg.
  arrive(i) {
    const L = this.ledger;
    const s = this.step[i];
    switch (this.task[i]) {
      case T.glucose: {
        // In the PTS: if a PEP is to hand it phosphorylates the glucose and becomes pyruvate.
        const site = this.pts[this.site[i]];
        if (!L.pts()) {
          this.step[i] = 1;
          this.hold(i, 0.25, 0.006);
          return;
        }
        site.flash?.(1);
        this.atPts--;
        this.pos(i, _a);
        const p = this.spawn(K.pyruvate, T.pyruvate, _a);
        if (p >= 0) this.hop(p, site.inner, 0.3, E_OUT, 0.002); // out of the PTS, then to the node
        else this.settlePyruvate(); // no bead to be had: its chemistry happens at once
        this.kind[i] = K.hexose;
        this.task[i] = T.hexose;
        this.step[i] = -1;
        this.flag[i] = 0;
        this.hop(i, site.inner, 0.3, E_OUT, 0.002);
        return;
      }
      case T.vesicleGlucose:
        // glucokinase (at the head of glycolysis): glucose + ATP -> G6P; a short wait, then on
        L.glucokinase();
        this.kind[i] = K.hexose;
        this.task[i] = T.hexose;
        this.step[i] = 0;
        this.flag[i] = 1; // both trioses go on to pyruvate kinase: no PEP is owed to the PTS
        this.hold(i, 0.25, 0.004);
        return;
      case T.hexose: {
        if (s < 0) {
          // out of the PTS: on to phosphoglucose isomerase (from the far PTS patch, round the cell)
          this.step[i] = 0;
          this.travel(i, this.gly[0], 0.3, 0.3, 2.6, 0.006, 0.12);
          return;
        }
        if (s === 0) {
          // G6P -> F6P; phosphofructokinase invests an ATP next
          this.step[i] = 1;
          const d = this.travel(i, this.gly[1], 0.3, 0.32, 0.8, 0.004, 0.14);
          this.spendInto(this.gly[1], d - 0.14);
          return;
        }
        if (s === 1) {
          L.invest(); // PFK: F6P + ATP -> fructose-1,6-bisphosphate
          this.step[i] = 2;
          this.travel(i, this.gly[2], 0.3, 0.32, 0.8, 0.004, 0.16);
          return;
        }
        // aldolase: two trioses. This one (GAP) goes straight on; DHAP goes via the isomerase.
        this.pos(i, _a);
        const glk = this.flag[i];
        this.kind[i] = K.triose;
        this.task[i] = T.triose;
        this.step[i] = 4;
        this.flag[i] = 1;
        this.travel(i, this.gly[4], 0.3, 0.45, 0.9, 0.006, 0.12);
        const j = this.spawn(K.triose, T.triose, _a, -1, glk ? 1 : 0);
        if (j >= 0) {
          this.step[j] = 3;
          this.travel(j, this.gly[3], 0.3, 0.3, 0.8, 0.004, 0.1);
        } else this.settleTriose(glk);
        return;
      }
      case T.triose: {
        this.pos(i, _a);
        if (s === 4) {
          L.gapdh();
          this.launchNadh(_a);
        } else if (s === 5) {
          L.substrateAtp(); // phosphoglycerate kinase
          this.launchAtp(_a);
        } else if (s === 7 && !this.flag[i]) {
          // PEP: back to the PTS, to pay for the next glucose
          this.task[i] = T.pep;
          const k = pickNear(this.pts, _a.x, _a.y, _a.z, 2, 'inner');
          this.site[i] = k;
          this.travel(i, this.pts[k].inner, 0.35, 0.5, 1.6, 0.02);
          return;
        } else if (s === 8) {
          L.pyruvateKinase();
          this.launchAtp(_a);
          this.kind[i] = K.pyruvate;
          this.task[i] = T.pyruvate;
          this.step[i] = 1;
          this.travel(i, this.node, 0.3, 0.5, 1.6, 0.02, 0.05);
          return;
        }
        this.step[i] = s + 1;
        this.travel(i, this.gly[s + 1], 0.3, 0.3, 0.8, 0.004, s === 3 ? 0.06 : 0.12);
        return;
      }
      case T.pep:
        L.pepBack();
        this.pts[this.site[i]].flash?.(0.25);
        this.end(i, 0.15);
        return;
      case T.pyruvate:
        if (s === 0) {
          // just out of the PTS
          this.step[i] = 1;
          this.travel(i, this.node, 0.3, 0.6, 2.4, 0.03, 0.05);
          return;
        }
        this.atNode(i);
        return;
      case T.acetyl:
        // citrate synthase: acetyl-CoA + oxaloacetate -> citrate; the carbon now rides the cycle
        this.kind[i] = K.tca;
        this.task[i] = T.tca;
        this.step[i] = 0;
        this.toLoop(i, 0);
        return;
      case T.tca: {
        const at = LOOP[s];
        this.pos(i, _a);
        if (at === 4 || at === 5) {
          L.decarboxylate(); // isocitrate / α-ketoglutarate dehydrogenase
          this.launchNadh(_a);
          this.launchWaste(_a, K.co2);
        } else if (at === 6) {
          L.substrateAtp(); // succinyl-CoA synthetase (E. coli's makes ATP)
          this.launchAtp(_a);
        } else if (at === GAP) {
          L.sdh(); // succinate -> fumarate in the membrane: QH2
          const sd = this.sdh[this.sdhAt];
          sd.flash?.(0.9);
          _b.copy(sd.pos);
          this.launchQh2(_b);
        } else if (at === 1) {
          L.malateDehydrogenase();
          this.launchNadh(_a);
          // oxaloacetate: back to citrate synthase to take the next acetyl-CoA
          this.step[i] = 7;
          this.travel(i, this.tcaE[2], 0.3, 0.3, 0.7, 0.01);
          return;
        }
        if (s >= 7) {
          this.end(i, 0.35);
          return;
        }
        this.toLoop(i, s + 1);
        return;
      }
      case T.nadh:
        if (this.site[i] < 0 && this.mode !== 'fermentation') {
          // oxygen came back on the way to alcohol dehydrogenase: on to complex I instead
          this.pos(i, _a);
          const k = pickNear(this.cI, _a.x, _a.y, _a.z, 3, 'inner');
          this.site[i] = k;
          this.travel(i, this.cI[k].inner, 0.45, 0.5, 1.8, 0.03);
          return;
        }
        if (this.site[i] >= 0) {
          L.complexI();
          const c = this.cI[this.site[i]];
          c.flash?.(0.9);
          this.pumpOut(c, 4);
          this.launchQh2(c.pos);
        } else L.nadhToAlcohol();
        this.end(i, 0.12);
        return;
      case T.qh2: {
        const ox = this.flag[i] ? this.bd[this.site[i]] : this.bo3[this.site[i]];
        if (this.flag[i]) L.bd();
        else L.bo3();
        ox.flash?.(0.8);
        this.pumpOut(ox, this.flag[i] ? 2 : 4);
        this.end(i, 0.12);
        return;
      }
      case T.o2:
        L.oxygen();
        this.end(i, 0.15);
        return;
      case T.hOut:
        if (s === 0) {
          // Out in the periplasm: it wanders a little, and a synthase or motor nearby may take it
          // (the circuit you can follow). If none does, it fades into the gradient's glow.
          this.step[i] = 1;
          this.pos(i, _a);
          atDepth(_a.x + (Math.random() - 0.5) * 0.06, _a.y + (Math.random() - 0.5) * 0.06, _a.z + (Math.random() - 0.5) * 0.06, PERI + (Math.random() - 0.5) * 0.02, _b);
          this.hop(i, _b, 0.25, E_LIN, 0);
          if (this.nWaiting < this.waiting.length) this.waiting[this.nWaiting++] = i;
          else this.end(i, 0.2);
          return;
        }
        this.unwait(i);
        this.end(i, 0.2);
        return;
      case T.hSynth:
      case T.hMotor:
        if (s === 0) {
          // above the rotor (or a stator): now in through the membrane
          this.step[i] = 1;
          const m = this.task[i] === T.hSynth ? this.syn[this.site[i]] : this.mot[this.site[i]];
          this.entry(this.task[i], m, this.flag[i], _a);
          this.hop(i, _a, 0.22, E_IN, 0);
          return;
        }
        if (this.task[i] === T.hMotor) {
          L.motorProton();
          this.mot[this.site[i]]?.flash?.(0.05);
          this.end(i, 0.08);
          return;
        }
      // falls through: a proton through the synthase's c-ring
      case T.hSynthIn: {
        const k = this.site[i];
        this.spinPending[k] += SPIN;
        const site = this.syn[k];
        if (L.synthaseProton(k)) {
          site.flash?.(0.35);
          this.launchAtp(site.inner);
        } else site.flash?.(0.06);
        this.end(i, 0.08);
        return;
      }
      case T.atp:
        if (this.site[i] >= 0) this.rib[this.site[i]]?.flash?.(0.45);
        this.end(i, 0.15);
        return;
      case T.spend:
        this.end(i, 0.1);
        return;
      case T.atpBack: {
        const k = this.site[i];
        const n = L.synthaseReverse(k);
        this.spinPending[k] -= n * SPIN;
        this.syn[k].flash?.(0.3);
        this.pumpOut(this.syn[k], n, true);
        this.end(i, 0.1);
        return;
      }
      case T.out:
        if (s === 0) {
          this.step[i] = 1;
          this.pos(i, _a);
          atDepth(_a.x, _a.y, _a.z, depthOf(_a.x, _a.y, _a.z) + 0.08, _b);
          _b.x += (Math.random() - 0.5) * 0.06;
          _b.y += (Math.random() - 0.5) * 0.06;
          _b.z += (Math.random() - 0.5) * 0.06;
          this.line(i, _b, 0.7, E_LIN, 0.2);
          this.end(i, 0.7);
        }
        return;
      case T.ferment:
        if (!this.flag[i]) {
          L.acetateKinase(); // acetyl-P + ADP -> acetate + ATP
          this.pos(i, _a);
          this.launchAtp(_a);
          this.kind[i] = K.ferment;
          this.task[i] = T.out;
          this.step[i] = 0;
          this.toOutside(i);
          return;
        }
        this.task[i] = T.ethanolWait;
        this.step[i] = 0;
        this.hold(i, 0.2, 0.005);
        return;
      case T.ethanolWait:
        if (L.alcohol()) {
          this.kind[i] = K.ferment;
          this.task[i] = T.out;
          this.step[i] = 0;
          this.toOutside(i);
        } else if (this.mode !== 'fermentation') {
          // oxygen is back: this acetyl-CoA goes round the TCA cycle after all
          this.task[i] = T.acetyl;
          this.travel(i, this.tcaE[2], 0.3, 0.5, 1.6, 0.02);
        } else if (++this.step[i] >= 30) {
          // 6 s and its NADH has not come (a mishap: it was counted on): acetate instead
          this.task[i] = T.ferment;
          this.flag[i] = 0;
          this.travel(i, this.ack, 0.3, 0.3, 0.8, 0.01, 0.1);
        } else this.hold(i, 0.2, 0.005);
        return;
      case T.amino:
        if (!this.flag[i]) {
          L.aminoAcid(true); // straight into protein
          this.rib[this.site[i]]?.flash?.(0.5);
          this.end(i, 0.15);
          return;
        }
        L.aminoAcid(false); // deaminated: NH3 out, the carbon goes on as pyruvate
        this.pos(i, _a);
        this.launchWaste(_a, K.nh3);
        this.kind[i] = K.pyruvate;
        this.atNode(i);
        return;
      default:
        this.end(i);
    }
  }

  // Pyruvate at the node: pyruvate dehydrogenase, or pyruvate formate-lyase without oxygen.
  atNode(i) {
    const L = this.ledger;
    this.pos(i, _a);
    this.activity.pdh = Math.min(this.activity.pdh + 0.8, 1.6);
    if (this.mode === 'fermentation') {
      L.pfl();
      this.launchWaste(_a, K.ferment); // formate
      this.kind[i] = K.acetyl;
      this.task[i] = T.ferment;
      // Ethanol only when its two NADH are there or on their way (and not promised to an acetyl-CoA
      // already waiting): the cell keeps its redox balance. Otherwise acetate, for an ATP.
      // The flag is cleared first: it still holds whatever this bead carried before, and a stale 1
      // would count the bead as already bound for ethanol and strand two NADH at the dehydrogenase.
      this.flag[i] = 0;
      const toEthanol = this.spareNadh() >= 2;
      this.flag[i] = toEthanol ? 1 : 0;
      this.travel(i, toEthanol ? this.adh : this.ack, 0.3, 0.3, 0.8, 0.01, 0.1);
      return;
    }
    L.pdh();
    this.launchNadh(_a);
    this.launchWaste(_a, K.co2);
    this.kind[i] = K.acetyl;
    this.task[i] = T.acetyl;
    this.travel(i, this.tcaE[2], 0.3, 0.5, 1.6, 0.02, 0.12);
  }

  // NADH for alcohol dehydrogenase: there, on its way, or still to come from sugar on its way down
  // glycolysis (two per hexose, one per triose before GAPDH), less what acetyl-CoA already bound
  // for ethanol will use.
  spareNadh() {
    let n = this.ledger.nadhHeld;
    for (let i = 0; i <= this.hi; i++) {
      if (!this.alive[i] || this.die[i] >= 0) continue;
      const t = this.task[i];
      if (t === T.nadh) n += this.site[i] < 0 ? 1 : 0;
      else if (t === T.hexose || t === T.glucose || t === T.vesicleGlucose) n += 2;
      else if (t === T.triose) n += this.step[i] <= 4 ? 1 : 0;
      else if (t === T.ethanolWait || (t === T.ferment && this.flag[i])) n -= 2;
    }
    return n;
  }

  // The rest of the route at once, for a step that found no bead to carry it (the pool is full of
  // the route's own beads): the books stay exact whatever the screen shows.
  settleTriose(toPk) {
    const L = this.ledger;
    L.gapdh();
    this.settleNadh();
    L.substrateAtp(); // phosphoglycerate kinase
    if (!toPk) {
      L.pepBack(); // its PEP pays for the next glucose
      return;
    }
    L.pyruvateKinase();
    this.settlePyruvate();
  }

  settlePyruvate() {
    const L = this.ledger;
    if (this.mode === 'fermentation') {
      L.pfl();
      if (L.nadhHeld >= 2 && L.alcohol()) return;
      L.acetateKinase();
      return;
    }
    L.pdh();
    this.settleNadh();
    // round the TCA cycle
    for (let k = 0; k < 2; k++) {
      L.decarboxylate();
      this.settleNadh();
    }
    L.substrateAtp();
    L.sdh();
    this.settleQh2();
    L.malateDehydrogenase();
    this.settleNadh();
  }

  settleNadh() {
    if (this.mode === 'fermentation') {
      this.ledger.nadhToAlcohol();
      return;
    }
    this.ledger.complexI();
    this.settleQh2();
  }

  toLoop(i, s) {
    this.step[i] = s;
    const at = LOOP[s];
    this.travel(i, at === GAP ? this.gap : this.tcaE[at], 0.3, 0.28, 0.7, 0.012, at === GAP ? 0.2 : 0.14);
  }

  toOutside(i) {
    this.pos(i, _a);
    atDepth(_a.x, _a.y, _a.z, 0.58, _b);
    this.line(i, _b, clamp((0.58 - depthOf(_a.x, _a.y, _a.z)) / 0.3, 0.6, 1.4), E_OUT, 0.18);
  }

  launchNadh(p) {
    const i = this.spawn(K.nadh, T.nadh, p);
    const ferment = this.mode === 'fermentation';
    const k = ferment ? -1 : pickNear(this.cI, p.x, p.y, p.z, 3, 'inner');
    if (i < 0) {
      // out of beads: settle the chemistry at once so the books stay exact
      if (k >= 0) {
        this.ledger.complexI();
        this.settleQh2();
      } else this.ledger.nadhToAlcohol();
      return;
    }
    this.site[i] = k;
    this.travel(i, k >= 0 ? this.cI[k].inner : this.adh, 0.45, 0.5, 1.8, 0.03);
  }

  // QH2 leaves its maker in the membrane and slides along it to an oxidase: bo3 with plenty of
  // oxygen, bd when it runs low. Every second QH2 also calls an O2 in from the water.
  launchQh2(p) {
    const useBd = (this.mode !== 'respiration' && this.bd.length > 0) || !this.bo3.length;
    const list = useBd ? this.bd : this.bo3;
    const k = pickNear(list, p.x, p.y, p.z, 2);
    const i = this.spawn(K.qh2, T.qh2, p, k, useBd ? 1 : 0);
    if (i < 0) {
      this.settleQh2();
      return;
    }
    const dur = this.travel(i, list[k].pos, 0.25, 0.35, 1.6, 0.0);
    this.needO2(list[k], dur);
  }

  settleQh2() {
    if ((this.mode !== 'respiration' && this.bd.length) || !this.bo3.length) this.ledger.bd();
    else this.ledger.bo3();
    if (this.halfO2 > 0) this.halfO2--;
    else {
      this.ledger.oxygen();
      this.halfO2 = 1;
    }
  }

  needO2(ox, arriveIn) {
    if (this.halfO2 > 0) {
      this.halfO2--;
      return;
    }
    this.halfO2 = 1; // one O2 is two halves: this QH2 uses one, the next the other
    across(ox.normal, _e1, _e2);
    const a = Math.random() * TAU, r = 0.06 + Math.random() * 0.1;
    _a.copy(ox.pos).addScaledVector(ox.normal, 0.34).addScaledVector(_e1, Math.cos(a) * r).addScaledVector(_e2, Math.sin(a) * r);
    const i = this.spawn(K.o2, T.o2, _a);
    if (i < 0) {
      this.ledger.oxygen();
      return;
    }
    this.line(i, ox.pos, Math.max(arriveIn, 1.3), E_INOUT, 0.25);
  }

  // H+ out of a membrane machine into the periplasm, a few at a time.
  pumpOut(site, n, quick = false) {
    for (let k = 0; k < this.syn.length; k++) {
      const d2 = this.syn[k].pos.distanceToSquared(site.pos);
      this.heat[k] += n * Math.exp(-d2 / 0.012);
    }
    // Already counted by the ledger; the beads are only the picture, drawn when close enough to see.
    if (this.nFree < this.reserve / 2 || this.hLod <= 0.02) return;
    across(site.normal, _e1, _e2);
    for (let k = 0; k < n; k++) {
      const i = this.spawn(K.proton, T.hOut, site.pos);
      if (i < 0) return;
      const a = Math.random() * TAU, r = 0.02 + Math.random() * 0.045;
      _a.copy(site.pos).addScaledVector(_e1, Math.cos(a) * r).addScaledVector(_e2, Math.sin(a) * r);
      atDepth(_a.x, _a.y, _a.z, PERI + (Math.random() - 0.5) * 0.02, _b);
      this.line(i, _b, quick ? 0.22 : 0.26, E_OUT, 0.1);
      this.t[i] = this.age[i] = -k * 0.07; // a short burst rather than all at once
    }
  }

  launchAtp(p) {
    if (this.nFree < this.reserve / 2) return; // counted already: the bead only shows where it goes
    const k = pickNear(this.rib, p.x, p.y, p.z, 4);
    const i = this.spawn(K.atp, T.atp, p, k);
    if (i < 0) return;
    if (k >= 0) this.travel(i, this.rib[k].pos, 0.5, 0.6, 1.6, 0.03);
    else {
      atDepth(p.x, p.y, p.z, 0.25, _b);
      this.travel(i, _b, 0.5, 0.6, 1.4, 0.02);
      this.end(i, 1.2);
    }
  }

  // An ATP bead coming in from the pool to an enzyme that invests it (arriving in `time` s).
  spendInto(target, time) {
    if (this.nFree < this.reserve) return;
    atDepth(target.x, target.y, target.z, depthOf(target.x, target.y, target.z) - 0.07, _b);
    _b.x += (Math.random() - 0.5) * 0.05;
    _b.y += (Math.random() - 0.5) * 0.05;
    _b.z += (Math.random() - 0.5) * 0.05;
    const i = this.spawn(K.atp, T.spend, _b);
    if (i >= 0) this.hop(i, target, Math.max(time, 0.3), E_IN, 0.01);
  }

  launchWaste(p, kind) {
    if (this.nFree < this.reserve / 2) return; // counted already
    const i = this.spawn(kind, T.out, p);
    if (i < 0) return;
    this.toOutside(i);
  }

  // ----------------------------------------------------------------------------------- pools
  draws(dt, thrust) {
    const L = this.ledger;
    const mv = -L.pmf;
    const atp = L.atpFraction;
    const room = this.nFree > this.reserve;
    // Flagellar motors: H+ through the stators while swimming.
    const power = motorPowerAt(L.pmf);
    this.acc.motor += CONFIG.motorDraw * clamp(thrust, 0, 1) * power * dt;
    while (this.acc.motor >= 1) {
      this.acc.motor--;
      if (!L.drawProton()) {
        this.acc.motor = 0;
        break;
      }
      this.launchMotorProton(room);
    }
    // ATP synthase: turns forward when Δp is above its balance point (and not at all with no ADP
    // left to phosphorylate).
    const drive = L.atp >= CONFIG.maxAtp - 1 ? 0 : clamp((mv - synthEquilibrium(atp)) / CONFIG.synthSpan, 0, 1);
    this.acc.synth += CONFIG.synthMax * drive * dt;
    while (this.acc.synth >= 1) {
      this.acc.synth--;
      if (!L.drawProton()) {
        this.acc.synth = 0;
        break;
      }
      this.launchSynthProton(room);
    }
    // Fermenting, it runs backwards: ATP in, H+ out, to keep the gradient up. A respiring cell
    // whose gradient has all but gone (starving, swimming hard) does the same, only weakly: the ε
    // subunit holds hydrolysis back, so the motors still run down first.
    const fermenting = this.mode === 'fermentation';
    if (fermenting ? atp > 0.08 : atp > 0.3) {
      const setpoint = fermenting ? CONFIG.reverseSetpoint : CONFIG.reverseFloor;
      const back = CONFIG.reverseMax * (fermenting ? 1 : CONFIG.reverseAerobic) * clamp((setpoint - mv) / 20, 0, 1);
      this.acc.reverse += back * 0.3 * dt;
      while (this.acc.reverse >= 1) {
        this.acc.reverse--;
        if (!L.takeAtp()) {
          this.acc.reverse = 0;
          break;
        }
        this.launchAtpBack(room);
      }
    } else this.acc.reverse = 0;
    // how well fed: carbon arriving lately (glucose, or amino acids at a sixth of a glucose each)
    const M = L.made;
    const carbon = M.glucose + M.aminoAcids / 6;
    this.fed += ((carbon - this.carbonSeen) / CONFIG.wellFed - this.fed * dt) * (1 / 8);
    this.carbonSeen = carbon;
    L.tick(dt, this.fed);
  }

  launchSynthProton(room) {
    let sum = 0;
    for (let j = 0; j < this.heat.length; j++) sum += 0.15 + this.heat[j];
    let pick = Math.random() * sum, k = 0;
    while (k < this.heat.length - 1 && (pick -= 0.15 + this.heat[k]) > 0) k++;
    const s = this.syn[k];
    if (!room || this.hLod <= 0.02) {
      // no bead to spare (or too far to see one): the proton still turns the rotor
      this.spinPending[k] += SPIN;
      if (this.ledger.synthaseProton(k)) this.launchAtp(s.inner);
      return;
    }
    this.toMachine(T.hSynth, k, s, 0);
  }

  launchMotorProton(room) {
    const n = this.mot.length;
    if (!n || !room || this.hLod <= 0.02) {
      this.ledger.motorProton();
      return;
    }
    const k = (this.motorTurn = (this.motorTurn + 1) % n);
    // one of the MotA/MotB stators in the ring round the rotor
    this.toMachine(T.hMotor, k, this.mot[k], Math.floor(Math.random() * 11));
  }

  // An H+ from the periplasm to a synthase (or to stator `slot` of a motor): one that was just
  // pumped out nearby if there is one, else one from the pool.
  toMachine(task, k, m, slot) {
    this.entry(task, m, slot, _c);
    atDepth(_c.x, _c.y, _c.z, PERI + 0.008, _b); // just above it in the periplasm
    let i = this.claim(_c, task === T.hSynth ? 0.2 : 0.26);
    if (i >= 0) {
      this.task[i] = task;
      this.site[i] = k;
      this.flag[i] = slot;
      this.step[i] = 0;
      this.travel(i, _b, 0.4, 0.18, 0.7, 0);
      return;
    }
    across(m.normal, _e1, _e2);
    const a = Math.random() * TAU, r = 0.03 + Math.random() * 0.035;
    _a.copy(_b).addScaledVector(_e1, Math.cos(a) * r).addScaledVector(_e2, Math.sin(a) * r);
    atDepth(_a.x, _a.y, _a.z, PERI + (Math.random() - 0.5) * 0.02, _a);
    i = this.spawn(K.proton, task, _a, k, slot);
    if (i < 0) {
      if (task === T.hMotor) this.ledger.motorProton();
      return;
    }
    this.hop(i, _b, 0.22, E_INOUT, 0);
  }

  // Where an H+ goes into machine m: the synthase's rotor, or stator `slot` of a motor's eleven.
  entry(task, m, slot, out) {
    if (task === T.hSynth) return out.copy(m.pos).addScaledVector(m.normal, 0.006);
    across(m.normal, _e1, _e2);
    const a = (slot / 11) * TAU;
    return out.copy(m.pos).addScaledVector(_e1, Math.cos(a) * 0.053).addScaledVector(_e2, Math.sin(a) * 0.053);
  }

  // The waiting H+ bead nearest p within maxDist, taken off the waiting list; -1 if none.
  claim(p, maxDist) {
    let best = -1, bd = maxDist * maxDist;
    for (let w = 0; w < this.nWaiting; w++) {
      const o = this.waiting[w] * 3;
      // where it is heading is close enough to where it is
      const d = (this.B[o] - p.x) ** 2 + (this.B[o + 1] - p.y) ** 2 + (this.B[o + 2] - p.z) ** 2;
      if (d < bd) (bd = d), (best = w);
    }
    if (best < 0) return -1;
    const i = this.waiting[best];
    this.waiting[best] = this.waiting[--this.nWaiting];
    // carry on from where it is now, not from the end of its wander
    const o = i * 3;
    const move = Math.max(this.dur[i] - this.dwell[i], 1e-3);
    const u = Math.min(this.t[i] / move, 1);
    const a = 1 - u;
    for (let c = 0; c < 3; c++) this.B[o + c] = a * a * this.A[o + c] + 2 * a * u * this.C[o + c] + u * u * this.B[o + c];
    return i;
  }

  unwait(i) {
    for (let w = 0; w < this.nWaiting; w++) {
      if (this.waiting[w] !== i) continue;
      this.waiting[w] = this.waiting[--this.nWaiting];
      return;
    }
  }

  launchAtpBack(room) {
    const k = Math.floor(Math.random() * this.syn.length);
    const s = this.syn[k];
    if (!room) {
      const n = this.ledger.synthaseReverse(k);
      this.spinPending[k] -= n * SPIN;
      return;
    }
    _b.copy(s.inner).addScaledVector(s.normal, -0.08);
    _b.x += (Math.random() - 0.5) * 0.06;
    _b.y += (Math.random() - 0.5) * 0.06;
    _b.z += (Math.random() - 0.5) * 0.06;
    const i = this.spawn(K.atp, T.atpBack, _b, k);
    if (i < 0) {
      const n = this.ledger.synthaseReverse(k);
      this.spinPending[k] -= n * SPIN;
      return;
    }
    this.hop(i, s.inner, 0.6, E_IN, 0.01);
  }

  // ----------------------------------------------------------------------------------- update
  update(dt, { thrust = 0, oxygen = 1 } = {}) {
    if (this.warm > 0) {
      const w = this.warm;
      this.warm = 0;
      for (let k = 0; k < Math.round(w * 30); k++) this.advance(1 / 30, thrust, oxygen);
    }
    this.advance(dt, thrust, oxygen);
    this.draw();
  }

  advance(dt, thrust, oxygen) {
    const ox = this.debugOxygen ?? oxygen ?? 1;
    this.oxygen = ox;
    // Which way the chain runs, with a little hysteresis so a cell at the boundary doesn't flicker.
    const m = this.mode, h = 0.005;
    const f = m === 'fermentation' ? h : -h;
    const l = m === 'low-oxygen' ? h : -h;
    this.mode = ox < CONFIG.noOxygen + f ? 'fermentation' : ox < CONFIG.lowOxygen + l ? 'low-oxygen' : 'respiration';
    // Oxygen is back: NADH left waiting at alcohol dehydrogenase goes to complex I.
    if (this.mode !== 'fermentation' && this.ledger.releaseNadh()) this.launchNadh(this.adh);

    if (this.debugFeed > 0) {
      this.acc.feed = Math.min(this.acc.feed + this.debugFeed * dt, 2);
      if (this.acc.feed >= 1 && this.uptakeGlucose()) this.acc.feed--;
    }

    this.draws(dt, thrust);

    const taskCount = this.taskCount;
    taskCount.fill(0);
    let critical = 0;
    for (let i = 0; i <= this.hi; i++) {
      if (!this.alive[i]) continue;
      this.age[i] += dt;
      this.t[i] += dt;
      if (this.die[i] >= 0) {
        this.die[i] -= dt;
        if (this.die[i] <= 0) this.free(i);
        continue;
      }
      if (this.t[i] >= this.dur[i]) this.arrive(i);
      if (this.alive[i]) {
        taskCount[this.task[i]]++;
        critical += CRITICAL[this.task[i]];
      }
    }
    this.critical = critical;

    const cool = Math.exp(-dt / 4);
    for (let k = 0; k < this.heat.length; k++) this.heat[k] *= cool;
    // Rotors turn smoothly by what their protons have paid for.
    for (let k = 0; k < this.syn.length; k++) {
      const p = this.spinPending[k];
      if (Math.abs(p) < 1e-5) continue;
      const s = p * (1 - Math.exp(-dt / 0.12));
      this.spinPending[k] -= s;
      this.syn[k].spin?.(s);
    }
    this.refresh(dt, taskCount);
  }

  // The volume's activity and the public state.
  refresh(dt, taskCount) {
    const L = this.ledger;
    const st = this.state;
    const k = dt > 0 ? 1 - Math.exp(-dt / 0.6) : 1;
    if (taskCount) {
      const nGly = taskCount[T.hexose] + taskCount[T.triose];
      const nTca = taskCount[T.tca] + taskCount[T.acetyl];
      this.activity.glycolysis += (0.12 + 0.88 * (1 - Math.exp(-nGly / 1.6)) - this.activity.glycolysis) * k;
      this.activity.tca += (0.12 + 0.88 * (1 - Math.exp(-nTca / 1.2)) - this.activity.tca) * k;
    }
    this.activity.pdh *= dt > 0 ? Math.exp(-dt / 0.5) : 1;
    const pmf = L.pmf;
    const frac = clamp(-pmf / 200, 0, 1);
    const atp = clamp(L.atpFraction, 0, 1);
    const vol = this.hero.volume;
    if (vol) {
      vol.glycolysisActivity = this.activity.glycolysis;
      if (vol.tca) {
        // The cycle's intermediates are this module's counted beads. CellPass's own procedural
        // stream of beads round the loop would draw them twice, so once the route runs that stream
        // (tca.stream, 0..1) fades out over a second and a half. Until then (the opening, which does
        // not run the route) it is left as it is, so nothing pops at the hand-over. tca.activity only
        // speeds and brightens that stream; it is kept low, as the opening has always shown it.
        if (dt > 0) vol.tca.stream = Math.max((vol.tca.stream ?? 1) - dt / 1.5, 0);
        vol.tca.activity = 0.3 * this.activity.tca;
      }
      vol.protonGlow = 0.1 + 0.95 * frac * frac;
      // CheA, the receptors' kinase, runs on ATP: the array dims as the cell runs out.
      vol.receptorGlow = 0.06 + 0.3 * smooth(0.02, 0.4, atp);
    }

    st.atp = atp;
    st.atpCount = Math.round(L.atp);
    st.nadh = taskCount ? taskCount[T.nadh] : 0;
    st.protons = Math.round(L.protons);
    st.pmf = pmf;
    st.pmfFraction = frac;
    st.motorPower = motorPowerAt(pmf);
    st.mode = this.mode;
    st.modeNote =
      this.mode === 'fermentation' ? 'Almost no oxygen: fermenting · ATP synthase runs backwards to hold Δp'
      : this.mode === 'low-oxygen' ? 'Low oxygen: cytochrome bd takes over · fewer H⁺ per NADH'
      : null;
    const M = L.made;
    const tot = st.totals;
    tot.glucose = M.glucose;
    tot.co2 = M.co2;
    tot.o2 = M.o2;
    tot.atpMade = L.atpMade;
    tot.nadh = M.nadh;
    tot.protonsPumped = M.protonsRespiration + M.protonsReverse;
    tot.ethanol = M.ethanol;
    tot.acetate = M.acetate;
    tot.formate = M.formate;
    if (dt > 0) {
      st.rates.glucosePerMin = this.ema('glucose', M.glucose, dt, 6) * 60;
      st.rates.atpPerSec = this.ema('atp', tot.atpMade, dt, 4);
      st.rates.protonsPerSec = this.ema('protons', tot.protonsPumped, dt, 4);
    } else {
      this.last.glucose = M.glucose;
      this.last.atp = tot.atpMade;
      this.last.protons = tot.protonsPumped;
    }
  }

  // A running rate (per second) of a count that only goes up.
  ema(key, now, dt, tau) {
    const r = this.rate;
    r[key] += ((now - this.last[key]) / dt - r[key]) * (1 - Math.exp(-dt / tau));
    this.last[key] = now;
    return r[key];
  }

  // Bead positions, shapes, sizes and colours into the InstancedMesh; anchors and the PDH onto the
  // flow.
  draw() {
    const kc = this.kindCount;
    kc.fill(0);
    for (let i = 0; i <= this.hi; i++) if (this.alive[i] && this.t[i] >= 0) kc[this.kind[i]]++;
    for (let l = 0; l < this.legend.length; l++) this.legend[l].count = 0;
    if (this.hLod <= 0.02) kc[K.proton] = 0; // not on screen
    for (let k = 0; k < STYLE.length; k++) this.legend[this.legendOf[k]].count += kc[k];

    const shape = this.hero.shape;
    for (let k = 0; shape && k < this.anchorRefs.length; k++) flowPoint(shape, this.anchorRefs[k].ref, this.anchorRefs[k].obj.position);
    if (this.pdhMesh) {
      const g = Math.min(this.activity.pdh, 1);
      const u = this.pdhMesh.material.uniforms;
      u.uColor.value.copy(this.pdhRest).lerp(this.pdhVivid, g);
      u.uPulse.value = 1 + 0.4 * g;
    }
    const mesh = this.mesh;
    if (!mesh) return;

    // µm per pixel at the camera's distance from the cell. Beads keep a smallest size on screen,
    // given in pixels of a view FLOOR_VIEW px tall (px): a share of the picture, so a bead reads as
    // well on a large or high-density screen as in a small window, where real pixels would shrink
    // it to a speck. pxScreen: per real pixel.
    let px = 0.0085, pxScreen = 0.0085; // about 6 µm away
    if (this.camera) {
      this.hero.body.getWorldPosition(_a);
      const d = this.camera.position.distanceTo(_a) / (this.hero.group?.scale.x ?? 1);
      px = this.pxAngle * d;
      pxScreen = this.screenAngle * d;
    }
    // The H+ circuit is drawn only while an H+ bead is more than a speck (about 2 real pixels
    // across); from further away the periplasm's glow carries Δp.
    this.hLod = this.camera ? smooth(1.6, 2.6, (2 * STYLE[K.proton][1]) / pxScreen) : 1;
    const dn = shape.uDentN?.value ?? [];
    this.dents = dn.some((N) => N.w > 0);

    const M = mesh.instanceMatrix.array;
    for (let i = 0; i <= this.hi; i++) {
      if (!this.alive[i]) continue;
      if (this.t[i] < 0) {
        M.fill(0, i * 16, i * 16 + 16);
        continue;
      }
      const kind = this.kind[i];
      const st = STYLE[kind];
      const age = this.age[i];
      let s = Math.max(st[1], st[2] * px) * this.size[i] * smooth(0, 0.14, age);
      if (this.die[i] >= 0) s *= Math.sqrt(clamp(this.die[i] / this.dieDur[i], 0, 1));
      if (kind === K.proton) s *= this.hLod;
      // a brief brightening as each bead is made
      this.put(i, s, st[3] * (1 + 0.5 * Math.exp(-age / 0.2)), st);
    }
    // Upload only the slots in use.
    const n = this.hi + 1;
    mesh.count = Math.max(n, 1);
    for (const [attr, size] of [[mesh.instanceMatrix, 16], [mesh.instanceColor, 3], [this.shapeAttr, 2]]) {
      attr.clearUpdateRanges();
      attr.addUpdateRange(0, Math.max(n, 1) * size);
      attr.needsUpdate = true;
    }
  }

  // Instance i: bead i where it is now on its leg, at radius s and brightness b. A comet bead on the
  // move stretches into a teardrop along its velocity; QH2 lies flat in the membrane.
  put(i, s, b, st) {
    const move = Math.max(this.dur[i] - this.dwell[i], 1e-3);
    const time = this.t[i];
    const v = clamp(time / move, 0, 1);
    let u = v, du = 1;
    switch (this.ease[i]) {
      case E_INOUT: u = v * v * (3 - 2 * v); du = 6 * v * (1 - v); break;
      case E_OUT: u = 1 - (1 - v) * (1 - v); du = 2 * (1 - v); break;
      case E_IN: u = v * v; du = 2 * v; break;
    }
    if (time >= move) du = 0; // dwelling at an enzyme
    const a = 1 - u;
    const w0 = a * a, w1 = 2 * a * u, w2 = u * u;
    const p = i * 3;
    const A = this.A, B = this.B, C = this.C;
    // a gentle wander, biggest mid-leg and while waiting at an enzyme
    const age = this.age[i], ph = this.ph[i];
    const wob = this.wob[i] * (0.4 + Math.sin(Math.PI * v));
    _w.set(
      w0 * A[p] + w1 * C[p] + w2 * B[p] + wob * Math.sin(age * 4.1 + ph),
      w0 * A[p + 1] + w1 * C[p + 1] + w2 * B[p + 1] + wob * Math.sin(age * 3.7 + ph * 1.7),
      w0 * A[p + 2] + w1 * C[p + 2] + w2 * B[p + 2] + wob * Math.sin(age * 4.6 + ph * 2.3),
    );
    if (this.dents) addDent(this.hero.shape, _w.x, _w.y, _w.z, _w);
    let tail = 1, sx = s, sy = s, sz = s;
    if (st[4] === LOZENGE) {
      // flat in the membrane (thin along its normal), long the way it slides
      _bz.set(_w.x, _w.y, _w.z - clamp(_w.z, -0.5, 0.5)).normalize();
      _bx.set(B[p] - A[p], B[p + 1] - A[p + 1], B[p + 2] - A[p + 2]).addScaledVector(_bz, -_bz.dot(_bx));
      if (_bx.lengthSq() < 1e-10) across(_bz, _bx, _by);
      else _by.crossVectors(_bz, _bx.normalize());
      sx = 1.45 * s;
      sz = 0.42 * s;
    } else {
      // velocity: the curve's derivative times the easing's
      const k = (2 * du) / move;
      _bz.set(k * (a * (C[p] - A[p]) + u * (B[p] - C[p])), k * (a * (C[p + 1] - A[p + 1]) + u * (B[p + 1] - C[p + 1])), k * (a * (C[p + 2] - A[p + 2]) + u * (B[p + 2] - C[p + 2])));
      const speed = _bz.length();
      if (st[4] === COMET && speed > 1e-4 && s > 0) {
        tail = 1 + Math.min((speed * 0.03) / s, 1);
        _bz.multiplyScalar(1 / speed);
        across(_bz, _bx, _by);
      } else {
        _bx.set(1, 0, 0);
        _by.set(0, 1, 0);
        _bz.set(0, 0, 1);
      }
    }
    const M = this.mesh.instanceMatrix.array;
    const o = i * 16;
    M[o] = _bx.x * sx; M[o + 1] = _bx.y * sx; M[o + 2] = _bx.z * sx; M[o + 3] = 0;
    M[o + 4] = _by.x * sy; M[o + 5] = _by.y * sy; M[o + 6] = _by.z * sy; M[o + 7] = 0;
    M[o + 8] = _bz.x * sz; M[o + 9] = _bz.y * sz; M[o + 10] = _bz.z * sz; M[o + 11] = 0;
    M[o + 12] = _w.x; M[o + 13] = _w.y; M[o + 14] = _w.z; M[o + 15] = 1;
    const S = this.shapeAttr.array;
    S[i * 2] = tail;
    S[i * 2 + 1] = st[5];
    const c = this.base[this.kind[i]];
    const Cc = this.mesh.instanceColor.array;
    Cc[i * 3] = c.r * b;
    Cc[i * 3 + 1] = c.g * b;
    Cc[i * 3 + 2] = c.b * b;
  }
}
