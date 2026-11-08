import * as THREE from 'three';
import { Pass, FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { Garden, B, BEAD_R, EYE_H, LOUPE, FOV, leafHeight } from './garden.js';
import { IntroAudio } from './audio.js';
import { LOOK } from './lens.js';

// The first-launch opening (story §5, shots 0 -> 4 -> 5 -> 6 -> 7): about 70 s, one continuous shot.
//
//   0:00  Before light. Black, a blackbird, someone crying quietly, a wet-glass A; a dawn gradient,
//         then one point of light: the tear bead catching the brightest part of the sky.
//   0:04  The glass. The leaf fades up round the point. 0:05 the loupe slides in, held by
//         fingertips with a plaster; a fingernail on brass; the engraving glints. 0:07 the breath
//         steadies (the motif's U). 0:08 the cursor becomes the lens; scroll focuses with honest
//         thin-lens optics (it flips past about 36 mm); a bead held centred and sharp for 0.8 s
//         gives a ting. 0:12 a faint pictogram if nothing has happened; 0:17 the dive by itself
//         (click, W or a trigger dives sooner; a player who keeps exploring keeps the hub to 0:38).
//   0:17  Beyond the glass (glass G). The eye sinks to the glass; the view through it becomes the
//         view; a logarithmic push at about 3 s per decade while the glass gives up honestly (its
//         detail limit is about 10 µm); the bead magnifies the leaf upright; the skin, a curved
//         mirror of sky holding the child's reflection; a soft, capped flash.
//   0:27  Under the meniscus: MicroIntro (intro-micro.js) takes over: the descent, the soft one,
//         the handoff to the game's start pose.
//
// Three clocks (story §6.1): `real` (wall clock: camera paths, cues), `world` (real x timeScale,
// for shaders and the drop's life) and the cue timeline, `intro.cues`, which counts from 0:00 and,
// from the dive on, from the moment the dive starts (`diveAt`), so a player who lingers in the hub
// shifts everything after it intact.
//
// The Garden is a second stage drawn through the same composer: the scene pass is pointed at the
// Garden's scene and camera, CellPass and the water's front particles are off, GardenPass runs
// right after the scene pass, and a final VeilPass (display space, after the lens grade) carries the
// fades, the point of light, the crossing flash, crossfades and the skip blink.

// MicroIntro lives in intro-micro.js (another builder). A glob import finds it when it exists and
// leaves the build intact while it doesn't.
const microModules = import.meta.glob('./intro-micro.js', { eager: true });
const MicroIntroFound = Object.values(microModules)[0]?.MicroIntro ?? null;
export const hasMicroIntro = !!MicroIntroFound;

const SEEN = 'codon.intro.seen';
const CAPTIONS = 'codon.captions';
const FONT = '"Avenir Next", "Futura", "Century Gothic", "Helvetica Neue", Inter, "DejaVu Sans", sans-serif';

// The authored timeline, in seconds of the opening clock (first launch, no input).
const T = {
  gradient: 1.5,
  point: 2.8,
  reveal: 4.0,
  parallax: 5.0,
  loupeIn: 5.0,
  loupeSettle: 7.0,
  click: 6.85,
  glint: 6.55,
  steady: 7.0,
  control: 8.0,
  pictogram: 12,
  autoDive: 17,
  hubLimit: 38,
};
// The dive, in seconds from diveAt.
const DIVE = { sink: 3.0, push: 8.0, skin: 9.65, cross: 10.0, flashUp: 0.35, flashDown: 0.35 };
const SKIN = { start: 9.35, end: 0.42, last: 0.27 }; // distance from the skin (mm): start of the push, its end, the last approach
const H_END = 11.5; // eye above the bead when the glass fills the frame
const D_END = 10.5; // the glass above the bead then
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const smoother = (x) => {
  const t = clamp(x, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};
const logLerp = (a, b, t) => Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * t);
const ease = (dt, tau) => 1 - Math.exp(-dt / Math.max(tau, 1e-4));

// ------------------------------------------------------------------------------ the veil
// Display space, the last pass: black, the dawn gradient and the point of light before the image;
// the iris that opens the image round the point; crossfades (reduced motion); the crossing flash
// (ramped over at least 0.3 s, at most 0.9 of white); the skip blink (a soft dip, not a flash).
const veilFragment = /* glsl */ `
  uniform sampler2D tDiffuse, tHold;
  uniform float uGrad, uPoint, uReveal, uFlash, uHold, uDim, uAspect, uTime;
  uniform vec2 uPointPos;
  varying vec2 vUv;
  void main() {
    vec3 scene = texture2D(tDiffuse, vUv).rgb;
    vec2 d = (vUv - uPointPos) * vec2(uAspect, 1.0);
    float r = length(d);
    // Before the image: a blue-lilac dawn gradient, lighter toward the top, with a slow breath.
    vec3 grad = mix(vec3(0.16, 0.16, 0.27), vec3(0.47, 0.44, 0.6), smoothstep(0.0, 1.0, vUv.y));
    grad = mix(grad, vec3(0.62, 0.54, 0.6), 0.35 * smoothstep(0.3, 1.2, 1.0 - length(vUv - vec2(0.75, 1.05))));
    vec3 pre = grad * uGrad;
    // The point of light: a tight core and a soft halo with a faint four-point glint.
    float star = exp(-r * r / 0.000012) + 0.28 * exp(-r * r / 0.0009) + 0.05 * exp(-r * r / 0.02);
    star += 0.05 * exp(-abs(d.x) * 300.0 - abs(d.y) * 12.0) + 0.05 * exp(-abs(d.y) * 300.0 - abs(d.x) * 12.0);
    pre += vec3(1.0, 0.97, 0.93) * star * uPoint;
    // The iris: the image opens out round the point, the dawn lightening as it does.
    float R = uReveal * 1.6;
    float m = 1.0 - smoothstep(R * 0.35, R, r);
    m = max(m, smoothstep(0.8, 1.0, uReveal));
    pre = mix(pre, pre * 1.6 + vec3(0.1, 0.1, 0.12), smoothstep(0.0, 0.6, uReveal));
    vec3 col = mix(pre, scene, m);
    col = mix(col, texture2D(tHold, vUv).rgb, uHold);
    // The blink: the light dips toward deep lilac.
    col = mix(col, col * vec3(0.32, 0.3, 0.42), uDim);
    col = mix(col, vec3(1.0), clamp(uFlash, 0.0, 0.9));
    gl_FragColor = vec4(col, 1.0);
  }
`;

class VeilPass extends Pass {
  constructor() {
    super();
    this.uniforms = {
      tDiffuse: { value: null },
      tHold: { value: null },
      uGrad: { value: 0 },
      uPoint: { value: 0 },
      uReveal: { value: 0 },
      uFlash: { value: 0 },
      uHold: { value: 0 },
      uDim: { value: 0 },
      uAspect: { value: 16 / 9 },
      uTime: { value: 0 },
      uPointPos: { value: new THREE.Vector2(0.5, 0.5) },
    };
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: veilFragment,
      depthTest: false,
      depthWrite: false,
    });
    this.quad = new FullScreenQuad(this.material);
    this.copy = new FullScreenQuad(new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `uniform sampler2D tDiffuse; varying vec2 vUv; void main() { gl_FragColor = texture2D(tDiffuse, vUv); }`,
    }));
    this.hold = null;
    this.wantCapture = false;
  }

  // Keep the next frame (as it is shown) to crossfade from.
  capture() {
    this.wantCapture = true;
  }

  render(renderer, writeBuffer, readBuffer) {
    const u = this.uniforms;
    u.tDiffuse.value = readBuffer.texture;
    u.uAspect.value = readBuffer.width / readBuffer.height;
    if (this.wantCapture) {
      if (!this.hold) this.hold = new THREE.WebGLRenderTarget(readBuffer.width, readBuffer.height);
      if (this.hold.width !== readBuffer.width || this.hold.height !== readBuffer.height) this.hold.setSize(readBuffer.width, readBuffer.height);
      // Keep what is on screen now, veil and all.
      renderer.setRenderTarget(this.hold);
      this.quad.render(renderer);
      u.tHold.value = this.hold.texture;
      u.uHold.value = 1;
      this.wantCapture = false;
    }
    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    this.quad.render(renderer);
  }

  dispose() {
    this.material.dispose();
    this.quad.dispose();
    this.copy.material.dispose();
    this.copy.dispose();
    this.hold?.dispose();
  }
}

