import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { MarchingCubes } from 'three/addons/objects/MarchingCubes.js';
import { createCellShape, syncShape, setDent, flowPoint, organicMaterial, mulberry32, MAX_DENTS } from './materials.js';
import { CELL_KIND } from './cellpass.js';
import { ORGANELLE } from './palette.js';

export { CELL_KIND };

// The cell. One unit is one micrometre: an E. coli-like Gram-negative rod, 1 µm wide and 2 µm long,
// that has lost its peptidoglycan wall, so nothing holds its shape and it flows. It keeps its outer
// membrane, the periplasm and the inner membrane.
//
// The cell itself (membranes, cytoplasm, nucleoid, plasmid, granules, the TCA cycle, glycolysis,
// the receptor patch, vesicles) is drawn by CellPass as one volume; a Bacterium IS its CellPass
// descriptor (body, shape, kind, R, H, tint, volume). What is better as meshes lives here: the
// membrane protein complexes, flagellar motors and flagella, polysomes, and a sprinkle of free
// proteins. They all ride the cell's flow warp (`shape`), are opaque, and are veiled by the
// membrane in front of them, so they sit inside the volume rather than on top of it.
//
// Sizes, one factor per kind of thing so proportions hold within it:
//   membrane complexes: 3x life size, like the periplasm (real ~25 nm, drawn 80 nm) and the
//     membranes (drawn 13 nm thick);
//   flagellar motors: 2.4x across (C-ring 45 nm, drawn 108 nm), so they stay a little quieter than
//     the energy route yet are still ~3.3x as wide as an ATP synthase head (in life ~4.5x). The rod
//     spans the drawn periplasm; the hook is drawn shortened and tapers into the filament;
//   ribosomes: ~1.4x;
//   flagella: true size (20 nm thick, a 2.3 µm pitch helix 0.4 µm across).
//
// The respiratory complexes and ATP synthase gather in a few mobile patches of membrane (in E. coli
// each kind gathers in its own mobile islands, and different kinds do not co-localise: Lenn et al.
// 2008; Llorente-Garcia et al. 2014; mixing them in one patch, so one circuit can be followed, is
// Codon staging), and the glucose transporters in two more. CellPass draws each patch as a thicker, differently coloured raft of inner membrane, so
// the complexes visibly sit in the membrane.
//
// Everything is placed in REFERENCE body space (capsule R = 0.5, core half-length H = 0.5 along +Z,
// +Z the front pole), which is also where game logic lives.

const Z = new THREE.Vector3(0, 0, 1);
export const R_INNER = 0.42;
const OM_GAP = 0.08; // outer membrane sits this far outside the inner one
const MOTOR_REACH = 0.13; // inner membrane to the top of the hook

const _v = new THREE.Vector3();
const _w = new THREE.Vector3();
const _p = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _m = new THREE.Matrix4();
const _s = new THREE.Vector3(1, 1, 1);
const _c = new THREE.Color();
const _wq = new THREE.Quaternion();
const _shift = new THREE.Vector3();
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);

// organicMaterial dithers away anything within ~1.6 µm of the lens; the cell's own parts are seen
// closer than that whenever the camera inspects it, and the dither breaks them into dots. Here it
// only dissolves what is about to touch the lens.
const cellMaterial = (opts) => organicMaterial({ nearFade: [0.08, 0.3], ...opts });

// ------------------------------------------------------------------------------------- geometry
// Every protein is ONE fused body: its subunits are lobes of a signed-distance field joined by a
// smooth union and polygonised once, at load (marching cubes). It reads as a single soft molecule
// with gentle bulges where its subunits are, never as a kit of separate beads.
const piece = {
  // an ellipsoid; `lobes` gentle bulges round its own z axis
  ell: (c, rx, ry, rz, lobes = 0, amp = 0) => ({ k: 'e', c, r: v3(rx, ry, rz), lobes, amp }),
  ball: (c, r) => ({ k: 'e', c, r: v3(r, r, r), lobes: 0, amp: 0 }),
  // a tube from a to b, radius ra to rb, swelling softly `bulges` times along its length
  tube: (a, b, ra, rb, bulges = 0, amp = 0) => ({ k: 't', a, b, ra, rb, bulges, amp }),
  // a ring round the z axis at height z: radius R, cross-section half-widths w (radial), h (along z)
  ring: (z, R, w, h, lobes = 0, amp = 0) => ({ k: 'r', z, R, w, h, lobes, amp }),
};

// (Math.hypot is slow; these run a few million times at load.)
const len2 = (x, y) => Math.sqrt(x * x + y * y);
const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z);
function sdPiece(pc, x, y, z) {
  if (pc.k === 'e') {
    const dx = x - pc.c.x, dy = y - pc.c.y, dz = z - pc.c.z;
    const s = pc.lobes ? 1 + pc.amp * Math.cos(pc.lobes * Math.atan2(dy, dx)) : 1;
    const rx = pc.r.x * s, ry = pc.r.y * s, rz = pc.r.z;
    return (len3(dx / rx, dy / ry, dz / rz) - 1) * Math.min(rx, ry, rz);
  }
  if (pc.k === 't') {
    const bx = pc.b.x - pc.a.x, by = pc.b.y - pc.a.y, bz = pc.b.z - pc.a.z;
    const px = x - pc.a.x, py = y - pc.a.y, pz = z - pc.a.z;
    const h = Math.min(Math.max((px * bx + py * by + pz * bz) / (bx * bx + by * by + bz * bz), 0), 1);
    const r = (pc.ra + (pc.rb - pc.ra) * h) * (1 + pc.amp * Math.cos(Math.PI * 2 * pc.bulges * h));
    return len3(px - bx * h, py - by * h, pz - bz * h) - r;
  }
  const q = len2(x, y) - pc.R;
  const s = pc.lobes ? 1 + pc.amp * Math.cos(pc.lobes * Math.atan2(y, x)) : 1;
  const w = pc.w * s, h = pc.h * s;
  return (len2(q / w, (z - pc.z) / h) - 1) * Math.min(w, h);
}

function pieceBounds(pc, min, max) {
  const grow = (x, y, z, r) => {
    min.min(_v.set(x - r, y - r, z - r));
    max.max(_v.set(x + r, y + r, z + r));
  };
  if (pc.k === 'e') grow(pc.c.x, pc.c.y, pc.c.z, Math.max(pc.r.x, pc.r.y, pc.r.z) * (1 + pc.amp));
  else if (pc.k === 't') {
    const r = Math.max(pc.ra, pc.rb) * (1 + pc.amp);
    grow(pc.a.x, pc.a.y, pc.a.z, r);
    grow(pc.b.x, pc.b.y, pc.b.z, r);
  } else {
    const r = pc.R + pc.w * (1 + pc.amp);
    min.min(_v.set(-r, -r, pc.z - pc.h * (1 + pc.amp)));
    max.max(_v.set(r, r, pc.z + pc.h * (1 + pc.amp)));
  }
}

