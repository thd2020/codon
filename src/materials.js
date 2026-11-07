import * as THREE from 'three';

// Materials for everything drawn as meshes. Cells themselves (membranes, cytoplasm, nucleoid,
// plasmid, granules, the TCA swirl, receptor lattice, periplasm, vesicles) are NOT meshes: they are
// raymarched as one continuous volume by CellPass (cellpass.js), lit and fogged like the water, so
// the whole scene shares one look. Meshes are for small or thin things (beads, ribosomes, membrane
// complexes, motors, flagella, food, motes). Draw them OPAQUE: the cell volume is composited over
// them up to their depth, so whatever sits inside a cell is veiled by the membrane in front of it.
// Light theme: a pale, sunlit drop. Nothing has an outline; forms separate by colour, light, depth.
//
// Everything about a cell flows. A cell owns one `shape` (createCellShape) shared by its meshes and
// by CellPass. The shape is a smooth warp of space around the cell's reference body (a capsule of
// radius 0.5 µm and core length 1 µm along +Z, in body space): slow travelling bulges, a teardrop
// stretch while swimming, a bend into turns, ripples on the skin, and pockets pushed in for
// endocytosis. Meshes given the shape ride the same warp as the volume. Game logic stays in
// reference body space; flowPoint() finds where a reference point is drawn (mirrors the shaders).

export const clock = { uTime: { value: 0 } };

export function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------------------------
// The cell's shape.
//   amp, speed, seed: the slow flow (bulge size in µm, how fast it travels, phase).
//   wobble: fine ripple on the skin in µm.
//   thrust (0..1) and turn (body x/y curvature) are set every frame by the cell from its motion.
//   dents: MAX_DENTS pockets pushed inward along -normal (endocytosis), in reference body space:
//          center (point on the reference surface), normal (outward, unit), radius (µm footprint),
//          depth (µm, how far the pocket sinks), pinch (0..1: at 1 the membrane has sealed over the
//          opening and the pocket's contents sit in a closed bubble). CellPass draws them.
//          Set with setDent(shape, i, {...}); depth 0 switches a dent off.
// Call syncShape(shape, body) once per frame (before rendering) with the cell's body Object3D.
// ---------------------------------------------------------------------------------------------
export const MAX_DENTS = 2;

export function createCellShape({ amp = 0.08, speed = 0.6, seed = 0, wobble = 0.01 } = {}) {
  return {
    uFlowAmp: { value: amp },
    uFlowSpeed: { value: speed },
    uSeed: { value: seed },
    uThrust: { value: 0 },
    uTurn: { value: new THREE.Vector2() },
    uBody: { value: new THREE.Matrix4() },
    uBodyInv: { value: new THREE.Matrix4() },
    uWobble: { value: wobble },
    uDentC: { value: Array.from({ length: MAX_DENTS }, () => new THREE.Vector4(0, 0, 0, 0.2)) },
    uDentN: { value: Array.from({ length: MAX_DENTS }, () => new THREE.Vector4(0, 0, 1, 0)) },
    uDentP: { value: new Array(MAX_DENTS).fill(0) },
  };
}

export function syncShape(shape, body) {
  body.updateWorldMatrix(true, false);
  shape.uBody.value.copy(body.matrixWorld);
  shape.uBodyInv.value.copy(body.matrixWorld).invert();
}

export function setDent(shape, i, { center, normal, radius = 0.2, depth = 0, pinch = 0 }) {
  if (center) shape.uDentC.value[i].set(center.x, center.y, center.z, radius);
  else shape.uDentC.value[i].w = radius;
  if (normal) shape.uDentN.value[i].set(normal.x, normal.y, normal.z, depth);
  else shape.uDentN.value[i].w = depth;
  shape.uDentP.value[i] = pinch;
}

// Signed distance to the reference capsule (negative inside).
export function capsuleSd(p) {
  const z = Math.max(Math.abs(p.z) - 0.5, 0);
  return Math.hypot(p.x, p.y, z) - 0.5;
}

const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

// JS mirror of flowWarp(): where a reference body-space point is drawn, in body space.
// Dents and the skin ripple are left out (they only move the membrane surface itself).
export function flowPoint(shape, p, out = new THREE.Vector3()) {
  const sd = capsuleSd(p);
  const reach = 1 - smooth(0.15, 0.9, sd);
  const core = smooth(-0.45, 0, sd);
  const t = clock.uTime.value * shape.uFlowSpeed.value + shape.uSeed.value;
  const thrust = shape.uThrust.value;
  const turn = shape.uTurn.value;
  const rear = smooth(0.2, -1.1, p.z);
  const front = smooth(-0.2, 1.1, p.z);
  const sxy = 1 + (0.06 * front - 0.24 * rear) * thrust * reach;
  let x = p.x * sxy + turn.x * p.z * p.z * 0.35 * reach;
  let y = p.y * sxy + turn.y * p.z * p.z * 0.35 * reach;
  let z = p.z + p.z * 0.1 * thrust * reach;
  const a = shape.uFlowAmp.value * (0.35 + 0.65 * core) * reach;
  x += a * Math.sin(p.z * 2.1 + t * 1.3) * Math.cos(p.y * 2.7 - t * 0.9);
  y += a * Math.sin(p.z * 1.7 - t * 1.1 + 1.3) * Math.cos(p.x * 2.3 + t * 0.7);
  z += a * 0.6 * Math.sin(p.x * 2.5 + t * 0.8 + 2.1) * Math.cos(p.y * 1.9 - t * 1.2);
  return out.set(x, y, z);
}

