import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { BRAND } from './palette.js';
import { LOOK, sceneColor } from './lens.js';
import { keepClear } from './water.js';

// The interface lives in the water with the cell, never on the glass. Around the cell: two arcs for
// its energy (ATP on the left, the proton motive force on the right), a bar exactly 1 µm long at the
// cell's depth with the swimming speed under it, and a note above when the cell can't respire
// normally. Inspect (Tab) pins names to the cell's parts, says what the beads are and keeps a live
// ledger of the energy route. The title floats where you start, and you swim past it.
//
// Light theme, clear and sharp: ink and plum text with a tight paper halo hugging the letters, solid
// mint and plum light. Nothing has an outline, a leader line, a tick or a rule: a tag is a pin with
// its name right beside it, and the arcs and the bar are distance fields with a crisp edge at any
// zoom. Nothing of the interface ever sits on the cell: the arcs keep outside its outline on screen.

const RING = 1.3; // µm from the cell's centre to the arcs (the cell is 2 µm long)
const RING_MIN_PX = 140; // ...but never tighter than this on screen
const CLEAR_PX = 22; // and always this far outside the cell's outline
const SPAN = 1.9; // radians of circle each arc covers
const REACH = Math.sin(SPAN / 2); // how far up and down an arc reaches, as a fraction of its radius
const INSPECT_DISTANCE = 3.9; // µm from the camera to the cell while inspecting
const TOUR = 4.5; // s each inspect description stays open while the pointer rests
const PIN = 3.5; // px, a tag's pin radius
const PIN_GAP = 7; // px from the pin's edge to its name
const NAME_LINE = 16; // px, the line height of a tag's name (style.css)
const FONT = '"Avenir Next", "Futura", "Century Gothic", "Helvetica Neue", Inter, "DejaVu Sans", sans-serif';

// Inspect names compete for room; earlier keys win: what is happening now, then the big structures.
const PRIORITY = ['vesicle', 'protein', 'glycogenFood', 'glucose', 'envelope', 'nucleoid', 'atpSynthase', 'complexI', 'oxidase',
  'protons', 'glycolysis', 'tca', 'pts', 'pdh', 'polysome', 'receptors', 'motor', 'flagellum', 'plasmid', 'glycogen', 'polyP'];

// Display colours (what the screen shows); the WebGL parts convert them with sceneColor so they come
// out exact after tone mapping.
const HEX = {
  atp: [BRAND.mint, 0x9be8d4], // the rod, and the light that breathes along it
  pmf: [BRAND.plum, 0xc7b2ee],
  warn: [0xd4573f, 0xffc2ae], // either arc shifts toward this as it runs low
  bar: BRAND.plum,
  paper: BRAND.paper,
};

const ease = (dt, tau) => 1 - Math.exp(-dt / tau);
const smooth = THREE.MathUtils.smoothstep;
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const css = (c) => (typeof c === 'string' ? c : `#${(c >>> 0).toString(16).padStart(6, '0')}`);
const num = (x) => (Number.isFinite(x) ? x : null);
const fmt = (x) => (x === null ? '–' : x < 10 ? x.toFixed(1) : Math.round(x).toLocaleString('en'));
const MINUS = '−';
// One typography for every module's text: H⁺, O₂, QH₂, CO₂, NH₃, H₂O, bo₃.
const SUB = { 2: '₂', 3: '₃' };
const tidy = (s) =>
  typeof s === 'string'
    ? s.replace(/H\+/g, 'H⁺').replace(/\bH2O\b/g, 'H₂O').replace(/\b(CO|O|QH|NH|bo)([23])\b/g, (_, a, d) => a + SUB[d])
    : '';

function div(cls, html = '') {
  const e = document.createElement('div');
  e.className = cls;
  e.innerHTML = html;
  return e;
}

// The arcs' directions from the cell's centre (ATP's, then Δp's), sampled to keep them off the cell.
const ARC_DIRS = new Float32Array(28);
for (let i = 0; i < 14; i++) {
  const a = (i < 7 ? Math.PI : 0) + ((i % 7) / 6 - 0.5) * SPAN;
  ARC_DIRS[2 * i] = Math.cos(a);
  ARC_DIRS[2 * i + 1] = Math.sin(a);
}

// How far a ray from the origin along (dx, dy) runs before it leaves the stadium of radius r round
// the segment a-b (px). A rod-shaped cell's outline on screen is such a stadium, and the stadium is
// convex, so the ray leaves it where it leaves the last of its pieces (two discs and a rectangle).
function exitDistance(dx, dy, ax, ay, bx, by, r) {
  let t = 0;
  let p = dx * ax + dy * ay;
  let q = p * p - (ax * ax + ay * ay) + r * r;
  if (q >= 0) t = Math.max(t, p + Math.sqrt(q));
  p = dx * bx + dy * by;
  q = p * p - (bx * bx + by * by) + r * r;
  if (q >= 0) t = Math.max(t, p + Math.sqrt(q));
  let ux = bx - ax, uy = by - ay;
  const L = Math.hypot(ux, uy);
  if (L > 1e-6) {
    ux /= L;
    uy /= L;
    const u0 = -(ax * ux + ay * uy), v0 = ax * uy - ay * ux; // the origin in the segment's frame
    const du = dx * ux + dy * uy, dv = dy * ux - dx * uy;
    const tu = du > 1e-9 ? (L - u0) / du : du < -1e-9 ? -u0 / du : Infinity;
    const tv = dv > 1e-9 ? (r - v0) / dv : dv < -1e-9 ? (-r - v0) / dv : Infinity;
    if (u0 >= 0 && u0 <= L && Math.abs(v0) <= r) t = Math.max(t, Math.min(tu, tv));
  }
  return t;
}

// ------------------------------------------------------------------------------- light in the water
// A flat quad facing the camera; vP is the point in the ring's plane (µm, centred on the cell).
const QUAD = new THREE.PlaneGeometry(2, 2);
const VERT = /* glsl */ `
  uniform vec4 uBox;
  varying vec2 vP;
  void main() {
    vP = uBox.xy + position.xy * uBox.zw;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vP, 0.0, 1.0);
  }`;
// Layers are mixed straight-alpha, back to front.
const OVER = /* glsl */ `
  vec4 over(vec3 c, float a, vec4 d) { float o = a + d.a * (1.0 - a); return vec4((c * a + d.rgb * d.a * (1.0 - a)) / max(o, 1e-5), o); }`;

// An arc that fills from its lower end: a solid rod of colour over the filled part, ending in a
// pearl, with a short halo of its own colour. The empty part is not drawn at all (a track would read
// as a pencil line); the readout beside it says how full it is. (A lighter middle would read as two
// dark edges, an outline, so the rod is one colour; light only breathes along it.) Distances are in
// CSS pixels (uPx = µm per pixel at the cell's depth), so it is equally crisp near and far; fwidth
// antialiases by one device pixel.
const ARC_FRAG = /* glsl */ `
  uniform vec3 uCore, uLight;
  uniform float uR, uFrom, uDir, uValue, uPx, uOpacity, uTime;
  varying vec2 vP;
  ${OVER}
  const float PI = 3.14159265;
  vec2 at(float u) { float a = uFrom + uDir * u; return uR * vec2(cos(a), sin(a)); }
  void main() {
    float u = mod((atan(vP.y, vP.x) - uFrom) * uDir + PI, 2.0 * PI) - PI;
    float u1 = uValue * ${SPAN.toFixed(4)};
    vec2 end = at(u1);
    float dF = (u >= 0.0 && u <= u1 ? abs(length(vP) - uR) : min(length(vP - at(0.0)), length(vP - end))) / uPx;
    float dP = length(vP - end) / uPx;
    float aa = max(fwidth(dF), 1e-3) * 0.75;
    float halo = exp(-dF * dF / 18.0) * 0.22 + exp(-dP * dP / 32.0) * 0.25;
    float rod = 1.0 - smoothstep(2.2 - aa, 2.2 + aa, dF);
    float pearl = 1.0 - smoothstep(4.0 - aa, 4.0 + aa, dP);
    // light breathes slowly along the rod toward the pearl
    float flow = 0.5 + 0.5 * sin(u * 14.0 - uTime * 1.4);
    vec3 rodCol = mix(uCore, uLight, 0.12 * flow * smoothstep(0.0, 0.3, u1 - u));
    vec4 c = vec4(uCore, halo);
    c = over(rodCol, rod, c);
    c = over(uCore, pearl, c);
    if (c.a < 0.003) discard;
    gl_FragColor = vec4(c.rgb, c.a * uOpacity);
  }`;

