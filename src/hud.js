import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { BRAND } from './palette.js';

// Every piece of interface lives in the water with the cell: a vitals ring around it,
// a scale bar, tags pinned to its parts, and the title floating where you start.

// A dot on the part, a hairline leader at `angle` degrees, and the name at the leader's end.
function tag(title, sub, angle = -40, len = 70) {
  const el = document.createElement('div');
  const left = Math.cos((angle * Math.PI) / 180) < 0;
  el.className = `tag ${left ? 'tag-l' : 'tag-r'}`;
  el.innerHTML = `<span class="dot"></span><span class="lead"></span><span class="txt"><b>${title}</b>${sub ? `<i>${sub}</i>` : ''}</span>`;
  const x = Math.cos((angle * Math.PI) / 180) * len, y = Math.sin((angle * Math.PI) / 180) * len;
  el.querySelector('.lead').style.cssText = `width:${len}px;transform:rotate(${angle}deg)`;
  const txt = el.querySelector('.txt');
  txt.style.top = `${y}px`;
  if (left) txt.style.right = `${-x + 6}px`;
  else txt.style.left = `${x + 6}px`;
  const obj = new CSS2DObject(el);
  obj.center.set(0.5, 0.5);
  return obj;
}

function readout(cls) {
  const el = document.createElement('div');
  el.className = `readout ${cls}`;
  const obj = new CSS2DObject(el);
  obj.center.set(0.5, 0.5);
  return obj;
}