// GLSL twin of flowPoint(). Keep the two identical.
const FLOW_GLSL = /* glsl */ `
  uniform float uFlowAmp;
  uniform float uFlowSpeed;
  uniform float uSeed;
  uniform float uThrust;
  uniform vec2 uTurn;

  float capsuleSd(vec3 p) {
    vec3 q = vec3(p.xy, max(abs(p.z) - 0.5, 0.0));
    return length(q) - 0.5;
  }

  vec3 flowWarp(vec3 p) {
    float sd = capsuleSd(p);
    float reach = 1.0 - smoothstep(0.15, 0.9, sd);
    float core = smoothstep(-0.45, 0.0, sd);
    float t = uTime * uFlowSpeed + uSeed;
    float rear = smoothstep(0.2, -1.1, p.z);
    float front = smoothstep(-0.2, 1.1, p.z);
    float sxy = 1.0 + (0.06 * front - 0.24 * rear) * uThrust * reach;
    vec3 q;
    q.xy = p.xy * sxy + uTurn * p.z * p.z * 0.35 * reach;
    q.z = p.z + p.z * 0.1 * uThrust * reach;
    float a = uFlowAmp * (0.35 + 0.65 * core) * reach;
    q.x += a * sin(p.z * 2.1 + t * 1.3) * cos(p.y * 2.7 - t * 0.9);
    q.y += a * sin(p.z * 1.7 - t * 1.1 + 1.3) * cos(p.x * 2.3 + t * 0.7);
    q.z += a * 0.6 * sin(p.x * 2.5 + t * 0.8 + 2.1) * cos(p.y * 1.9 - t * 1.2);
    return q;
  }
`;

// Interior objects: warp a world-space position through the cell's body space.
const BODY_WARP_GLSL = /* glsl */ `
  uniform mat4 uBody;
  uniform mat4 uBodyInv;
  vec4 bodyWarp(vec4 wp) {
    vec4 pb = uBodyInv * wp;
    pb.xyz = flowWarp(pb.xyz);
    return uBody * pb;
  }
`;

function bindShape(uniforms, shape) {
  for (const k of ['uFlowAmp', 'uFlowSpeed', 'uSeed', 'uThrust', 'uTurn', 'uBody', 'uBodyInv']) uniforms[k] = shape[k];
}