// The scale bar: a solid rod whose rounded ends sit exactly 0.5 µm either side of its centre, on a
// tight paper glow that lifts it off whatever is behind it.
const BAR_FRAG = /* glsl */ `
  uniform vec3 uCore, uPaper;
  uniform vec4 uBox;
  uniform float uPx, uOpacity, uW;
  varying vec2 vP;
  ${OVER}
  void main() {
    vec2 p = vP - uBox.xy;
    float r = uW * uPx;
    vec2 q = vec2(max(abs(p.x) - (0.5 - r), 0.0), p.y);
    float d = (length(q) - r) / uPx;
    float aa = max(fwidth(d), 1e-3) * 0.75;
    float rod = 1.0 - smoothstep(-aa, aa, d);
    float halo = exp(-max(d, 0.0) * max(d, 0.0) / 24.0) * 0.8;
    vec4 c = over(uCore, rod, vec4(uPaper, halo));
    if (c.a < 0.003) discard;
    gl_FragColor = vec4(c.rgb, c.a * uOpacity);
  }`;

function lightMesh(frag, uniforms) {
  const m = new THREE.Mesh(
    QUAD,
    new THREE.ShaderMaterial({
      uniforms: { uBox: { value: new THREE.Vector4() }, uPx: { value: 0.01 }, uOpacity: { value: 0 }, ...uniforms },
      vertexShader: VERT,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      // Over the small things passing in front (the flagella trailing past as the cell swims, a
      // bead), as the readouts beside them are, so an arc or the bar never reads as broken. Cells,
      // drawn after the scene, still veil them.
      depthTest: false,
    }),
  );
  m.frustumCulled = false;
  m.renderOrder = 10;
  m.visible = false;
  return m;
}

function arcMesh(from, dir) {
  return lightMesh(ARC_FRAG, {
    uCore: { value: new THREE.Color() },
    uLight: { value: new THREE.Color() },
    uR: { value: 1 },
    uFrom: { value: from },
    uDir: { value: dir },
    uValue: { value: 0 },
    uTime: { value: 0 },
  });
}

// ------------------------------------------------------------------------------- labels in the water
// A CSS2D label at a point, with an inner block that drifts and can be nudged back into view.
class Floater {
  constructor(cls, parent, cx = 0.5, cy = 0.5) {
    this.outer = div('floater');
    this.inner = div(cls);
    this.outer.appendChild(this.inner);
    this.obj = new CSS2DObject(this.outer);
    this.obj.center.set(cx, cy);
    this.obj.visible = false;
    parent.add(this.obj);
    this.html = null;
    this.alpha = 0;
    this.fresh = true; // the first fade starts where it is going
    this.dirty = true; // its size needs reading
    this.w = 0;
    this.h = 0;
    this.op = '';
    this.tf = '';
    this.phase = Math.random() * 20;
    this.box = { x: 0, y: 0, w: 0, h: 0 };
  }

  set(html) {
    if (html === this.html) return;
    this.inner.innerHTML = this.html = html;
    this.dirty = true;
  }

  fade(goal, dt, tau = 0.3) {
    this.alpha += (goal - this.alpha) * (this.fresh ? 1 : ease(dt, tau));
    this.fresh = false;
    if (goal === 0 && this.alpha < 0.004) this.alpha = 0;
    this.obj.visible = this.alpha > 0.004;
    const op = this.alpha.toFixed(3);
    if (op !== this.op) this.outer.style.opacity = this.op = op;
    return this.obj.visible;
  }

  // Reading a size forces a layout, so it is read only after the text changed (once it is drawn).
  measure() {
    if (!this.dirty || !this.obj.visible || !this.outer.isConnected || this.outer.style.display === 'none') return;
    this.w = this.outer.offsetWidth;
    this.h = this.outer.offsetHeight;
    this.dirty = false;
  }

  // At (x, y) px from the cell's centre on screen (y up), kept inside the window.
  place(x, y, k, time) {
    this.obj.position.set(x * k.upp, y * k.upp, 0);
    const sx = k.cx + x - this.obj.center.x * this.w;
    const sy = k.cy - y - this.obj.center.y * this.h;
    this.keepIn(sx, sy, k.W, k.H, 0, 0, time);
  }

  // The block's top left would be at (sx, sy) (after an offset ox, oy from the anchor): nudge it
  // back inside the window, and remember where it ends up.
  keepIn(sx, sy, W, H, ox, oy, time, amp) {
    const dx = clamp(sx, 10, Math.max(10, W - 10 - this.w)) - sx;
    const dy = clamp(sy, 10, Math.max(10, H - 10 - this.h)) - sy;
    const b = this.box;
    b.x = sx + dx;
    b.y = sy + dy;
    b.w = this.w;
    b.h = this.h;
    this.drift(ox + dx, oy + dy, time, amp);
  }

  drift(dx, dy, time, amp = 1.6) {
    const t = time * 0.55 + this.phase;
    const x = dx + Math.sin(t) * amp;
    const y = dy + Math.sin(t * 0.77 + 1.3) * amp;
    const tf = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    if (tf !== this.tf) this.inner.style.transform = this.tf = tf;
  }
}

// ------------------------------------------------------------------------------- the title plaque
// Canvas text on a quad in the water. The texture holds DISPLAY colours (premultiplied, sRGB); the
// shader decodes them and undoes the tone mapping, so the ink, plum and paper show exactly as drawn.
const PLAQUE = { w: 1408, h: 896, ppu: 256 }; // canvas px, and px per µm: 5.5 × 3.5 µm in the water
const PLAQUE_FRAG = /* glsl */ `
  uniform sampler2D map;
  uniform float uOpacity, uExposure;
  varying vec2 vUv;
  #include <fog_pars_fragment>
  vec3 sceneFromDisplay(vec3 v) {
    v = mix(v / 12.92, pow((v + 0.055) / 1.055, vec3(2.4)), step(0.04045, v));
  #ifdef NEUTRAL
    v *= min(0.97 / max(max(v.r, v.g), max(v.b, 1e-4)), 1.0);
    float P = max(max(v.r, v.g), v.b);
    if (P >= 0.76) {
      float d = 0.24;
      float peak = d * d / (1.0 - P) - d + 0.76;
      float g = 1.0 - 1.0 / (0.15 * (peak - P) + 1.0);
      v = (v - g * P) / (1.0 - g) * (peak / P);
    }
    float m = min(min(v.r, v.g), v.b);
    v += m + 0.04 >= 0.08 ? 0.04 : sqrt(max(m, 0.0) / 6.25) - m;
  #endif
    return v / uExposure;
  }
  void main() {
    // a slight negative bias: the text stays crisp where the mip chain alone would soften it
    vec4 t = texture2D(map, vUv, -0.6);
    if (t.a < 0.003) discard;
    gl_FragColor = vec4(sceneFromDisplay(t.rgb / t.a), t.a * uOpacity);
    #include <fog_fragment>
  }`;