// Polygonise the smooth union of `pieces` (blend: how broadly they melt together, µm) with marching
// cubes at about `voxel` µm, plus a faint lumpiness so no surface is mathematically clean.
const _dummy = new THREE.MeshBasicMaterial();
function bake({ pieces, blend = 0.004, voxel = 0.0016, lump = 0.0004 }) {
  const min = v3(Infinity, Infinity, Infinity), max = v3(-Infinity, -Infinity, -Infinity);
  const pmin = v3(0, 0, 0), pmax = v3(0, 0, 0);
  for (const pc of pieces) {
    pmin.set(Infinity, Infinity, Infinity);
    pmax.set(-Infinity, -Infinity, -Infinity);
    pieceBounds(pc, pmin, pmax);
    min.min(pmin);
    max.max(pmax);
    pc.bc = pmin.clone().add(pmax).multiplyScalar(0.5);
    pc.br = pmin.distanceTo(pmax) / 2;
  }
  const centre = min.clone().add(max).multiplyScalar(0.5);
  const half = Math.max(max.x - min.x, max.y - min.y, max.z - min.z) / 2 + blend + lump + 2 * voxel;
  const res = THREE.MathUtils.clamp(Math.ceil((2 * half) / voxel) + 6, 24, 80);
  const S = half / (1 - 6 / res);
  const mc = new MarchingCubes(res, _dummy, false, false, 80000);
  mc.isolation = 0;
  const step = (2 * S) / res;
  const at = (i) => (i - res / 2) * step;
  const f = (Math.PI * 2) / 0.014;
  const sdf = (x, y, z) => {
    let d = Infinity;
    for (let n = 0; n < pieces.length; n++) {
      // a piece whose bounding sphere is further than the blend cannot change d
      const pc = pieces[n];
      if (d < Infinity && len3(x - pc.bc.x, y - pc.bc.y, z - pc.bc.z) - pc.br > d + blend) continue;
      const b = sdPiece(pc, x, y, z);
      if (d === Infinity) { d = b; continue; }
      const h = Math.max(blend - Math.abs(d - b), 0) / blend;
      d = Math.min(d, b) - h * h * blend * 0.25;
    }
    return d;
  };
  // Coarse to fine: a 4-voxel block whose centre is well clear of the surface keeps that one value
  // (marching cubes only reads the sign there); only blocks near the surface are sampled in full.
  const B = 4;
  const clear = (1.5 * Math.sqrt(3) + 3) * step;
  for (let bk = 0; bk < res; bk += B) {
    for (let bj = 0; bj < res; bj += B) {
      for (let bi = 0; bi < res; bi += B) {
        const dc = sdf(centre.x + at(bi + 1.5), centre.y + at(bj + 1.5), centre.z + at(bk + 1.5));
        const far = Math.abs(dc) > clear;
        for (let k = bk; k < Math.min(bk + B, res); k++) {
          const z = centre.z + at(k);
          for (let j = bj; j < Math.min(bj + B, res); j++) {
            const y = centre.y + at(j);
            for (let i = bi; i < Math.min(bi + B, res); i++) {
              let d = dc;
              if (!far) {
                const x = centre.x + at(i);
                d = sdf(x, y, z) + lump * Math.sin(x * f + 1.3) * Math.sin(y * f * 1.13 + 0.4) * Math.sin(z * f * 0.91 + 2.2);
              }
              mc.field[i + j * res + k * res * res] = -d;
            }
          }
        }
      }
    }
  }
  mc.update();
  const n = mc.count;
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const o = i * 3;
    pos[o] = centre.x + S * mc.positionArray[o];
    pos[o + 1] = centre.y + S * mc.positionArray[o + 1];
    pos[o + 2] = centre.z + S * mc.positionArray[o + 2];
    _v.set(mc.normalArray[o], mc.normalArray[o + 1], mc.normalArray[o + 2]).normalize();
    nor[o] = _v.x;
    nor[o + 1] = _v.y;
    nor[o + 2] = _v.z;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  mc.geometry.dispose();
  return mergeVertices(g, 1e-7);
}

// The shapes, in each complex's local frame: origin in the middle of the inner membrane, +Z outward
// (toward the periplasm), -Z into the cytoplasm. µm, 3x life size (ribosome ~1.4x).
const SHAPES = {
  // F1Fo ATP synthase, the part that holds still: the α3β3 head in the cytoplasm (six gentle lobes,
  // three α and three β), δ on top, subunit a beside the rotor in the membrane, and the peripheral
  // stalk (b2) running up the side of the head to δ, which stops the head turning with the rotor.
  atpStator: () => ({
    voxel: 0.0019,
    blend: 0.0028,
    pieces: [
      piece.ell(v3(0, 0, -0.034), 0.0165, 0.0165, 0.0125, 6, 0.07),
      piece.ball(v3(0.0055, 0, -0.0485), 0.0052),
      piece.ell(v3(0.0118, 0, 0), 0.0046, 0.0056, 0.0078),
      piece.tube(v3(0.0125, 0, -0.004), v3(0.0185, 0.0005, -0.022), 0.0026, 0.0024),
      piece.tube(v3(0.0185, 0.0005, -0.022), v3(0.0205, 0.001, -0.036), 0.0024, 0.0024),
      piece.tube(v3(0.0205, 0.001, -0.036), v3(0.0075, 0, -0.0485), 0.0024, 0.0026),
    ],
  }),
  // The rotor: the ring of ten c-subunits in the membrane (10 H+ per turn), the γ stalk turning
  // inside the head (three ATP per turn) and ε, an off-axis cam in the gap under the head, so the
  // turning shows.
  atpRotor: () => ({
    voxel: 0.0015,
    blend: 0.0025,
    pieces: [
      piece.ring(0, 0.0052, 0.0034, 0.0095, 10, 0.1),
      piece.tube(v3(0, 0, -0.005), v3(0.0008, 0.0004, -0.036), 0.0027, 0.0023),
      piece.ell(v3(0.0058, 0.001, -0.0145), 0.0043, 0.0036, 0.0034),
    ],
  }),
  // One c-subunit drawn a shade brighter: a mark on the turning ring.
  atpMark: () => ({ voxel: 0.0013, pieces: [piece.ell(v3(0.0054, 0, 0), 0.0041, 0.0041, 0.0106)] }),
  // NADH dehydrogenase I: the L. A long arm in the membrane (the proton pumps) and a peripheral arm
  // reaching into the cytoplasm, where NADH hands over its electrons.
  complexI: () => ({
    voxel: 0.002,
    blend: 0.005,
    pieces: [
      piece.tube(v3(-0.026, 0, 0), v3(0.03, 0.002, 0.0005), 0.0072, 0.0062, 4, 0.1),
      piece.tube(v3(-0.022, 0, -0.005), v3(-0.016, 0.003, -0.031), 0.0085, 0.0105, 2, 0.08),
      piece.ball(v3(-0.015, 0.003, -0.039), 0.0095),
    ],
  }),
  // Succinate dehydrogenase (complex II): a membrane anchor under its two-lobed catalytic head.
  sdh: () => ({
    voxel: 0.0018,
    blend: 0.004,
    pieces: [
      piece.ell(v3(0, 0, 0), 0.0085, 0.0075, 0.0075),
      piece.ball(v3(0.001, 0, -0.012), 0.0065),
      piece.ell(v3(0.002, 0.001, -0.025), 0.0095, 0.0085, 0.0085),
    ],
  }),
  // Cytochrome bo3 oxidase: compact, mostly inside the membrane, a domain out in the periplasm.
  bo3: () => ({
    voxel: 0.0018,
    blend: 0.004,
    pieces: [piece.ell(v3(0, 0, 0.001), 0.0125, 0.0095, 0.008), piece.ell(v3(0.004, 0.001, 0.0115), 0.0075, 0.0068, 0.0055)],
  }),
  // Cytochrome bd: smaller, no proton pump.
  bd: () => ({
    voxel: 0.0018,
    blend: 0.004,
    pieces: [piece.ell(v3(0, 0, 0), 0.0105, 0.0085, 0.0078), piece.ball(v3(-0.003, 0.002, 0.0095), 0.0045)],
  }),
  // The glucose PTS (EIICB^Glc): a dimer of channels in the membrane, the B domains hanging into the
  // cytoplasm where they phosphorylate glucose as it comes through.
  pts: () => ({
    voxel: 0.0018,
    blend: 0.004,
    pieces: [
      piece.ell(v3(-0.0075, 0, 0), 0.0072, 0.0078, 0.0078),
      piece.ell(v3(0.0075, 0.0005, 0), 0.0072, 0.0078, 0.0078),
      piece.ball(v3(-0.0105, 0.002, -0.0135), 0.0052),
      piece.ball(v3(0.0108, -0.0015, -0.0135), 0.0052),
    ],
  }),
  // Flagellar motor, the part that turns: the C-ring in the cytoplasm (34 FliM/FliN), the collar
  // that joins it to the MS ring in the inner membrane, the drive rod across the periplasm and the
  // hook outside, where the filament starts.
  motorRotor: () => ({
    blend: 0.006,
    voxel: 0.0036,
    pieces: [
      piece.ring(-0.036, 0.0436, 0.0086, 0.0155, 34, 0.06),
      piece.ring(-0.019, 0.032, 0.0055, 0.009),
      piece.ring(-0.001, 0.02, 0.0098, 0.0075, 26, 0.05),
      piece.tube(v3(0, 0, -0.004), v3(0, 0, 0.078), 0.0092, 0.0086, 3, 0.06),
      piece.tube(v3(0, 0, 0.078), v3(0.0015, 0.001, MOTOR_REACH), 0.0122, 0.0094, 2, 0.06),
    ],
  }),
  // ...and the parts that hold still: eleven stator units (MotA/MotB, which let protons through and
  // push on the rotor) round it in the inner membrane, and the L ring in the outer membrane. (No P
  // ring: it sits in the wall this cell has lost.)
  motorStator: () => ({
    blend: 0.004,
    voxel: 0.0036,
    pieces: [piece.ring(-0.005, 0.053, 0.0078, 0.011, 11, 0.3), piece.ring(OM_GAP, 0.019, 0.0066, 0.006)],
  }),
  // A 70S ribosome: large and small subunit with the cleft between them, and the L7/L12 stalk.
  ribosome: () => ({
    voxel: 0.002,
    blend: 0.0032,
    pieces: [
      piece.ell(v3(0, 0, 0), 0.0155, 0.0145, 0.014),
      piece.ell(v3(0.002, 0.0138, 0.001), 0.0128, 0.0088, 0.0112),
      piece.tube(v3(-0.0115, 0.006, 0.002), v3(-0.0178, 0.0128, 0.003), 0.0032, 0.0024),
    ],
  }),
};
const BAKED = new Map(); // baked once per page, shared by every cell
function geo(name) {
  if (!BAKED.has(name)) BAKED.set(name, bake(SHAPES[name]()));
  return BAKED.get(name);
}

