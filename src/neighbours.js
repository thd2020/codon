import * as THREE from 'three';
import { Bacterium, Coccus } from './bacterium.js';

// Other microbes sharing the drop. Rods run and tumble on their own; cocci can't swim and only drift.
// Every one is drawn by the same CellPass as the hero, so they share its light and medium.
// Anything that falls too far behind is moved back into the water ahead of you.

const TINTS = [0xeaf4ff, 0xf3ecff, 0xeefbe8, 0xfff4ea];

const away = new THREE.Vector3();
const fwd = new THREE.Vector3();
const spin = new THREE.Quaternion();

export class Neighbours {
  constructor(scene, hero, camera, cellPass, { rods = 4, cocci = 2 } = {}) {
    this.hero = hero;
    this.camera = camera;
    this.rods = [];
    this.cocci = [];
    for (let i = 0; i < rods; i++) {
      const b = new Bacterium({ seed: 100 + i, tint: TINTS[i % TINTS.length], scale: 0.85 + (i % 3) * 0.15 });
      b.state = { run: Math.random() * 3, tumble: 0, axis: new THREE.Vector3(), thrust: 0, bundle: 1 };
      this.place(b.group, 7, 22);
      b.group.quaternion.random();
      scene.add(b.group);
      cellPass.add(b);
      this.rods.push(b);
    }
    for (let i = 0; i < cocci; i++) {
      const c = new Coccus({ seed: 200 + i, count: 2 });
      this.place(c.group, 8, 22);
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

  update(dt) {
    for (const b of this.rods) {
      const s = b.state;
      if (s.tumble > 0) {
        s.tumble -= dt;
        b.group.quaternion.premultiply(spin.setFromAxisAngle(s.axis, 4 * dt));
        s.thrust += (0 - s.thrust) * (1 - Math.exp(-dt / 0.1));
        s.bundle += (0 - s.bundle) * (1 - Math.exp(-dt / 0.15));
        if (s.tumble <= 0) s.run = 1 + Math.random() * 3;
      } else {
        s.run -= dt;
        s.thrust += (1 - s.thrust) * (1 - Math.exp(-dt / 0.12));
        s.bundle += (1 - s.bundle) * (1 - Math.exp(-dt / 0.2));
        if (s.run <= 0) {
          s.tumble = 0.4 + Math.random() * 0.4;
          s.axis.randomDirection();
        }
      }
      fwd.set(0, 0, 1).applyQuaternion(b.group.quaternion);
      b.group.position.addScaledVector(fwd, s.thrust * 4.5 * dt);
      // Keep a little personal space around the hero and the camera.
      for (const other of [this.hero.group.position, this.camera.position]) {
        away.copy(b.group.position).sub(other);
        const d = away.length();
        if (d < 4) b.group.position.addScaledVector(away.normalize(), (4 - d) * 1.5 * dt);
      }
      b.update(dt, { thrust: s.thrust, bundle: s.bundle, omega: 8 + s.thrust * 22 });
      if (b.group.position.distanceTo(this.hero.group.position) > 30) this.place(b.group, 14, 24);
    }
    for (const c of this.cocci) {
      c.group.rotation.x += c.spin.x * dt;
      c.group.rotation.y += c.spin.y * dt;
      c.group.position.y -= 0.03 * dt;
      c.update(dt);
      if (c.group.position.distanceTo(this.hero.group.position) > 30) this.place(c.group, 14, 24);
    }
  }
}