function makePlaque(iconUrl) {
  const c = document.createElement('canvas');
  c.width = PLAQUE.w;
  c.height = PLAQUE.h;
  const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.NoColorSpace;
  tex.premultiplyAlpha = true;
  tex.anisotropy = 8;
  const ink = css(BRAND.ink);
  const PAPER = '242, 239, 233'; // the logo's own paper
  // The logo's letter sits a little right of and below the middle of its square.
  const LOGO = { s: 300, gx: 0.525, gy: 0.62 };
  const DISC = { x: 196, y: 214, r: 150 };
  const lc = document.createElement('canvas');
  lc.width = lc.height = LOGO.s;
  const lg = lc.getContext('2d');
  let icon = null;

  // Text with a tight paper halo hugging the letters (a pixel or two on screen).
  const text = (str, x, y, size, weight, color, halo) => {
    g.font = `${weight} ${size}px ${FONT}`;
    g.save();
    g.shadowColor = `rgb(${PAPER})`;
    g.shadowBlur = halo;
    g.fillStyle = `rgb(${PAPER})`;
    g.fillText(str, x, y);
    g.fillText(str, x, y);
    g.restore();
    g.fillStyle = color;
    g.fillText(str, x, y);
  };
  // A key on a solid mint pebble, white letters (as the engulf prompt beside food). Returns its width.
  const pebble = (str, x, y, size, draw = true) => {
    g.font = `700 ${size}px ${FONT}`;
    const pad = size * 0.44;
    const w = g.measureText(str).width + pad * 2;
    if (!draw) return w;
    const h = size * 1.34;
    g.fillStyle = css(BRAND.mint);
    g.beginPath();
    g.roundRect(x, y - size * 0.99, w, h, h / 2);
    g.fill();
    g.fillStyle = '#ffffff';
    g.fillText(str, x + pad, y);
    return w;
  };

  const draw = () => {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, c.width, c.height);

    // The logo, exactly as drawn, on a small paper disc. Its own paper square fades out inside the
    // disc's solid middle (the same paper), so no corner of the square shows.
    const R = DISC.r * 1.22;
    const gr = g.createRadialGradient(DISC.x, DISC.y, 0, DISC.x, DISC.y, R);
    gr.addColorStop(0, `rgba(${PAPER}, 1)`);
    gr.addColorStop(0.8, `rgba(${PAPER}, 1)`);
    gr.addColorStop(1, `rgba(${PAPER}, 0)`);
    g.fillStyle = gr;
    g.fillRect(DISC.x - R, DISC.y - R, R * 2, R * 2);
    if (icon) {
      const s = LOGO.s, gx = LOGO.gx * s, gy = LOGO.gy * s;
      lg.globalCompositeOperation = 'source-over';
      lg.clearRect(0, 0, s, s);
      lg.drawImage(icon, 0, 0, s, s);
      lg.globalCompositeOperation = 'destination-in';
      const m = lg.createRadialGradient(gx, gy, 0, gx, gy, DISC.r * 0.95);
      m.addColorStop(0, '#000');
      m.addColorStop(0.88, '#000');
      m.addColorStop(1, 'rgba(0, 0, 0, 0)');
      lg.fillStyle = m;
      lg.fillRect(0, 0, s, s);
      lg.globalCompositeOperation = 'source-over';
      g.drawImage(lc, DISC.x - gx, DISC.y - gy);
    }

    // The wordmark leans like the logo's letter.
    const sk = Math.tan(THREE.MathUtils.degToRad(12));
    g.save();
    g.setTransform(1, 0, -sk, 1, 0, 0);
    text('codon', 392 + 300 * sk, 300, 270, 600, ink, 14);
    text('Rewrite life.', 404 + 400 * sk, 400, 80, 500, css(BRAND.plum), 7);
    g.restore();

    // Controls in two columns: each key on its pebble, then what it does, in solid ink.
    const cols = [
      [['W A S D', 'swim'], ['Space / C', 'rise / sink'], ['Q / E', 'roll'], ['F', 'tumble']],
      [['R', 'engulf'], ['Tab', 'inspect'], ['Drag', 'look around'], ['Wheel', 'zoom']],
    ];
    let KEY = 54, WHAT = 60;
    const widths = () =>
      cols.map((col) => {
        const kw = Math.max(...col.map(([k]) => pebble(k, 0, 0, KEY, false)));
        g.font = `500 ${WHAT}px ${FONT}`;
        return [kw, Math.max(...col.map(([, w]) => g.measureText(w).width))];
      });
    let wd = widths();
    const total = () => wd.reduce((s, [kw, dw]) => s + kw + 24 + dw, 0) + 76;
    if (total() > c.width - 110) {
      const f = (c.width - 110) / total();
      KEY *= f;
      WHAT *= f;
      wd = widths();
    }
    let x = 56;
    cols.forEach((col, ci) => {
      const [kw, dw] = wd[ci];
      col.forEach(([k, what], r) => {
        const y = 568 + r * 92;
        pebble(k, x, y, KEY);
        text(what, x + kw + 24, y, WHAT, 500, ink, 6);
      });
      x += kw + 24 + dw + 76;
    });
    tex.needsUpdate = true;
  };
  draw();
  const img = new Image();
  const ready = new Promise((done) => {
    img.onload = () => {
      icon = img;
      draw();
      done();
    };
    img.onerror = done;
  });
  img.src = iconUrl;
  document.fonts?.ready?.then(draw);

  const mat = new THREE.ShaderMaterial({
    uniforms: { ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog), map: { value: tex }, uOpacity: { value: 1 }, uExposure: { value: LOOK.exposure } },
    defines: LOOK.toneMapping === 'Neutral' ? { NEUTRAL: '' } : {},
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,
    fragmentShader: PLAQUE_FRAG,
    transparent: true,
    depthWrite: false,
    fog: true,
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(PLAQUE.w / PLAQUE.ppu, PLAQUE.h / PLAQUE.ppu), mat);
  m.renderOrder = 6;
  m.userData.ready = ready;
  m.userData.redraw = draw;
  return m;
}