// A small soft lump (free cytosolic proteins).
function lump(rng, r, { rough = 0.25, detail = 1 } = {}) {
  let g = new THREE.IcosahedronGeometry(1, detail);
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g);
  const waves = Array.from({ length: 4 }, () => ({ d: v3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize(), f: 1.6 + rng() * 2.6, ph: rng() * 6.283, a: 0.4 + rng() * 0.6 }));
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    _v.fromBufferAttribute(pos, i);
    let k = 1;
    for (const w of waves) k += rough * w.a * 0.5 * Math.sin(_v.dot(w.d) * w.f + w.ph);
    _v.multiplyScalar(r * k);
    pos.setXYZ(i, _v.x, _v.y, _v.z);
  }
  g.computeVertexNormals();
  return g;
}

// ------------------------------------------------------------------------------------- layout
// A point on a capsule (core half-length 0.5) of radius r, uniform over its area, and its normal.
function randomOnCapsule(rng, r) {
  const cyl = 2 * Math.PI * r;
  const caps = 4 * Math.PI * r * r;
  if (rng() * (cyl + caps) < cyl) {
    const a = rng() * Math.PI * 2;
    const n = v3(Math.cos(a), Math.sin(a), 0);
    return { pos: n.clone().multiplyScalar(r).setZ(rng() - 0.5), normal: n };
  }
  const n = v3(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1);
  while (n.lengthSq() > 1 || n.lengthSq() < 1e-3) n.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1);
  n.normalize();
  if (Math.abs(n.z) < 1e-3) n.z = 1e-3;
  return { pos: n.clone().multiplyScalar(r).setZ(n.z * r + Math.sign(n.z) * 0.5), normal: n };
}

// The point of the capsule of radius r nearest to p, and its normal there.
function onCapsule(p, r) {
  const z = THREE.MathUtils.clamp(p.z, -0.5, 0.5);
  const normal = v3(p.x, p.y, p.z - z);
  if (normal.lengthSq() < 1e-10) normal.set(1, 0, 0);
  normal.normalize();
  return { pos: v3(0, 0, z).addScaledVector(normal, r), normal };
}

// Along the membrane at normal n: toward the front pole, and round the cell.
function membraneFrame(n) {
  const along = Z.clone().addScaledVector(n, -n.z);
  if (along.lengthSq() < 1e-6) along.set(1, 0, 0).addScaledVector(n, -n.x);
  along.normalize();
  return { along, round: n.clone().cross(along) };
}

// Places on the inner membrane, kept apart from each other and out of the receptor patch.
function scatterOnMembrane(rng, count, taken, { minDist = 0.14, zMin = -2, zMax = 0.66 } = {}) {
  const out = [];
  for (let tries = 0; out.length < count && tries < 4000; tries++) {
    const pl = randomOnCapsule(rng, R_INNER);
    if (pl.pos.z < zMin || pl.pos.z > zMax) continue;
    if (taken.some((o) => o.distanceTo(pl.pos) < minDist)) continue;
    taken.push(pl.pos);
    pl.twist = rng() * Math.PI * 2;
    out.push(pl);
  }
  return out;
}

// How much room each kind of complex takes in the membrane (µm, radius).
const FOOT = { pts: 0.017, complexI: 0.03, sdh: 0.013, bo3: 0.016, bd: 0.013, atpSynthase: 0.02 };

// A patch of membrane holding the given complexes: the first at its centre, the rest packed round.
function fillPatch(rng, centre, kinds) {
  const { along, round } = membraneFrame(centre.normal);
  const members = [];
  for (const kind of kinds) {
    for (let tries = 0; tries < 300; tries++) {
      const rr = members.length === 0 ? 0 : 0.03 + rng() * (0.04 + tries * 0.0004);
      const a = rng() * Math.PI * 2;
      const pl = onCapsule(centre.pos.clone().addScaledVector(along, Math.cos(a) * rr).addScaledVector(round, Math.sin(a) * rr), R_INNER);
      if (members.some((m) => m.pos.distanceTo(pl.pos) < FOOT[m.kind] + FOOT[kind] + 0.006)) continue;
      pl.kind = kind;
      pl.twist = rng() * Math.PI * 2;
      members.push(pl);
      break;
    }
  }
  const extent = members.reduce((e, m) => Math.max(e, m.pos.distanceTo(centre.pos) + FOOT[m.kind]), 0);
  return { centre, members, radius: extent + 0.03 };
}

function orient(normal, twist, out) {
  out.setFromUnitVectors(Z, normal);
  return out.multiply(_q2.setFromAxisAngle(Z, twist));
}

// How far the membrane at reference point p has sunk into an endocytic pocket (mirrors CellPass's
// dents(); keep the two in step).
function dentShift(shape, p, out) {
  out.set(0, 0, 0);
  for (let k = 0; k < MAX_DENTS; k++) {
    const N = shape.uDentN.value[k];
    if (N.w <= 0) continue;
    const C = shape.uDentC.value[k];
    const r = C.w;
    _w.set(p.x - C.x, p.y - C.y, p.z - C.z);
    const along = _w.x * N.x + _w.y * N.y + _w.z * N.z;
    const l2 = _w.lengthSq() - along * along;
    const near = THREE.MathUtils.smoothstep(along, -2.2 * r - N.w, -0.6 * r);
    const pocket = N.w * Math.exp(-l2 / (r * r)) * near;
    const lid = shape.uDentP.value[k] * pocket * Math.exp(-(((along + 0.35 * r) / (0.45 * r)) ** 2));
    out.x -= N.x * (pocket - 1.1 * lid);
    out.y -= N.y * (pocket - 1.1 * lid);
    out.z -= N.z * (pocket - 1.1 * lid);
  }
  return out;
}