function arcMaterial(color, from, span) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uFrom: { value: from }, uSpan: { value: span }, uValue: { value: 1 }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */ `varying vec2 vP; void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uFrom, uSpan, uValue, uOpacity; varying vec2 vP;
      void main() {
        float a = atan(vP.y, vP.x);
        float t = mod(a - uFrom + 6.2831853, 6.2831853) / uSpan;
        if (t > 1.0) discard;
        float on = step(t, uValue);
        gl_FragColor = vec4(uColor, mix(0.12, 0.7, on) * uOpacity);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
  });
}

export class Hud {
  constructor(scene, cell, iconUrl) {
    this.scene = scene;
    this.cell = cell;
    this.ring = new THREE.Group();
    scene.add(this.ring);

    const R = 1.9;
    const ringGeo = new THREE.RingGeometry(R - 0.008, R + 0.008, 160);
    this.atpArc = new THREE.Mesh(ringGeo, arcMaterial(BRAND.mintOnPlum, Math.PI * 0.62, Math.PI * 0.76));
    this.envArc = new THREE.Mesh(ringGeo, arcMaterial(BRAND.paper, Math.PI * 1.62, Math.PI * 0.76));
    const ticks = [];
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const r0 = R + 0.06, r1 = R + (i % 4 === 0 ? 0.16 : 0.1);
      ticks.push(Math.cos(a) * r0, Math.sin(a) * r0, 0, Math.cos(a) * r1, Math.sin(a) * r1, 0);
    }
    const tickGeo = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(ticks, 3));
    this.ticks = new THREE.LineSegments(tickGeo, new THREE.LineBasicMaterial({ color: BRAND.mintOnPlum, transparent: true, opacity: 0.22, depthWrite: false }));

    // Scale bar: exactly 1 µm long at the cell's depth.
    const bar = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([-0.5, 0, 0, 0.5, 0, 0, -0.5, -0.06, 0, -0.5, 0.06, 0, 0.5, -0.06, 0, 0.5, 0.06, 0], 3));
    this.bar = new THREE.LineSegments(bar, new THREE.LineBasicMaterial({ color: BRAND.paper, transparent: true, opacity: 0.7, depthWrite: false }));
    this.bar.position.set(0, -R - 0.55, 0);

    for (const o of [this.atpArc, this.envArc, this.ticks, this.bar]) {
      o.renderOrder = 10;
      o.material.fog = false;
      this.ring.add(o);
    }

    this.atpLabel = readout('left');
    this.atpLabel.position.set(-R - 0.5, 0.25, 0);
    this.envLabel = readout('right');
    this.envLabel.position.set(R + 0.5, 0.25, 0);
    this.barLabel = readout('scale');
    this.barLabel.position.set(0, -R - 0.85, 0);
    this.ring.add(this.atpLabel, this.envLabel, this.barLabel);

    // Inspect mode: tags on the cell's parts and readings of the water around it.
    this.partTags = cell.anchors.map((a) => {
      const t = tag(a.title, a.sub, a.angle, a.len);
      a.obj.add(t);
      return { ...a, t };
    });
    const env = [
      ['Glucose', '5.5 mM · food', -2.6, 1.5, 'l'],
      ['Oxygen', '0.21 mM · aerobic', 2.6, 1.4, 'r'],
      ['37.0 °C · pH 7.2', 'gut-like water', -2.7, -1.2, 'l'],
      ['Reynolds number ≈ 10⁻⁵', 'no coasting: stop the motors and you stop', 2.5, -1.3, 'r'],
    ];
    this.envTags = env.map(([title, sub, x, y, side]) => {
      const t = tag(title, sub, side === 'l' ? 180 : 0, 12);
      t.element.classList.add('tag-env');
      t.position.set(x, y, 0);
      this.ring.add(t);
      return t;
    });

    this.plaque = this.makePlaque(iconUrl);
    scene.add(this.plaque);

    this.vis = 1;
    this.inspectVis = 0;
    this.savedDistance = null;
  }

  makePlaque(iconUrl) {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 1024;
    const g = c.getContext('2d');
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const font = '"Avenir Next", "Futura", "Century Gothic", "Helvetica Neue", "DejaVu Sans", sans-serif';
    const draw = (img) => {
      g.clearRect(0, 0, c.width, c.height);
      if (img) {
        g.save();
        g.beginPath();
        g.roundRect(120, 210, 420, 420, 92);
        g.clip();
        g.drawImage(img, 120, 210, 420, 420);
        g.restore();
      }
      g.save();
      g.setTransform(1, 0, -Math.tan(THREE.MathUtils.degToRad(12)), 1, 0, 0);
      g.fillStyle = '#f2efe9';
      g.font = `600 300px ${font}`;
      g.fillText('codon', 720, 540);
      g.fillStyle = '#86dcc6';
      g.font = `500 76px ${font}`;
      g.fillText('Rewrite life.', 745, 660);
      g.restore();
      g.fillStyle = 'rgba(242,239,233,0.62)';
      g.font = `500 40px ${font}`;
      const hints = ['W A S D  swim toward where you look', 'SPACE / C  rise / sink     Q / E  roll', 'F  tumble     DRAG  look     WHEEL  zoom     TAB  inspect'];
      hints.forEach((h, i) => g.fillText(h, 124, 790 + i * 62));
      tex.needsUpdate = true;
    };
    draw(null);
    const img = new Image();
    img.onload = () => draw(img);
    img.src = iconUrl;

    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 4),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: true }),
    );
    m.renderOrder = 6;
    return m;
  }

  placePlaque(camera, target) {
    const toCam = camera.position.clone().sub(target).normalize();
    const side = new THREE.Vector3().crossVectors(toCam, new THREE.Vector3(0, 1, 0)).normalize();
    this.plaque.position.copy(target).addScaledVector(toCam, -9).addScaledVector(side, 4.6).add(new THREE.Vector3(0, 3.6, 0));
    this.plaque.lookAt(camera.position);
  }

  // Inspecting eases the camera in close; leaving eases it back to where it was.
  zoom(dt, camera, target, inspect) {
    const off = _w.copy(camera.position).sub(target);
    const d = off.length();
    let goal;
    if (inspect) {
      if (this.savedDistance === null) this.savedDistance = d;
      goal = 3.9;
    } else if (this.savedDistance !== null) {
      goal = this.savedDistance;
      if (Math.abs(d - goal) < 0.02) this.savedDistance = null;
    } else return;
    camera.position.copy(target).addScaledVector(off.normalize(), d + (goal - d) * (1 - Math.exp(-dt / 0.35)));
  }

  update(dt, camera, player) {
    const g = this.cell.group;
    this.ring.position.copy(g.position);
    this.ring.quaternion.copy(camera.quaternion);
    const k = THREE.MathUtils.clamp(camera.position.distanceTo(g.position) / 5.2, 0.75, 2.5);
    this.ring.scale.setScalar(k);
    this.bar.scale.set(1 / k, 1, 1);

    const moving = player.thrust > 0.15 || player.tumble > 0;
    const targetVis = moving ? 0.35 : 1;
    this.vis += (targetVis - this.vis) * (1 - Math.exp(-dt / 0.4));
    this.inspectVis += ((player.inspect ? 1 : 0) - this.inspectVis) * (1 - Math.exp(-dt / 0.25));

    this.atpArc.material.uniforms.uValue.value = player.atp;
    this.envArc.material.uniforms.uValue.value = player.envelope;
    for (const o of [this.atpArc, this.envArc]) o.material.uniforms.uOpacity.value = this.vis;
    this.ticks.material.opacity = 0.22 * this.vis;
    const near = THREE.MathUtils.smoothstep(camera.position.distanceTo(this.plaque.position), 3, 8);
    this.plaque.material.opacity = (1 - this.inspectVis) * near;
    this.plaque.visible = this.plaque.material.opacity > 0.01;
    this.bar.material.opacity = 0.7 * this.vis;

    this.atpLabel.element.innerHTML = `<b>ATP</b> ${(player.atp * 100).toFixed(0)}%`;
    this.envLabel.element.innerHTML = `<b>Envelope</b> ${(player.envelope * 100).toFixed(0)}%`;
    this.barLabel.element.innerHTML = `1 µm <span>·</span> ${player.speed.toFixed(1)} µm/s`;
    for (const l of [this.atpLabel, this.envLabel, this.barLabel]) l.element.style.opacity = this.vis.toFixed(3);

    // Tags on the far side of the cell fade out; interior ones show through the jelly.
    const center = g.position;
    _toCam.copy(camera.position).sub(center).normalize();
    for (const p of this.partTags) {
      let a = this.inspectVis;
      if (!p.interior) {
        p.obj.getWorldPosition(_w);
        a *= THREE.MathUtils.smoothstep(_w.sub(center).normalize().dot(_toCam), -0.15, 0.35);
      }
      p.t.element.style.opacity = a.toFixed(3);
      p.t.visible = a > 0.01;
    }
    for (const t of this.envTags) {
      t.element.style.opacity = this.inspectVis.toFixed(3);
      t.visible = this.inspectVis > 0.01;
    }
  }
}

const _toCam = new THREE.Vector3();
const _w = new THREE.Vector3();
