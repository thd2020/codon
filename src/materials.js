import * as THREE from 'three';

// Goodsell's look: flat colour, soft key light, dark outline at the silhouette.
// Instanced meshes jiggle in place (thermal motion) and take their colour per instance.
// Flagella use BEND to curve their straight helix into a bundle behind the cell.
const goodsellVertex = /* glsl */ `
  #include <common>
  #include <fog_pars_vertex>
  uniform float uTime;
  uniform float uJitter;
  uniform vec3 uColor;
  #ifdef BEND
    uniform vec3 uBend;
    uniform vec2 uBendRange;
  #endif
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vColor;
  varying float vDepth;

  float hash1(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    vec3 p = position;
    vec3 n = normal;
    #ifdef USE_INSTANCING
      float id = float(gl_InstanceID);
      vec3 jitter = vec3(
        sin(uTime * 3.1 + hash1(id) * 40.0),
        sin(uTime * 2.7 + hash1(id + 1.7) * 40.0),
        sin(uTime * 3.7 + hash1(id + 3.1) * 40.0)) * uJitter;
      vec4 wp = modelMatrix * (instanceMatrix * vec4(p, 1.0) + vec4(jitter, 0.0));
      n = mat3(instanceMatrix) * n;
    #else
      vec4 wp = modelMatrix * vec4(p, 1.0);
    #endif
    #ifdef BEND
      wp.xyz += uBend * smoothstep(uBendRange.x, uBendRange.y, position.z);
    #endif
    vN = normalize(mat3(modelMatrix) * n);
    vV = cameraPosition - wp.xyz;
    #ifdef USE_INSTANCING_COLOR
      vColor = instanceColor;
    #else
      vColor = uColor;
    #endif
    vec4 mvPosition = viewMatrix * wp;
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const goodsellFragment = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  uniform vec3 uLightDir;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    // Dissolve anything about to touch the lens instead of letting it fill the screen.
    float ign = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
    if (smoothstep(0.5, 1.6, vDepth) < ign) discard;
    vec3 n = normalize(vN);
    vec3 v = normalize(vV);
    if (!gl_FrontFacing) n = -n;
    float key = max(dot(n, uLightDir), 0.0);
    vec3 c = vColor * (0.62 + 0.48 * key);
    float rim = 1.0 - abs(dot(n, v));
    c = mix(c, vColor * 0.22, smoothstep(0.62, 0.86, rim));
    gl_FragColor = vec4(c, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

export const clock = { uTime: { value: 0 } };

export function goodsellMaterial({ color = 0xffffff, jitter = 0, bend = false } = {}) {
  const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    {
      uJitter: { value: jitter },
      uColor: { value: new THREE.Color(color) },
      uLightDir: { value: new THREE.Vector3(0.35, 1, 0.45).normalize() },
      uBend: { value: new THREE.Vector3() },
      uBendRange: { value: new THREE.Vector2(0, 1) },
    },
  ]);
  uniforms.uTime = clock.uTime;
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: goodsellVertex,
    fragmentShader: goodsellFragment,
    defines: bend ? { BEND: '' } : {},
    fog: true,
  });
}

// The cell's outer jelly: a transmissive, slightly iridescent membrane that wobbles.
export function jellyMaterial({ color, attenuation, bump, wobble }) {
  const m = new THREE.MeshPhysicalMaterial({
    color,
    transmission: 1,
    thickness: 0.45,
    roughness: 0.05,
    ior: 1.36,
    attenuationColor: attenuation,
    attenuationDistance: 1.6,
    clearcoat: 0.6,
    clearcoatRoughness: 0.35,
    iridescence: 0.45,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [180, 520],
    sheen: 0.5,
    sheenColor: new THREE.Color(color).lerp(new THREE.Color(0xffffff), 0.4),
    sheenRoughness: 0.4,
    specularIntensity: 0.6,
    bumpMap: bump,
    bumpScale: 0.22,
  });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = clock.uTime;
    shader.uniforms.uWobble = wobble;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;\nuniform float uWobble;')
      .replace(
        '#include <begin_vertex>',
        `vec3 transformed = vec3(position);
         float w = sin(position.z * 4.1 + uTime * 2.3) * 0.5
                 + sin(position.x * 6.3 - uTime * 1.7 + position.y * 5.2) * 0.35
                 + sin(position.y * 7.7 + uTime * 2.9) * 0.25;
         transformed += normal * w * uWobble;`,
      );
  };
  return m;
}

// Membrane envelope seen edge-on: a coloured band at the silhouette, almost nothing face-on.
export function envelopeMaterial(color) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = cameraPosition - wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; varying vec3 vN; varying vec3 vV;
      void main() {
        float rim = 1.0 - abs(dot(normalize(vN), normalize(vV)));
        float band = smoothstep(0.6, 0.93, rim) * (1.0 - smoothstep(0.985, 1.0, rim));
        gl_FragColor = vec4(uColor, band * 0.55);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });
}

// Lumpy surface (lipopolysaccharide and porins) as a bump map.
export function bumpTexture(rng) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#808080';
  g.fillRect(0, 0, c.width, c.height);
  for (let i = 0; i < 5200; i++) {
    const x = rng() * c.width, y = rng() * c.height, r = 3 + rng() * 9;
    const light = rng() < 0.7;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, light ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)');
    grad.addColorStop(1, 'rgba(128,128,128,0)');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 1);
  return t;
}

export function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
