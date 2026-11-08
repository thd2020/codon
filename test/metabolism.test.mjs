// Headless check of the energy route's bookkeeping: node _dev/metabolism.test.mjs
// Runs the real Metabolism (beads and all, no WebGL) on the real hero's sites and counts.
import { Bacterium } from '../src/bacterium.js';
import * as THREE from 'three';
import { setDent } from '../src/materials.js';
import { Metabolism, Ledger, CONFIG, motorPowerAt } from '../src/metabolism.js';

let failed = 0;
const check = (name, got, want, tol = 0) => {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${+got.toFixed(3)}${ok ? '' : ` (want ${want}${tol ? ` ± ${tol}` : ''})`}`);
};
const between = (name, got, lo, hi) => {
  const ok = got >= lo && got <= hi;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${+got.toFixed(3)} (${lo}..${hi})`);
};

const hero = new Bacterium({ hero: true, seed: 42 });
const DT = 1 / 30;
const fresh = () => {
  // a fresh hero each time so flashes and rotor angles start clean
  const h = new Bacterium({ hero: true, seed: 42 });
  return { h, m: new Metabolism(h) };
};
const ROUTE_TASKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 18, 19, 20, 21];
const routeBusy = (m) => {
  let n = 0;
  for (let i = 0; i <= m.hi; i++) if (m.alive[i] && ROUTE_TASKS.includes(m.task[i]) && m.die[i] < 0) n++;
  return n;
};

// Feed n glucose (every `gap` s), then let everything run out.
function feed(m, n, { oxygen = 1, gap = 1.2, via = 'pts', thrust = 0 } = {}) {
  let given = 0, t = 0, maxAlive = 0;
  while (given < n || routeBusy(m) > 0) {
    if (given < n && t >= given * gap) {
      const ok = via === 'pts' ? m.uptakeGlucose() : m.deliver('glucose', m.gly[0].clone().multiplyScalar(0.4));
      if (ok) given++;
    }
    m.update(DT, { thrust, oxygen });
    t += DT;
    maxAlive = Math.max(maxAlive, m.capacity - m.nFree);
    if (t > 600) throw new Error('route never emptied');
  }
  for (let k = 0; k < 120; k++) m.update(DT, { thrust, oxygen });
  return { t, maxAlive };
}

console.log('\n# respiration (O2 = 1), glucose through the PTS');
{
  const N = 12;
  const { m } = fresh();
  const pep0 = m.ledger.pep;
  const { maxAlive } = feed(m, N);
  const M = m.ledger.made;
  check('glucose', M.glucose, N);
  check('NADH per glucose', M.nadh / N, 10);
  check('QH2 from SDH per glucose', M.qh2Sdh / N, 2);
  check('QH2 from complex I per glucose', M.qh2ComplexI / N, 10);
  check('QH2 oxidised per glucose', M.qh2Oxidised / N, 12);
  check('substrate-level ATP (net) per glucose', m.ledger.atpNetSubstrate / N, 4);
  check('ATP invested (PFK) per glucose', M.atpInvested / N, 1);
  check('CO2 per glucose', M.co2 / N, 6);
  check('H+ out per glucose', M.protonsRespiration / N, 88);
  check('O2 per glucose', M.o2 / N, 6);
  check('pyruvate per glucose', M.pyruvate / N, 2);
  check('PEP pool back where it started', m.ledger.pep, pep0);
  check('ATP from synthase vs H+ through it (3 per 10)', M.atpSynthase, M.protonsSynthase * 0.3, m.syn.length * 3);
  console.log(`     beads alive at most: ${maxAlive} of ${m.capacity}`);
}

console.log('\n# low oxygen (O2 = 0.15): cytochrome bd');
{
  const N = 10;
  const { m } = fresh();
  feed(m, N, { oxygen: 0.15 });
  const M = m.ledger.made;
  check('mode', m.mode === 'low-oxygen' ? 1 : 0, 1);
  check('NADH per glucose', M.nadh / N, 10);
  check('H+ out per glucose', M.protonsRespiration / N, 64);
  check('O2 per glucose', M.o2 / N, 6);
  check('substrate-level ATP (net) per glucose', m.ledger.atpNetSubstrate / N, 4);
  check('CO2 per glucose', M.co2 / N, 6);
}

