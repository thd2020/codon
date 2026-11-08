import * as THREE from 'three';
import { clock, mulberry32 } from './materials.js';
import { sceneColor } from './lens.js';

// The far crowd: the resident bacteria of a leaf (10^6-10^7 per cm²), too far away for CellPass,
// drawn as camera-facing impostors. Each is a tiny rod (or now and then a coccus) seen through
// water: a clear body a shade lighter than the water, densest in its middle and fading to nothing
// at its edge (never a rim, which would read as an outline), its sun side catching faint
// thin-film colours, a hint of gold where its nucleoid is. They swim lazy runs to and fro and turn
// slowly. With distance they thin away (aerial falloff: `aerial`, 1/µm), so a crowd seen from
// above sinks into the depth instead of greying toward the fog colour. An impostor only shows
// beyond `near` µm from the camera (closer than that, real cells take over).
//
// new Crowd({ clusters: [{ center, radius, count, flat? }], seed }) ; scene.add(crowd.mesh)
// crowd.opacity (0..1), crowd.aerial (1/µm), crowd.resize(heightPx, fovDeg), dispose().

const vertexShader = /* glsl */ `
  #include <common>
  #include <fog_pars_vertex>
  attribute vec3 aPos;
  attribute vec3 aAxis;
  attribute vec4 aSeed;     // size, film phase, swim phase, coccus (1) or rod (0)
  uniform float uTime, uPixelAngle, uAerial;
  uniform vec2 uNear;
  uniform vec3 uSunDir;
  varying vec2 vSun;        // the sun's direction across the impostor
  varying vec2 vLocal;      // µm across the impostor: x along its drawn axis, y across
  varying vec2 vShape;      // drawn core half-length, radius (µm)
  varying float vPx, vAlpha, vFilm, vCoccus;

  void main() {
    float size = aSeed.x;
    float coccus = aSeed.w;
    float R = (coccus > 0.5 ? 0.42 : 0.5) * size;
    float H = (coccus > 0.5 ? 0.0 : 0.5) * size;
    // a lazy run along its axis and back, and a slow turn
    float t = uTime * 0.21 + aSeed.z * 6.2831853;
    vec3 ax = normalize(aAxis + 0.35 * vec3(sin(t * 0.7 + aSeed.y * 9.0), cos(t * 0.53 + aSeed.z * 7.0), sin(t * 0.61 + 2.0)));
    vec3 p = aPos + ax * sin(t) * 4.0 * (1.0 - coccus);
    vec4 mv = viewMatrix * vec4(p, 1.0);
    float dist = max(-mv.z, 1e-3);
    vec3 axv = mat3(viewMatrix) * ax;
    float l = length(axv.xy);
    vec2 u = l > 1e-4 ? axv.xy / l : vec2(1.0, 0.0);
    vec2 w = vec2(-u.y, u.x);
    float Hp = H * l;             // the core as it projects
    float px = dist * uPixelAngle; // µm per pixel at its depth
    float pad = 1.5 * px;
    vec2 half_ = vec2(Hp + R + pad, R + pad);
    vec2 c = position.xy * 2.0 * half_;
    mv.xy += u * c.x + w * c.y;
    vLocal = c;
    vec2 sv = normalize((viewMatrix * vec4(uSunDir, 0.0)).xy + 1e-4);
    vSun = vec2(dot(sv, u), dot(sv, w));
    vShape = vec2(Hp, R);
    vPx = px;
    vFilm = aSeed.y;
    vCoccus = coccus;
    float fa = dist * uAerial;
    vAlpha = smoothstep(uNear.x, uNear.y, dist) * exp(-fa * fa);
    vec4 mvPosition = mv;
    gl_Position = projectionMatrix * mvPosition;
    if (vAlpha < 0.002) gl_Position = vec4(2.0, 2.0, 2.0, 1.0); // not drawn
    #include <fog_vertex>
  }
`;