// ------------------------------------------------------------------------------- the HUD
export class Hud {
  constructor(scene, hero, iconUrl, { metabolism = null, feeding = null } = {}) {
    this.scene = scene;
    this.hero = hero;
    this.metabolism = metabolism;
    this.feeding = feeding;
    this.time = 0;
    this.first = true;
    this.vis = 1; // dims a touch while swimming
    this.inspectVis = 0;
    this.master = 1; // show(): the whole interface
    this.masterGoal = 1;
    this.masterRate = 1;
    this.savedDistance = null;
    this.barExtra = ''; // appended to the scale bar's line (a later "generations" count)

    // Where the cell is on screen this frame (reused, nothing is allocated per frame).
    this.k = { upp: 0.01, W: 1, H: 1, cx: 0, cy: 0, nx: 0, ny: 0, depth: 1, rpx: RING_MIN_PX };
    this.outline = { need: 0, above: 0, below: 0 };
    this.rpx = null;
    this.fit = 1; // 1 while the arcs fit round the cell inside the window
    this.fitGoal = 1;

    // The vitals ring faces the camera at the cell's centre, so a length in it is a true length at
    // the cell's depth.
    this.ring = new THREE.Group();
    scene.add(this.ring);
    this.atpArc = arcMesh(Math.PI + SPAN / 2, -1); // left, filling upward
    this.pmfArc = arcMesh(-SPAN / 2, 1); // right, filling upward
    this.bar = lightMesh(BAR_FRAG, {
      uCore: { value: sceneColor(HEX.bar) },
      uPaper: { value: sceneColor(HEX.paper) },
      uW: { value: 1.9 },
    });
    this.ring.add(this.atpArc, this.pmfArc, this.bar);
    this.col = {};
    for (const k of ['atp', 'pmf', 'warn']) this.col[k] = HEX[k].map((h) => sceneColor(h));
    this.shown = { atp: null, pmf: null, frac: null };
    this.said = { atp: null, pmf: null, bar: null, note: null }; // what the readouts show now

    this.atpLabel = new Floater('vital atp paper', this.ring, 1, 0.5);
    this.pmfLabel = new Floater('vital pmf paper', this.ring, 0, 0.5);
    this.barLabel = new Floater('barlabel paper', this.ring, 0.5, 0);
    this.note = new Floater('note paper', this.ring, 0.5, 1);
    this.legend = new Floater('panel legend paper', this.ring, 1, 0);
    this.ledger = new Floater('panel ledger paper', this.ring, 0, 0);
    this.legendRows = null;
    this.legendSource = null;
    this.legendOn = [];
    this.legendClock = [];
    this.legendSettle = 0;
    this.buildLedger();

    // Inspect tags and the engulf prompt sit at world points.
    this.tagRoot = new THREE.Group();
    scene.add(this.tagRoot);
    this.tags = new Map(); // anchor -> tag
    this.tagList = [];
    this.live = [];
    this.cands = [];
    this.boxes = [];
    this.synced = [null, null, null];
    this.syncedLength = [-1, -1, -1];
    this.focus = null;
    this.tourClock = 0;
    this.prompt = new Floater('prompt paper', this.tagRoot, 0, 0.5);
    this.promptPos = new THREE.Vector3();
    this.promptText = null;
    this.floaters = [this.atpLabel, this.pmfLabel, this.barLabel, this.note, this.legend, this.ledger, this.prompt];

    this.plaque = makePlaque(iconUrl);
    this.ready = this.plaque.userData.ready; // resolves once the logo has loaded
    scene.add(this.plaque);

    // The pointer opens the description it rests near; dragging (orbiting the camera) doesn't.
    this.pointer = { x: 0, y: 0, at: -1e9 };
    this.onPointer = (e) => {
      if (e.buttons) return;
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.at = performance.now();
    };
    addEventListener('pointermove', this.onPointer);
    // Text sizes change when a font arrives.
    this.onFonts = () => {
      for (const f of this.floaters) f.dirty = true;
      for (const t of this.tags.values()) t.m0 = t.m1 = false;
      this.plaque.userData.redraw();
    };
    document.fonts?.addEventListener?.('loadingdone', this.onFonts);
  }

  // Hide or bring in the whole interface over `fade` seconds (0: at once).
  show(visible = true, fade = 0.6) {
    this.masterGoal = visible ? 1 : 0;
    this.masterRate = fade > 0 ? 1 / fade : Infinity;
    if (!(fade > 0)) this.master = this.masterGoal;
  }

  // Where the 1 µm bar is on screen, as of the last update(): out.x, out.y the middle of its line
  // (CSS px), out.z its length (CSS px). The opening's stepping scale bar settles onto it in the
  // hand-over, so the one becomes the other in place.
  barPlace(out) {
    const k = this.k, box = this.bar.material.uniforms.uBox.value;
    return out.set(k.cx, k.cy - box.y / k.upp, 1 / k.upp);
  }

  // The title hangs in the water 8 µm beyond the cell, its top left corner near the top left of the
  // starting view, clear of the ring (smaller on narrow windows).
  placePlaque(camera, target) {
    camera.updateMatrixWorld();
    const D = camera.position.distanceTo(target) + 8;
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * D;
    const halfW = halfH * camera.aspect;
    const s = clamp(camera.aspect / 1.7, 0.6, 1);
    const w = (PLAQUE.w / PLAQUE.ppu) * s, h = (PLAQUE.h / PLAQUE.ppu) * s;
    const fwd = camera.getWorldDirection(_a);
    const right = _b.setFromMatrixColumn(camera.matrixWorld, 0);
    const up = _c.setFromMatrixColumn(camera.matrixWorld, 1);
    this.plaque.position.copy(camera.position).addScaledVector(fwd, D).addScaledVector(right, -halfW * 0.93 + w / 2).addScaledVector(up, halfH * 0.93 - h / 2);
    this.plaque.quaternion.copy(camera.quaternion);
    this.plaque.scale.setScalar(s);
  }

  // Inspecting eases the camera in close; leaving eases it back to where it was.
  zoom(dt, camera, target, inspect) {
    const off = _a.copy(camera.position).sub(target);
    const d = off.length();
    let goal;
    if (inspect) {
      if (this.savedDistance === null) this.savedDistance = d;
      goal = INSPECT_DISTANCE;
    } else if (this.savedDistance !== null) {
      goal = this.savedDistance;
      if (Math.abs(d - goal) < 0.02) this.savedDistance = null;
    } else return;
    camera.position.copy(target).addScaledVector(off.normalize(), d + (goal - d) * ease(dt, 0.35));
  }

  update(dt, camera, player, mState, fState) {
    player = player || {};
    mState = mState || {};
    fState = fState || {};
    dt = Number.isFinite(dt) ? Math.max(dt, 0) : 0;
    this.time += dt;
    const step = this.masterRate * dt;
    this.master = this.master < this.masterGoal ? Math.min(this.masterGoal, this.master + step) : Math.max(this.masterGoal, this.master - step);
    const master = smooth(this.master, 0, 1);
    const moving = (player.thrust ?? 0) > 0.15 || (player.tumble ?? 0) > 0;
    this.vis += ((moving ? 0.92 : 1) - this.vis) * ease(dt, 0.4);
    this.inspectVis += ((player.inspect ? 1 : 0) - this.inspectVis) * (this.first ? 1 : ease(dt, 0.25));

    // Where the cell is on screen, and how many µm a CSS pixel is at its depth.
    camera.updateMatrixWorld();
    const k = this.k;
    k.W = innerWidth;
    k.H = innerHeight;
    const centre = this.hero.group.getWorldPosition(_c);
    camera.getWorldDirection(_f);
    k.depth = Math.max(_a.copy(centre).sub(camera.position).dot(_f), 0.05);
    k.upp = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * k.depth) / (camera.zoom * k.H);
    _a.copy(centre).project(camera);
    k.nx = _a.x;
    k.ny = _a.y;
    k.cx = (_a.x + 1) * 0.5 * k.W;
    k.cy = (1 - _a.y) * 0.5 * k.H;
    this.layoutRing(dt, camera, k);

    // The ring rides on the cell, facing the camera, bobbing very gently.
    const t = this.time;
    this.ring.quaternion.copy(camera.quaternion);
    this.ring.position.copy(centre);
    _a.set(Math.sin(t * 0.41) * 1.2, Math.sin(t * 0.33 + 2) * 1.5, 0).multiplyScalar(k.upp).applyQuaternion(camera.quaternion);
    this.ring.position.add(_a);