// ------------------------------------------------------------------------------------- complexes
// At rest a complex has the colour of the membrane it sits in (a hint of its own hue kept so the
// kinds can be told apart up close); when it works (flash) it lights up in its full colour, so the
// energy route is what catches the eye.
const MEMBRANE_REST = new THREE.Color(0x86d8c6);
const REST_MIX = 0.82;
// The rest colour: the membrane's clear sea-glass hue turned a little toward the complex's own (in
// hue, so the mix never goes grey the way complementary colours do when blended).
const _hsl = { h: 0, s: 0, l: 0 };
const _hslM = MEMBRANE_REST.getHSL({ h: 0, s: 0, l: 0 });
function restColor(vivid, mix) {
  vivid.getHSL(_hsl);
  let dh = _hsl.h - _hslM.h;
  dh -= Math.round(dh);
  return new THREE.Color().setHSL((_hslM.h + dh * (1 - mix) + 1) % 1, _hslM.s, _hslM.l + (_hsl.l - 0.5) * 0.12);
}
function lit(rest, vivid, glow) {
  return _c.copy(rest).lerp(vivid, Math.min(glow, 1)).multiplyScalar(1 + 0.7 * glow);
}

// One kind of membrane complex: an InstancedMesh (plus a turning rotor, and a mark on it, for ATP
// synthase and the motors), one site per instance. Sites flash (a brief inner glow) and, where
// they have a rotor, spin. spinSign: which way + turns the rotor as drawn.
class Complexes {
  constructor(cell, places, { geo: body, color, rotorGeo, rotorColor, markGeo, depth = 0.05, glow = 0.14, shade = 0.08, spinSign = 1, restMix = REST_MIX }) {
    this.cell = cell;
    this.places = places;
    this.spinSign = spinSign;
    const n = places.length;
    const mesh = (g, gl) => {
      const m = new THREE.InstancedMesh(g, cellMaterial({ glow: gl, shape: cell.shape, translucency: 0.45 }), n);
      m.frustumCulled = false;
      cell.body.add(m);
      return m;
    };
    this.mesh = mesh(body, glow);
    this.vivid = places.map((_, i) => new THREE.Color(color).offsetHSL(0, 0, ((i * 0.618) % 1 - 0.5) * shade));
    this.rest = this.vivid.map((c) => restColor(c, restMix));
    if (rotorGeo) {
      this.rotor = mesh(rotorGeo, glow + 0.04);
      this.rotorVivid = new THREE.Color(rotorColor);
      this.rotorRest = restColor(this.rotorVivid, restMix * 0.9);
    }
    if (markGeo) {
      this.mark = mesh(markGeo, glow + 0.25);
      this.markVivid = new THREE.Color(rotorColor).lerp(new THREE.Color(0xffffff), 0.55);
      this.markRest = restColor(this.markVivid, 0.5).offsetHSL(0, 0, 0.12);
    }
    this.sites = places.map((pl, i) => {
      const site = {
        pos: pl.pos.clone(),
        normal: pl.normal.clone(),
        inner: pl.pos.clone().addScaledVector(pl.normal, -depth), // where its cytoplasmic side is
        glow: 0,
        angle: 0,
        flash: (s = 1) => {
          site.glow = Math.min(2, site.glow + s);
          this.dirtyColor = true;
        },
      };
      if (rotorGeo) site.spin = (rad) => { site.angle += rad; };
      return site;
    });
    this.extraSpin = null; // motors: the flagellum's phase, added to each rotor
    this.dirtyColor = true;
    this.update(0, true);
  }

  // Instance matrices: on the inner membrane, following it into any endocytic pocket.
  place() {
    const sh = this.cell.shape;
    for (let i = 0; i < this.places.length; i++) {
      const pl = this.places[i];
      _p.copy(pl.pos).add(dentShift(sh, pl.pos, _v));
      orient(pl.normal, pl.twist, _q);
      this.mesh.setMatrixAt(i, _m.compose(_p, _q, _s));
      if (this.rotor) {
        const spin = this.spinSign * this.sites[i].angle + (this.extraSpin ? this.extraSpin(i) : 0);
        orient(pl.normal, pl.twist + spin, _q);
        _m.compose(_p, _q, _s);
        this.rotor.setMatrixAt(i, _m);
        if (this.mark) this.mark.setMatrixAt(i, _m);
      }
    }
    for (const m of [this.mesh, this.rotor, this.mark]) if (m) m.instanceMatrix.needsUpdate = true;
  }

  update(dt, dentsActive) {
    let any = this.dirtyColor;
    const fade = Math.exp(-dt / 0.45);
    for (let i = 0; i < this.sites.length; i++) {
      const s = this.sites[i];
      if (s.glow > 1e-3 || any) {
        s.glow = s.glow > 1e-3 ? s.glow * fade : 0;
        this.mesh.setColorAt(i, lit(this.rest[i], this.vivid[i], s.glow));
        if (this.rotor) this.rotor.setColorAt(i, lit(this.rotorRest, this.rotorVivid, s.glow));
        if (this.mark) this.mark.setColorAt(i, lit(this.markRest, this.markVivid, s.glow));
        any = true;
      }
    }
    if (any) for (const m of [this.mesh, this.rotor, this.mark]) if (m) m.instanceColor.needsUpdate = true;
    this.dirtyColor = false;
    if (this.rotor || dentsActive) this.place();
  }
}

// ------------------------------------------------------------------------------------- flagella
// E. coli's normal filament is a LEFT-handed helix. Turned counterclockwise as seen from its tip
// (a run), its wave travels from the cell to the tip, so it pushes.
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
    return target.set(Math.cos(a) * r, -Math.sin(a) * r, z);
  }
}

// A tube whose end closes softly instead of stopping in a cut.
function taperedTube(curve, segments, radius, radial) {
  const g = new THREE.TubeGeometry(curve, segments, radius, radial, false);
  const pos = g.attributes.position;
  const c = new THREE.Vector3();
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const k = Math.sqrt(1 - THREE.MathUtils.smoothstep(t, 0.985, 1)) * (0.75 + 0.25 * THREE.MathUtils.smoothstep(t, 0, 0.01));
    curve.getPointAt(t, c);
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j;
      _v.fromBufferAttribute(pos, idx).sub(c).multiplyScalar(k).add(c);
      pos.setXYZ(idx, _v.x, _v.y, _v.z);
    }
  }
  return g; // the tube's own normals: recomputing them would crease the seam into a spiral stripe
}

