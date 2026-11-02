import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { goodsellMaterial, jellyMaterial, envelopeMaterial, bumpTexture, mulberry32 } from './materials.js';
import { GOODSELL } from './palette.js';

// One unit is one micrometre. An E. coli-like rod: 1 µm wide, 2 µm long, flagella about 5 µm.
const Z = new THREE.Vector3(0, 0, 1);

function capsule(r, cyl, cap = 24, radial = 48) {
  const g = new THREE.CapsuleGeometry(r, cyl, cap, radial, 8);
  g.rotateX(Math.PI / 2);
  return g;
}

function inCapsule(p, r, cyl) {
  const z = Math.max(Math.abs(p.z) - cyl / 2, 0);
  return p.x * p.x + p.y * p.y + z * z < r * r;
}

function randomInCapsule(rng, r, cyl, v, reject) {
  do {
    v.set((rng() * 2 - 1) * r, (rng() * 2 - 1) * r, (rng() * 2 - 1) * (r + cyl / 2));
  } while (!inCapsule(v, r, cyl) || (reject && reject(v)));
  return v;
}

// A point on the capsule's surface and its outward normal, at height z.
function surfacePoint(r, cyl, z, angle) {
  const cap = Math.abs(z) > cyl / 2;
  const dz = cap ? Math.abs(z) - cyl / 2 : 0;
  const rr = Math.sqrt(Math.max(r * r - dz * dz, 0));
  const p = new THREE.Vector3(Math.cos(angle) * rr, Math.sin(angle) * rr, z);
  const n = cap ? p.clone().sub(new THREE.Vector3(0, 0, Math.sign(z) * cyl / 2)).normalize() : new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
  return { p, n };
}

class Helix extends THREE.Curve {
  constructor(length, pitch, radius) {
    super();
    this.length = length;
    this.pitch = pitch;
    this.radius = radius;
  }
  getPoint(t, target = new THREE.Vector3()) {
    const z = t * this.length;
    const a = (z / this.pitch) * Math.PI * 2;
    const r = this.radius * THREE.MathUtils.smoothstep(t, 0, 0.1);
    return target.set(Math.cos(a) * r, Math.sin(a) * r, z);
  }
}

// A flagellum: a rigid left-handed helix spun by its motor. Spinning a helix about its own axis is
// what makes the wave travel down it. Bundled (running), each filament runs back along the body and,
// once past the rear pole, bends in to join the others in one tight bundle; splayed (tumbling),
// they fly apart and trail loosely.
class Flagellum {
  constructor({ root, normal, length, rng, parent, motorGeo, motorMat }) {
    this.length = length;
    this.pivot = new THREE.Group();
    this.pivot.position.copy(root);
    parent.add(this.pivot);

    this.material = goodsellMaterial({ color: GOODSELL.flagellum, bend: true });
    const geo = new THREE.TubeGeometry(new Helix(length, 2.3, 0.2), 220, 0.014, 6, false);
    this.filament = new THREE.Mesh(geo, this.material);
    this.filament.frustumCulled = false;
    this.pivot.add(this.filament);

    const motor = new THREE.Mesh(motorGeo, motorMat);
    motor.position.copy(root);
    motor.quaternion.setFromUnitVectors(Z, normal);
    parent.add(motor);
    this.motor = motor;

    const back = new THREE.Vector3(0, 0, -1);
    const radial = new THREE.Vector3(normal.x, normal.y, 0).normalize();
    this.bundleDir = back.clone().addScaledVector(radial, 0.06).normalize();
    this.bundleBend = radial.clone().multiplyScalar(-(Math.hypot(root.x, root.y) - 0.04));
    const pastPole = root.z + 1.05;
    this.bundleRange = new THREE.Vector2(pastPole, pastPole + 1.3);
    this.splayRange = new THREE.Vector2(0, length);
    const wobble = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).multiplyScalar(0.5);
    this.splayDir = normal.clone().add(wobble).addScaledVector(back, 0.35).normalize();
    this.splayBend = back.clone().multiplyScalar(1.2).add(wobble.clone().multiplyScalar(0.4));
    this.dir = this.splayDir.clone().lerp(this.bundleDir, 0.6).normalize();
    this.bend = this.splayBend.clone().lerp(this.bundleBend, 0.6);
    this.phase = rng() * Math.PI * 2;
    this.tip = new THREE.Object3D();
    this.tip.position.set(0, 0, length * 0.45);
    this.pivot.add(this.tip);
  }

  update(dt, bundle, omega, worldQuat) {
    const k = 1 - Math.exp(-dt * 5);
    _v.lerpVectors(this.splayDir, this.bundleDir, bundle).normalize();
    this.dir.lerp(_v, k).normalize();
    _w.lerpVectors(this.splayBend, this.bundleBend, bundle);
    this.bend.lerp(_w, k);
    this.pivot.quaternion.setFromUnitVectors(Z, this.dir);
    this.phase += omega * dt;
    this.filament.rotation.z = this.phase;
    const u = this.material.uniforms;
    u.uBend.value.copy(this.bend).applyQuaternion(worldQuat);
    u.uBendRange.value.lerpVectors(this.splayRange, this.bundleRange, bundle);
  }
}
const _v = new THREE.Vector3();
const _w = new THREE.Vector3();
const _q = new THREE.Quaternion();