// A stand-in for MicroIntro when intro-micro.js is missing: it cuts straight to the game's start
// pose, so the opening still ends in the game.
class CutToGame {
  constructor({ camera, controls, hero }) {
    Object.assign(this, { camera, controls, hero });
    this.timeScale = 1;
    this.frameHeight = 4.8;
    this.canHandOver = true;
    this.done = false;
  }
  start() {
    this.skip();
  }
  update() {}
  gazeOnHero() {
    return true;
  }
  handOver() {
    this.skip();
  }
  skip() {
    this.hero.group.position.set(0, 0, 0);
    this.hero.group.rotation.set(0, -0.35, 0);
    this.camera.fov = 42;
    this.camera.position.set(5.6, 1.8, 2.1);
    this.camera.updateProjectionMatrix();
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    this.done = true;
  }
  dispose() {}
}

// ------------------------------------------------------------------------- the interface
// Everything the opening shows as interface lives in one small DOM layer: the web pre-roll, the
// stepping scale bar, captions, the hub's pictogram, the skip ring. Light and soft: ink and plum
// on a paper glow, no lines.
function el(tag, style, parent, html) {
  const e = document.createElement(tag);
  Object.assign(e.style, style);
  if (html != null) e.innerHTML = html;
  parent?.appendChild(e);
  return e;
}