console.log('\n# fermentation (O2 = 0.02)');
{
  const N = 10;
  const { m } = fresh();
  feed(m, N, { oxygen: 0.02 });
  const M = m.ledger.made;
  check('mode', m.mode === 'fermentation' ? 1 : 0, 1);
  check('NADH made per glucose', M.nadh / N, 2);
  check('NADH reoxidised (ethanol) per glucose', M.nadhOxidised / N, 2);
  check('substrate-level ATP (net) per glucose', m.ledger.atpNetSubstrate / N, 3);
  check('formate per glucose', M.formate / N, 2);
  check('acetate per glucose', M.acetate / N, 1);
  check('ethanol per glucose', M.ethanol / N, 1);
  check('CO2', M.co2, 0);
  check('O2', M.o2, 0);
  check('H+ from respiration', M.protonsRespiration, 0);
  // with Δp down at -90 mV the reversed synthases burn ATP to pump it back up
  m.ledger.protons = 180;
  for (let k = 0; k < 10 / DT; k++) m.update(DT, { oxygen: 0.02 });
  for (let k = 0; k < 60; k++) m.update(DT, { oxygen: 0.02, thrust: 0 });
  between('reversed synthases: ATP burnt in 10 s at -90 mV', M.atpHydrolysed, 5, 200);
  check('ATP burnt -> H+ out (10 per 3)', M.protonsReverse, (M.atpHydrolysed * 10) / 3, m.syn.length * 4);
  console.log(`     synthase ran backwards: ${M.atpHydrolysed} ATP -> ${M.protonsReverse} H+, Δp now ${m.state.pmf.toFixed(0)} mV`);
}

console.log('\n# glucose from a vesicle (glucokinase instead of the PTS)');
{
  const N = 8;
  const { m } = fresh();
  feed(m, N, { via: 'vesicle' });
  const M = m.ledger.made;
  check('NADH per glucose', M.nadh / N, 10);
  check('substrate-level ATP (net) per glucose', m.ledger.atpNetSubstrate / N, 4);
  check('ATP invested (glucokinase + PFK) per glucose', M.atpInvested / N, 2);
  check('CO2 per glucose', M.co2 / N, 6);
  check('H+ out per glucose', M.protonsRespiration / N, 88);
}

console.log('\n# amino acids from a vesicle');
{
  const N = 10;
  const { m } = fresh();
  for (let k = 0; k < N; k++) {
    m.deliver('aminoAcid', m.node.clone().multiplyScalar(0.5));
    for (let s = 0; s < 20; s++) m.update(DT, { oxygen: 1 });
  }
  while (routeBusy(m) > 0) m.update(DT, { oxygen: 1 });
  const M = m.ledger.made;
  check('amino acids', M.aminoAcids, N);
  check('NH3 (deaminated half)', M.nh3, N / 2);
  check('NADH per deaminated amino acid (PDH + TCA)', M.nadh / (N / 2), 4);
  check('CO2 per deaminated amino acid', M.co2 / (N / 2), 3);
  check('H+ per deaminated amino acid', M.protonsRespiration / (N / 2), 36);
}

console.log('\n# flooded: 4 glucose/s offered for 30 s at full thrust, then O2 dropping mid-route');
{
  const { m } = fresh();
  let acc = 0, offered = 0, taken = 0;
  for (let k = 0; k < 30 / DT; k++) {
    acc += 4 * DT;
    while (acc >= 1) {
      acc--;
      offered++;
      if (m.uptakeGlucose(k % 8)) taken++;
    }
    m.update(DT, { thrust: 1, oxygen: 1 });
  }
  let t = 0;
  while (routeBusy(m) > 0 && t < 120) {
    m.update(DT, { thrust: 1, oxygen: 1 });
    t += DT;
  }
  const M = m.ledger.made;
  console.log(`     offered ${offered}, taken ${taken}, pool never ran dry: ${m.nFree > 0}`);
  check('glucose taken = glucose counted', M.glucose, taken);
  check('NADH per glucose', M.nadh / taken, 10);
  check('H+ out per glucose', M.protonsRespiration / taken, 88);
  check('O2 per glucose', M.o2 / taken, 6);
  check('CO2 per glucose', M.co2 / taken, 6);
  between('uptake throttled to what the PTS can take (glucose/s)', taken / 30, 0.8, 2);

  // switching to fermentation while acetyl-CoA and NADH are on their way leaves nothing stuck
  const { m: f } = fresh();
  for (let k = 0; k < 6; k++) f.uptakeGlucose();
  for (let k = 0; k < 4 / DT; k++) f.update(DT, { oxygen: 1 });
  for (let k = 0; k < 6 / DT; k++) f.update(DT, { oxygen: 0.02 });
  for (let k = 0; k < 4 / DT; k++) f.update(DT, { oxygen: 1 });
  t = 0;
  while (routeBusy(f) > 0 && t < 60) {
    f.update(DT, { oxygen: 1 });
    t += DT;
  }
  check('mode switches mid-route: route empties', routeBusy(f), 0);
  check('mode switches mid-route: glucose', f.ledger.made.glucose, 6);
}

