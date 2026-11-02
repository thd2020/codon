import * as THREE from 'three';
import { clock } from './materials.js';
import { WATER } from './palette.js';

// The inside of a water drop: light from the surface overhead, deep blue below,
// drifting particles that blur when out of focus, and slow shafts of light.

const domeVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vDir = wp.xyz - cameraPosition;
    gl_Position = projectionMatrix * viewMatrix * wp;
    gl_Position.z = gl_Position.w * 0.99999;
  }
`;

const domeFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDeep, uMid, uLight, uSun;
  varying vec3 vDir;

  float caustic(vec2 p, float t) {
    float c = 0.0;
    vec2 q = p;
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      q += vec2(sin(q.y * 1.3 + t * 0.5 + fi), cos(q.x * 1.5 - t * 0.4 + fi * 1.7));
      c += 1.0 / (1.0 + 18.0 * abs(sin(q.x) * sin(q.y)));
    }
    return c / 4.0;
  }

  void main() {
    vec3 d = normalize(vDir);
    float y = d.y;
    vec3 col = mix(uDeep, uMid, smoothstep(-0.75, 0.2, y));
    col = mix(col, uLight, smoothstep(0.05, 0.95, y) * 0.7);
    vec2 p = d.xz / max(y, 0.06) * 1.6;
    float c = caustic(p, uTime);
    col += uSun * pow(c, 2.6) * smoothstep(0.2, 0.85, y) * 0.55;
    col += uSun * pow(max(dot(d, normalize(vec3(0.25, 1.0, 0.15))), 0.0), 18.0) * 0.9;
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function domeMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: clock.uTime,
      uDeep: { value: new THREE.Color(WATER.deep) },
      uMid: { value: new THREE.Color(WATER.mid) },
      uLight: { value: new THREE.Color(WATER.light) },
      uSun: { value: new THREE.Color(WATER.sun) },
    },
    vertexShader: domeVertex,
    fragmentShader: domeFragment,
    side: THREE.BackSide,
    depthWrite: false,
  });
}

const particleVertex = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime, uBox, uFocus, uScale;
  uniform vec3 uCam;
  varying float vAlpha;
  varying float vBlur;
  void main() {
    vec3 p = position;
    p += vec3(sin(uTime * 0.31 + aSeed * 20.0), sin(uTime * 0.23 + aSeed * 31.0) - uTime * 0.02, cos(uTime * 0.27 + aSeed * 17.0)) * 0.35;
    p = mod(p - uCam + uBox * 0.5, uBox) - uBox * 0.5 + uCam;
    vec4 mv = viewMatrix * vec4(p, 1.0);
    float dist = max(-mv.z, 0.01);
    vBlur = clamp(abs(dist - uFocus) / dist * 1.4, 0.0, 1.0);
    float size = aSize * (1.0 + vBlur * 5.0);
    gl_PointSize = min(size * uScale / dist, 160.0);
    float edgeFade = 1.0 - smoothstep(uBox * 0.3, uBox * 0.5, length(p - uCam));
    vAlpha = (1.0 - vBlur * 0.8) * edgeFade * smoothstep(0.4, 1.6, dist);
    gl_Position = projectionMatrix * mv;
  }
`;

const particleFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vBlur;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float edge = mix(0.25, 0.08, vBlur);
    float a = 1.0 - smoothstep(1.0 - edge, 1.0, r);
    a *= mix(1.0 - r * 0.6, 0.55 + 0.45 * smoothstep(0.55, 0.95, r), vBlur);
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

