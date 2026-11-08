import * as THREE from 'three';
import { Bacterium, Coccus } from './bacterium.js';

// Other microbes sharing the drop. Rods run and tumble on their own; cocci can't swim and only drift.
// Every one is drawn by the same CellPass as the hero, so they share its light and medium. The rods
// are ordinary walled E. coli (CellPass draws them walled by default); only the hero is soft.
// Anything that falls too far behind is moved back into the water ahead of you.
//
// For the opening: `held` stops update() from moving anyone (the intro drives the cells it needs),
// spawnAt() and despawn() add and remove extra rods, hide() takes the ordinary neighbours out of
// the water for a while, and scatter() puts them back somewhere out of view. adopt() takes over a
// thing the opening leaves in the world (the shed wall): update() keeps it ticking and removes it
// once the hero has left it far behind.

const TINTS = [0xeaf4ff, 0xf3ecff, 0xeefbe8, 0xfff4ea];

const away = new THREE.Vector3();
const fwd = new THREE.Vector3();
const spin = new THREE.Quaternion();
const _p = new THREE.Vector3();
const _frustum = new THREE.Frustum();
const _pv = new THREE.Matrix4();
const _sphere = new THREE.Sphere();

// One rod's run and tumble: runs of 1-4 s in a straight line, tumbles of 0.4-0.8 s that turn it to
// a new heading. pace scales how hard it swims (0 stops it). Returns the drive for Bacterium.update.
export function runTumble(b, dt, pace = 1) {
  const s = (b.state ??= { run: Math.random() * 3, tumble: 0, axis: new THREE.Vector3(), thrust: 0, bundle: 1 });
  if (s.tumble > 0) {
    s.tumble -= dt;
    b.group.quaternion.premultiply(spin.setFromAxisAngle(s.axis, 4 * pace * dt));
    s.thrust += (0 - s.thrust) * (1 - Math.exp(-dt / 0.1));
    s.bundle += (0 - s.bundle) * (1 - Math.exp(-dt / 0.15));
    if (s.tumble <= 0) s.run = 1 + Math.random() * 3;
  } else {
    s.run -= dt;
    s.thrust += (pace - s.thrust) * (1 - Math.exp(-dt / 0.12));
    s.bundle += (Math.min(pace * 2, 1) - s.bundle) * (1 - Math.exp(-dt / 0.2));
    if (s.run <= 0) {
      s.tumble = 0.4 + Math.random() * 0.4;
      s.axis.randomDirection();
    }
  }
  fwd.set(0, 0, 1).applyQuaternion(b.group.quaternion);
  b.group.position.addScaledVector(fwd, s.thrust * 4.5 * dt);
  return { thrust: s.thrust, bundle: s.bundle, omega: (8 + s.thrust * 22) * Math.min(pace * 3, 1) };
}

export class Neighbours {
  constructor(scene, hero, camera, cellPass, { rods = 4, cocci = 2 } = {}) {
    this.scene = scene;
    this.hero = hero;
    this.camera = camera;
    this.cellPass = cellPass;
    this.rods = [];
    this.cocci = [];
    this.extra = []; // rods added with spawnAt()
    this.adopted = []; // things left in the world by the opening (adopt())
    this.held = false;
    for (let i = 0; i < rods; i++) {
      const b = new Bacterium({ seed: 100 + i, tint: TINTS[i % TINTS.length], scale: 0.85 + (i % 3) * 0.15 });
      b.state = { run: Math.random() * 3, tumble: 0, axis: new THREE.Vector3(), thrust: 0, bundle: 1 };
      this.place(b.group, 7, 22);
      b.group.quaternion.random();
      scene.add(b.group);
      cellPass.add(b);
      this.rods.push(b);
    }
    // Cocci can't swim, so one that started in the first view (the camera looking at the hero) would
    // stay parked there, over the title or the cell: they start outside it.
    _p.copy(hero.group.position).sub(camera.position).normalize();
    for (let i = 0; i < cocci; i++) {
      const c = new Coccus({ seed: 200 + i, count: 2 });
      for (let k = 0; k < 40; k++) {
        this.place(c.group, 8, 22);
        if (away.copy(c.group.position).sub(camera.position).normalize().dot(_p) < Math.cos(0.9)) break;
      }
      c.spin = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(0.2);
      scene.add(c.group);
      for (const d of c.cells) cellPass.add(d);
      this.cocci.push(c);
    }
  }