export class Bacterium {
  constructor({ hero = false, seed = 1, tint = 0xbfe6c8, attenuation = 0x7fc7a4, flagella = hero ? 7 : 4, scale = 1 } = {}) {
    const rng = mulberry32(seed);
    this.rng = rng;
    this.hero = hero;
    this.R = 0.5;
    this.CYL = 1.0;
    this.group = new THREE.Group();
    this.body = new THREE.Group();
    this.group.add(this.body);
    this.group.scale.setScalar(scale);
    this.wobble = { value: 0.012 };
    this.anchors = [];

    const jelly = new THREE.Mesh(
      capsule(this.R, this.CYL, hero ? 32 : 16, hero ? 64 : 32),
      jellyMaterial({ color: tint, attenuation, bump: bumpTexture(rng), wobble: this.wobble }),
    );
    this.body.add(jelly);
    this.jelly = jelly;

    const envelope = new THREE.Mesh(capsule(this.R * 1.03, this.CYL, 24, 48), envelopeMaterial(GOODSELL.envelope));
    envelope.renderOrder = 2;
    this.body.add(envelope);

    if (hero) this.buildInterior(rng);
    else this.buildSimpleInterior(rng);

    const motorGeo = new THREE.TorusGeometry(0.035, 0.013, 8, 16);
    const motorMat = goodsellMaterial({ color: GOODSELL.motor });
    this.flagella = [];
    for (let i = 0; i < flagella; i++) {
      const z = THREE.MathUtils.lerp(-0.95, 0.55, rng());
      const { p, n } = surfacePoint(this.R * 0.96, this.CYL, z, rng() * Math.PI * 2);
      this.flagella.push(new Flagellum({ root: p, normal: n, length: 4.4 + rng() * 1.6, rng, parent: this.body, motorGeo, motorMat }));
    }
    if (hero) {
      const f = this.flagella[0];
      this.anchor('motor', 'Flagellar motor', 'proton-driven rotor · ~100 rev/s', f.motor, { angle: -150, len: 70 });
      this.anchor('flagellum', 'Flagellum', 'flagellin helix · 20 nm thick', f.tip, { angle: -35, len: 60, interior: true });
    }
  }

  // angle: direction of the tag's leader on screen in degrees (0 = right, -90 = up); len in pixels.
  anchor(key, title, sub, obj, { angle = -40, len = 70, interior = false } = {}) {
    this.anchors.push({ key, title, sub, obj, angle, len, interior });
  }