    this.updateVitals(dt, k, mState, player, master);
    this.updateInspect(dt, k, mState, fState, master);
    this.updatePrompt(dt, camera, k, fState, master);
    this.updateTags(dt, camera, k, master);
    this.updatePlaque(camera, master);
    this.first = false;
  }

  // ----------------------------------------------------------------------------- ring layout
  // The cell's outline on screen: a stadium round its projected axis, as wide as its radius at the
  // nearer pole (a little over, as the cell flows). `need` is the smallest ring radius that keeps
  // every part of both arcs clear of it.
  cellOutline(camera, k) {
    const o = this.outline;
    const hero = this.hero, body = hero.body;
    if (!body) {
      o.need = o.above = o.below = 0;
      return;
    }
    body.updateWorldMatrix(true, false);
    const s = _s.setFromMatrixScale(body.matrixWorld).x;
    const Hc = (hero.H ?? 0.5) * 1.06, Rc = (hero.R ?? 0.5) * 1.06 * s;
    let rho = 0;
    for (let e = 0; e < 2; e++) {
      _a.set(0, 0, e ? -Hc : Hc).applyMatrix4(body.matrixWorld);
      const d = _b.copy(_a).sub(camera.position).dot(_f);
      _a.project(camera);
      _ends[2 * e] = (_a.x - k.nx) * 0.5 * k.W;
      _ends[2 * e + 1] = (_a.y - k.ny) * 0.5 * k.H;
      rho = Math.max(rho, d > 0.05 ? (Rc * k.depth) / (k.upp * d) : 1e5);
    }
    const ax = _ends[0], ay = _ends[1], bx = _ends[2], by = _ends[3];
    let need = 0;
    for (let i = 0; i < 14; i++) need = Math.max(need, exitDistance(ARC_DIRS[2 * i], ARC_DIRS[2 * i + 1], ax, ay, bx, by, rho + CLEAR_PX));
    o.need = need;
    o.above = Math.max(ay, by) + rho;
    o.below = Math.max(-ay, -by) + rho;
  }

  // The ring is 1.3 µm out at ordinary distances; close up it shrinks to fit the window but never
  // into the cell. When even that can't fit, the arcs fade and the readouts move down by the bar.
  layoutRing(dt, camera, k) {
    this.cellOutline(camera, k);
    const need = this.outline.need;
    const roomX = Math.min(k.cx - 26 - (this.atpLabel.w || 90), k.W - k.cx - 26 - (this.pmfLabel.w || 125));
    const roomY = (Math.min(k.cy, k.H - k.cy) - 14) / REACH;
    const room = Math.min(roomX, roomY);
    const goal = Math.max(Math.min(Math.max(RING / k.upp, RING_MIN_PX), room), need);
    this.rpx = this.rpx === null ? goal : this.rpx + (goal - this.rpx) * ease(dt, 0.25);
    this.rpx = Math.max(this.rpx, need);
    this.fitGoal = need <= room + (this.fitGoal ? 6 : -6) ? 1 : 0;
    this.fit = this.first ? this.fitGoal : this.fit + (this.fitGoal - this.fit) * ease(dt, 0.3);
    k.rpx = this.rpx;
  }

  // ----------------------------------------------------------------------------- vitals
  updateVitals(dt, k, m, player, master) {
    const { upp, rpx } = k;
    const R = rpx * upp;
    const margin = 16 * upp;
    const atp = num(m.atp);
    const pmf = num(m.pmf);
    const frac = num(m.pmfFraction) ?? (pmf === null ? null : clamp(-pmf / 200, 0, 1));
    const sh = this.shown;
    const kk = this.first ? 1 : ease(dt, 0.3);
    if (atp !== null) sh.atp = sh.atp === null ? atp : sh.atp + (atp - sh.atp) * kk;
    if (pmf !== null) sh.pmf = sh.pmf === null ? pmf : sh.pmf + (pmf - sh.pmf) * kk;
    if (frac !== null) sh.frac = sh.frac === null ? frac : sh.frac + (frac - sh.frac) * kk;

    // The arcs: gone while inspecting (the readouts stay) and when they can't fit round the cell.
    const alpha = master * this.vis * (1 - this.inspectVis) * this.fit;
    this.setArc(this.atpArc, R, upp, margin, sh.atp, this.col.atp, 1 - smooth(sh.atp ?? 1, 0.1, 0.25), alpha * (atp === null ? 0 : 1));
    this.setArc(this.pmfArc, R, upp, margin, sh.frac, this.col.pmf, 1 - smooth(sh.frac ?? 1, 0.25, 0.45), alpha * (frac === null ? 0 : 1));

    // The bar sits in the gap at the bottom of the ring, or higher if the window ends first, but
    // always below the cell when there is room for it.
    const roomBelow = k.H - k.cy - 40;
    const by = Math.min(Math.max(Math.min(rpx - 4, roomBelow), this.outline.below + 16), roomBelow);
    const u = this.bar.material.uniforms;
    u.uBox.value.set(0, -by * upp, 0.5 + margin, margin);
    u.uPx.value = upp;
    u.uOpacity.value = master * this.vis;
    this.bar.visible = u.uOpacity.value > 0.003;

    // Readouts beside the arcs, or beside the bar while the arcs are away.
    const label = master * (0.85 + 0.15 * this.vis);
    const f = this.fit, side = 0.5 / upp + 18;
    if (this.atpLabel.fade(atp === null ? 0 : label, dt)) {
      const v = Math.round((sh.atp ?? 0) * 100);
      if (v !== this.said.atp) this.atpLabel.set(`<span class="k">ATP</span><span class="v">${(this.said.atp = v)}%</span>`);
      this.atpLabel.place(-lerp(side, rpx + 14, f), lerp(-by, 0, f), k, this.time);
    }
    if (this.pmfLabel.fade(pmf === null ? 0 : label, dt)) {
      const mv = Math.round(sh.pmf ?? 0);
      if (mv !== this.said.pmf) this.pmfLabel.set(`<span class="k">Δp</span><span class="v">${(this.said.pmf = mv) < 0 ? MINUS + -mv : mv} mV</span>`);
      this.pmfLabel.place(lerp(side, rpx + 14, f), lerp(-by, 0, f), k, this.time);
    }
    if (this.barLabel.fade(label, dt)) {
      const line = `${Math.max(0, num(player.speed) ?? 0).toFixed(1)}|${this.barExtra}`;
      if (line !== this.said.bar) {
        this.said.bar = line;
        const extra = this.barExtra ? `<i></i><span>${this.barExtra}</span>` : '';
        this.barLabel.set(`<b>1 µm</b><i></i><span>${line.slice(0, line.indexOf('|'))} µm/s</span>${extra}`);
      }
      this.barLabel.place(0, -by - 9, k, this.time);
    }

    // The note above the cell (above the ring, or as high as the window allows).
    const note = this.modeNote(m);
    if (note && note.html !== this.said.note) this.note.set((this.said.note = note.html));
    if (this.note.fade(note ? label : 0, dt, 0.4) && this.said.note) {
      const top = k.cy - 12 - this.note.h;
      this.note.place(0, Math.min(Math.max(Math.min(rpx - 2, top), this.outline.above + 12), top), k, this.time);
    }
  }

  setArc(mesh, R, upp, margin, value, [core, light], warn, alpha) {
    const u = mesh.material.uniforms;
    mesh.visible = alpha > 0.003;
    if (!mesh.visible) return;
    // the bounding box of an arc spanning ±SPAN/2 about the horizontal, plus room for its halo
    const x0 = Math.cos(SPAN / 2) * R, y1 = REACH * R;
    const sx = u.uDir.value < 0 ? -1 : 1;
    u.uBox.value.set((sx * (x0 + R)) / 2, 0, (R - x0) / 2 + margin, y1 + margin);
    u.uR.value = R;
    u.uPx.value = upp;
    u.uValue.value = clamp(value ?? 0, 0, 1);
    u.uTime.value = this.time;
    u.uOpacity.value = alpha;
    u.uCore.value.copy(core).lerp(this.col.warn[0], warn);
    u.uLight.value.copy(light).lerp(this.col.warn[1], warn);
  }

  // The note above the cell: why it isn't respiring normally (the metabolism's own words when it
  // gives them), or that the gradient driving the motors is running down; and what to do about it.
  // Oxygen comes in from the drop's surface, so rising is the way out of low oxygen.
  modeNote(m) {
    const mode = typeof m.mode === 'string' ? m.mode : 'respiration';
    let text = typeof m.modeNote === 'string' && m.modeNote ? m.modeNote : null;
    let tone = mode === 'fermentation' ? 'ferment' : 'low';
    if (!text && mode === 'fermentation') text = 'Almost no oxygen: fermenting · ATP synthase runs backwards to hold Δp';
    if (!text && mode === 'low-oxygen') text = 'Low oxygen: cytochrome bd takes over · fewer H⁺ per NADH';
    let act = text && (mode === 'fermentation' || mode === 'low-oxygen') ? '<kbd>Space</kbd>rise toward the surface' : '';
    if (!text && num(m.motorPower) !== null && m.motorPower < 0.55 && mode === 'respiration') {
      text = 'Gradient running down: motor speed follows Δp';
      tone = 'weak';
      act = 'find glucose';
    }
    if (!text) return null;
    if (text !== this.noteText || act !== this.noteAct) {
      this.noteText = text;
      this.noteAct = act;
      const i = text.indexOf(':');
      const title = i > 0 ? text.slice(0, i) : text, sub = i > 0 ? text.slice(i + 1).trim() : '';
      this.noteCache = { html: `<b class="${tone}">${tidy(title)}</b>${sub ? `<span>${tidy(sub)}</span>` : ''}${act ? `<em>${act}</em>` : ''}` };
    }
    return this.noteCache;
  }

  // ----------------------------------------------------------------------------- inspect panels
  buildLedger() {
    // The metabolism counts in beads, each a quantum of about 10⁴ molecules (a real E. coli makes on
    // the order of 10⁶ ATP a second), so the units say beads.
    this.ledger.set(
      '<div class="cap">Ledger</div>' +
        [['glc', 'glucose in', 'beads/min'], ['atp', 'ATP made', 'beads/s'], ['o2', 'O₂ here', '% air sat.'], ['co2', 'CO₂ out', 'beads']]
          .map(([key, k, unit]) => `<div class="row"><span class="k">${k}</span><span class="v" data-v="${key}">–</span><span class="u">${unit}</span></div>`)
          .join('') +
        '<div class="foot">1 bead ≈ 10⁴ molecules · the clock runs slow, and swimming costs more than in life</div>',
    );
    this.ledgerValues = {};
    for (const e of this.ledger.inner.querySelectorAll('[data-v]')) this.ledgerValues[e.dataset.v] = { e, text: '–' };
  }

  setValue(key, text) {
    const v = this.ledgerValues[key];
    if (v.text !== text) v.e.textContent = v.text = text;
  }

  updateInspect(dt, k, m, f, master) {
    const a = master * this.inspectVis;
    const legend = this.metabolism?.legend;
    if (Array.isArray(legend) && legend.length && legend !== this.legendSource) {
      this.legendSource = legend;
      this.legend.set(
        '<div class="cap">Beads</div>' +
          legend.map((l) => `<div class="row off"><span class="bead" style="--c:${css(l.css ?? l.color ?? '#888')}"></span><span>${tidy(l.label ?? l.key)}</span></div>`).join(''),
      );
      this.legendRows = [...this.legend.inner.querySelectorAll('.row')];
      this.legendOn = this.legendRows.map(() => false);
      this.legendClock = this.legendRows.map(() => 0);
    }
    // A row shows the beads in the cell now (all of them when the metabolism doesn't count them).
    // A row comes in once its beads have been there 0.3 s and stays 5 s after the last one leaves,
    // so a count flickering between 0 and 1 doesn't make the panel breathe.
    let any = false;
    const rows = this.legendRows, src = this.legendSource;
    if (rows) {
      for (let i = 0; i < rows.length; i++) {
        const count = src[i]?.count;
        const here = typeof count !== 'number' || count > 0;
        const on = this.legendOn[i];
        this.legendClock[i] = here === on ? 0 : this.legendClock[i] + dt;
        if (here !== on && (this.legendClock[i] >= (on ? 5 : 0.3) || this.first || typeof count !== 'number')) {
          this.legendOn[i] = here;
          this.legendClock[i] = 0;
          rows[i].classList.toggle('off', !here);
          this.legendSettle = 0.5; // its height eases for 0.4 s: measure it until then
        }
        any ||= this.legendOn[i];
      }
    }
    if (this.legendSettle > 0) {
      this.legendSettle -= dt;
      this.legend.dirty = true;
    }
    if (this.legend.fade(any ? a : 0, dt)) {
      this.legend.place(-(k.rpx + 18), -30, k, this.time);
    }

    if (this.ledger.fade(a, dt)) {
      const r = m.rates ?? {};
      this.setValue('glc', fmt(num(r.glucosePerMin)));
      this.setValue('atp', fmt(num(r.atpPerSec)));
      this.setValue('o2', num(f.oxygen) === null ? '–' : String(Math.round(f.oxygen * 100)));
      this.setValue('co2', num(m.totals?.co2) === null ? '–' : Math.round(m.totals.co2).toLocaleString('en'));
      this.ledger.place(k.rpx + 18, -30, k, this.time);
    }
    for (const fl of this.floaters) fl.measure();
  }

  // ----------------------------------------------------------------------------- engulf prompt
  updatePrompt(dt, camera, k, f, master) {
    const text = typeof f.prompt === 'string' && f.prompt ? f.prompt : null;
    const anchor = f.promptAnchor;
    let has = !!text && !!(anchor?.isVector3 || anchor?.isObject3D);
    if (has) {
      if (anchor.isVector3) this.promptPos.copy(anchor);
      else anchor.getWorldPosition(this.promptPos);
      if (text !== this.promptText) {
        this.promptText = text;
        const mm = /^\s*(\S{1,6})\s*[·:]\s*(.+)$/.exec(text);
        this.prompt.set(mm ? `<span class="key">${mm[1]}</span><span class="act">${mm[2]}</span>` : `<span class="act">${text}</span>`);
      }
    }
    _a.copy(this.promptPos).project(camera);
    if (_a.z > 1) has = false; // behind the camera
    this.prompt.obj.position.copy(this.promptPos);
    if (this.prompt.fade(has ? master : 0, dt, 0.15)) {
      // beside the particle, up and to the right, kept inside the window
      const sx = (_a.x + 1) * 0.5 * k.W, sy = (1 - _a.y) * 0.5 * k.H;
      this.prompt.keepIn(sx + 16, sy - 14 - this.prompt.h / 2, k.W, k.H, 16, -14, this.time, 1.2);
    }
  }

  // ----------------------------------------------------------------------------- inspect tags
  // The tag list changes only when an anchors array is swapped or grows; titles are checked per tag.
  syncTags() {
    const lists = _lists;
    lists[0] = this.hero.anchors;
    lists[1] = this.metabolism?.anchors;
    lists[2] = this.feeding?.anchors;
    let same = true;
    for (let i = 0; i < 3; i++) {
      const l = Array.isArray(lists[i]) ? lists[i] : null;
      const n = l ? l.length : -1;
      if (l !== this.synced[i] || n !== this.syncedLength[i]) same = false;
      this.synced[i] = l;
      this.syncedLength[i] = n;
    }
    if (same) return;
    const seen = new Set();
    for (const list of this.synced) {
      if (!list) continue;
      for (const a of list) {
        if (!a?.obj?.isObject3D) continue;
        seen.add(a);
        if (!this.tags.has(a)) this.tags.set(a, this.makeTag(a));
      }
    }
    for (const [a, tag] of this.tags) {
      if (seen.has(a)) continue;
      this.tagRoot.remove(tag.obj);
      tag.el.remove();
      this.tags.delete(a);
      if (this.focus === tag) this.focus = null;
    }
    this.tagList = [...this.tags.values()];
  }

  makeTag(a) {
    let inCell = false;
    for (let p = a.obj; p; p = p.parent) if (p === this.hero.group) inCell = true;
    const el = div(`tag${inCell ? ' in' : ''}`, '<span class="dot"></span><span class="txt"><b></b><i></i></span>');
    const obj = new CSS2DObject(el);
    obj.visible = false;
    this.tagRoot.add(obj);
    const pr = PRIORITY.indexOf(a.key);
    // Which side of its pin a name tries first: left or right as the anchor's angle says, then the
    // other, then above and below.
    const ang = THREE.MathUtils.degToRad(Number.isFinite(a.angle) ? a.angle : -40);
    const lr = Math.cos(ang) >= 0 ? [0, 1] : [1, 0];
    const ud = Math.sin(ang) < 0 ? [2, 3] : [3, 2];
    return {
      a, el, obj, inCell,
      txt: el.querySelector('.txt'), b: el.querySelector('b'), i: el.querySelector('i'),
      title: null, sub: null,
      prio: pr < 0 ? PRIORITY.length : pr,
      sides: [...lr, ...ud],
      alpha: 0, want: 0, score: 0, placed: false, wasPlaced: false,
      w0: 0, h0: 0, w1: 0, h1: 0, m0: false, m1: false,
      sx: 0, sy: 0, bx: 0, by: 0, w: 0, h: 0,
      cand: { x: 0, y: 0, w: 0, h: 0, side: 0 },
      goal: { x: 0, y: 0, w: 0, h: 0, side: -1 },
      align: '', op: '', tf: '', focus: false, focusClass: false, noRoom: -1,
    };
  }

  retitle(tag) {
    const a = tag.a;
    tag.title = a.title;
    tag.sub = a.sub;
    tag.b.textContent = tidy(a.title);
    tag.i.textContent = tidy(a.sub);
    tag.m0 = tag.m1 = false;
    // a guess at its size until it has been drawn and measured
    const n = tag.b.textContent.length, d = tag.i.textContent.length;
    tag.w0 = 6 + 7.4 * n;
    tag.h0 = NAME_LINE;
    tag.w1 = Math.min(230, Math.max(tag.w0, 6.3 * d));
    tag.h1 = NAME_LINE + 1 + 15.5 * Math.ceil((6.3 * d) / 230);
  }

  updateTags(dt, camera, k, master) {
    this.syncTags();
    const show = master * this.inspectVis;
    const live = this.live;
    live.length = 0;
    for (const tag of this.tagList) {
      if (show < 0.003 && tag.alpha < 0.003) {
        tag.obj.visible = false;
        tag.alpha = 0;
        tag.placed = tag.wasPlaced = tag.focus = false;
        continue;
      }
      live.push(tag);
    }
    if (!live.length) {
      this.focus = null;
      return;
    }

    const body = this.hero.body;
    body.updateWorldMatrix(true, false);
    _inv.copy(body.matrixWorld).invert();
    _toCam.copy(camera.position).sub(this.hero.group.getWorldPosition(_c)).normalize();
    const W = k.W, H = k.H;

    // Where each pin is and whether it should show: parts on the far side of the cell's surface
    // hide (they don't ghost), parts inside it show through the clear jelly.
    for (const tag of live) {
      if (tag.title !== tag.a.title || tag.sub !== tag.a.sub) this.retitle(tag);
      const o = tag.a.obj;
      o.updateWorldMatrix(true, false);
      tag.obj.position.setFromMatrixPosition(o.matrixWorld);
      let want = show * (this.inScene(o) ? 1 : 0);
      if (want > 0) want *= tag.inCell ? this.facing(tag.obj.position, tag.a.interior) : 1 - smooth(tag.obj.position.distanceTo(camera.position), 11.5, 12.5);
      _a.copy(tag.obj.position).project(camera);
      tag.sx = (_a.x + 1) * 0.5 * W;
      tag.sy = (1 - _a.y) * 0.5 * H;
      const edge = tag.wasPlaced ? 4 : 16; // a pin near the edge must come well inside to appear
      if (_a.z > 1 || tag.sx < edge || tag.sx > W - edge || tag.sy < edge || tag.sy > H - edge) want = 0;
      tag.want = want;
      // sizes closed (the name) and open (with its description), read once each after drawing
      if (tag.obj.visible && tag.el.style.display !== 'none' && tag.el.isConnected) {
        if (tag.focusClass && !tag.m1) {
          tag.w1 = tag.txt.offsetWidth;
          tag.h1 = tag.txt.offsetHeight;
          tag.m1 = true;
        } else if (!tag.focusClass && !tag.m0) {
          tag.w0 = tag.txt.offsetWidth;
          tag.h0 = tag.txt.offsetHeight;
          tag.m0 = true;
        }
      }
    }

    this.pickFocus(dt, live);

    // A few names at a time (the most important, and those near the pointer), each right beside its
    // pin; none covers another name, another pin or a panel. A name already showing keeps its side
    // while it still fits; a new one needs clear space round it. One that finds no room hides.
    const cands = this.cands;
    cands.length = 0;
    const pointing = performance.now() - this.pointer.at < 2500;
    for (const t of live) {
      t.placed = false;
      if (t.want <= 0.02) continue;
      // a name showing keeps its slot unless a far more important one (or the pointer) wants it
      let s = t.prio - (t.wasPlaced ? 6 : 0) - (t.focus ? 100 : 0);
      if (pointing) s -= 10 * (1 - smooth(Math.hypot(this.pointer.x - t.sx, this.pointer.y - t.sy), 50, 240));
      t.score = s;
      cands.push(t);
    }
    cands.sort(byScore);
    const most = W * H > 1.4e6 ? 10 : W * H > 7e5 ? 9 : 8;
    this.pins = Math.min(most, cands.length);
    const boxes = this.boxes;
    boxes.length = 0;
    for (const fl of this.floaters) if (fl.obj.visible && fl.box.w) boxes.push(fl.box);
    let placed = 0;
    for (let i = 0; i < cands.length && placed < most; i++) {
      const tag = cands[i];
      if (this.pinCovered(tag)) continue;
      if (tag.focus) {
        if (this.placeTag(tag, tag.w1, tag.h1, k)) {
          placed++;
          continue;
        }
        // an open description with no room closes again, and the tour passes it by a while
        tag.focus = false;
        tag.noRoom = this.time + 20;
        this.focus = null;
      }
      if (this.placeTag(tag, tag.w0, tag.h0, k)) placed++;
    }

    for (const tag of live) {
      tag.wasPlaced = tag.placed;
      const goal = tag.placed ? tag.want : 0;
      tag.alpha += (goal - tag.alpha) * ease(dt, 0.2);
      if (goal === 0 && tag.alpha < 0.004) tag.alpha = 0;
      tag.obj.visible = tag.alpha > 0.004;
      if (!tag.obj.visible) continue;
      const op = tag.alpha.toFixed(2);
      if (op !== tag.op) tag.el.style.opacity = tag.op = op;
      if (tag.placed) {
        const gx = tag.goal.x - tag.sx, gy = tag.goal.y - tag.sy;
        const snap = tag.alpha < 0.05;
        tag.bx = snap ? gx : tag.bx + (gx - tag.bx) * ease(dt, 0.12);
        tag.by = snap ? gy : tag.by + (gy - tag.by) * ease(dt, 0.12);
        const align = ALIGN[tag.goal.side];
        if (tag.align !== align) tag.txt.dataset.align = tag.align = align;
      }
      const tf = `translate(${tag.bx.toFixed(1)}px, ${tag.by.toFixed(1)}px)`;
      if (tf !== tag.tf) tag.txt.style.transform = tag.tf = tf;
      if (tag.focusClass !== tag.focus) {
        tag.el.classList.toggle('focus', tag.focus);
        tag.focusClass = tag.focus;
      }
    }
  }

  // A pin already under a name or a panel doesn't get a name of its own.
  pinCovered(tag) {
    for (const b of this.boxes) if (b.x < tag.sx + PIN && tag.sx - PIN < b.x + b.w && b.y < tag.sy + PIN && tag.sy - PIN < b.y + b.h) return true;
    return false;
  }

  placeTag(tag, w, h, k) {
    tag.w = w;
    tag.h = h;
    const keep = tag.wasPlaced ? tag.goal.side : -1;
    for (let i = keep < 0 ? 0 : -1; i < 4; i++) {
      const side = i < 0 ? keep : tag.sides[i];
      if (i >= 0 && side === keep) continue;
      const box = this.tagBox(tag, side, w, h, k);
      if (!box || this.blocked(box, tag, i < 0 ? 0 : 5)) continue;
      const g = tag.goal;
      g.x = box.x;
      g.y = box.y;
      g.w = w;
      g.h = h;
      g.side = side;
      this.boxes.push(g);
      tag.placed = true;
      return true;
    }
    return false;
  }

  // The name's box on one side of its pin (0 right, 1 left, 2 above, 3 below), its first line level
  // with the pin; null when it would leave the window (a name never slides away from its pin).
  tagBox(tag, side, w, h, k) {
    const b = tag.cand;
    const off = PIN + PIN_GAP;
    if (side === 0 || side === 1) {
      b.x = side === 0 ? tag.sx + off : tag.sx - off - w;
      b.y = tag.sy - NAME_LINE / 2;
    } else {
      b.x = tag.sx - w / 2;
      b.y = side === 2 ? tag.sy - off + 2 - h : tag.sy + off - 2;
    }
    b.w = w;
    b.h = h;
    b.side = side;
    return b.x >= 8 && b.y >= 8 && b.x + w <= k.W - 8 && b.y + h <= k.H - 8 ? b : null;
  }

  // An open description only keeps clear of the panels; names whose pins it covers wait.
  blocked(box, tag, pad) {
    for (const b of this.boxes) if (hit(b, box, pad)) return true;
    if (tag.focus) return false;
    for (let i = 0; i < this.pins; i++) {
      const t = this.cands[i];
      if (t === tag) continue;
      _pin.x = t.sx - 6;
      _pin.y = t.sy - 6;
      if (hit(_pin, box, pad)) return true;
    }
    return false;
  }

  // One tag at a time opens its description: the one nearest the pointer while it moves, otherwise
  // each in turn (by priority).
  focusable(t) {
    return t.wasPlaced && t.want > 0.3 && t.noRoom < this.time;
  }

  pickFocus(dt, live) {
    let focus = this.focus && live.includes(this.focus) && this.focusable(this.focus) ? this.focus : null;
    if (performance.now() - this.pointer.at < 2500) {
      let best = 110;
      for (const t of live) {
        if (!this.focusable(t)) continue;
        const d = Math.min(Math.hypot(this.pointer.x - t.sx, this.pointer.y - t.sy), boxDistance(t.goal, this.pointer.x, this.pointer.y));
        if (d < best) {
          best = d;
          focus = t;
        }
      }
      this.tourClock = 0;
    } else {
      this.tourClock += dt;
      if (!focus || this.tourClock > TOUR) {
        this.tourClock = 0;
        // the next by priority after the open one, wrapping round
        const after = focus ? focus.prio : -Infinity;
        let next = null, first = null;
        for (const t of live) {
          if (!this.focusable(t)) continue;
          if (!first || t.prio < first.prio) first = t;
          if (t.prio > after && (!next || t.prio < next.prio)) next = t;
        }
        focus = next ?? first;
      }
    }
    for (const t of live) t.focus = t === focus;
    this.focus = focus;
  }

  inScene(o) {
    let p = o;
    for (; p.parent; p = p.parent) if (!p.visible) return false;
    return p.visible && p === this.scene;
  }

  // Parts on the far side of the cell's surface hide; parts inside it show through the clear jelly.
  facing(pos, interior) {
    if (interior) return 1;
    const hero = this.hero;
    _l.copy(pos).applyMatrix4(_inv);
    const Hc = hero.H ?? 0.5;
    _n.set(_l.x, _l.y, _l.z - clamp(_l.z, -Hc, Hc));
    const r = _n.length();
    if (r > (hero.R ?? 0.5) + 0.35 || r < 0.1) return 1; // well outside (a flagellum's tip), or on the axis
    _n.divideScalar(r).transformDirection(hero.body.matrixWorld);
    return smooth(_n.dot(_toCam), 0, 0.08);
  }

  // ----------------------------------------------------------------------------- title
  updatePlaque(camera, master) {
    const near = smooth(camera.position.distanceTo(this.plaque.position), 3, 8);
    const a = master * near * (1 - this.inspectVis);
    this.plaque.material.uniforms.uOpacity.value = a;
    this.plaque.visible = a > 0.005;
    this.clearPlaque(camera, this.plaque.visible ? a : 0);
  }

  // The water's specks in front of the cell keep off the title while it shows (keepClear): its rect
  // on screen, as far as it reaches, unless part of it is behind the camera.
  clearPlaque(camera, amount) {
    const c = keepClear;
    c.amount.value = 0;
    if (!(amount > 0)) return;
    const p = this.plaque;
    p.updateWorldMatrix(true, false);
    const hw = PLAQUE.w / PLAQUE.ppu / 2, hh = PLAQUE.h / PLAQUE.ppu / 2;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < 4; i++) {
      _a.set(i & 1 ? hw : -hw, i & 2 ? hh : -hh, 0).applyMatrix4(p.matrixWorld).project(camera);
      if (_a.z > 1) return;
      x0 = Math.min(x0, _a.x);
      x1 = Math.max(x1, _a.x);
      y0 = Math.min(y0, _a.y);
      y1 = Math.max(y1, _a.y);
    }
    c.rect.value.set(x0, y0, x1, y1);
    c.amount.value = amount;
  }

  // Take the whole interface out of the scene and the page.
  dispose() {
    removeEventListener('pointermove', this.onPointer);
    document.fonts?.removeEventListener?.('loadingdone', this.onFonts);
    for (const root of [this.ring, this.tagRoot]) {
      root.traverse((o) => o.isCSS2DObject && o.element.remove());
      root.removeFromParent();
    }
    this.plaque.removeFromParent();
    keepClear.amount.value = 0;
    for (const m of [this.atpArc, this.pmfArc, this.bar]) m.material.dispose();
    this.plaque.material.uniforms.map.value.dispose();
    this.plaque.material.dispose();
    this.plaque.geometry.dispose();
    this.tags.clear();
    this.tagList.length = 0;
    this.focus = null;
  }
}

const ALIGN = ['l', 'r', 'c', 'c'];
const byScore = (p, q) => p.score - q.score;

// Whether two boxes come within `pad` px of each other (half that vertically).
function hit(a, b, pad = 0) {
  return a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad / 2 && b.y < a.y + a.h + pad / 2;
}

function boxDistance(b, x, y) {
  return Math.hypot(Math.max(b.x - x, 0, x - b.x - b.w), Math.max(b.y - y, 0, y - b.y - b.h));
}

const _a = new THREE.Vector3();
const _b = new THREE.Vector3();
const _c = new THREE.Vector3();
const _f = new THREE.Vector3();
const _l = new THREE.Vector3();
const _n = new THREE.Vector3();
const _s = new THREE.Vector3();
const _toCam = new THREE.Vector3();
const _inv = new THREE.Matrix4();
const _ends = new Float64Array(4);
const _lists = [null, null, null];
const _pin = { x: 0, y: 0, w: 12, h: 12 };