// ---------------------------------------------------------------------------------------------
// organicMaterial: opaque, softly lit, glowing from within. Use for organelles, complexes, granules,
// DNA, flagella. Light wraps around it and bleeds through its thin edges, so it reads as wet
// living matter, not a drawing. Options:
//   color        base colour (ignored for InstancedMesh with per-instance colours: setColorAt)
//   glow         self-illumination (0 none, 1 = its own colour at full strength)
//   jitter       thermal shiver amplitude in µm (InstancedMesh only, per instance)
//   shape        the cell's shape: the object flows with the cell (any place in the cell's tree)
//   bend         flagellum bend (uniforms uBend, uBendRange; see bacterium.js). Not with shape.
//   translucency light bleeding at thin edges (0..1)
// Per-mesh brightness: material.uniforms.uPulse.value (1 = normal). For InstancedMesh, per-instance
// colour values may exceed 1 for bright flashes.
// ---------------------------------------------------------------------------------------------
const organicVertex = /* glsl */ `
  #include <common>
  #include <fog_pars_vertex>
  uniform float uTime;
  uniform float uJitter;
  uniform vec3 uColor;
  #ifdef FLOW
    ${FLOW_GLSL}
    ${BODY_WARP_GLSL}
  #endif
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
    #ifdef FLOW
      wp = bodyWarp(wp);
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

const organicFragment = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  uniform vec3 uLightDir;
  uniform float uGlow;
  uniform float uTranslucency;
  uniform float uPulse;
  uniform vec2 uNearFade;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    // Dissolve anything about to touch the lens instead of letting it fill the screen.
    float ign = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
    if (smoothstep(uNearFade.x, uNearFade.y, vDepth) < ign) discard;
    vec3 n = normalize(vN);
    vec3 v = normalize(vV);
    if (!gl_FrontFacing) n = -n;
    float wrap = dot(n, uLightDir) * 0.5 + 0.5;
    float facing = abs(dot(n, v));
    vec3 c = vColor * (0.42 + 0.58 * wrap * wrap);
    // Light bleeding through thin edges: a broad soft gradient, never a line.
    c += vColor * pow(1.0 - facing, 1.6) * uTranslucency * 0.6;
    c += vColor * uGlow;
    c *= uPulse;
    gl_FragColor = vec4(c, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

function shapeUniforms(shape) {
  if (!shape) return {};
  const u = {};
  bindShape(u, shape);
  return u;
}

// nearFade: [start, end] depth in µm over which the part dissolves as it nears the lens. The default
// suits things floating in the water; a cell's own parts, inspected from close, want a narrower one.
export function organicMaterial({ color = 0xffffff, glow = 0.15, jitter = 0, bend = false, shape = null, translucency = 0.6, nearFade = [0.5, 1.6] } = {}) {
  const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    {
      uJitter: { value: jitter },
      uColor: { value: new THREE.Color(color) },
      uLightDir: { value: new THREE.Vector3(0.35, 1, 0.45).normalize() },
      uGlow: { value: glow },
      uTranslucency: { value: translucency },
      uPulse: { value: 1 },
      uBend: { value: new THREE.Vector3() },
      uBendRange: { value: new THREE.Vector2(0, 1) },
      uNearFade: { value: new THREE.Vector2(nearFade[0], nearFade[1]) },
    },
  ]);
  uniforms.uTime = clock.uTime;
  Object.assign(uniforms, shapeUniforms(shape));
  const defines = {};
  if (bend) defines.BEND = '';
  if (shape) defines.FLOW = '';
  return new THREE.ShaderMaterial({ uniforms, vertexShader: organicVertex, fragmentShader: organicFragment, defines, fog: true });
}

// ---------------------------------------------------------------------------------------------
// tokenMaterial: for InstancedMesh of small spheres that are metabolites, ions and sparks.
// Unlit and opaque (so they are refracted by the jelly): a saturated bead with a brighter core and
// softer edge. Give each instance its colour with setColorAt (values above 1 brighten the core).
// Hide an instance by giving it zero scale. Pass the cell's shape so beads flow with the cell.
// ---------------------------------------------------------------------------------------------
export function tokenMaterial({ shape = null } = {}) {
  const uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {}]);
  uniforms.uTime = clock.uTime;
  Object.assign(uniforms, shapeUniforms(shape));
  return new THREE.ShaderMaterial({
    uniforms,
    defines: shape ? { FLOW: '' } : {},
    vertexShader: /* glsl */ `
      #include <common>
      #include <fog_pars_vertex>
      uniform float uTime;
      #ifdef FLOW
        ${FLOW_GLSL}
        ${BODY_WARP_GLSL}
      #endif
      varying vec3 vN; varying vec3 vV; varying vec3 vColor;
      void main() {
        vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
        #ifdef FLOW
          wp = bodyWarp(wp);
        #endif
        vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        vV = cameraPosition - wp.xyz;
        #ifdef USE_INSTANCING_COLOR
          vColor = instanceColor;
        #else
          vColor = vec3(1.0);
        #endif
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: /* glsl */ `
      #include <common>
      #include <fog_pars_fragment>
      varying vec3 vN; varying vec3 vV; varying vec3 vColor;
      void main() {
        float facing = abs(dot(normalize(vN), normalize(vV)));
        vec3 c = vColor * (0.55 + 0.75 * pow(facing, 1.2));
        gl_FragColor = vec4(c, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }`,
    fog: true,
  });
}

// ---------------------------------------------------------------------------------------------
// haloMaterial: a soft veil of colour on any mesh (a sphere for a vesicle's shimmer, a torus for the
// TCA cycle's swirl). Densest where you look through the middle, fading to nothing at the edge.
// Normal blending by default (light theme); additive: true for glow. Pass shape to flow with a
// cell. Animate material.uniforms.uIntensity.value.
// ---------------------------------------------------------------------------------------------
export function haloMaterial({ color, intensity = 0.4, falloff = 1.5, additive = false, shape = null } = {}) {
  const uniforms = { uColor: { value: new THREE.Color(color) }, uIntensity: { value: intensity }, uFalloff: { value: falloff } };
  uniforms.uTime = clock.uTime;
  Object.assign(uniforms, shapeUniforms(shape));
  return new THREE.ShaderMaterial({
    uniforms,
    defines: shape ? { FLOW: '' } : {},
    vertexShader: /* glsl */ `
      uniform float uTime;
      #ifdef FLOW
        ${FLOW_GLSL}
        ${BODY_WARP_GLSL}
      #endif
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        #ifdef FLOW
          wp = bodyWarp(wp);
        #endif
        vN = normalize(mat3(modelMatrix) * normal);
        vV = cameraPosition - wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; uniform float uIntensity; uniform float uFalloff;
      varying vec3 vN; varying vec3 vV;
      void main() {
        float facing = abs(dot(normalize(vN), normalize(vV)));
        float a = clamp(uIntensity * pow(facing, uFalloff), 0.0, 1.0);
        gl_FragColor = vec4(uColor, a);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}
