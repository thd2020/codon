import * as THREE from 'three';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// The final look of the world: tone mapping, exposure, bloom, the light the cells share with the
// water, and the lens grade.
//
// Colours of the drop are chosen as DISPLAY colours (what you should see on screen). sceneColor()
// turns one into the scene-linear value that shows exactly that after tone mapping, so pale water
// stays pale and luminous instead of going grey. The water sits a step below white on purpose:
// that headroom is what lets bright things (film reflections, the sun's window, caustic threads,
// glints, light rays) read as brighter than the water instead of vanishing into it.

const TONE = { AgX: THREE.AgXToneMapping, ACES: THREE.ACESFilmicToneMapping, Neutral: THREE.NeutralToneMapping };

// Display colours of the drop (sRGB hex).
const DROP = {
  meniscus: 0xd8ebe7, // the underside of the surface overhead; caustic threads and the sun's window brighten it toward white
  sky: 0xdbefec, // the drop's upper body
  horizon: 0xcfe6e3, // looking level: also the fog colour, so distance fades into the water itself
  haze: 0xe2def2, // a faint luminous lilac band just below level
  deep: 0xa2d0d4, // gentle teal below
  abyss: 0xb0b0dc, // and lilac at the very bottom
  sun: 0xfff5e6,
};

const START = 0.76; // the Neutral curve's shoulder (0.8 - 0.04)
const DESAT = 0.15;

// Inverse of three.js NeutralToneMapping (Khronos PBR Neutral), exact: a display colour -> the
// scene-linear colour that tone-maps to it at this exposure. For other curves it is a plain
// sRGB -> linear conversion.
export function sceneColor(hex, gain = 1) {
  const c = new THREE.Color(hex); // linear
  const v = [c.r, c.g, c.b];
  if (LOOK.toneMapping === 'Neutral') {
    // Pure display white is never reached by the curve: cap it just below.
    const cap = Math.min(0.97 / Math.max(...v), 1);
    for (let i = 0; i < 3; i++) v[i] *= cap;
    const P = Math.max(...v);
    if (P >= START) {
      const d = 1 - START;
      const peak = (d * d) / (1 - P) - d + START;
      const g = 1 - 1 / (DESAT * (peak - P) + 1);
      for (let i = 0; i < 3; i++) v[i] = ((v[i] - g * P) / (1 - g)) * (peak / P);
    }
    const m = Math.min(...v);
    const offset = m + 0.04 >= 0.08 ? 0.04 : Math.sqrt(Math.max(m, 0) / 6.25) - m;
    for (let i = 0; i < 3; i++) v[i] += offset;
  }
  return new THREE.Color(v[0], v[1], v[2]).multiplyScalar(gain / LOOK.exposure);
}

export const LOOK = {
  toneMapping: 'Neutral',
  exposure: 1,
  // Only true highlights bloom (the sun, glints at their flash): the threshold sits above the
  // brightest water, caustic thread and window, and the halo is small and tight.
  bloom: { strength: 0.32, radius: 0.18, threshold: 3.2 },
  // The lens grade (display space, after tone mapping). See LensShader.
  lens: {
    lift: [0.5, 0.46, 0.62], // pastel lilac the deepest shadows are lifted toward
    liftAmount: 0.07,
    warmth: 0.015, // warm highlights
    contrast: 0.1, // a gentle S-curve on mid-tones: crisp forms, still high-key
    saturation: 0.1, // extra purity for strong colours only; pale water and pale films are left alone
    clarity: 0.5, // local contrast on luma (4 px), clamped so it can never ring around an edge
    vignette: 0.045, // corners lighten very slightly toward pearl
    dispersion: 1.1, // px of colour separation at the corners only
    grain: 0.009,
  },
  drop: DROP,
  sunDir: new THREE.Vector3(0.35, 1, 0.45).normalize(), // same as organicMaterial's light
  cellEnvironment: null, // filled below, once sceneColor can run
};