class IntroUI {
  constructor(iconUrl) {
    const halo = '0 0 1px rgb(248 246 240), 0 0 3px rgb(248 246 240), 0 0 7px rgb(248 246 240 / 0.75)';
    this.root = el('div', { position: 'fixed', inset: '0', pointerEvents: 'none', zIndex: 20, fontFamily: FONT, color: '#2b2340' }, document.body);
    this.root.className = 'codon-intro';
    // Pre-roll.
    this.pre = el('div', {
      position: 'absolute', inset: '0', background: '#000', display: 'none', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '22px',
      pointerEvents: 'auto', cursor: 'pointer', transition: 'opacity 0.5s ease', opacity: '1',
    }, this.root);
    el('img', { width: '64px', height: '64px', borderRadius: '15px', opacity: '0.92' }, this.pre).src = iconUrl;
    el('div', { color: 'rgba(236,232,244,0.78)', fontSize: '14px', letterSpacing: '0.06em' }, this.pre, 'click or press any key');
    // The stepping scale bar.
    this.bar = el('div', { position: 'absolute', left: '50%', bottom: '9.5vh', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', opacity: '0', transition: 'opacity 0.6s ease' }, this.root);
    this.barLine = el('div', {
      height: '5px', borderRadius: '3px', background: 'linear-gradient(90deg, rgba(94,58,140,0) 0%, #5e3a8c 9%, #5e3a8c 91%, rgba(94,58,140,0) 100%)',
      boxShadow: '0 0 6px rgba(248,246,240,0.95), 0 0 14px rgba(248,246,240,0.6)', width: '100px', transition: 'opacity 0.25s ease',
    }, this.bar);
    this.barLabel = el('div', { fontSize: '13px', fontWeight: '700', color: '#5e3a8c', textShadow: halo, letterSpacing: '0.02em', fontVariantNumeric: 'tabular-nums', transition: 'opacity 0.25s ease' }, this.bar);
    // Captions.
    this.cap = el('div', { position: 'absolute', left: '50%', bottom: '3.6vh', transform: 'translateX(-50%)', fontSize: '15px', fontStyle: 'italic', color: '#4f4366', textShadow: halo, opacity: '0', transition: 'opacity 0.4s ease', whiteSpace: 'nowrap' }, this.root);
    // The hub's pictogram: a circle (the glass) and a scroll arrow.
    this.picto = el('div', { position: 'absolute', opacity: '0', transition: 'opacity 1.2s ease', filter: 'drop-shadow(0 0 3px rgba(248,246,240,0.9))' }, this.root,
      `<svg width="58" height="40" viewBox="0 0 58 40" fill="none">
        <circle cx="16" cy="20" r="11" stroke="#5e3a8c" stroke-width="3" opacity="0.85"/>
        <rect x="38" y="7" width="12" height="20" rx="6" stroke="#5e3a8c" stroke-width="2.6" opacity="0.85"/>
        <circle cx="44" cy="13.5" r="1.8" fill="#5e3a8c"/>
        <path d="M44 31 l-4 -3.5 h8 z" fill="#5e3a8c" opacity="0.85"/>
        <path d="M44 3.2 l-4 3.2 h8 z" fill="#5e3a8c" opacity="0.85"/></svg>`);
    // The skip ring.
    this.skip = el('div', { position: 'absolute', opacity: '0', transition: 'opacity 0.2s ease' }, this.root,
      `<svg viewBox="0 0 100 100" width="100%" height="100%"><circle cx="50" cy="50" r="46" fill="none" stroke="rgba(248,246,240,0.85)" stroke-width="6"/>
       <circle class="arc" cx="50" cy="50" r="46" fill="none" stroke="#5e3a8c" stroke-width="4" stroke-linecap="round" stroke-dasharray="289" stroke-dashoffset="289" transform="rotate(-90 50 50)"/></svg>`);
    this.skipArc = this.skip.querySelector('.arc');
    this.capUntil = 0;
    this.label = null;
  }

  showPre(on) {
    this.pre.style.display = on ? 'flex' : 'none';
  }

  caption(text, until) {
    this.cap.textContent = text;
    this.cap.style.opacity = '1';
    this.capUntil = until;
  }

  tickCaption(now) {
    if (this.capUntil && now > this.capUntil) {
      this.cap.style.opacity = '0';
      this.capUntil = 0;
    }
  }

  setBar(visible, label, px) {
    this.bar.style.opacity = visible ? '1' : '0';
    if (!visible) return;
    if (label !== this.label) {
      this.label = label;
      this.barLabel.textContent = label;
    }
    this.barLine.style.width = `${Math.round(clamp(px, 4, innerWidth * 0.6))}px`;
  }

  setPicto(on, x, y) {
    this.picto.style.opacity = on ? '0.7' : '0';
    if (x != null) {
      this.picto.style.left = `${Math.round(x)}px`;
      this.picto.style.top = `${Math.round(y - 20)}px`;
    }
  }

  setSkip(p, x, y, r) {
    this.skip.style.opacity = p > 0.02 ? '1' : '0';
    this.skip.style.left = `${Math.round(x - r)}px`;
    this.skip.style.top = `${Math.round(y - r)}px`;
    this.skip.style.width = this.skip.style.height = `${Math.round(2 * r)}px`;
    this.skipArc.setAttribute('stroke-dashoffset', `${(289 * (1 - clamp(p, 0, 1))).toFixed(1)}`);
  }

  dispose() {
    this.root.remove();
  }
}

// --------------------------------------------------------------------------------- Intro
export class Intro {
  // First launch (no 'codon.intro.seen'), or ?intro. Never with ?nointro, nor in headless ?frames
  // renders unless ?intro asks for it.
  static shouldPlay(params) {
    if (params.has('nointro')) return false;
    if (params.has('intro')) return true;
    if (params.has('frames')) return false;
    try {
      return !localStorage.getItem(SEEN);
    } catch {
      return true;
    }
  }

  constructor({ renderer, composer, look, scene, camera, controls, cellPass, water, hero, neighbours, player, hud, params, MicroIntro = null, iconUrl } = {}) {
    Object.assign(this, { renderer, composer, look, scene, camera, controls, cellPass, water, hero, neighbours, player, hud });
    params = params ?? new URLSearchParams(location.search);
    this.params = params;
    this.headless = params.has('frames');
    this.reducedMotion = params.has('reducedmotion') || (!!globalThis.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

    this.active = true;
    this.timeScale = 1;
    this.focus = null;
    this.state = 'preroll'; // preroll -> garden -> micro -> done; 'blink' while skipping
    this.t = 0; // the opening clock (real seconds since 0:00)
    this.diveAt = null; // opening-clock time the dive started
    this.td = 0; // the dive clock
    this.tm = 0; // seconds since MicroIntro.start()
    this.diveRate = 1;

    // Input.
    this.cursor = new THREE.Vector2(0, 0);
    this.cursorMoved = false;
    this.lastInput = -1;
    this.wheel = 0;
    this.keys = new Set();
    this.dragging = false;
    this.lookedAround = false;
    this.skipHold = 0;
    this.gazeT = 0;

    // The Garden, and the stage swap.
    this.garden = new Garden(renderer);
    this.veil = new VeilPass();
    composer.insertPass(this.garden.pass, 1);
    composer.addPass(this.veil);
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    this.garden.setSize(size.x, size.y);
    this.lensSaved = this.saveLens();
    this.enterGarden();

    // The hub's state.
    this.hub = {
      parallax: new THREE.Vector2(),
      loupe: new THREE.Vector3(0, 0, 0), // x, z on the bead plane
      vel: new THREE.Vector2(),
      d: LOUPE.rest,
      dGoal: LOUPE.rest,
      following: false,
      aligned: 0,
      moving: false,
      lastThock: -1,
      lastBlur: 0,
      tremor: 0,
    };

    this.ui = new IntroUI(iconUrl ?? `${import.meta.env?.BASE_URL ?? '/'}brand/cell-icon.svg`);
    let caps = params.has('captions');
    try {
      caps = caps || localStorage.getItem(CAPTIONS) === '1';
    } catch {
      /* storage blocked */
    }
    this.captions = caps;
    this.audio = new IntroAudio({ onCaption: (text, s) => this.captions && this.ui.caption(text, this.clockNow() + s) });

    const Micro = MicroIntro ?? MicroIntroFound;
    const deps = { renderer, scene, camera, controls, cellPass, water, hero, neighbours, hud, look, reducedMotion: this.reducedMotion };
    this.micro = Micro ? new Micro(deps) : new CutToGame(deps);
    this.micro.reducedMotion = this.reducedMotion;
    // The real MicroIntro brings the micro half's own sound (attachAudio) and shows the interface
    // itself during its glide; a stand-in leaves both to the director.
    this.microOwnsSound = typeof this.micro.attachAudio === 'function';
    this.microOwnsHud = this.microOwnsSound;

    hud?.show?.(false, 0);
    if (controls) controls.enabled = false;

    this.cues = this.buildCues();
    this.bindInput();
    if (this.headless) this.start();
    else this.ui.showPre(true);
  }

  get inGarden() {
    return this.state === 'preroll' || this.state === 'garden' || (this.state === 'blink' && !this.inMicro);
  }

  clockNow() {
    return performance.now() / 1000;
  }

  // ---------------------------------------------------------------------------- stage swap
  saveLens() {
    const u = this.look?.lens?.uniforms;
    if (!u) return null;
    return { lift: u.uLift.value.clone(), amount: u.uLiftAmount.value, warmth: u.uWarmth.value };
  }

  enterGarden() {
    const { scenePass, front } = this.look;
    scenePass.scene = this.garden.scene;
    scenePass.camera = this.garden.camera;
    if (this.cellPass) this.cellPass.enabled = false;
    if (front) front.enabled = false;
    this.garden.pass.enabled = true;
    this.inMicro = false;
    // The dawn grade (story §6.2 DAWN.lens): shadows lifted toward a bluer lilac, no warmth yet.
    const u = this.look.lens?.uniforms;
    if (u) {
      u.uLift.value.set(0.5, 0.47, 0.66);
      u.uLiftAmount.value = 0.08;
      u.uWarmth.value = 0;
    }
  }

  enterMicro() {
    const { scenePass, front } = this.look;
    scenePass.scene = this.scene;
    scenePass.camera = this.camera;
    if (this.cellPass) this.cellPass.enabled = true;
    if (front) front.enabled = true;
    this.garden.pass.enabled = false;
    this.inMicro = true;
    const u = this.look.lens?.uniforms;
    if (u && this.lensSaved) {
      u.uLift.value.copy(this.lensSaved.lift);
      u.uLiftAmount.value = this.lensSaved.amount;
      u.uWarmth.value = this.lensSaved.warmth;
    }
  }

  // ------------------------------------------------------------------------------ input
  bindInput() {
    const ndc = (e) => this.cursor.set((e.clientX / innerWidth) * 2 - 1, 1 - (e.clientY / innerHeight) * 2);
    this.on = {
      move: (e) => {
        ndc(e);
        if (this.state === 'garden') {
          if (this.t >= T.control && !this.diveAt) {
            this.cursorMoved = true;
            this.lastInput = this.t;
          }
        }
        if (this.state === 'micro' && e.buttons) {
          this.dragging = true;
          this.lookedAround = true;
        }
      },
      down: (e) => {
        if (this.state === 'preroll') return this.gesture();
        ndc(e);
        if (this.state === 'garden' && e.button === 0 && this.t >= T.control) this.requestDive('click');
      },
      up: () => {
        this.dragging = false;
      },
      wheel: (e) => {
        if (this.state === 'preroll' || this.state === 'done') return;
        e.preventDefault();
        const dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
        this.wheel += clamp(dy, -300, 300);
        if (this.state === 'garden' && this.t >= T.control) this.lastInput = this.t;
      },
      keydown: (e) => {
        if (this.state === 'preroll') {
          if (e.code === 'KeyC') this.setCaptions(true);
          return this.gesture();
        }
        if (this.state === 'done') return;
        this.keys.add(e.code);
        if (e.code === 'KeyC' && !e.repeat) this.setCaptions(!this.captions);
        if (e.code === 'KeyW' && this.state === 'garden' && this.t >= T.control) this.requestDive('key');
      },
      keyup: (e) => this.keys.delete(e.code),
      blur: () => this.keys.clear(),
    };
    addEventListener('pointermove', this.on.move);
    addEventListener('pointerdown', this.on.down);
    addEventListener('pointerup', this.on.up);
    addEventListener('wheel', this.on.wheel, { passive: false });
    addEventListener('keydown', this.on.keydown);
    addEventListener('keyup', this.on.keyup);
    addEventListener('blur', this.on.blur);
  }

  unbindInput() {
    removeEventListener('pointermove', this.on.move);
    removeEventListener('pointerdown', this.on.down);
    removeEventListener('pointerup', this.on.up);
    removeEventListener('wheel', this.on.wheel);
    removeEventListener('keydown', this.on.keydown);
    removeEventListener('keyup', this.on.keyup);
    removeEventListener('blur', this.on.blur);
  }

  setCaptions(on) {
    this.captions = on;
    try {
      localStorage.setItem(CAPTIONS, on ? '1' : '0');
    } catch {
      /* storage blocked */
    }
    if (!on) this.ui.cap.style.opacity = '0';
  }

  // The pre-roll's click or key: resumes the audio inside the gesture and starts 0:00.
  gesture() {
    this.audio.resume();
    this.ui.pre.style.opacity = '0';
    setTimeout(() => this.ui.showPre(false), 500);
    this.start();
  }

  start() {
    if (this.state !== 'preroll') return;
    this.state = 'garden';
    this.t = 0;
  }

  // Gamepad: left stick steers the glass, the triggers raise and lower it, A dives, B (held) skips.
  pollGamepad() {
    const pads = navigator.getGamepads?.() ?? [];
    const p = [...pads].find((x) => x && x.connected);
    if (!p) return null;
    const b = (i) => p.buttons[i]?.value ?? 0;
    const dead = (v) => (Math.abs(v) < 0.15 ? 0 : v);
    return { x: dead(p.axes[0] ?? 0), y: dead(p.axes[1] ?? 0), lt: b(6), rt: b(7), a: b(0) > 0.5, back: b(1) > 0.5 };
  }

  // ------------------------------------------------------------------------- the cue sheet
  // Sounds and beats on the timeline. clock: 'open' (from 0:00), 'dive' (from diveAt), 'micro' (from
  // MicroIntro.start()). Exported as `intro.cues` (the audio animatic's cue sheet).
  buildCues() {
    const a = this.audio;
    const cue = (clock, at, name, fn) => ({ clock, at, name, fn, done: false });
    return [
      cue('open', 1.0, 'blackbird, distant', () => {
        a.bird(0, { kind: 'blackbird', level: 0.05, pan: -0.55 });
        a.caption('[a bird]');
      }),
      cue('open', 1.6, 'breath: unsteady', () => a.setBreathing('unsteady')),
      cue('open', 2.6, 'a sniff', () => {
        a.breath('sniff', 0, { level: 0.12 });
        a.caption('[someone crying quietly]', 3);
      }),
      cue('open', 3.2, 'glass A (the motif: A)', () => a.glassA(0, { level: 0.07, caption: '[a wet glass rings]' })),
      cue('open', 3.6, 'garden bed in', () => a.gardenIn(4)),
      cue('open', T.click, 'a fingernail clicks on brass', () => a.click()),
      cue('open', T.steady, 'breath steadies; the exhale is the motif U', () => {
        a.setBreathing('steady');
        a.breath('u', 0, { dur: 2.4, level: 0.07 });
        a.caption('[a long breath out; the breathing steadies]', 3);
      }),
      cue('open', 7.3, 'the glass settles into a drone on A', () => a.droneIn(0.035, 4)),
      // Glass G (the motif's G) sounds on the dive input itself, see requestDive(); listed for the sheet.
      cue('dive', 0, 'glass G (on the dive input: A-U-G, start)', () => {}),
      cue('dive', 8.0, 'the breath stretches into a tide', () => a.tideIn(2.5, 0.45)),
      cue('dive', 3.2, 'birdsong slows', () => a.caption('[birdsong slows into long moans]', 3)),
      cue('dive', 6.0, 'a fine hiss rises', () => a.caption('[a fine, granular hiss]', 2.5)),
      cue('micro', 3.0, 'walled rods: thin glass harmonics', () => a.rodsIn(6)),
      ...[6.6, 7.6, 8.8, 9.9, 11.0].map((at, i) => cue('micro', at, `rod ${i + 1} fades`, () => a.rodOut(i + 1))),
      cue('micro', 8.0, 'the wall splits: the hero’s wobble', () => a.heroWobble()),
    ];
  }

  runCues() {
    for (const c of this.cues) {
      if (c.done) continue;
      if (c.clock === 'micro' && this.microOwnsSound) continue;
      const clock = c.clock === 'open' ? this.t : c.clock === 'dive' ? (this.diveAt != null && this.t >= this.diveAt ? this.td : -1) : this.state === 'micro' ? this.tm : -1;
      if (clock >= c.at) {
        c.done = true;
        c.fn(this);
      }
    }
  }

  // The cue sheet as plain data.
  cueSheet() {
    return this.cues.map(({ clock, at, name }) => ({ clock, at, name }));
  }

  // ------------------------------------------------------------------------------ frame
  // Called by the game loop every frame while `active`. Steps the timeline, then draws what the
  // composer's frame needs from the Garden.
  update(real) {
    this.step(real);
    if (this.inGarden && this.state !== 'done') this.garden.prerender(this.renderer);
  }

  // The timeline alone (no drawing): also used to seek.
  step(real) {
    if (this.state === 'done') return;
    const size = this.renderer.getDrawingBufferSize(_v2);
    if (size.x !== this.garden.size.x || size.y !== this.garden.size.y) this.garden.setSize(size.x, size.y);
    if (this.state === 'preroll') {
      // Black until the gesture; the Garden waits at its first frame.
      this.veil.uniforms.uGrad.value = 0;
      this.veil.uniforms.uReveal.value = 0;
      this.veil.uniforms.uPoint.value = 0;
      this.stepGarden(0);
      return;
    }
    this.t += real;
    this.audio.tick();
    this.ui.tickCaption(this.clockNow());
    this.stepSkip(real);
    if (this.state === 'blink') return this.stepBlink(real);
    this.runCues();
    if (this.state === 'garden') this.stepGarden(real);
    else if (this.state === 'micro') this.stepMicro(real);
    this.stepVeil(real);
  }

  // ----------------------------------------------------------------------------- Garden
  stepGarden(real) {
    const g = this.garden;
    const t = this.t;
    // The dawn brightens as the image opens.
    g.expo = 0.74 + 0.26 * smooth(T.reveal, 7.5, t);
    if (this.diveAt == null || t < this.diveAt) this.stepHub(real);
    if (this.diveAt != null) this.stepDive(real);
    g.update(real);
    if (this.diveAt == null) this.hubAfter(real);
    this.updateBar();
  }

  eyeFromParallax(out) {
    const p = this.hub.parallax;
    const yaw = THREE.MathUtils.degToRad(2) * p.x;
    const pitch = THREE.MathUtils.degToRad(2) * p.y;
    out.set(-Math.sin(yaw) * EYE_H, Math.cos(yaw) * Math.cos(pitch) * EYE_H, Math.sin(pitch) * EYE_H).add(B);
    return out;
  }

  // Shot 0 and shot 4: the arrival, then the hub under the player's hand.
  stepHub(real) {
    const g = this.garden;
    const h = this.hub;
    const t = this.t;
    const pad = this.pollGamepad();
    // Parallax from 0:05: the cursor tilts the eye by up to 2 degrees.
    const pg = t >= T.parallax ? this.cursor : _zero;
    h.parallax.lerp(pg, ease(real, 0.45));
    const cam = g.camera;
    this.eyeFromParallax(cam.position);
    cam.up.set(0, 0, 1);
    cam.lookAt(B);
    cam.updateMatrixWorld();
    const H = cam.position.y - B.y;

    // The arrival: the glass slides in from the bottom edge, held by the fingertips, and settles
    // over the tear bead; the child leans in and the sky dims by 15%.
    const s = smoother((t - T.loupeIn) / (T.loupeSettle - T.loupeIn));
    g.loupeOn = t >= T.loupeIn - 0.05;
    g.skyOcc = s;
    if (t < T.control) {
      const from = _a.set(-14, 34, -112);
      const via = _b.set(-6, 20, -38);
      const to = _c.set(0, LOUPE.rest, 0);
      // A quadratic path, settling with a small overshoot of the hand.
      const u = s;
      _d.copy(from).multiplyScalar((1 - u) * (1 - u)).addScaledVector(via, 2 * u * (1 - u)).addScaledVector(to, u * u);
      _d.y += Math.sin(clamp((t - 6.6) / 0.9, 0, 1) * Math.PI) * 0.8;
      h.loupe.set(_d.x, 0, _d.z);
      h.d = _d.y;
      h.dGoal = LOUPE.rest;
    } else if (!this.diveAt) {
      // The cursor steers the glass (once it moves), scroll or the triggers raise and lower it.
      if (this.cursorMoved) h.following = true;
      if (pad && (pad.x || pad.y)) {
        h.following = false;
        h.loupe.x -= pad.x * 40 * real;
        h.loupe.z -= pad.y * 40 * real;
        this.lastInput = t;
      }
      if (h.following) {
        // Where the cursor meets the bead's plane.
        _ray.setFromCamera(this.cursor, cam);
        const k = (B.y - _ray.ray.origin.y) / _ray.ray.direction.y;
        const px = _ray.ray.origin.x + _ray.ray.direction.x * k;
        const pz = _ray.ray.origin.z + _ray.ray.direction.z * k;
        // A critically damped spring, about a quarter second.
        const w = 13;
        const ax = w * w * (px - h.loupe.x) - 2 * w * h.vel.x;
        const az = w * w * (pz - h.loupe.z) - 2 * w * h.vel.y;
        h.vel.x += ax * real;
        h.vel.y += az * real;
        h.loupe.x += h.vel.x * real;
        h.loupe.z += h.vel.y * real;
      }
      const r = Math.hypot(h.loupe.x, h.loupe.z);
      if (r > 46) h.loupe.multiplyScalar(46 / r);
      if (this.wheel) {
        h.dGoal = clamp(h.dGoal + this.wheel * 0.012, LOUPE.min, LOUPE.max);
        this.wheel = 0;
      }
      if (pad) {
        const tr = pad.rt - pad.lt;
        if (Math.abs(tr) > 0.05) {
          h.dGoal = clamp(h.dGoal + tr * 14 * real, LOUPE.min, LOUPE.max);
          this.lastInput = t;
        }
        if (pad.a) this.requestDive('pad');
      }
      h.d += (h.dGoal - h.d) * ease(real, 0.12);
      // A felt thock as the glass starts to move.
      const speed = h.vel.length();
      if (speed > 25 && !h.moving && t - h.lastThock > 0.4) {
        this.audio.thock();
        h.lastThock = t;
      }
      h.moving = speed > 8;
    }
    // Keep the glass above the blade, with a hand's faint tremor.
    h.tremor += real;
    const floor = leafHeight(h.loupe.x, h.loupe.z) + 4.5;
    const tr = 0.12;
    g.loupePos.set(
      h.loupe.x + tr * Math.sin(h.tremor * 2.3) * 0.8,
      Math.max(B.y + h.d, floor) + tr * Math.sin(h.tremor * 1.7 + 1),
      h.loupe.z + tr * Math.sin(h.tremor * 1.9 + 2),
    );
    g.portalM = null;
    g.focusBlur = null;
    g.glass.on = 0;

    // Focus: on the bead; on the glass while it comes in (so its engraving reads as it glints),
    // then through it, back to the bead.
    const zBead = H - BEAD_R;
    const zLoupe = cam.position.distanceTo(g.loupePos);
    const pull = smooth(5.35, 6.0, t) * (1 - smooth(7.25, 7.95, t));
    g.focus = zBead + (zLoupe - zBead) * pull;
    // The mid layer's own defocus when the eye is on the glass (px at 1080p).
    const coc1080 = g.pupil * (1080 / (2 * TAN)) * Math.abs(1 / zBead - 1 / g.focus);
    g.midSigma = coc1080 / 2.4;
    g.glint = clamp((t - T.glint) / 1.0, 0, 1);
    g.schlieren = 0.5;
  }

  // After the Garden's optics are computed: the focus whisper, the alignment ting, the pictogram,
  // and when the dive begins by itself.
  hubAfter(real) {
    const g = this.garden;
    const h = this.hub;
    const t = this.t;
    if (t < T.control) return;
    const o = g.optics;
    const blur = o.blurPx;
    const activity = clamp(Math.abs(blur - h.lastBlur) / Math.max(real, 1e-3) / 30, 0, 1);
    h.lastBlur = blur;
    this.audio.focusWhisper(clamp(blur / 14, 0, 1), activity);
    // A bead held centred and sharp for 0.8 s: eye, glass and drop on one axis.
    const i = g.beadInGlass();
    if (i >= 0 && g.beadCentred(i) && blur < 1.5) {
      h.aligned += real;
      if (h.aligned >= 0.8 && h.alignedBead !== i) {
        this.audio.ting();
        h.alignedBead = i;
        h.rim = 1;
        h.rimBead = i;
      }
    } else {
      h.aligned = 0;
      if (h.alignedBead != null && (i !== h.alignedBead || !g.beadCentred(h.alignedBead))) h.alignedBead = null;
    }
    if (h.rim > 0) {
      g.setRim(h.rimBead, h.rim);
      h.rim = Math.max(0, h.rim - real * 0.35);
      if (h.rim === 0) g.setRim(h.rimBead, 0);
    }
    // 0:12: a faint pictogram beside the rim, if nothing has happened.
    const idle = this.lastInput < 0;
    const showPicto = idle && t >= T.pictogram;
    const css = this.cssOf(o.discC);
    const rCss = (o.discR / g.size.y) * innerHeight;
    this.ui.setPicto(showPicto, css.x + rCss + 18, css.y);
    // The dive by itself: 0:17 with no input; otherwise after 9 s of rest, and at 0:38 at the latest.
    const due = idle ? T.autoDive : Math.min(T.hubLimit, Math.max(T.autoDive, this.lastInput + 9));
    if (t >= due) this.requestDive('auto');
  }

  cssOf(px, out = new THREE.Vector2()) {
    const g = this.garden;
    return out.set((px.x / g.size.x) * innerWidth, (1 - px.y / g.size.y) * innerHeight);
  }

  requestDive(source) {
    if (this.diveAt != null || this.state !== 'garden') return;
    const h = this.hub;
    this.diveSource = source;
    // The dive itself sounds glass G: A-U-G, start.
    this.audio.glassG(0, { level: 0.11, caption: '[a second glass note]' });
    this.ui.setPicto(false);
    // If the glass is over another bead, the child's hand takes it back to the tear bead first.
    const off = Math.hypot(h.loupe.x, h.loupe.z) > 1.5 || Math.abs(h.d - LOUPE.rest) > 1.5;
    this.glide = { from: h.loupe.clone(), d: h.d, dur: off ? 0.6 : 0, t0: this.t };
    this.diveAt = this.t + this.glide.dur;
    this.td = 0;
    this.dive = { H0: null, d0: LOUPE.rest, swapR: null, rmStage: 0 };
  }

  // Shot 5 in the Garden: sink to the glass, swap to the equivalent camera, the push, the skin, the
  // crossing.
  stepDive(real) {
    const g = this.garden;
    const h = this.hub;
    const t = this.t;
    const cam = g.camera;
    if (t < this.diveAt) {
      // The hand glides back to the tear bead.
      const u = smoother((t - this.glide.t0) / Math.max(this.glide.dur, 1e-3));
      h.loupe.copy(this.glide.from).multiplyScalar(1 - u);
      h.d = this.glide.d + (LOUPE.rest - this.glide.d) * u;
      g.loupePos.set(h.loupe.x, B.y + h.d, h.loupe.z);
      return;
    }
    // W, scroll or a trigger hurries the dive, never past four times the authored pace (the whole
    // path then still takes longer than the 3 s replay dive).
    const pad = this.pollGamepad();
    const want = this.keys.has('KeyW') || this.wheel > 0 || (pad && pad.rt > 0.3) ? 4 : 1;
    this.wheel = 0;
    this.diveRate += (want - this.diveRate) * ease(real, want > this.diveRate ? 0.5 : 1.2);
    if (this.reducedMotion) return this.stepDiveReduced(real);
    this.td += real * (this.td < DIVE.skin ? this.diveRate : 1);
    const td = this.td;
    const d = this.dive;
    if (d.H0 == null) d.H0 = cam.position.y - B.y;
    h.parallax.multiplyScalar(1 - ease(real, 0.8));

    if (td < DIVE.sink) {
      // (a) The eye sinks along the eye-glass-drop axis until the disc fills the frame; the hand
      // brings the glass down with it, keeping the bead in focus.
      const p = smoother(td / DIVE.sink);
      const H = logLerp(d.H0, H_END, p);
      const dd = LOUPE.rest + (D_END - LOUPE.rest) * smooth(0.0, 1.0, p);
      this.eyeFromParallax(cam.position);
      cam.position.sub(B).normalize().multiplyScalar(H).add(B);
      cam.up.set(0, 0, 1);
      cam.lookAt(B);
      cam.updateMatrixWorld();
      g.loupeOn = true;
      g.loupePos.set(h.loupe.x, B.y + dd, h.loupe.z);
      // The magnification eases to 1 as the eye reaches the glass (the swap must be invisible).
      const Mphys = this.physM(H, dd);
      g.portalM = Mphys + (1 - Mphys) * smooth(0.55, 1.0, p);
      g.focusBlur = 0;
      g.focus = H - BEAD_R;
      g.midSigma = 0;
      g.glass.on = 0;
      g.skin = 0;
      this.frameH = (2 * H * TAN) / Math.abs(g.portalM);
    } else {
      // (b) The swap: the glass is at the eye; from now on GlassPass draws its barrel distortion,
      // fringing and blur over the whole frame. (c) The push, about 3 s per decade.
      if (d.swapR == null) {
        g.update(0);
        d.swapR = g.optics.discR;
      }
      g.loupeOn = false;
      g.portalM = null;
      let gap;
      if (td < DIVE.push) gap = logLerp(SKIN.start, SKIN.end, (td - DIVE.sink) / (DIVE.push - DIVE.sink));
      else gap = logLerp(SKIN.end, SKIN.last, smooth(DIVE.push, DIVE.cross, td));
      cam.position.set(B.x, B.y + BEAD_R + gap, B.z);
      // A slow turn over the whole push, so the leaf below swims rather than slides; near the skin
      // the eye lifts a little toward the bright sky, so the mirror holds the child small, at its
      // edge, and not over the whole frame.
      const spin = 0.12 * smooth(DIVE.sink, DIVE.cross, td);
      cam.up.set(Math.sin(spin), 0, Math.cos(spin));
      const lift = Math.tan(THREE.MathUtils.degToRad(16)) * smooth(5.5, 9.0, td);
      cam.lookAt(_a.copy(cam.position).add(_b.set(0, -1, lift)));
      cam.updateMatrixWorld();
      g.focus = gap;
      const hFrame = 2 * gap * TAN; // mm at the skin
      // The honest limit: the glass resolves about 10 µm (the eye's 0.1 mm over 10).
      const blurPx = Math.min((0.5 * 0.01 * 1080) / hFrame, 40);
      g.midSigma = blurPx / 2.2;
      g.glass.on = 1;
      g.glass.discR = d.swapR;
      g.glass.barrel = 0.08;
      g.glass.fringe = 0.012 + 0.02 * smooth(DIVE.sink, DIVE.push, td);
      // The skin, a curved mirror of sky holding the child's reflection; pressed against it, more so.
      g.mirror = smooth(DIVE.sink - 0.4, DIVE.sink + 1.0, td);
      g.skin = smooth(7.2, 9.2, td);
      this.frameH = hFrame;
    }
    // The crossing: a soft white flash, ramped and capped; MicroIntro starts at its peak.
    if (td >= DIVE.skin && this.state === 'garden') {
      const f = smooth(DIVE.skin, DIVE.cross, td);
      this.flash = 0.9 * f;
      if (td >= DIVE.cross) this.cross();
    }
    this.audio.setScale(this.frameH * 1e-3);
  }

  // Reduced motion: three crossfades instead of the push (hub -> skin close-up -> 40 µm -> handoff).
  stepDiveReduced(real) {
    const g = this.garden;
    const d = this.dive;
    this.td += real;
    const cam = g.camera;
    if (d.rmStage === 0) {
      // Keep this frame (the hub) and cut on the next one.
      this.veil.capture();
      d.rmStage = 0.5;
      return;
    }
    if (d.rmStage === 0.5) {
      d.rmStage = 1;
      g.loupeOn = false;
      const gap = 0.4;
      cam.position.set(B.x, B.y + BEAD_R + gap, B.z);
      cam.up.set(0, 0, 1);
      cam.lookAt(B);
      cam.updateMatrixWorld();
      g.focus = gap;
      const hFrame = 2 * gap * TAN;
      g.midSigma = Math.min((0.5 * 0.01 * 1080) / hFrame, 40) / 2.2;
      g.glass.on = 1;
      g.glass.discR = g.size.y * 0.9;
      g.skin = 0.6;
      this.frameH = hFrame;
      this.audio.tideIn(2, 0.45);
    }
    this.veil.uniforms.uHold.value = Math.max(0, this.veil.uniforms.uHold.value - real / 1.0);
    this.audio.setScale(this.frameH * 1e-3);
    if (this.td >= 3.4 && d.rmStage === 1) {
      this.veil.capture();
      d.rmStage = 2;
    } else if (d.rmStage === 2 && this.state === 'garden') this.cross();
  }

  physM(H, d) {
    const f = LOUPE.f;
    if (Math.abs(f - d) < 1e-3) return H / d;
    const m = f / (f - d);
    const M = (m * H) / (H + (m - 1) * d);
    return Number.isFinite(M) ? clamp(M, -30, 30) : 30;
  }

  // Under the meniscus: hand the micro part to MicroIntro, the flash at its peak (MicroIntro lets it
  // down over 0.35 s from wherever the lens's flash is when it starts).
  cross() {
    this.enterMicro();
    this.state = 'micro';
    this.tm = 0;
    const lf = this.look.lens?.uniforms?.uFlash;
    if (lf) lf.value = this.reducedMotion ? 0 : 0.9;
    this.flash = 0;
    this.startMicro();
    this.micro.update?.(0, 0);
  }

  startMicro() {
    if (this.audio.on && this.microOwnsSound) this.micro.attachAudio(this.audio.ctx, this.audio.master);
    this.micro.start();
  }

  // ----------------------------------------------------------------------------- micro
  stepMicro(real) {
    const m = this.micro;
    this.tm += real;
    try {
      m.update(real, this.tm);
    } catch (err) {
      // MicroIntro must never stop the opening: if its sound fails, take the sound back (the
      // director plays the micro cues itself) and finish the frame with no time step.
      if (!this.microError) console.warn('Intro: MicroIntro.update threw; its sound is detached.', err);
      this.microError = true;
      m.audio = null;
      this.microOwnsSound = false;
      try {
        m.update(0, this.tm);
      } catch {
        /* the next frame tries again */
      }
    }
    this.timeScale = m.timeScale ?? 1;
    this.focus = m.focus ?? null;
    this.frameH = (m.frameHeight ?? 4.8) * 1e-3;
    this.audio.setScale(this.frameH * 1e-3);
    if (this.reducedMotion) this.veil.uniforms.uHold.value = Math.max(0, this.veil.uniforms.uHold.value - real / 1.0);
    // Resting the view on the soft cell hands over (only after a look around, and not mid-drag).
    if (m.canHandOver && !this.handedOver && this.lookedAround && !this.dragging) {
      this.gazeT = m.gazeOnHero?.(_zero) ? this.gazeT + real : 0;
      if (this.gazeT >= 0.8) {
        m.handOver();
        this.handedOver = true;
        this.hudAt = this.tm + 0.6;
      }
    }
    if (!this.hudShown && (this.tm >= (this.hudAt ?? 17.6) || m.done)) this.showHud();
    this.updateBar();
    if (m.done) this.finish();
  }

  showHud() {
    this.hudShown = true;
    if (this.microOwnsHud) return; // MicroIntro brings the interface in, with its chord and ripple
    this.hud?.show?.(true, 1.2);
    this.audio.chord();
    this.audio.ripple();
  }

  // --------------------------------------------------------------------------------- skip
  // Hold Escape (or B on a pad) for 1 s at any time: one blink, then shot 7's end state.
  stepSkip(real) {
    if (this.state === 'blink' || this.state === 'done') return;
    const pad = this.pollGamepad();
    const held = this.keys.has('Escape') || (pad && pad.back);
    this.skipHold = held ? this.skipHold + real : Math.max(0, this.skipHold - real * 3);
    let x = innerWidth / 2, y = innerHeight / 2, r = 46;
    if (this.state === 'garden' && this.garden.loupeOn) {
      const o = this.garden.optics;
      const c = this.cssOf(o.discC);
      x = c.x;
      y = c.y;
      // On the brass bezel (its middle is 1.13 of the glass's radius).
      r = clamp((o.discR / this.garden.size.y) * innerHeight * 1.13, 40, innerHeight * 0.45);
    }
    this.ui.setSkip(this.skipHold, x, y, r);
    if (this.skipHold >= 1) {
      this.state = 'blink';
      this.blinkT = 0;
      this.landed = false;
      this.skipHold = 0;
      this.ui.setSkip(0, x, y, r);
    }
  }

  stepBlink(real) {
    this.blinkT += real;
    const b = this.blinkT;
    const u = this.veil.uniforms;
    u.uDim.value = b < 0.3 ? smooth(0, 0.3, b) : 1 - smooth(0.3, 0.8, b);
    u.uFlash.value = Math.max(0, u.uFlash.value - real * 3);
    if (!this.landed && b >= 0.3) {
      this.landed = true;
      if (!this.inMicro) {
        this.enterMicro();
        this.startMicro();
      }
      this.micro.skip();
      this.ui.setPicto(false);
      this.ui.setBar(false);
      this.timeScale = 1;
      this.audio.settle();
      if (!this.hudShown) {
        this.hudShown = true;
        this.hud?.show?.(true, 1.2);
      }
    }
    if (b >= 0.8) {
      u.uDim.value = 0;
      this.finish();
    }
  }

  // ----------------------------------------------------------------------------- the veil
  stepVeil(real) {
    const u = this.veil.uniforms;
    const t = this.t;
    if (this.state === 'garden') {
      u.uGrad.value = smooth(T.gradient, 2.6, t);
      u.uPoint.value = smooth(T.point, 3.3, t) * (1 - smooth(4.6, 6.0, t));
      u.uReveal.value = smoother((t - T.reveal) / 1.9);
      // The point sits on the tear bead's highlight.
      const g = this.garden;
      const p = g.toScreen(_a.copy(B).add(_b.set(0.85, 1.4, 1.1)));
      u.uPointPos.value.set(p.x / g.size.x, p.y / g.size.y);
      // The crossing's flash rides on the lens's own flash when it has one (MicroIntro then lets it
      // down); otherwise on the veil.
      const lf = this.look.lens?.uniforms?.uFlash;
      if (lf) lf.value = this.flash ?? 0;
      u.uFlash.value = lf ? 0 : this.flash ?? 0;
    } else if (this.state === 'micro') {
      u.uGrad.value = 0;
      u.uPoint.value = 0;
      u.uReveal.value = 1;
      const lf = this.look.lens?.uniforms?.uFlash;
      const f = this.reducedMotion ? 0 : 0.9 * (1 - smooth(0, DIVE.flashDown, this.tm));
      if (lf && !this.microOwnsHud) lf.value = f; // a stand-in doesn't let the flash down itself
      u.uFlash.value = lf ? 0 : f;
    }
    if (this.reducedMotion) u.uFlash.value = 0;
    u.uTime.value = t;
  }

  // ------------------------------------------------------------------------ the scale bar
  // The largest power of ten no bigger than 0.3 of the frame's width; its true length on screen.
  updateBar() {
    const show = this.diveAt != null && this.t >= this.diveAt + 0.6 && this.state !== 'done' && !this.hudShown;
    const h = this.frameH; // mm
    if (!show || !(h > 0)) return this.ui.setBar(false);
    const w = h * (innerWidth / innerHeight);
    let len = Math.pow(10, Math.floor(Math.log10(0.3 * w) + 1e-9));
    // A little hysteresis, so a frame that rests near a decade doesn't flicker between two labels.
    const prev = this.barLen;
    if (prev && len < prev && 0.3 * w > 0.85 * prev) len = prev;
    this.barLen = len;
    const label = len >= 10 ? `${len / 10} cm` : len >= 1 ? `${len} mm` : `${Math.round(len * 1000)} µm`;
    this.ui.setBar(true, label, (len / h) * innerHeight);
  }

  // ------------------------------------------------------------------------------ handoff
  finish() {
    if (this.state === 'done') return;
    this.state = 'done';
    this.active = false;
    this.timeScale = 1;
    this.focus = null;
    if (!this.hudShown) this.showHud();
    if (!this.inMicro) this.enterMicro();
    if (this.controls) this.controls.enabled = true;
    try {
      localStorage.setItem(SEEN, '1');
    } catch {
      /* storage blocked */
    }
    this.audio.settle();
    this.dispose();
  }

  // Removes the Garden, its passes and the opening's interface; the scene is left as the game
  // expects it. The audio stays (the tide carries on as the drop's ambience).
  dispose() {
    const c = this.composer;
    if (this.garden) {
      c.removePass?.(this.garden.pass);
      c.removePass?.(this.veil);
      this.garden.dispose();
      this.veil.dispose();
      this.garden = null;
    }
    this.micro?.dispose?.();
    this.ui.dispose();
    this.unbindInput();
  }
}

const _v2 = new THREE.Vector2();
const _zero = new THREE.Vector2(0, 0);
const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _d = new THREE.Vector3();
const _ray = new THREE.Raycaster();
