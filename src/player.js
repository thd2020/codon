import * as THREE from 'three';

// Swimming at a bacterium's scale: water is so viscous relative to the cell (Reynolds number
// around 0.00001) that there is no coasting. Speed follows motor thrust almost instantly, and
// the cell body counter-rotates against its spinning flagella.
// Run: bundled flagella push the cell forward. Tumble: flagella splay and the cell flips.
// The motors run on the proton motive force, so how hard the cell can push is set each frame by
// the metabolism (motorPower), not by ATP.

const Z = new THREE.Vector3(0, 0, 1);
const UP = new THREE.Vector3(0, 1, 0);
const AIM_LIFT = Math.tan(THREE.MathUtils.degToRad(14));
// How much higher still the camera rides while the cell's tail points back at the lens, as the angle
// the cell then sits below the middle of the view.
const CHASE_RISE = Math.tan(THREE.MathUtils.degToRad(7));

export class Player {
  constructor(cell, camera, controls) {
    this.cell = cell;
    this.camera = camera;
    this.controls = controls;
    this.keys = new Set();
    this.speed = 0;
    this.thrust = 0;
    this.bundle = 0.6;
    this.motorPower = 1; // 0..1, from the metabolism's proton motive force
    this.requested = 0; // thrust asked of the motors this frame, before motorPower
    this.maxSpeed = 7; // µm/s, a relaxed E. coli pace
    this.tumble = 0;
    this.tumbleAxis = new THREE.Vector3(1, 0, 0);
    this.spinRate = 0;
    this.idle = 0;
    this.rise = 0; // 0..1: how far the camera has risen over a cell whose tail points at it
    this.started = false;
    this.inspect = false;

    addEventListener('keydown', (e) => {
      if (e.code === 'Tab') {
        e.preventDefault();
        if (!e.repeat) this.inspect = !this.inspect;
        return;
      }
      if (e.code === 'KeyF' && !e.repeat) this.startTumble();
      this.keys.add(e.code);
      this.started = true;
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => this.keys.clear());
  }

  key(...codes) {
    return codes.some((c) => this.keys.has(c)) ? 1 : 0;
  }

  startTumble() {
    if (this.tumble > 0) return;
    this.tumble = 0.7;
    const fwd = Z.clone().applyQuaternion(this.cell.group.quaternion);
    this.tumbleAxis.randomDirection().cross(fwd).normalize();
    this.spinRate = (Math.PI * (0.8 + Math.random() * 0.6)) / 0.7;
  }

  update(dt) {
    const g = this.cell.group;
    const fwd = _a.copy(Z).applyQuaternion(g.quaternion);

    // Aim at a point a little above the cell, so the camera rides above and behind it
    // and the trailing flagella pass below the line of sight rather than through the lens.
    this.camera.getWorldDirection(_f);
    _r.crossVectors(_f, UP).normalize();
    _u.crossVectors(_r, _f).normalize();
    _f.addScaledVector(_u, AIM_LIFT).normalize();
    _m.set(0, 0, 0)
      .addScaledVector(_f, this.key('KeyW', 'ArrowUp') - this.key('KeyS', 'ArrowDown'))
      .addScaledVector(_r, this.key('KeyD', 'ArrowRight') - this.key('KeyA', 'ArrowLeft'))
      .addScaledVector(_u, this.key('Space') - this.key('KeyC', 'ShiftLeft', 'ShiftRight'));

    let thrustTarget = 0;
    let bundleTarget = 0.55;
    if (this.tumble > 0) {
      this.tumble -= dt;
      bundleTarget = 0;
      g.quaternion.premultiply(_q.setFromAxisAngle(this.tumbleAxis, this.spinRate * dt));
      thrustTarget = 0.05;
    } else if (_m.lengthSq() > 0) {
      _m.normalize();
      _q.setFromUnitVectors(fwd, _m);
      const angle = 2 * Math.acos(Math.min(1, Math.abs(_q.w)));
      const step = angle > 1e-4 ? Math.min(1, (2.4 * dt) / angle) : 1;
      g.quaternion.premultiply(_i.identity().slerp(_q, step));
      thrustTarget = THREE.MathUtils.smoothstep(fwd.dot(_m), -0.1, 0.85);
      bundleTarget = 1;
    }
    this.requested = thrustTarget;
    thrustTarget *= this.motorPower;

    this.thrust += (thrustTarget - this.thrust) * (1 - Math.exp(-dt / 0.12));
    this.bundle += (bundleTarget - this.bundle) * (1 - Math.exp(-dt / 0.18));
    this.speed = this.maxSpeed * this.thrust;
    g.position.addScaledVector(fwd, this.speed * dt);

    // Thermal jostling: tiny random drift and rotation all the time.
    g.position.x += (Math.random() - 0.5) * 0.06 * dt;
    g.position.y += (Math.random() - 0.5) * 0.06 * dt;
    g.quaternion.premultiply(_q.setFromAxisAngle(_v.randomDirection(), (Math.random() - 0.5) * 0.06 * dt));

    // Roll: the player's Q/E, plus the body's counter-rotation against the motors. On a run the
    // filaments turn counterclockwise seen from behind, so torque balance turns the body clockwise
    // (a positive angle about +Z).
    const roll = (this.key('KeyE') - this.key('KeyQ')) * 1.8 + this.thrust * 0.9;
    g.quaternion.multiply(_q.setFromAxisAngle(Z, roll * dt));
    g.quaternion.normalize();

    this.idle = this.thrust < 0.05 && this.tumble <= 0 ? this.idle + dt : 0;

    return {
      thrust: this.thrust,
      bundle: this.bundle,
      omega: 6 + this.thrust * 26 + (this.tumble > 0 ? -18 : 0),
    };
  }

  // Keep the orbit camera on the cell, trailing a little. While the cell's tail points back at the
  // lens (swimming away from the camera, or resting after), the camera also rides a little higher,
  // so the cell sits a little below the middle of the view and its trailing flagella fall away below
  // the line of sight instead of streaming at the lens. Camera and target move together, so the
  // view's direction, and with it the steering, stays as it was.
  follow(dt) {
    const target = this.controls.target;
    const g = this.cell.group;
    this.camera.getWorldDirection(_f);
    _r.crossVectors(_f, UP).normalize();
    _u.crossVectors(_r, _f).normalize();
    const away = THREE.MathUtils.smoothstep(_a.copy(Z).applyQuaternion(g.quaternion).dot(_f), 0.86, 0.96);
    this.rise += (away - this.rise) * (1 - Math.exp(-dt / 0.6));
    const lift = this.rise * CHASE_RISE * this.camera.position.distanceTo(target);
    _v.copy(g.position).addScaledVector(_u, lift).sub(target).multiplyScalar(1 - Math.exp(-dt / 0.15));
    target.add(_v);
    this.camera.position.add(_v);
  }
}

const _a = new THREE.Vector3();
const _f = new THREE.Vector3();
const _r = new THREE.Vector3();
const _u = new THREE.Vector3();
const _m = new THREE.Vector3();
const _v = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _i = new THREE.Quaternion();