const fragmentShader = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  uniform vec3 uBody, uRim, uGold;
  uniform float uOpacity;
  varying vec2 vLocal, vShape, vSun;
  varying float vPx, vAlpha, vFilm, vCoccus;

  void main() {
    float d = length(vec2(max(abs(vLocal.x) - vShape.x, 0.0), vLocal.y)) - vShape.y;
    if (d > 1.5 * vPx) discard;
    // A clear jelly bean: a soft-edged body a shade off the water, its sun side catching light in
    // faint film colours (a crescent, never a ring), a hint of gold inside. Under a few pixels it
    // is only a faint fleck.
    float big = smoothstep(1.5, 5.0, vShape.y / vPx);
    float edge = max(vPx, 0.15 * vShape.y);
    float inside = smoothstep(edge, -edge, d);
    float r = max(length(vLocal), 1e-4);
    float lit = max(dot(vLocal / r, vSun), 0.0) * smoothstep(-0.6 * vShape.y, -0.05 * vShape.y, d) * inside;
    // faint film colour, varying across the body only slowly (a ring of it would read as a contour)
    vec3 film = 0.85 + 0.15 * cos(6.2831853 * (vFilm + vLocal.x * 0.15 + vec3(0.0, 0.33, 0.67)));
    vec2 q = vLocal / max(vec2(vShape.x + 0.7 * vShape.y, 0.55 * vShape.y), vec2(1e-4));
    float nuc = exp(-dot(q, q));
    // pale like the near cells: a clear film body catching the light, a warm nucleoid inside.
    // Densest in the middle, fading to nothing at the edge.
    float core = exp(-dot(q, q) * 1.6);
    vec3 col = mix(uBody, uRim * film, 0.3 + 0.4 * lit);
    col = mix(col, uGold, 0.7 * core);
    float a = inside * (0.1 + 0.4 * core) * smoothstep(0.0, -0.4 * vShape.y, d) + lit * big * 0.12 * inside;
    gl_FragColor = vec4(col, a * uOpacity * vAlpha);
  }
`;

export class Crowd {
  constructor({ clusters = [], seed = 5, near = [22, 32], sunDir = null } = {}) {
    const rng = mulberry32(seed);
    let total = 0;
    for (const c of clusters) total += c.count;
    const pos = new Float32Array(total * 3);
    const axis = new Float32Array(total * 3);
    const seeds = new Float32Array(total * 4);
    const v = new THREE.Vector3();
    let i = 0;
    for (const c of clusters) {
      for (let k = 0; k < c.count; k++, i++) {
        // loosely clumped: denser toward the centre
        v.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1);
        while (v.lengthSq() > 1) v.set(rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1);
        v.multiplyScalar(c.radius * Math.pow(rng(), 0.35));
        if (c.flat) v.y *= c.flat;
        if (c.along) v.addScaledVector(c.along, (rng() - 0.5) * c.length);
        v.add(c.center);
        v.toArray(pos, i * 3);
        v.set(rng() * 2 - 1, (rng() * 2 - 1) * 0.6, rng() * 2 - 1).normalize().toArray(axis, i * 3);
        seeds[i * 4] = 0.8 + rng() * 0.45;
        seeds[i * 4 + 1] = rng();
        seeds[i * 4 + 2] = rng();
        seeds[i * 4 + 3] = rng() < 0.12 ? 1 : 0;
      }
    }
    const g = new THREE.InstancedBufferGeometry();
    const quad = new THREE.PlaneGeometry(1, 1);
    g.index = quad.index;
    g.setAttribute('position', quad.getAttribute('position'));
    g.setAttribute('aPos', new THREE.InstancedBufferAttribute(pos, 3));
    g.setAttribute('aAxis', new THREE.InstancedBufferAttribute(axis, 3));
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 4));
    g.instanceCount = total;
    this.uniforms = THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uPixelAngle: { value: 0.0014 },
        uBody: { value: sceneColor(0xf2f6f4) },
        uRim: { value: sceneColor(0xf6f8f4, 1.08) },
        uGold: { value: sceneColor(0xe0a85a) },
        uNear: { value: new THREE.Vector2(...near) },
        uOpacity: { value: 1 },
        uAerial: { value: 0 },
        uSunDir: { value: new THREE.Vector3(0.35, 1, 0.45).normalize() },
      },
    ]);
    this.uniforms.uTime = clock.uTime;
    if (sunDir) this.uniforms.uSunDir.value = sunDir; // shared, so it follows the sun
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      fog: true,
    });
    this.material = material;
    this.mesh = new THREE.Mesh(g, material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 3;
    this.count = total;
  }

  get opacity() {
    return this.uniforms.uOpacity.value;
  }
  set opacity(v) {
    this.uniforms.uOpacity.value = v;
    this.mesh.visible = v > 0.002;
  }

  get aerial() {
    return this.uniforms.uAerial.value;
  }
  set aerial(v) {
    this.uniforms.uAerial.value = v;
  }

  resize(height, fov = 42) {
    this.uniforms.uPixelAngle.value = (2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2)) / Math.max(1, height);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}