// A flagellum: a rigid helix spun by its motor. Spinning a helix about its own axis is what makes
// the wave travel down it. Bundled (running), each filament runs back along the body and, once past
// the rear pole, bends in to join the others; their phases ease together so the bundle turns as
// one helix. Splayed (tumbling), they fly apart and drift out of step. Its root rides the flowing
// membrane.
class Flagellum {
  constructor({ root, normal, length, rng, parent, motor }) {
    this.root = root;
    this.normal = normal;
    this.motor = motor;
    this.length = length;
    this.pivot = new THREE.Group();
    parent.add(this.pivot);
    // A filament reaches several µm out into the water, toward the lens when the cell swims away from
    // it, so it dissolves further out than the cell's own parts do.
    this.material = cellMaterial({ color: ORGANELLE.flagellum, bend: true, glow: 0.3, translucency: 0.7, nearFade: [0.4, 1.2] });
    this.curve = new Helix(length, 2.3, 0.2);
    this.filament = new THREE.Mesh(taperedTube(this.curve, 420, 0.0092, 7), this.material);
    this.filament.frustumCulled = false;
    this.pivot.add(this.filament);

    const back = v3(0, 0, -1);
    const radial = v3(normal.x, normal.y, 0).normalize();
    this.bundleDir = back.clone().addScaledVector(radial, 0.06).normalize();
    this.bundleBend = radial.clone().multiplyScalar(-(Math.hypot(root.x, root.y) - 0.04));
    const pastPole = root.z + 1.05;
    this.bundleRange = new THREE.Vector2(pastPole, pastPole + 1.3);
    this.splayRange = new THREE.Vector2(0, length);
    const wobble = v3(rng() - 0.5, rng() - 0.5, rng() - 0.5).multiplyScalar(0.5);
    this.splayDir = normal.clone().add(wobble).addScaledVector(back, 0.35).normalize();
    this.splayBend = back.clone().multiplyScalar(1.2).add(wobble.clone().multiplyScalar(0.4));
    this.dir = this.splayDir.clone().lerp(this.bundleDir, 0.6).normalize();
    this.bend = this.splayBend.clone().lerp(this.bundleBend, 0.6);
    this.offset = rng() * Math.PI * 2; // phase relative to the bundle's
    this.drift = (rng() - 0.5) * 3; // how fast it slips out of step when splayed (rad/s)
    this.phase = this.offset;
    // The inspect anchor: a point on the drawn filament 1.3 µm out, where it is clearly visible.
    this.tipT = Math.min(1.3 / length, 0.5);
    this.tip = new THREE.Object3D();
    this.pivot.add(this.tip);
  }

  update(dt, bundle, commonPhase, worldQuat, shape, shift, scale = 1) {
    const k = 1 - Math.exp(-dt * 5);
    _v.lerpVectors(this.splayDir, this.bundleDir, bundle).normalize();
    this.dir.lerp(_v, k).normalize();
    _w.lerpVectors(this.splayBend, this.bundleBend, bundle);
    this.bend.lerp(_w, k);
    flowPoint(shape, _p.copy(this.root).add(shift), this.pivot.position);
    this.pivot.quaternion.setFromUnitVectors(Z, this.dir);
    this.offset = this.offset * Math.exp(-dt * 2.5 * bundle * bundle) + this.drift * dt * (1 - bundle);
    this.phase = commonPhase + this.offset;
    this.filament.rotation.z = this.phase;
    const u = this.material.uniforms;
    u.uBend.value.copy(this.bend).applyQuaternion(worldQuat);
    u.uBendRange.value.lerpVectors(this.splayRange, this.bundleRange, bundle);
    // Keep the anchor on the filament as drawn: the helix turned by its phase, plus the bend the
    // vertex shader adds (given in world space, so brought back into the pivot's frame).
    this.curve.getPoint(this.tipT, _v);
    const c = Math.cos(this.phase), s = Math.sin(this.phase);
    this.tip.position.set(_v.x * c - _v.y * s, _v.x * s + _v.y * c, _v.z);
    const b = THREE.MathUtils.smoothstep(_v.z, u.uBendRange.value.x, u.uBendRange.value.y);
    _w.copy(this.bend).applyQuaternion(_q.copy(this.pivot.quaternion).invert());
    this.tip.position.addScaledVector(_w, b / scale);
  }
}

// ------------------------------------------------------------------------------------- the cell
// Hero sites (reference body space) beyond the spec's list, for the energy route:
//   glycolysisEnzymes[9]: { pos, radius, lobes, name }, G6P end first, starting just under the
//     first PTS patch (sites.pts[0..3]); sites.glycolysis is their centre.
//   tca: { center, radius, axis, activity, enzymes[7] {pos, radius, lobes, name} in cycle order
//     from fumarase to succinyl-CoA synthetase, gap }: `gap` is where the loop runs past
//     sites.sdh[0] in the membrane (succinate -> fumarate happens there).
//   The complexes sit in membrane patches (this.patches: { centre, members, radius }); the
//   volume's `rafts` are the same patches, which CellPass draws as thicker inner membrane.
//
// Envelope state CellPass reads (see its descriptor notes): `wall` (0..1; rods default to walled,
// the hero to none), `pinch` (division), `ghost` (dying, 0..1). A walled cell is held still by its
// wall, so its flow is calmer (setWall keeps the two together). `H` > 0.5 makes a longer rod (a rod
// about to divide: H = 1.5 is two standard rods end to end). `wobbleBoost` multiplies the skin's
// ripple (the opening's tremble).
export class Bacterium {
  constructor({ hero = false, seed = 1, flagella = hero ? 6 : 4, scale = 1, tint, H = 0.5, wall } = {}) {
    const rng = mulberry32(seed);
    this.hero = hero;
    this.kind = hero ? CELL_KIND.hero : CELL_KIND.rod;
    this.R = 0.5;
    this.H = H;
    this.R_INNER = R_INNER;
    this.tint = new THREE.Color(tint ?? (hero ? ORGANELLE.jelly : 0xe4f0f8));
    this.group = new THREE.Group();
    this.group.scale.setScalar(scale);
    this.body = new THREE.Group();
    this.group.add(this.body);
    this.flowAmp = hero ? 0.085 : 0.07;
    this.wobbleBoost = 1;
    this.shape = createCellShape({ amp: this.flowAmp, speed: 0.55, seed: rng() * 10, wobble: 0.006 });
    this.setWall(wall ?? (hero ? 0 : 1));
    this.anchors = [];
    this.anchorRefs = [];
    this.sites = { pts: [], complexI: [], sdh: [], bo3: [], bd: [], atpSynthase: [], motors: [], ribosomes: [], receptors: null, granules: [] };
    this.volume = null;
    this.prevQuat = null;
    this.turnTarget = new THREE.Vector2();
    this.dentsWereActive = false;
    this.flagPhase = 0;

    // The hero's energy side is laid out first (glucose uptake, the TCA loop at an SDH patch) so
    // the motors keep clear of it.
    const taken = [];
    const energy = hero ? this.energySide() : null;
    if (energy) taken.push(energy.uptake.pos, energy.tca.pos);
    const motorPlaces = scatterOnMembrane(rng, flagella, taken, { minDist: 0.3, zMin: -0.75, zMax: 0.45 });
    // A long rod: its motors spread along the longer body.
    if (H !== 0.5) for (const pl of motorPlaces) pl.pos.z += Math.sign(pl.pos.z || 1) * (H - 0.5) * Math.min(Math.abs(pl.pos.z) / 0.5, 1);
    this.motors = new Complexes(this, motorPlaces, {
      geo: geo('motorStator'),
      color: 0x2f9e86,
      rotorGeo: geo('motorRotor'),
      rotorColor: ORGANELLE.motor,
      depth: 0.05,
      glow: 0.12,
      restMix: 0.86,
    });
    this.flagella = motorPlaces.map((pl) => {
      const motor = new THREE.Object3D();
      this.body.add(motor);
      this.track(motor, pl.pos.clone());
      return new Flagellum({
        root: pl.pos.clone().addScaledVector(pl.normal, MOTOR_REACH),
        normal: pl.normal,
        length: 4.4 + rng() * 1.6,
        rng,
        parent: this.body,
        motor,
      });
    });
    this.motors.extraSpin = (i) => this.flagella[i].phase;
    this.complexes = [this.motors];

    if (hero) this.buildHero(rng, taken, energy);
  }

  // Where glucose comes in and where the TCA loop meets the membrane: one side of the cell (the
  // side the inspect view looks at), uptake toward the front, the TCA further back.
  energySide() {
    const side = Math.atan2(-0.75, -0.6);
    const at = (phi, z) => onCapsule(v3(Math.cos(phi), Math.sin(phi), z), R_INNER);
    return { uptake: at(side, 0.36), tca: at(side + 0.3, -0.36) };
  }