console.log('\n# fermentation keeps its redox balance: nothing waits for NADH that never comes');
{
  // 40 amino acids with no oxygen: their carbon enters as pyruvate, with no NADH for ethanol
  const { m } = fresh();
  for (let k = 0; k < 40; k++) {
    m.deliver('aminoAcid', m.node.clone().multiplyScalar(0.5));
    for (let s = 0; s < 6; s++) m.update(DT, { oxygen: 0.01 });
  }
  for (let k = 0; k < 15 / DT; k++) m.update(DT, { oxygen: 0.01 });
  check('amino acids, no O2: route empties (no acetyl-CoA stuck at ADH)', routeBusy(m), 0);
  check('amino acids, no O2: ethanol (no NADH to make it)', m.ledger.made.ethanol, 0);
  check('amino acids, no O2: acetate = acetyl-CoA from the deaminated half', m.ledger.made.acetate, m.ledger.made.nh3);

  // O2 drops mid-route, then glucose keeps coming for 30 s with no oxygen
  const { m: f } = fresh();
  for (let k = 0; k < 4; k++) f.uptakeGlucose();
  for (let k = 0; k < 2.5 / DT; k++) f.update(DT, { oxygen: 1 });
  let acc = 0;
  for (let k = 0; k < 30 / DT; k++) {
    acc += 0.6 * DT;
    if (acc >= 1 && f.uptakeGlucose()) acc--;
    f.update(DT, { oxygen: 0.01 });
  }
  for (let k = 0; k < 12 / DT; k++) f.update(DT, { oxygen: 0.01 });
  check('O2 lost mid-route, 30 s of fermenting: route empties', routeBusy(f), 0);
  const F = f.ledger.made;
  check('... every NADH reoxidised or waiting at ADH', F.nadh, F.nadhOxidised + f.ledger.nadhHeld);
  // oxygen back with NADH parked at alcohol dehydrogenase (3 made, nothing to use them): they go
  // to complex I
  F.nadh += 3;
  f.ledger.nadhHeld += 3;
  const h0 = F.protonsRespiration;
  for (let k = 0; k < 8 / DT; k++) f.update(DT, { oxygen: 1 });
  check('O2 back: NADH held at ADH released', f.ledger.nadhHeld, 0);
  check('... and oxidised at complex I', F.nadh, F.nadhOxidised);
  check('... 8 H+ each', F.protonsRespiration - h0, 24);
}

console.log('\n# a full ATP pool: the synthases stand still, nothing is counted that was not kept');
{
  const { m } = fresh();
  let acc = 0;
  // Δp arrives in bursts (a complex pumps 4 H+ at once, 2 mV), so it is read as its mean over the
  // last 3 s rather than at one instant, which can sit a few mV either side.
  let pmfSum = 0, pmfN = 0;
  for (let k = 0; k < 45 / DT; k++) {
    acc += 1 * DT;
    if (acc >= 1 && m.uptakeGlucose()) acc--;
    m.update(DT, { thrust: k * DT < 20 ? 1 : 0, oxygen: 1 });
    if (k * DT >= 42) {
      pmfSum += m.state.pmf;
      pmfN++;
    }
  }
  const M = m.ledger.made;
  console.log(`     45 s at 1 glucose/s: ATP ${(m.state.atp * 100).toFixed(0)}%, Δp ${m.state.pmf.toFixed(0)} mV, spilled ${M.atpSpilled.toFixed(1)} of ${M.atpSubstrate + M.atpSynthase} made`);
  between('ATP spilled from a full pool (share of ATP made)', M.atpSpilled / (M.atpSubstrate + M.atpSynthase), 0, 0.03);
  between('Δp at rest in plenty, mean of the last 3 s (mV)', pmfSum / pmfN, -206, -185);
  check('state.totals.atpMade = ATP that reached the pool', m.state.totals.atpMade, M.atpSubstrate + M.atpSynthase - M.atpSpilled, 1e-6);
}