  // The hero cell's insides, crowded the way Goodsell paints them.
  buildInterior(rng) {
    const R = this.R * 0.82, CYL = this.CYL;
    const v = new THREE.Vector3();
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const s = new THREE.Vector3();
    const e = new THREE.Euler();
    const col = new THREE.Color();
    const inNucleoid = (p) => (p.x * p.x + p.y * p.y) / 0.07 + (p.z * p.z) / 0.36 < 1;

    // Nucleoid: the chromosome as a tangle of DNA confined to the middle of the cell.
    const strands = [];
    for (let s2 = 0; s2 < 3; s2++) {
      const pts = [];
      const p = new THREE.Vector3((rng() - 0.5) * 0.1, (rng() - 0.5) * 0.1, (rng() - 0.5) * 0.4);
      const d = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize();
      for (let i = 0; i < 420; i++) {
        d.x += (rng() - 0.5) * 0.9;
        d.y += (rng() - 0.5) * 0.9;
        d.z += (rng() - 0.5) * 0.9;
        d.normalize();
        p.addScaledVector(d, 0.03);
        if ((p.x * p.x + p.y * p.y) / 0.075 + (p.z * p.z) / 0.4 > 1) {
          d.copy(p).multiplyScalar(-1).normalize();
          p.addScaledVector(d, 0.04);
        }
        pts.push(p.clone());
      }
      strands.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 1600, 0.011, 5, false));
    }
    const dna = new THREE.Mesh(mergeGeometries(strands), goodsellMaterial({ color: GOODSELL.dna }));
    this.body.add(dna);

    // DNA-binding proteins dotted along the nucleoid.
    const hu = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), goodsellMaterial({ jitter: 0.004 }), 180);
    for (let i = 0; i < hu.count; i++) {
      randomInCapsule(rng, R, CYL, v, (p) => !inNucleoid(p));
      s.setScalar(0.022 + rng() * 0.012);
      m.compose(v, q.identity(), s);
      hu.setMatrixAt(i, m);
      hu.setColorAt(i, col.setHex(GOODSELL.dnaProtein).offsetHSL(0, 0, (rng() - 0.5) * 0.1));
    }
    this.body.add(hu);

    // Cytoplasmic proteins: thousands of small blue and violet blobs, packed tight.
    const prot = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), goodsellMaterial({ jitter: 0.006 }), 2600);
    for (let i = 0; i < prot.count; i++) {
      randomInCapsule(rng, R, CYL, v, (p) => inNucleoid(p) && rng() < 0.75);
      s.set(1, 0.8 + rng() * 0.4, 0.8 + rng() * 0.4).multiplyScalar(0.018 + rng() * 0.022);
      q.setFromEuler(e.set(rng() * 6, rng() * 6, rng() * 6));
      m.compose(v, q, s);
      prot.setMatrixAt(i, m);
      prot.setColorAt(i, col.setHex(GOODSELL.cytoplasm[(rng() * GOODSELL.cytoplasm.length) | 0]));
    }
    this.body.add(prot);

    // Ribosomes: two subunits each, magenta, kept out of the nucleoid.
    const big = new THREE.IcosahedronGeometry(0.05, 1);
    const small = new THREE.IcosahedronGeometry(0.036, 1).translate(0.012, 0.046, 0);
    const ribo = new THREE.InstancedMesh(mergeGeometries([big, small]), goodsellMaterial({ jitter: 0.005 }), 420);
    let riboAnchor = null;
    for (let i = 0; i < ribo.count; i++) {
      randomInCapsule(rng, R, CYL, v, inNucleoid);
      q.setFromEuler(e.set(rng() * 6, rng() * 6, rng() * 6));
      m.compose(v, q, s.setScalar(0.85 + rng() * 0.3));
      ribo.setMatrixAt(i, m);
      ribo.setColorAt(i, col.setHex(GOODSELL.ribosome[(rng() * GOODSELL.ribosome.length) | 0]));
      if (!riboAnchor && v.y > 0.18 && v.z > 0.1) riboAnchor = v.clone();
    }
    this.body.add(ribo);

    // A supercoiled plasmid: the kind of DNA bacteria trade with each other.
    const plasmidCurve = new THREE.Curve();
    plasmidCurve.getPoint = (t, target = new THREE.Vector3()) => {
      const a = t * Math.PI * 2;
      return target.set(Math.cos(a) * 0.1 + 0.025 * Math.cos(a * 9), Math.sin(a) * 0.045 + 0.025 * Math.sin(a * 9), 0.02 * Math.sin(a * 9 + 1));
    };
    const plasmid = new THREE.Mesh(new THREE.TubeGeometry(plasmidCurve, 300, 0.012, 5, true), goodsellMaterial({ color: GOODSELL.plasmid }));
    plasmid.position.set(-0.16, -0.12, -0.62);
    plasmid.rotation.set(0.6, 0.4, 0.2);
    this.body.add(plasmid);

    // Polyphosphate granules.
    const granules = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 2), goodsellMaterial({ jitter: 0.002 }), 3);
    for (let i = 0; i < 3; i++) {
      randomInCapsule(rng, R * 0.8, CYL, v, inNucleoid);
      m.compose(v, q.identity(), s.setScalar(0.06 + rng() * 0.03));
      granules.setMatrixAt(i, m);
      granules.setColorAt(i, col.setHex(GOODSELL.granule));
    }
    this.body.add(granules);

    // Chemoreceptor array at the leading pole.
    const rec = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.008, 0.008, 0.08, 5).rotateX(Math.PI / 2), goodsellMaterial({ jitter: 0.002 }), 160);
    for (let i = 0; i < rec.count; i++) {
      const theta = Math.acos(1 - rng() * (1 - Math.cos(0.7)));
      const phi = rng() * Math.PI * 2;
      const n = new THREE.Vector3(Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta));
      v.copy(n).multiplyScalar(this.R * 0.84).add(new THREE.Vector3(0, 0, CYL / 2));
      q.setFromUnitVectors(Z, n);
      m.compose(v, q, s.setScalar(1));
      rec.setMatrixAt(i, m);
      rec.setColorAt(i, col.setHex(GOODSELL.receptor).offsetHSL(0, 0, (rng() - 0.5) * 0.08));
    }
    this.body.add(rec);

    const at = (x, y, z) => {
      const o = new THREE.Object3D();
      o.position.set(x, y, z);
      this.body.add(o);
      return o;
    };
    this.anchor('envelope', 'Cell envelope', 'outer membrane · peptidoglycan · inner membrane', at(0, this.R, 0.15), { angle: -55, len: 80 });
    this.anchor('nucleoid', 'Nucleoid', 'circular chromosome · 4.6 million base pairs', at(0, 0.05, -0.1), { angle: 165, len: 130, interior: true });
    this.anchor('ribosome', 'Ribosome', '70S · reads mRNA three bases (one codon) at a time', at(...(riboAnchor ?? new THREE.Vector3(0, 0.25, 0.3)).toArray()), { angle: -15, len: 120, interior: true });
    this.anchor('plasmid', 'Plasmid', 'small DNA ring · can be passed to other cells', plasmid, { angle: 135, len: 90, interior: true });
    this.anchor('receptors', 'Chemoreceptor array', 'tastes the water for sugar and oxygen', at(0, 0.2, CYL / 2 + this.R * 0.85), { angle: -125, len: 90 });
    this.anchor('cytoplasm', 'Cytoplasm', 'about 300 mg of protein per mL · crowded', at(0.18, -0.26, 0.35), { angle: 40, len: 100, interior: true });
  }

  // Neighbours seen from a distance: a coloured core, no individual molecules.
  buildSimpleInterior(rng) {
    const core = new THREE.Mesh(capsule(this.R * 0.72, this.CYL * 0.95, 12, 24), goodsellMaterial({ color: GOODSELL.cytoplasm[(rng() * 6) | 0] }));
    this.body.add(core);
    const nuc = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), goodsellMaterial({ color: GOODSELL.dna }));
    nuc.scale.set(0.26, 0.26, 0.5);
    this.body.add(nuc);
  }

  // thrust 0..1 (how hard the motors drive), bundle 0..1 (bundled vs splayed), omega (filament spin rate).
  update(dt, { thrust = 0, bundle = 0.5, omega = 20, squish = 0 } = {}) {
    this.wobble.value = 0.01 + thrust * 0.008;
    const sz = 1 + squish * 0.05;
    this.body.scale.set(1 / Math.sqrt(sz), 1 / Math.sqrt(sz), sz);
    this.group.getWorldQuaternion(_q);
    for (const f of this.flagella) f.update(dt, bundle, omega, _q);
  }
}

// Cocci clusters: round, non-motile cells that only drift.
export class Coccus {
  constructor({ seed = 3, count = 4, tint = 0xf0d9a0, attenuation = 0xd9b25a } = {}) {
    const rng = mulberry32(seed);
    this.group = new THREE.Group();
    const geo = new THREE.SphereGeometry(0.45, 32, 24);
    const mat = jellyMaterial({ color: tint, attenuation, bump: bumpTexture(rng), wobble: { value: 0.008 } });
    const coreMat = goodsellMaterial({ color: 0xd9a948 });
    const coreGeo = new THREE.SphereGeometry(0.3, 16, 12);
    const p = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(geo, mat);
      m.position.copy(p);
      m.add(new THREE.Mesh(coreGeo, coreMat));
      this.group.add(m);
      p.add(new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize().multiplyScalar(0.82));
    }
  }
}