// What CellPass needs to light and fog cells exactly like the water (scene-linear colours, so they
// match the dome and FogExp2 after tone mapping). `window` and `sun` describe the two bright
// features of the sky, and the dome draws them from these same numbers, so a membrane that mirrors
// the sky mirrors exactly what is there:
//   window: s = dot(dir, sunDir); add sky * gain * smoothstep(cosOut, cosIn, s)
//   sun:    add sunColor * (pow(s, power) * gain + pow(s, glowPower) * glowGain)
LOOK.cellEnvironment = {
  sunDir: LOOK.sunDir.clone(),
  sunColor: new THREE.Color(DROP.sun),
  sky: sceneColor(0xf5f9f5), // what the films reflect from overhead: the meniscus with its light
  deep: sceneColor(DROP.deep),
  fogColor: sceneColor(DROP.horizon),
  // Light enough that the hero is never veiled (about 12% at the farthest orbit of 18 µm), strong
  // enough that neighbours 30-50 µm away sink into the water.
  fogDensity: 0.02,
  window: { cosIn: 0.9865, cosOut: 0.9845, gain: 0.55 }, // a bright disc of sky about 10° round the sun, with a crisp rim
  sun: { power: 4000, gain: 12, glowPower: 24, glowGain: 0.18 }, // a small hot disc (~3° across) and a modest aureole
};

// Applies LOOK to the renderer and, when given, the passes that read it.
export function applyLook(renderer, { cellPass, bloom, lens } = {}) {
  renderer.toneMapping = TONE[LOOK.toneMapping] ?? THREE.NeutralToneMapping;
  renderer.toneMappingExposure = LOOK.exposure;
  if (cellPass) cellPass.setEnvironment(LOOK.cellEnvironment);
  if (bloom) {
    bloom.strength = LOOK.bloom.strength;
    bloom.radius = LOOK.bloom.radius;
    bloom.threshold = LOOK.bloom.threshold;
    // Halation is warm, like light spreading in the film.
    if (bloom.bloomTintColors) bloom.bloomTintColors.forEach((c) => c.set(1.0, 0.93, 0.84));
  }
  if (lens) {
    const u = lens.uniforms;
    const L = LOOK.lens;
    u.uLift.value.set(...L.lift);
    u.uLiftAmount.value = L.liftAmount;
    u.uWarmth.value = L.warmth;
    u.uContrast.value = L.contrast;
    u.uSaturation.value = L.saturation;
    u.uClarity.value = L.clarity;
    u.uVignette.value = L.vignette;
    u.uDispersion.value = L.dispersion;
    u.uGrain.value = L.grain;
  }
}