function particles({ count, box, size, color, opacity, seed }) {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rnd() - 0.5) * box;
    pos[i * 3 + 1] = (rnd() - 0.5) * box;
    pos[i * 3 + 2] = (rnd() - 0.5) * box;
    sizes[i] = size[0] + Math.pow(rnd(), 3) * (size[1] - size[0]);
    seeds[i] = rnd();
  }
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
  const m = new THREE.ShaderMaterial({
    uniforms: {
      uTime: clock.uTime,
      uBox: { value: box },
      uFocus: { value: 6 },
      uScale: { value: 500 },
      uCam: { value: new THREE.Vector3() },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    },
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(g, m);
  pts.frustumCulled = false;
  pts.renderOrder = 5;
  return pts;
}

const shaftVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vFade;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vFade = smoothstep(3.0, 14.0, distance(wp.xyz, cameraPosition));
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const shaftFragment = /* glsl */ `
  uniform float uTime, uSeed, uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vFade;
  void main() {
    float x = vUv.x;
    float b = (sin(x * 17.0 + uSeed * 5.0 + uTime * 0.13) * 0.5 + 0.5) * (sin(x * 6.1 - uSeed * 3.0 + uTime * 0.08) * 0.5 + 0.5);
    b = pow(b, 2.5);
    float edge = smoothstep(0.0, 0.25, x) * smoothstep(1.0, 0.75, x);
    float vert = smoothstep(0.0, 0.45, vUv.y) * mix(0.35, 1.0, vUv.y);
    gl_FragColor = vec4(uColor, b * edge * vert * vFade * uOpacity);
    #include <colorspace_fragment>
  }
`;

export class Water {
  constructor(scene) {
    this.scene = scene;
    scene.fog = new THREE.FogExp2(WATER.fog, 0.038);

    this.dome = new THREE.Mesh(new THREE.SphereGeometry(400, 48, 32), domeMaterial());
    this.dome.renderOrder = -10;
    this.dome.frustumCulled = false;
    scene.add(this.dome);

    this.dust = particles({ count: 4200, box: 36, size: [0.018, 0.05], color: WATER.dust, opacity: 0.55, seed: 7 });
    this.flocs = particles({ count: 260, box: 44, size: [0.08, 0.26], color: 0x9fd2c8, opacity: 0.22, seed: 11 });
    scene.add(this.dust, this.flocs);

    this.shafts = [];
    this.shaftBox = 56;
    for (let i = 0; i < 9; i++) {
      const m = new THREE.ShaderMaterial({
        uniforms: { uTime: clock.uTime, uSeed: { value: i * 1.37 }, uOpacity: { value: 0.07 + (i % 3) * 0.025 }, uColor: { value: new THREE.Color(WATER.shaft) } },
        vertexShader: shaftVertex,
        fragmentShader: shaftFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5 + (i % 4) * 2.5, 90), m);
      mesh.rotation.order = 'YXZ';
      mesh.userData.base = new THREE.Vector3(((i * 0.618) % 1 - 0.5) * this.shaftBox, 10, (((i * 0.382 + 0.2) % 1) - 0.5) * this.shaftBox);
      mesh.userData.tilt = 0.12 + (i % 3) * 0.05;
      mesh.renderOrder = 4;
      mesh.frustumCulled = false;
      this.shafts.push(mesh);
      scene.add(mesh);
    }
  }

  // The water colour as an environment map, so the jelly reflects and tints by it.
  environment(renderer) {
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(new THREE.SphereGeometry(50, 48, 32), domeMaterial()));
    const pmrem = new THREE.PMREMGenerator(renderer);
    const tex = pmrem.fromScene(envScene, 0.02).texture;
    pmrem.dispose();
    return tex;
  }

  resize(height, fov) {
    const scale = height / (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2));
    this.dust.material.uniforms.uScale.value = scale;
    this.flocs.material.uniforms.uScale.value = scale;
  }

  update(camera, focus) {
    this.dome.position.copy(camera.position);
    for (const p of [this.dust, this.flocs]) {
      p.material.uniforms.uCam.value.copy(camera.position);
      p.material.uniforms.uFocus.value = focus;
    }
    const B = this.shaftBox;
    for (const s of this.shafts) {
      const b = s.userData.base;
      const wrap = (v, c) => ((((v - c + B / 2) % B) + B) % B) - B / 2 + c;
      s.position.set(wrap(b.x, camera.position.x), camera.position.y + b.y, wrap(b.z, camera.position.z));
      s.rotation.y = Math.atan2(camera.position.x - s.position.x, camera.position.z - s.position.z);
      s.rotation.z = s.userData.tilt;
    }
  }
}