console.log('\n# deliveries are refused only for the route itself, not for pictures');
{
  const { m } = fresh();
  let offered = 0, refused = 0, acc = 0;
  for (let k = 0; k < 30 / DT; k++) {
    acc += 1 * DT;
    if (acc >= 1 && m.uptakeGlucose()) acc--;
    // two digesting vesicles: a monomer every 0.25 s
    if (k % 8 === 0) {
      offered++;
      if (!m.deliver(k % 16 ? 'glucose' : 'aminoAcid', m.node.clone().multiplyScalar(0.5))) refused++;
    }
    m.update(DT, { thrust: 1, oxygen: 1 });
  }
  console.log(`     offered ${offered}, refused ${refused}, critical ${m.critical} of ${m.capacity}, free ${m.nFree}`);
  between('share of monomers refused while the route has room', refused / offered, 0, 0.1);
}

console.log('\n# readouts');
{
  const { m } = fresh();
  let acc = 0;
  for (let k = 0; k < 10 / DT; k++) {
    acc += 0.6 * DT;
    if (acc >= 1 && m.uptakeGlucose()) acc--;
    m.update(DT, { oxygen: 1 });
  }
  between('glucose in /min after 10 s at 0.6/s', m.state.rates.glucosePerMin, 25, 40);
  const rowOf = (k) => m.legend[m.legendOf[k]];
  let same = 0;
  for (let k = 0; k < m.legendOf.length; k++) same += rowOf(k).color === m.base[k].getHex() ? 1 : 0;
  check('every bead kind has the colour of its legend row', same, m.legendOf.length);
  check('NH3 is in the CO₂ · NH₃ row', rowOf(14).key === 'co2' ? 1 : 0, 1);
}

console.log('\n# a pool full of the route itself: steps with no bead settle at once');
{
  const h = new Bacterium({ hero: true, seed: 42 });
  const m = new Metabolism(h, { capacity: 24 });
  let taken = 0;
  for (let k = 0; k < 40 / DT; k++) {
    if (k % 6 === 0 && m.uptakeGlucose()) taken++;
    m.update(DT, { oxygen: 1 });
  }
  let t = 0;
  while (routeBusy(m) > 0 && t < 120) {
    m.update(DT, { oxygen: 1 });
    t += DT;
  }
  const M = m.ledger.made;
  console.log(`     24 beads, glucose offered every 0.2 s: taken ${taken}`);
  check('NADH per glucose', M.nadh / taken, 10);
  check('H+ out per glucose', M.protonsRespiration / taken, 88);
  check('CO2 per glucose', M.co2 / taken, 6);
  check('net substrate ATP per glucose', m.ledger.atpNetSubstrate / taken, 4);
  check('PEP pool back where it started', m.ledger.pep, CONFIG.pep);
}