  // The hero's insides: the volume's structures, membrane patches, polysomes, a few free proteins.
  buildHero(rng, taken, energy) {
    // Membrane patches: two of glucose transporters, six of respiratory chain and ATP synthase. The
    // first SDH sits where the TCA loop runs past the membrane, so succinate -> fumarate happens at
    // that complex.
    const recipes = [
      ['complexI', 'bo3', 'atpSynthase', 'atpSynthase', 'bd'],
      ['complexI', 'bo3', 'atpSynthase', 'sdh'],
      ['complexI', 'bo3', 'atpSynthase', 'bd'],
      ['complexI', 'bo3', 'atpSynthase', 'sdh', 'bd'],
      ['complexI', 'bo3', 'atpSynthase'],
      ['pts', 'pts', 'pts', 'pts'],
    ];
    const centres = scatterOnMembrane(rng, recipes.length, taken, { minDist: 0.34, zMin: -0.85, zMax: 0.55 });
    const patches = [
      fillPatch(rng, energy.uptake, ['pts', 'pts', 'pts', 'pts']),
      fillPatch(rng, energy.tca, ['sdh', 'complexI', 'bo3', 'atpSynthase', 'atpSynthase']),
      ...centres.map((c, i) => fillPatch(rng, c, recipes[i])),
    ];
    this.patches = patches;
    const byKind = {};
    for (const p of patches) for (const m of p.members) (byKind[m.kind] ??= []).push(m);

    // The TCA loop: tilted out of the membrane's plane so it reads from outside, its shallowest
    // point (the gap where succinate dehydrogenase works) just under the SDH. Seven cytoplasmic
    // enzymes round the rest, in the order the intermediates meet them.
    const sdh0 = byKind.sdh[0];
    const n = sdh0.normal;
    const { along } = membraneFrame(n);
    const tilt = 0.6;
    const axis = n.clone().multiplyScalar(Math.cos(tilt)).addScaledVector(along, Math.sin(tilt)).normalize();
    const U = n.clone().addScaledVector(axis, -n.dot(axis)).normalize();
    const V = axis.clone().cross(U);
    const radius = 0.1;
    const tcaCentre = sdh0.pos.clone().addScaledVector(n, -0.05).addScaledVector(U, -radius);
    const tcaNames = ['fumarase', 'malate dehydrogenase', 'citrate synthase', 'aconitase', 'isocitrate dehydrogenase', 'α-ketoglutarate dehydrogenase', 'succinyl-CoA synthetase'];
    // radius (µm) and subunits drawn: fumarase tetramer, malate dehydrogenase dimer, citrate
    // synthase hexamer, aconitase (one chain, four domains), isocitrate dehydrogenase dimer, the
    // huge α-ketoglutarate dehydrogenase complex, succinyl-CoA synthetase α2β2
    const tcaSizes = [0.016, 0.013, 0.018, 0.016, 0.014, 0.024, 0.017];
    const tcaLobes = [4, 2, 4, 3, 2, 4, 4];
    const tcaEnzymes = tcaNames.map((name, k) => {
      const a = 0.55 + (k * (Math.PI * 2 - 1.1)) / (tcaNames.length - 1);
      const pos = tcaCentre.clone().addScaledVector(U, Math.cos(a) * radius).addScaledVector(V, Math.sin(a) * radius).addScaledVector(axis, (rng() - 0.5) * 0.012);
      return { pos, radius: tcaSizes[k], lobes: tcaLobes[k], name };
    });

    // Glycolysis: from just under the glucose transporters, nine enzymes run back along the
    // membrane on a gentle curl, glucose-6-phosphate's end first.
    const pa = energy.uptake;
    const fr = membraneFrame(pa.normal);
    const glyNames = ['phosphoglucose isomerase', 'phosphofructokinase', 'aldolase', 'triose phosphate isomerase', 'GAPDH', 'phosphoglycerate kinase', 'phosphoglycerate mutase', 'enolase', 'pyruvate kinase'];
    // radius and subunits: dimer, tetramer, dimer (class II aldolase), dimer, tetramer, one
    // two-domain chain, dimer, dimer, tetramer
    const glySizes = [0.015, 0.016, 0.014, 0.012, 0.017, 0.013, 0.012, 0.015, 0.018];
    const glyLobes = [2, 4, 2, 2, 4, 2, 2, 2, 4];
    const glycolysisEnzymes = glyNames.map((name, k) => ({
      pos: pa.pos.clone().addScaledVector(pa.normal, -(0.056 + 0.009 * k)).addScaledVector(fr.along, -0.037 * k).addScaledVector(fr.round, 0.028 * Math.sin(0.8 * k)),
      radius: glySizes[k],
      lobes: glyLobes[k],
      name,
    }));
    const glyCentre = glycolysisEnzymes.reduce((s, e) => s.add(e.pos), v3(0, 0, 0)).multiplyScalar(1 / glycolysisEnzymes.length);

    // The chemoreceptors: one patch a little off the front pole, ~0.28 µm across.
    const receptorDir = v3(0.22, 0.1, 1).normalize();

    this.volume = {
      nucleoid: v3(0, 0, -0.06),
      nucleoidScale: 1,
      plasmid: v3(0.17, 0.17, -0.5),
      plasmidRadius: 0.06,
      granules: [
        { pos: v3(-0.17, 0.15, 0.46), radius: 0.05, kind: 'glycogen' },
        { pos: v3(-0.2, 0.06, 0.1), radius: 0.038, kind: 'glycogen' },
        { pos: v3(0.22, 0.12, -0.2), radius: 0.04, kind: 'polyphosphate' },
      ],
      tca: { center: tcaCentre, radius, axis, activity: 0.35, enzymes: tcaEnzymes, gap: sdh0.pos.clone().addScaledVector(n, -0.05) },
      glycolysis: glyCentre,
      glycolysisEnzymes,
      glycolysisActivity: 0.35,
      receptorDir,
      receptorRadius: 0.14,
      receptorZ: 0.5 + R_INNER * Math.cos(Math.acos(receptorDir.z) + 0.14 / R_INNER), // the patch's lowest edge
      receptorGlow: 0.2,
      receptorFlash: 0,
      protonGlow: 0.5,
      rafts: patches.map((p) => ({ pos: p.centre.pos, normal: p.centre.normal, radius: p.radius })),
      vesicles: [],
    };
    const vol = this.volume;
    Object.assign(this.sites, {
      glycolysis: vol.glycolysis,
      glycolysisEnzymes,
      tca: vol.tca,
      nucleoid: vol.nucleoid,
      plasmid: vol.plasmid,
      granules: vol.granules,
      receptors: {
        pos: v3(0, 0, 0.5).addScaledVector(receptorDir, R_INNER - 0.03),
        normal: receptorDir.clone(),
        flash: (s = 1) => { vol.receptorFlash = Math.min(1.5, vol.receptorFlash + s); },
      },
    });

    const kinds = [
      ['pts', { geo: geo('pts'), color: ORGANELLE.pts, depth: 0.025 }],
      ['complexI', { geo: geo('complexI'), color: ORGANELLE.complexI, depth: 0.045 }],
      ['sdh', { geo: geo('sdh'), color: ORGANELLE.sdh, depth: 0.03 }],
      ['bo3', { geo: geo('bo3'), color: ORGANELLE.bo3, depth: 0.012 }],
      ['bd', { geo: geo('bd'), color: 0xa64b8c, depth: 0.012 }],
      // + spin is synthesis: clockwise seen from the periplasm (Noji et al. 1997 watched hydrolysis
      // turn it the other way), so it is drawn with the sign flipped.
      ['atpSynthase', { geo: geo('atpStator'), color: ORGANELLE.atpSynthase, rotorGeo: geo('atpRotor'), rotorColor: ORGANELLE.atpRotor, markGeo: geo('atpMark'), depth: 0.045, spinSign: -1 }],
    ];
    this.sites.motors = this.motors.sites;
    for (const [key, opts] of kinds) {
      const c = new Complexes(this, byKind[key] ?? [], opts);
      this.complexes.push(c);
      this.sites[key] = c.sites;
    }

    this.buildPolysomes(rng);
    this.buildMotes(rng);

    const at = (ref) => {
      const o = new THREE.Object3D();
      this.body.add(o);
      this.track(o, ref);
      return o;
    };
    const atp = this.sites.atpSynthase[0];
    const rib = this.sites.ribosomes[3] ?? { pos: v3(0, 0.26, 0.3) };
    this.anchor('envelope', 'Cell envelope', 'outer membrane · periplasm · inner membrane · no wall: it flows', at(v3(0, 0.5, 0.15)), { angle: -60, len: 80 });
    this.anchor('nucleoid', 'Nucleoid', 'circular chromosome · 4.6 million base pairs', at(v3(0, 0.08, -0.1)), { angle: 165, len: 130, interior: true });
    this.anchor('plasmid', 'Plasmid', 'small DNA ring · can be passed to other cells', at(vol.plasmid.clone()), { angle: 140, len: 90, interior: true });
    this.anchor('polysome', 'Polysome', 'ribosomes reading one mRNA · the cell’s biggest ATP sink', at(rib.pos.clone()), { angle: -20, len: 110, interior: true });
    this.anchor('receptors', 'Chemoreceptor array', 'tastes the water for sugar and oxygen', at(this.sites.receptors.pos.clone()), { angle: -125, len: 90 });
    this.anchor('glycogen', 'Glycogen granule', 'glucose stored for later', at(vol.granules[0].pos.clone()), { angle: -150, len: 80, interior: true });
    this.anchor('polyP', 'Polyphosphate granule', 'a store of phosphate and energy', at(vol.granules[2].pos.clone()), { angle: 30, len: 80, interior: true });
    this.anchor('atpSynthase', 'ATP synthase', '10 H+ turn the rotor once · 3 ATP', at(atp.inner.clone()), { angle: 20, len: 100, interior: true });
    this.anchor('glycolysis', 'Glycolysis', 'nine enzymes · glucose to 2 pyruvate (one PEP pays for the sugar’s uptake) · net +2 ATP, +2 NADH', at(glycolysisEnzymes[4].pos.clone()), { angle: 150, len: 90, interior: true });
    this.anchor('tca', 'TCA cycle', 'seven enzymes here, the eighth (SDH) in the membrane · 2 NADH + 1 NADPH (counted as NADH), 1 QH2, 1 ATP per turn', at(tcaCentre.clone()), { angle: -160, len: 90, interior: true });
    const f = this.flagella[0];
    if (f) {
      this.anchor('motor', 'Flagellar motor', this.hero ? 'runs on the proton gradient · with no wall to brace on, a real one could barely grip (Codon staging)' : 'runs on the proton gradient · ~100 rev/s', f.motor, { angle: -150, len: 70 });
      this.anchor('flagellum', 'Flagellum', 'flagellin helix · 20 nm thick', f.tip, { angle: -35, len: 60 });
    }
  }