// The lens grade. Runs LAST, after OutputPass (it works on display colours: run on scene-linear
// HDR it would clip all the pale water to grey). High-key: shadows lifted toward pastel lilac,
// highlights a touch warm, a gentle mid-tone curve and a little local contrast; colour separation
// and a pearl lightening only at the very corners; whisper grain that also hides banding in the
// pale gradients. No blur, and no edge sharpening (which would draw halos and dark contours).
export const LensShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uLift: { value: new THREE.Vector3(...LOOK.lens.lift) },
    uLiftAmount: { value: LOOK.lens.liftAmount },
    uWarmth: { value: LOOK.lens.warmth },
    uContrast: { value: LOOK.lens.contrast },
    uSaturation: { value: LOOK.lens.saturation },
    uClarity: { value: LOOK.lens.clarity },
    uVignette: { value: LOOK.lens.vignette },
    uDispersion: { value: LOOK.lens.dispersion },
    uGrain: { value: LOOK.lens.grain },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uRes;
    uniform vec3 uLift;
    uniform float uLiftAmount, uWarmth, uContrast, uSaturation, uClarity, uVignette, uDispersion, uGrain;
    varying vec2 vUv;

    float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

    void main() {
      vec2 px = 1.0 / uRes;
      vec2 c = vUv - 0.5;
      vec2 ca = c * vec2(uRes.x / uRes.y, 1.0);
      float r = length(ca) / length(vec2(uRes.x / uRes.y, 1.0) * 0.5); // 0 centre, 1 corner

      // Colour separation grows only toward the corners (zero over the middle of the frame).
      vec2 off = normalize(c + 1e-6) * px * uDispersion * smoothstep(0.45, 1.0, r) * r;
      vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);

      // Local contrast on luma against a 4 px ring. The detail term is clamped and fades out where
      // it is large (a hard edge), so it deepens soft film swirls and fine texture but cannot draw a
      // halo or a dark contour round a bead, a granule or a label.
      float lb = 0.0;
      for (int k = 0; k < 8; k++) {
        float a = float(k) * 0.7853982 + 0.3927;
        lb += luma(texture2D(tDiffuse, vUv + vec2(cos(a), sin(a)) * 4.0 * px).rgb);
      }
      float dl = luma(col) - lb * 0.125;
      col += clamp(dl, -0.025, 0.025) * (1.0 - smoothstep(0.015, 0.06, abs(dl))) * uClarity;
      col = max(col, 0.0);

      float l = luma(col);
      // Gentle S-curve around the middle: definition without darkening the pale water much.
      float ls = l + uContrast * (l - 0.5) * (1.0 - abs(l * 2.0 - 1.0)) * 2.0;
      col *= ls / max(l, 1e-4);
      l = ls;
      // Purity for things that already have colour; neutral and pale water untouched.
      float chroma = max(col.r, max(col.g, col.b)) - min(col.r, min(col.g, col.b));
      col = mix(vec3(l), col, 1.0 + uSaturation * smoothstep(0.15, 0.45, chroma));
      // Lifted pastel shadows and warm highlights.
      col = mix(col, uLift, uLiftAmount * pow(1.0 - clamp(l, 0.0, 1.0), 2.5));
      col *= 1.0 + uWarmth * smoothstep(0.93, 1.0, l) * vec3(1.0, 0.2, -0.8);
      // Corners lighten very slightly toward pearl instead of going dark.
      col = mix(col, vec3(0.985, 0.98, 0.965), uVignette * smoothstep(0.55, 1.15, r));

      // Grain: fine, monochrome, strongest in the mid-tones.
      vec2 g = floor(vUv * uRes) + fract(uTime * 7.13) * vec2(97.0, 57.0);
      float n = fract(sin(dot(g, vec2(12.9898, 78.233))) * 43758.5453) + fract(sin(dot(g + 17.0, vec2(39.346, 11.135))) * 24634.6345) - 1.0;
      col += n * uGrain * (0.4 + 0.6 * (1.0 - abs(l * 2.0 - 1.0)));
      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
};

// The lens as a pass that keeps its own resolution in step with the composer.
export class LensPass extends ShaderPass {
  constructor() {
    super(LensShader);
  }

  setSize(width, height) {
    this.uniforms.uRes.value = new THREE.Vector2(width, height);
  }
}

// The scene's first render, remembering which depth texture it drew into, so later passes (the
// particles in front of the cells) can be hidden behind opaque meshes.
class ScenePass extends RenderPass {
  render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive);
    this.depthTexture = this.renderToScreen ? null : readBuffer.depthTexture;
  }
}

// Builds the whole frame in the only order that works, and applies LOOK:
//   scene (HDR, with depth) -> cells (CellPass) -> water in front of the cells -> bloom (on HDR)
//   -> OutputPass (tone mapping + sRGB) -> lens grade (display colours).
// The composer's render target must be HalfFloat with a depthTexture (CellPass needs it too).
// Returns the passes, so callers can toggle them or set uniforms (lens.uniforms.uTime).
export function composeLook(composer, renderer, { scene, camera, cellPass = null, water = null } = {}) {
  const size = renderer.getDrawingBufferSize(new THREE.Vector2());
  const scenePass = new ScenePass(scene, camera);
  composer.addPass(scenePass);
  if (cellPass) composer.addPass(cellPass);
  const front = water ? water.frontPass(camera, { depth: () => scenePass.depthTexture }) : null;
  if (front) composer.addPass(front);
  const bloom = new UnrealBloomPass(size.clone(), LOOK.bloom.strength, LOOK.bloom.radius, LOOK.bloom.threshold);
  composer.addPass(bloom);
  const output = new OutputPass();
  composer.addPass(output);
  const lens = new LensPass();
  composer.addPass(lens);
  applyLook(renderer, { cellPass, bloom, lens });
  return { scenePass, cellPass, front, bloom, output, lens };
}