console.log('\n# beads follow an endocytic pocket the way the membrane complexes do');
{
  const { h, m } = fresh();
  const c = h.complexes.find((x) => x.places.length && x.mesh);
  const pl = c.places[0];
  setDent(h.shape, 0, { center: pl.pos.clone().addScaledVector(pl.normal, 0.08).add(new THREE.Vector3(0.02, 0, 0)), normal: pl.normal, radius: 0.18, depth: 0.12, pinch: 0.3 });
  c.place();
  const placed = new THREE.Vector3().setFromMatrixPosition(c.mesh.getMatrixAt(0, new THREE.Matrix4()));
  // a bead parked on the complex, drawn into a stand-in instance buffer
  const i = m.spawn(7, 17, pl.pos);
  m.hold(i, 10, 0);
  m.wob[i] = 0;
  m.dents = true;
  m.mesh = { instanceMatrix: { array: new Float32Array(16 * m.capacity) }, instanceColor: { array: new Float32Array(3 * m.capacity) } };
  m.shapeAttr = { array: new Float32Array(2 * m.capacity) };
  m.put(i, 0.01, 1, [0, 0.01, 0, 1, 0, 0]);
  const A = m.mesh.instanceMatrix.array;
  const drawn = new THREE.Vector3(A[i * 16 + 12], A[i * 16 + 13], A[i * 16 + 14]);
  between('the pocket moved the complex (µm)', placed.distanceTo(pl.pos), 0.02, 1);
  check('a bead at the complex is drawn where the complex is (µm)', drawn.distanceTo(placed), 0, 1e-6);
}

console.log('\n# a small pool (100 beads): pictures make way, the books stay exact');
{
  const h = new Bacterium({ hero: true, seed: 42 });
  const m = new Metabolism(h, { capacity: 100 });
  let acc = 0, taken = 0, evictions = 0;
  const evict = m.evict.bind(m);
  m.evict = () => (evictions++, evict());
  for (let k = 0; k < 40 / DT; k++) {
    acc += 1 * DT;
    if (acc >= 1 && m.uptakeGlucose()) (acc--, taken++);
    m.update(DT, { thrust: 1, oxygen: 1 });
  }
  let t = 0;
  while (routeBusy(m) > 0 && t < 120) {
    m.update(DT, { thrust: 1, oxygen: 1 });
    t += DT;
  }
  const M = m.ledger.made;
  console.log(`     taken ${taken} in 40 s, evictions ${evictions}`);
  check('NADH per glucose', M.nadh / taken, 10);
  check('H+ out per glucose', M.protonsRespiration / taken, 88);
  check('O2 per glucose', M.o2 / taken, 6);
  check('net substrate ATP per glucose', m.ledger.atpNetSubstrate / taken, 4);
  check('ATP from synthase vs H+ through it (3 per 10)', M.atpSynthase, M.protonsSynthase * 0.3, m.syn.length * 3);
}

{
  // a full pool of H+ beads on their way into a synthase; an NADH must still get through
  const h = new Bacterium({ hero: true, seed: 42 });
  const m = new Metabolism(h, { capacity: 40 });
  const T_HSYNTH = 12;
  let sent = 0;
  while (m.nFree > 0) (m.toMachine(T_HSYNTH, 0, m.syn[0], 0), sent++);
  m.launchNadh(m.node);
  for (let k = 0; k < 10 / DT; k++) m.update(DT, { oxygen: 1 });
  const M = m.ledger.made;
  check('evicted H+ still turned the rotor: H+ through synthase', M.protonsSynthase, sent);
  check('the NADH got through: H+ out', M.protonsRespiration, 8);
}

console.log('\n# ATP synthase: 36° per H+, 3 ATP per 10 H+, and backwards');
{
  const L = new Ledger({ synthases: 1 });
  L.atp = 0;
  const at = [];
  for (let h = 1; h <= 1000; h++) if (L.synthaseProton(0)) at.push(h);
  check('ATP from 1000 H+', L.made.atpSynthase, 300);
  check('first turn releases at H+ 4, 7, 10', at.slice(0, 3).join(',') === '4,7,10' ? 1 : 0, 1);
  let out = 0;
  for (let k = 0; k < 300; k++) out += L.synthaseReverse(0);
  check('H+ pumped by burning 300 ATP', out, 1000);
  const { h, m } = fresh();
  m.ledger.protons = 380; // a high Δp: the synthases turn forward
  for (let k = 0; k < 300; k++) m.update(DT, { oxygen: 1 });
  for (let k = 0; k < 120; k++) m.update(DT, { oxygen: 1 });
  const turned = h.sites.atpSynthase.reduce((s, x) => s + x.angle, 0) + m.spinPending.reduce((s, x) => s + x, 0);
  check('rotor angle = 36° x H+ through (deg)', (turned * 180) / Math.PI, 36 * m.ledger.made.protonsSynthase, 0.5);
}