  // Polysomes: several ribosomes reading one mRNA, at the edge of the nucleoid (in bacteria,
  // translation starts while the gene is still being transcribed).
  buildPolysomes(rng) {
    const vol = this.volume;
    const avoid = [
      ...vol.granules.map((g) => ({ p: g.pos, r: g.radius + 0.04 })),
      ...vol.tca.enzymes.map((e) => ({ p: e.pos, r: e.radius + 0.045 })),
      { p: vol.plasmid, r: 0.11 },
      ...vol.glycolysisEnzymes.map((e) => ({ p: e.pos, r: e.radius + 0.04 })),
    ];
    const ok = (p) => avoid.every((a) => a.p.distanceTo(p) > a.r) && Math.hypot(p.x, p.y) < 0.32 && Math.abs(p.z) < 0.62;
    const strands = [];
    const ribs = [];
    for (let k = 0; ribs.length < 28 && k < 12; k++) {
      let pts;
      for (let attempt = 0; attempt < 60; attempt++) {
        const phi = (k / 4) * Math.PI * 2 + rng() * 1.2 + attempt * 0.37;
        const p = v3(Math.cos(phi) * 0.28, Math.sin(phi) * 0.28, (rng() - 0.5) * 0.8);
        let dphi = (rng() < 0.5 ? -1 : 1) * 0.14;
        let dz = (rng() - 0.5) * 0.06;
        pts = [];
        for (let i = 0; i < 7 && ok(p); i++) {
          pts.push(p.clone());
          const a = Math.atan2(p.y, p.x) + dphi;
          const r = THREE.MathUtils.clamp(Math.hypot(p.x, p.y) + (rng() - 0.5) * 0.03, 0.26, 0.31);
          p.set(Math.cos(a) * r, Math.sin(a) * r, p.z + dz);
          dphi += (rng() - 0.5) * 0.05;
          dz += (rng() - 0.5) * 0.03;
        }
        if (pts.length === 7) break;
      }
      if (!pts || pts.length < 4) continue;
      ribs.push(...pts);
      // The mRNA runs a little past the first and last ribosome.
      const head = pts[0].clone().multiplyScalar(2).sub(pts[1]);
      const tail = pts[pts.length - 1].clone().multiplyScalar(2).sub(pts[pts.length - 2]);
      strands.push(taperedTube(new THREE.CatmullRomCurve3([head, ...pts, tail]), 90, 0.0042, 5));
    }
    const merged = strands.length ? mergeGeometries(strands) : new THREE.BufferGeometry();
    const mrna = new THREE.Mesh(merged, cellMaterial({ color: ORGANELLE.mrna, glow: 0.2, shape: this.shape, translucency: 0.4 }));
    mrna.frustumCulled = false;
    this.body.add(mrna);

    const mesh = new THREE.InstancedMesh(geo('ribosome'), cellMaterial({ glow: 0.14, jitter: 0.0025, shape: this.shape, translucency: 0.45 }), ribs.length);
    mesh.frustumCulled = false;
    const base = new THREE.Color(ORGANELLE.ribosome);
    const rest = base.clone().lerp(new THREE.Color(0xeaf4f0), 0.35);
    ribs.forEach((p, i) => {
      _q.setFromEuler(new THREE.Euler(rng() * 6, rng() * 6, rng() * 6));
      mesh.setMatrixAt(i, _m.compose(p, _q, _s.setScalar(0.9 + rng() * 0.2)));
      mesh.setColorAt(i, rest);
    });
    _s.setScalar(1);
    this.body.add(mesh);
    this.ribosomeMesh = mesh;
    this.ribosomeBase = base;
    this.ribosomeRest = rest;
    this.sites.ribosomes = ribs.map((p) => {
      const site = { pos: p.clone(), glow: 0, flash: (s = 1) => { site.glow = Math.min(2, site.glow + s); } };
      return site;
    });
  }

  // A light sprinkle of free cytosolic proteins.
  buildMotes(rng) {
    const n = 24;
    const mesh = new THREE.InstancedMesh(lump(rng, 1), cellMaterial({ glow: 0.1, jitter: 0.004, shape: this.shape, translucency: 0.4 }), n);
    mesh.frustumCulled = false;
    const nuc = this.volume.nucleoid;
    const tints = [ORGANELLE.cytosol, 0x8b7ff0, 0x5fb3d9];
    for (let i = 0; i < n; i++) {
      do {
        _p.set((rng() * 2 - 1) * 0.34, (rng() * 2 - 1) * 0.34, (rng() * 2 - 1) * 0.84);
      } while (Math.hypot(_p.x, _p.y, Math.max(Math.abs(_p.z) - 0.5, 0)) > 0.33 || ((_p.x - nuc.x) ** 2 + (_p.y - nuc.y) ** 2) / 0.05 + ((_p.z - nuc.z) / 0.45) ** 2 < 1);
      _q.setFromEuler(new THREE.Euler(rng() * 6, rng() * 6, rng() * 6));
      _v.set(1, 0.75 + rng() * 0.4, 0.75 + rng() * 0.4).multiplyScalar(0.0065 + rng() * 0.0045);
      mesh.setMatrixAt(i, _m.compose(_p, _q, _v));
      mesh.setColorAt(i, _c.setHex(tints[i % 3]).lerp(MEMBRANE_REST, 0.35));
    }
    this.body.add(mesh);
  }