  place(obj, min, max) {
    const d = new THREE.Vector3().randomDirection();
    d.y *= 0.5;
    obj.position.copy(this.hero.group.position).addScaledVector(d.normalize(), min + Math.random() * (max - min));
  }

  // A rod at a given transform ({ position, quaternion }, e.g. an Object3D), registered with the
  // scene and CellPass but not moved by update(): its owner drives it. Options as Bacterium's
  // (H, tint, scale, seed, wall, flagella).
  spawnAt(transform, opts = {}) {
    const b = new Bacterium({ seed: 300 + this.extra.length, tint: TINTS[this.extra.length % TINTS.length], ...opts });
    if (transform?.position) b.group.position.copy(transform.position);
    if (transform?.quaternion) b.group.quaternion.copy(transform.quaternion);
    this.scene.add(b.group);
    this.cellPass.add(b);
    this.extra.push(b);
    return b;
  }

  // Removes a rod added with spawnAt() from the scene and CellPass.
  despawn(b) {
    this.scene.remove(b.group);
    this.cellPass.remove(b);
    this.extra = this.extra.filter((x) => x !== b);
    b.group.traverse((o) => {
      if (o.isMesh) o.material.dispose?.();
    });
    for (const f of b.flagella) f.filament.geometry.dispose();
  }

  // Keeps a CellPass descriptor the opening leaves behind (the husk: { group, update(dt) }) ticking
  // until the hero is more than removeBeyond µm from it; then it is taken out of the scene and
  // CellPass for good.
  adopt(cell, { removeBeyond = 60 } = {}) {
    if (!cell || this.adopted.some((a) => a.cell === cell)) return;
    this.adopted.push({ cell, removeBeyond });
  }

  // Takes the ordinary neighbours out of the water (hidden, not drawn) or brings them back.
  hide(hidden = true) {
    for (const b of this.rods) b.group.visible = !hidden;
    for (const c of this.cocci) c.group.visible = !hidden;
  }

  // Puts every ordinary neighbour back into the water 14-24 µm from the hero, outside the camera's
  // view, swimming afresh: so they arrive unseen.
  scatter() {
    const cam = this.camera;
    cam.updateMatrixWorld();
    _pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
    _frustum.setFromProjectionMatrix(_pv);
    const put = (obj, r) => {
      for (let k = 0; k < 40; k++) {
        this.place(obj, 14, 24);
        if (!_frustum.intersectsSphere(_sphere.set(obj.position, r))) return;
      }
      // Nowhere out of view (a very wide window): behind the camera, then.
      cam.getWorldDirection(_p);
      obj.position.copy(cam.position).addScaledVector(_p, -16);
    };
    for (const b of this.rods) {
      put(b.group, 3);
      b.group.quaternion.random();
      b.state = { run: Math.random() * 3, tumble: 0, axis: new THREE.Vector3(), thrust: 0, bundle: 1 };
      b.ghost = 0;
    }
    for (const c of this.cocci) put(c.group, 2);
  }

  update(dt) {
    if (this.held) return;
    for (let i = this.adopted.length - 1; i >= 0; i--) {
      const { cell, removeBeyond } = this.adopted[i];
      cell.update?.(dt);
      if (cell.group.position.distanceTo(this.hero.group.position) > removeBeyond) {
        this.scene.remove(cell.group);
        this.cellPass.remove(cell);
        this.adopted.splice(i, 1);
      }
    }
    for (const b of this.rods) {
      if (!b.group.visible) continue;
      const drive = runTumble(b, dt);
      // Keep a little personal space around the hero and the camera.
      for (const other of [this.hero.group.position, this.camera.position]) {
        away.copy(b.group.position).sub(other);
        const d = away.length();
        if (d < 4) b.group.position.addScaledVector(away.normalize(), (4 - d) * 1.5 * dt);
      }
      b.update(dt, drive);
      if (b.group.position.distanceTo(this.hero.group.position) > 30) this.place(b.group, 14, 24);
    }
    for (const c of this.cocci) {
      if (!c.group.visible) continue;
      c.group.rotation.x += c.spin.x * dt;
      c.group.rotation.y += c.spin.y * dt;
      c.group.position.y -= 0.03 * dt;
      c.update(dt);
      if (c.group.position.distanceTo(this.hero.group.position) > 30) this.place(c.group, 14, 24);
    }
  }
}