console.log('\n# calibration');
{
  const { m } = fresh();
  check('start Δp (mV)', m.state.pmf, -150, 1);
  check('start ATP', m.state.atp, 0.7, 0.01);
  check('motor power at start', m.state.motorPower, 1, 0.02);

  // Full thrust, no food: how long until the motors are down to a crawl (30% power)?
  let t = 0;
  while (m.state.motorPower > 0.3 && t < 120) {
    m.update(DT, { thrust: 1, oxygen: 1 });
    t += DT;
  }
  between('full thrust without food: seconds to 30% motor power', t, 15, 25);
  console.log(`     then Δp ${m.state.pmf.toFixed(0)} mV, ATP ${(m.state.atp * 100).toFixed(0)}%`);

  for (const rate of [1, 0.5, 0.25]) {
    const { m: g } = fresh();
    let acc = 0, minPower = 1, maxAlive = 0, sumAlive = 0, n = 0;
    for (let k = 0; k < 90 / DT; k++) {
      acc += rate * DT;
      if (acc >= 1 && g.uptakeGlucose()) acc--;
      g.update(DT, { thrust: 1, oxygen: 1 });
      if (k * DT > 12) {
        minPower = Math.min(minPower, g.state.motorPower);
        const alive = g.capacity - g.nFree;
        maxAlive = Math.max(maxAlive, alive);
        sumAlive += alive;
        n++;
      }
    }
    const s = g.state;
    console.log(`     ${rate} glucose/s, full thrust for 90 s: min motor power ${minPower.toFixed(2)}, Δp ${s.pmf.toFixed(0)} mV, ATP ${(s.atp * 100).toFixed(0)}%, ATP ${s.rates.atpPerSec.toFixed(1)}/s, beads ${(sumAlive / n).toFixed(0)} avg / ${maxAlive} max`);
    if (rate === 1) between('in a glucose patch (1/s) the cell swims on: min motor power', minPower, 0.9, 1);
    if (rate === 0.5) between('half a glucose a second still swims: min motor power', minPower, 0.85, 1);
  }

  const { m: idle } = fresh();
  for (let k = 0; k < 60 / DT; k++) idle.update(DT, { thrust: 0, oxygen: 1 });
  console.log(`     resting 60 s without food: Δp ${idle.state.pmf.toFixed(0)} mV, ATP ${(idle.state.atp * 100).toFixed(0)}%`);
  check('motor power curve: 0 at -35 mV, 1 at -125 mV', motorPowerAt(-35) + (1 - motorPowerAt(-125)), 0);
}

console.log('\n# the TCA cycle is drawn once');
{
  // CellPass draws its own stream of beads round the loop unless tca.stream says not to. The
  // opening does not run the route and keeps that stream; once the route runs it fades out, and
  // the cycle's intermediates are the counted beads alone.
  const { h, m } = fresh();
  check('before the route runs: CellPass stream', h.volume.tca.stream ?? 1, 1);
  for (let k = 0; k < 2 / DT; k++) m.update(DT, { oxygen: 1 });
  check('once it runs: CellPass stream', h.volume.tca.stream, 0);
}

console.log('\n# gold means ATP: the complexes keep off the beads’ colours');
{
  const { h, m } = fresh();
  const hsl = (c) => c.getHSL({}, THREE.SRGBColorSpace);
  const apart = (a, b) => {
    const d = Math.abs(hsl(a).h - hsl(b).h) * 360;
    return Math.min(d, 360 - d);
  };
  const beads = m.base.filter((c) => hsl(c).s > 0.3); // greys have no hue to clash with
  const atp = new THREE.Color(m.legend.find((l) => l.key === 'atp').color);
  for (const key of ['pts', 'atpSynthase']) {
    const c = h.complexes.find((x) => x.sites === h.sites[key]).vivid[0];
    between(`${key}: hue from ATP's gold (°)`, apart(c, atp), 45, 180);
    between(`${key}: hue from the nearest bead colour (°)`, Math.min(...beads.map((b) => apart(c, b))), 25, 180);
  }
}

void hero;
void CONFIG;
console.log(failed ? `\n${failed} FAILED` : '\nall passed');
process.exit(failed ? 1 : 0);