  // Keep an Object3D on the reference point `ref` as the cell flows.
  track(obj, ref) {
    this.anchorRefs.push({ obj, ref });
    flowPoint(this.shape, ref, obj.position);
  }

  // angle: direction of the tag from its point on screen in degrees (0 = right, -90 = up); len in
  // pixels. interior: inside the cell (fades when seen through a lot of it).
  anchor(key, title, sub, obj, { angle = -40, len = 70, interior = false } = {}) {
    this.anchors.push({ key, title, sub, obj, angle, len, interior });
  }

  setDent(i, opts) {
    setDent(this.shape, i, opts);
  }

  // A wall holds the cell's shape: walled, the slow flow is a quarter of a soft cell's.
  setWall(w) {
    this.wall = w;
    this.shape.uFlowAmp.value = this.flowAmp * (1 - 0.75 * w);
  }

  get visible() {
    return this.group.visible;
  }

  // thrust 0..1 (how hard the motors drive), bundle 0..1 (bundled vs splayed), omega (filament
  // spin, rad/s; + is a run: counterclockwise seen from behind the cell). The cell's flow follows
  // its motion: it stretches into a teardrop while it swims and bends into turns.
  update(dt, { thrust = 0, bundle = 0.6, omega = 20 } = {}) {
    const sh = this.shape;
    sh.uThrust.value += (thrust - sh.uThrust.value) * (1 - Math.exp(-dt / 0.25));
    sh.uWobble.value = (0.006 + 0.004 * sh.uThrust.value) * this.wobbleBoost;
    this.followTurn(dt);
    syncShape(sh, this.body);

    const dentsActive = sh.uDentN.value.some((n) => n.w > 0);
    const dentsMoved = dentsActive || this.dentsWereActive;
    this.dentsWereActive = dentsActive;

    this.group.getWorldQuaternion(_wq);
    this.flagPhase += omega * dt;
    const scale = this.group.scale.x;
    for (const f of this.flagella) f.update(dt, bundle, this.flagPhase, _wq, sh, dentShift(sh, f.root, _shift), scale);
    for (const c of this.complexes) c.update(dt, dentsMoved);
    for (const { obj, ref } of this.anchorRefs) flowPoint(sh, ref, obj.position);
    if (this.hero) this.updateHero(dt);
  }

  // Bend into turns: the body's angular velocity (in its own frame) curves it toward the turn.
  followTurn(dt) {
    this.body.getWorldQuaternion(_q);
    if (this.prevQuat && dt > 0) {
      _q2.copy(this.prevQuat).invert().multiply(_q);
      const w = Math.min(1, Math.abs(_q2.w));
      const angle = 2 * Math.acos(w);
      const s = Math.sqrt(Math.max(1 - w * w, 1e-12));
      const sign = _q2.w < 0 ? -1 : 1;
      const wx = angle > 1e-6 ? ((_q2.x / s) * angle * sign) / dt : 0;
      const wy = angle > 1e-6 ? ((_q2.y / s) * angle * sign) / dt : 0;
      this.turnTarget.set(THREE.MathUtils.clamp(0.14 * wy, -0.45, 0.45), THREE.MathUtils.clamp(-0.14 * wx, -0.45, 0.45));
    } else this.prevQuat = new THREE.Quaternion();
    this.prevQuat.copy(_q);
    this.shape.uTurn.value.lerp(this.turnTarget, 1 - Math.exp(-dt / 0.3));
  }

  updateHero(dt) {
    const fade = Math.exp(-dt / 0.45);
    const vol = this.volume;
    vol.receptorFlash *= Math.exp(-dt / 0.6);
    let changed = false;
    const ribs = this.sites.ribosomes;
    for (let i = 0; i < ribs.length; i++) {
      const s = ribs[i];
      if (s.glow < 1e-3 && !s.lit) continue;
      s.glow = s.glow > 1e-3 ? s.glow * fade : 0;
      s.lit = s.glow > 0;
      this.ribosomeMesh.setColorAt(i, lit(this.ribosomeRest, this.ribosomeBase, s.glow));
      changed = true;
    }
    if (changed) this.ribosomeMesh.instanceColor.needsUpdate = true;
  }
}

// ------------------------------------------------------------------------------------- husk
// A shed wall: the empty peptidoglycan sacculus a cell has squeezed out of, a CellPass descriptor
// with nothing inside. It starts exactly where `of` is (same world transform, just outside its outer
// membrane). Add `group` to the scene and the husk itself to CellPass; `wall` is how present it is
// (0..1), `split` how far open its slit is (along its +y side). Call update() each frame.
// Codon staging: in E. coli the wall lies under the outer membrane, in the periplasm, so a real cell
// could not leave its sacculus behind outside itself and keep that membrane. Wall-deficient cells
// filmed escaping a split wall are Bacillus subtilis, which has no outer membrane. A real E. coli
// L-form loses its wall in place.
export function createHusk(of, { tint = 0xf1f1e6, seed = 7 } = {}) {
  const group = new THREE.Group();
  of.body.updateWorldMatrix(true, false);
  of.body.matrixWorld.decompose(group.position, group.quaternion, group.scale);
  const body = new THREE.Group();
  group.add(body);
  const shape = createCellShape({ amp: 0.012, speed: 0.3, seed, wobble: 0 });
  return {
    group,
    body,
    shape,
    kind: CELL_KIND.rod,
    R: of.R + 0.025,
    H: of.H,
    tint: new THREE.Color(tint),
    volume: null,
    husk: true,
    wall: 0,
    split: 0,
    get visible() {
      return group.visible;
    },
    update() {
      syncShape(shape, body);
    },
  };
}

// ------------------------------------------------------------------------------------- cocci
// A cluster of round, non-motile cells (they only drift). Tetrad cocci (Micrococcus-like) are
// Gram-positive: CellPass draws one membrane under a thick satin wall, which also tells them
// apart from the rods at a glance. The spheres touch but never overlap. Each sphere is its own
// CellPass descriptor; register every entry of `cells`.
export class Coccus {
  constructor({ seed = 3, count = 4, scale = 1, tint = 0xfff0d8 } = {}) {
    const rng = mulberry32(seed);
    this.group = new THREE.Group();
    this.group.scale.setScalar(scale);
    this.cells = [];
    const centres = [v3(0, 0, 0)];
    for (let tries = 0; centres.length < count && tries < 400; tries++) {
      const from = centres[(rng() * centres.length) | 0];
      const p = from.clone().add(v3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize().multiplyScalar(0.88));
      if (centres.every((c) => c.distanceTo(p) >= 0.86)) centres.push(p);
    }
    const mid = centres.reduce((a, c) => a.add(c), v3(0, 0, 0)).multiplyScalar(1 / centres.length);
    for (const c of centres) {
      const body = new THREE.Group();
      body.position.copy(c).sub(mid);
      body.quaternion.setFromEuler(new THREE.Euler(rng() * 6, rng() * 6, rng() * 6));
      this.group.add(body);
      const group = this.group;
      this.cells.push({
        body,
        shape: createCellShape({ amp: 0.03, speed: 0.35, seed: rng() * 10, wobble: 0.004 }),
        kind: CELL_KIND.coccus,
        R: 0.42,
        H: 0,
        tint: new THREE.Color(tint).offsetHSL((rng() - 0.5) * 0.03, 0, 0),
        volume: null,
        get visible() {
          return group.visible;
        },
      });
    }
  }

  update() {
    for (const c of this.cells) syncShape(c.shape, c.body);
  }
}
