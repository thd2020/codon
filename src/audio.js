// The opening's score, synthesised with WebAudio: no recordings, no files.
//
// The motif is the start codon played as A-U-G: glass A in the dark, the child's breath (U is a
// breath, not a note: an exhale shaped like a whispered "oo") as the glass settles, glass G on the
// dive. Around it: a blackbird and a garden bed of breeze and distant birds, the child's breathing
// (unsteady, then steady once they look), a felt thock and a fingernail on brass, a focus whisper,
// the ting of alignment, a held drone on A. As the frame shrinks the garden is time-stretched: the
// birds slow and darken into long moans, the breath stretches into a tide (one swell every 8 s), a
// fine Brownian hiss rises, and the drone dissolves into shimmer. Under the meniscus the walled
// rods ring thin glass harmonics that drop out one by one; the soft one's breaks into a warm,
// detuned wobble; the handoff resolves on a held chord, and the tide stays.
//
// Browsers start an AudioContext suspended until a click or key press, so nothing is built until
// resume() is called from that gesture. Until then every method does nothing (headless renders
// stay silent). Captions are the director's (intro.js), so they show whether or not sound plays.
//
// Everything that repeats after the opening runs inside the audio graph itself (the tide's swell is
// an oscillator on its gain), so the drop's ambience carries on with no one calling tick().

const A5 = 880;
const G5 = 783.99;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

export class IntroAudio {
  constructor() {
    this.ctx = null;
    this.settled = false;
    this.breathState = 'unsteady';
    this.nextBreath = 0;
    this.nextBird = 0;
    this.nextTide = 0;
    this.stretch = 1; // how slowed the garden is (1 at 1 cm and above)
    this.decades = 0;
    this.tideOn = false;
    this.rodVoices = [];
    this.birdRate = 1; // how often birds sing (The First Morning thickens them)
  }

  get on() {
    return !!this.ctx && this.ctx.state !== 'closed';
  }

  get now() {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  // Call from a click or key press (an activation-triggering one: not Escape, and pointerup for touch).
  // Safe to call again from any later gesture while the context is still suspended.
  resume() {
    if (!this.ctx) {
      const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
      } catch {
        return;
      }
      this.build();
    }
    this.ctx.resume?.();
  }

  // ----------------------------------------------------------------------------- the graph
  build() {
    const c = this.ctx;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    comp.connect(c.destination);
    this.master = c.createGain();
    this.master.gain.value = 0.85;
    this.master.connect(comp);
    // A small outdoor space: a short, soft, dark reverb.
    this.verb = c.createConvolver();
    this.verb.buffer = this.impulse(2.2, 2.6);
    const verbOut = c.createGain();
    verbOut.gain.value = 0.32;
    this.verb.connect(verbOut).connect(this.master);
    this.noiseBuf = this.noiseBuffer(3);
    this.crackleBuf = this.crackleBuffer(2);

    // The garden bed (breeze, birds): through the shrink filter.
    this.bedFilter = c.createBiquadFilter();
    this.bedFilter.type = 'lowpass';
    this.bedFilter.frequency.value = 18000;
    this.bedFilter.Q.value = 0.5;
    this.bed = c.createGain();
    this.bed.gain.value = 0;
    this.bed.connect(this.bedFilter);
    this.bedFilter.connect(this.master);
    this.bedFilter.connect(this.verb);
    const breeze = this.loopNoise();
    const bf = c.createBiquadFilter();
    bf.type = 'lowpass';
    bf.frequency.value = 650;
    const bg = c.createGain();
    bg.gain.value = 0.05;
    const lfo = c.createOscillator();
    lfo.frequency.value = 0.09;
    const lfoG = c.createGain();
    lfoG.gain.value = 0.03;
    lfo.connect(lfoG).connect(bg.gain);
    lfo.start();
    breeze.connect(bf).connect(bg).connect(this.bed);

    // The child's breath, close and binaural.
    this.breathBus = c.createGain();
    this.breathBus.gain.value = 1;
    let out = this.breathBus;
    try {
      const p = c.createPanner();
      p.panningModel = 'HRTF';
      p.distanceModel = 'linear';
      p.refDistance = 0.3;
      p.positionX.value = 0.08;
      p.positionY.value = -0.1;
      p.positionZ.value = -0.28;
      this.breathBus.connect(p);
      out = p;
    } catch {
      /* no panner: plain stereo */
    }
    this.breathOut = c.createGain();
    this.breathOut.gain.value = 1;
    out.connect(this.breathOut);
    this.breathOut.connect(this.master);
    const bs = c.createGain();
    bs.gain.value = 0.25;
    this.breathOut.connect(bs).connect(this.verb);

    // The tide: the breath slowed into the drop's swell, one every 8 s (in about 3.2 s, out 4.8 s),
    // driven by a slow oscillator on its gain so it needs no scheduling: 0.05 .. 0.32.
    this.tide = c.createGain();
    this.tide.gain.value = 0.185;
    const swell = c.createOscillator();
    // A sine with a little second harmonic: a quicker rise and a longer fall.
    swell.setPeriodicWave(c.createPeriodicWave(new Float32Array([0, 0, 0]), new Float32Array([0, 1, 0.22]), { disableNormalization: true }));
    swell.frequency.value = 0.125;
    const swellG = c.createGain();
    swellG.gain.value = 0.135 / 1.08;
    swell.connect(swellG).connect(this.tide.gain);
    swell.start();
    const tf = c.createBiquadFilter();
    tf.type = 'lowpass';
    tf.frequency.value = 420;
    tf.Q.value = 0.7;
    this.loopNoise().connect(tf).connect(this.tide);
    this.tideLevel = c.createGain();
    this.tideLevel.gain.value = 0;
    this.tide.connect(this.tideLevel).connect(this.master);
    this.tideLevel.connect(this.verb);

    // Brownian hiss: fine, granular.
    this.hiss = c.createGain();
    this.hiss.gain.value = 0;
    const hs = c.createBufferSource();
    hs.buffer = this.crackleBuf;
    hs.loop = true;
    const hf = c.createBiquadFilter();
    hf.type = 'highpass';
    hf.frequency.value = 3800;
    hs.connect(hf).connect(this.hiss).connect(this.master);
    hs.start();

    // The focus whisper: filtered noise that clears as the image sharpens.
    this.whisper = c.createGain();
    this.whisper.gain.value = 0;
    this.whisperF = c.createBiquadFilter();
    this.whisperF.type = 'bandpass';
    this.whisperF.frequency.value = 1200;
    this.whisperF.Q.value = 1.4;
    this.loopNoise().connect(this.whisperF).connect(this.whisper).connect(this.master);

    // The held drone on A, and the shimmer it dissolves into.
    this.drone = c.createGain();
    this.drone.gain.value = 0;
    const df = c.createBiquadFilter();
    df.type = 'lowpass';
    df.frequency.value = 1400;
    for (const [f, g] of [[220, 0.5], [440.6, 0.35], [659.3, 0.12], [880, 0.08]]) {
      const o = c.createOscillator();
      o.frequency.value = f;
      const og = c.createGain();
      og.gain.value = g;
      const v = c.createOscillator();
      v.frequency.value = 0.21 + f / 4000;
      const vg = c.createGain();
      vg.gain.value = g * 0.25;
      v.connect(vg).connect(og.gain);
      o.connect(og).connect(df);
      o.start();
      v.start();
    }
    df.connect(this.drone).connect(this.master);
    this.drone.connect(this.verb);
    this.shimmer = c.createGain();
    this.shimmer.gain.value = 0;
    [1760, 2217.5, 2637, 3520, 4434.9, 5274].forEach((f, i) => {
      const o = c.createOscillator();
      o.frequency.value = f * (1 + (i % 2 ? 0.002 : -0.0015));
      const g = c.createGain();
      g.gain.value = 0;
      const lf = c.createOscillator();
      lf.frequency.value = 0.37 + i * 0.29;
      const lg = c.createGain();
      lg.gain.value = 0.05 / (1 + i * 0.4);
      lf.connect(lg).connect(g.gain);
      o.connect(g).connect(this.shimmer);
      o.start();
      lf.start();
    });
    this.shimmer.connect(this.master);
    this.shimmer.connect(this.verb);
  }

  impulse(seconds, decay) {
    const c = this.ctx;
    const n = Math.floor(c.sampleRate * seconds);
    const b = c.createBuffer(2, n, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < n; i++) {
        lp += (Math.random() * 2 - 1 - lp) * 0.35; // darker tail
        d[i] = lp * Math.pow(1 - i / n, decay);
      }
    }
    return b;
  }

  noiseBuffer(seconds) {
    const c = this.ctx;
    const n = Math.floor(c.sampleRate * seconds);
    const b = c.createBuffer(1, n, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  // Sparse random grains: the Brownian hiss.
  crackleBuffer(seconds) {
    const c = this.ctx;
    const n = Math.floor(c.sampleRate * seconds);
    const b = c.createBuffer(1, n, c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() < 0.06 ? (Math.random() * 2 - 1) * Math.random() : 0;
    return b;
  }

  loopNoise() {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.loop = true;
    s.loopStart = Math.random();
    s.start(0, Math.random() * 2);
    return s;
  }

  noiseBurst(at, dur) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.start(at, Math.random() * 2, dur + 0.05);
    return s;
  }

  env(param, at, points) {
    param.cancelScheduledValues(at);
    param.setValueAtTime(points[0][1], at);
    for (const [t, v] of points.slice(1)) param.linearRampToValueAtTime(v, at + t);
  }

  ramp(param, value, seconds) {
    if (!this.on) return;
    const t = this.now;
    param.cancelScheduledValues(t);
    param.setValueAtTime(param.value, t);
    param.linearRampToValueAtTime(value, t + seconds);
  }

  // ----------------------------------------------------------------------------- the voices
  // A rubbed glass: a nearly pure tone that swells in, beats softly, with a faint inharmonic partial
  // and a breath of friction at the start.
  glass(freq, delay = 0, { level = 0.16, dur = 5.5 } = {}) {
    if (!this.on) return;
    const c = this.ctx;
    const at = this.now + delay;
    const out = c.createGain();
    out.gain.value = 0;
    this.env(out.gain, at, [[0, 0], [0.45, level], [1.2, level * 0.85], [dur, 0]]);
    out.connect(this.master);
    const send = c.createGain();
    send.gain.value = 0.7;
    out.connect(send).connect(this.verb);
    for (const [k, g] of [[1, 1], [1.0028, 0.6], [2.76, 0.05], [5.4, 0.012]]) {
      const o = c.createOscillator();
      o.frequency.value = freq * k;
      const og = c.createGain();
      og.gain.value = g;
      o.connect(og).connect(out);
      o.start(at);
      o.stop(at + dur + 0.1);
    }
    const n = this.noiseBurst(at, 0.6);
    const nf = c.createBiquadFilter();
    nf.type = 'bandpass';
    nf.frequency.value = freq * 2;
    nf.Q.value = 9;
    const ng = c.createGain();
    this.env(ng.gain, at, [[0, 0], [0.12, level * 0.25], [0.6, 0]]);
    n.connect(nf).connect(ng).connect(out);
  }

  glassA(delay = 0, opts = {}) {
    this.glass(A5, delay, opts);
  }

  glassG(delay = 0, opts = {}) {
    this.glass(G5, delay, opts);
  }

  // One breath. kind: 'in' | 'out' | 'u' (the motif's exhale, a whispered "oo") | 'sniff'.
  breath(kind, delay = 0, { dur = 1.6, level = 0.12, shaky = 0 } = {}) {
    if (!this.on) return;
    const c = this.ctx;
    const at = this.now + delay;
    const src = this.noiseBurst(at, dur + 0.2);
    const g = c.createGain();
    g.gain.value = 0;
    const pts = [[0, 0]];
    if (kind === 'sniff') {
      pts.push([0.04, level * 1.4], [0.12, level * 0.5], [0.16, level * 1.1], [0.32, 0]);
    } else {
      const a = kind === 'in' ? 0.55 : 0.25;
      // Unsteady breathing catches: the inhale stutters.
      const steps = shaky > 0 ? 3 : 1;
      for (let i = 1; i <= steps; i++) {
        const t = (dur * a * i) / steps;
        pts.push([t - 0.04 * shaky, level * (0.55 + 0.45 * (i / steps))]);
        if (shaky > 0 && i < steps) pts.push([t + 0.03, level * 0.25]);
      }
      pts.push([dur, 0]);
    }
    this.env(g.gain, at, pts);
    if (kind === 'u') {
      // Two formants of a whispered "oo".
      for (const [f, q, k] of [[330, 4, 1], [860, 5, 0.6], [2400, 3, 0.12]]) {
        const bp = c.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = f;
        bp.Q.value = q;
        const kg = c.createGain();
        kg.gain.value = k * 2.2;
        src.connect(bp).connect(kg).connect(g);
      }
    } else {
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = kind === 'in' ? 1700 : kind === 'sniff' ? 2600 : 1000;
      bp.Q.value = kind === 'sniff' ? 1.6 : 0.7;
      src.connect(bp).connect(g);
    }
    g.connect(this.breathBus);
  }

  // A blackbird (or a smaller garden bird): fluty warbled notes, then a twitter. Stretched as the
  // frame shrinks: slower, lower, into long moans.
  // dest: the bus it sings into (the garden bed by default; the very first bird, before the bed is
  // up, goes straight to the bed's filter so it is heard over the silence).
  bird(delay = 0, { kind = 'blackbird', level = 0.05, pan = -0.5, dest = null } = {}) {
    if (!this.on) return;
    const bus = dest ?? this.bed;
    const c = this.ctx;
    const k = this.stretch;
    const pitch = 1 / Math.pow(k, 0.85);
    const at = this.now + delay;
    const p = c.createStereoPanner ? c.createStereoPanner() : null;
    const out = c.createGain();
    out.gain.value = level;
    if (p) {
      p.pan.value = pan;
      out.connect(p).connect(bus);
    } else out.connect(bus);
    const r = Math.random;
    const notes =
      kind === 'blackbird'
        ? [
            [0, 0.2, 1650, 1950],
            [0.24, 0.13, 2150, 1750],
            [0.4, 0.28, 1500, 1800],
            [0.74, 0.1, 2450, 2650],
            [0.87, 0.07, 3200, 2800],
            [0.97, 0.05, 4300, 3700],
            [1.04, 0.05, 4100, 3500],
          ]
        : Array.from({ length: 5 + Math.floor(r() * 4) }, (_, i) => [i * 0.11, 0.07, 3600 + r() * 1800, 3000 + r() * 1500]);
    for (const [t0, d, f0, f1] of notes) {
      const t = at + t0 * k;
      const dur = d * k;
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(f0 * pitch, t);
      o.frequency.linearRampToValueAtTime(((f0 + f1) / 2) * pitch * (1 + 0.04 * Math.sin(t0 * 31)), t + dur * 0.5);
      o.frequency.linearRampToValueAtTime(f1 * pitch, t + dur);
      const g = c.createGain();
      g.gain.value = 0;
      this.env(g.gain, t, [[0, 0], [Math.min(0.015 * k, dur * 0.3), 1], [dur * 0.75, 0.7], [dur, 0]]);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
  }

  ting() {
    if (!this.on) return;
    const c = this.ctx;
    const at = this.now;
    for (const [k, g, d] of [[1, 0.09, 1.6], [2.76, 0.035, 0.5], [5.4, 0.012, 0.18]]) {
      const o = c.createOscillator();
      o.frequency.value = 1760 * k;
      const og = c.createGain();
      this.env(og.gain, at, [[0, 0], [0.004, g], [d, 0]]);
      o.connect(og).connect(this.master);
      og.connect(this.verb);
      o.start(at);
      o.stop(at + d + 0.05);
    }
  }

  // A fingernail on brass: a short tick and a small metallic ring.
  click(delay = 0) {
    if (!this.on) return;
    const c = this.ctx;
    const at = this.now + delay;
    const n = this.noiseBurst(at, 0.02);
    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 3200;
    bp.Q.value = 2;
    const ng = c.createGain();
    this.env(ng.gain, at, [[0, 0.22], [0.012, 0]]);
    n.connect(bp).connect(ng).connect(this.master);
    for (const [f, g] of [[2380, 0.03], [3920, 0.02], [6100, 0.01]]) {
      const o = c.createOscillator();
      o.frequency.value = f;
      const og = c.createGain();
      this.env(og.gain, at, [[0, g], [0.22, 0]]);
      o.connect(og).connect(this.master);
      o.start(at);
      o.stop(at + 0.25);
    }
  }

  // A felt thock as the glass moves.
  thock() {
    if (!this.on) return;
    const c = this.ctx;
    const at = this.now;
    const o = c.createOscillator();
    o.frequency.setValueAtTime(150, at);
    o.frequency.exponentialRampToValueAtTime(70, at + 0.09);
    const g = c.createGain();
    this.env(g.gain, at, [[0, 0], [0.006, 0.09], [0.12, 0]]);
    o.connect(g).connect(this.master);
    o.start(at);
    o.stop(at + 0.15);
  }

  // The tear's contact, for The first morning: soft, deep, pitched down. No splash.
  dumm() {
    if (!this.on) return;
    const c = this.ctx;
    const at = this.now;
    const o = c.createOscillator();
    o.frequency.setValueAtTime(74, at);
    o.frequency.exponentialRampToValueAtTime(46, at + 1.3);
    const g = c.createGain();
    this.env(g.gain, at, [[0, 0], [0.03, 0.35], [1.8, 0]]);
    o.connect(g).connect(this.master);
    g.connect(this.verb);
    o.start(at);
    o.stop(at + 1.9);
  }

  // ---------------------------------------------------------------- The First Morning's voices
  // A breeze through the garden: a slow swell of soft noise in the bed.
  gust(level = 0.06, seconds = 3) {
    if (!this.on) return;
    const c = this.ctx;
    const at = this.now;
    const n = this.noiseBurst(at, seconds + 0.2);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(500, at);
    lp.frequency.linearRampToValueAtTime(1100, at + seconds * 0.45);
    lp.frequency.linearRampToValueAtTime(600, at + seconds);
    const g = c.createGain();
    this.env(g.gain, at, [[0, 0], [seconds * 0.45, level], [seconds, 0]]);
    n.connect(lp).connect(g).connect(this.bed);
  }

  // The beads trembling on their hairs: a few tiny glassy ticks.
  beadTick() {
    if (!this.on) return;
    const c = this.ctx;
    [0, 0.055, 0.13, 0.21].forEach((dt, i) => {
      const at = this.now + dt;
      const f = [4186, 5274, 3951, 4699][i];
      const o = c.createOscillator();
      o.frequency.value = f;
      const g = c.createGain();
      this.env(g.gain, at, [[0, 0], [0.003, 0.016 * (1 - i * 0.18)], [0.09, 0]]);
      o.connect(g).connect(this.master);
      g.connect(this.verb);
      o.start(at);
      o.stop(at + 0.12);
    });
  }

  // The shoulders shake once: two caught breaths in, a long unsteady one out. Breath only.
  sob() {
    if (!this.on) return;
    this.breath('in', 0, { dur: 0.42, level: 0.13, shaky: 1 });
    this.breath('in', 0.46, { dur: 0.36, level: 0.11, shaky: 1 });
    this.breath('out', 0.95, { dur: 1.5, level: 0.08 });
    this.nextBreath = Math.max(this.nextBreath, this.now + 3.2);
  }

  setBirdRate(r) {
    this.birdRate = r;
    if (this.on && this.nextBird) this.nextBird = Math.min(this.nextBird, this.now + 1.2);
  }

  // A high-speed camera's slow motion (k: 0 normal .. 1 slowest): the garden holds still, dark and
  // low; the birds that still sing are slowed.
  setSlow(k, seconds = 1) {
    if (!this.on || this.settled) return;
    const t = this.now;
    this.bedFilter.frequency.cancelScheduledValues(t);
    this.bedFilter.frequency.setTargetAtTime(18000 * Math.pow(420 / 18000, k), t, seconds / 3);
    this.bed.gain.cancelScheduledValues(t);
    this.bed.gain.setTargetAtTime(1 - 0.7 * k, t, seconds / 3);
    this.stretch = 1 + 3 * k;
  }

  // ------------------------------------------------------------------------- continuous parts
  gardenIn(seconds = 3) {
    if (!this.on) return;
    this.ramp(this.bed.gain, 1, seconds);
    this.nextBird = this.now + 2.5;
  }

  droneIn(level = 0.05, seconds = 3) {
    if (!this.on) return;
    this.ramp(this.drone.gain, level, seconds);
    this.droneLevel = level;
  }

  // blur01: 0 sharp .. 1 smeared; activity: how fast focus is changing (0..1).
  focusWhisper(blur01, activity) {
    if (!this.on || this.settled) return;
    const t = this.now;
    this.whisper.gain.setTargetAtTime(0.05 * clamp(activity, 0, 1) * (0.25 + blur01), t, 0.08);
    this.whisperF.frequency.setTargetAtTime(700 + 4200 * (1 - blur01), t, 0.08);
  }

  // The frame's height in metres drives the time-stretch (story §6.4): the bed's cutoff falls
  // from 18 kHz at 1 cm to 400 Hz at 10 µm, the birds slow, the hiss rises, the drone dissolves.
  setScale(h) {
    if (!this.on || this.settled) return;
    const dec = clamp(-2 - Math.log10(Math.max(h, 1e-9)), 0, 3.3);
    this.decades = dec;
    this.stretch = Math.pow(2, 0.75 * dec);
    const t = this.now;
    this.bedFilter.frequency.setTargetAtTime(18000 * Math.pow(400 / 18000, Math.min(dec, 3) / 3), t, 0.1);
    this.hiss.gain.setTargetAtTime(0.06 * smooth(0.8, 2.8, dec), t, 0.2);
    const d = this.droneLevel ?? 0;
    this.drone.gain.setTargetAtTime(d * (1 - smooth(0.6, 2.2, dec)), t, 0.2);
    this.shimmer.gain.setTargetAtTime(0.5 * smooth(0.8, 2.4, dec) * (1 - 0.6 * smooth(3.0, 4.0, dec)), t, 0.3);
  }

  // The breath stretched into the drop's slow swell.
  tideIn(seconds = 2.5, level = 0.5) {
    if (!this.on) return;
    this.tideOn = true;
    this.ramp(this.tideLevel.gain, level, seconds);
    this.ramp(this.breathOut.gain, 0, seconds);
  }

  // Thin glass harmonics of the walled rods (shot 6).
  rodsIn(n = 6) {
    if (!this.on || this.rodVoices.length) return;
    const c = this.ctx;
    const fs = [1318.5, 1567.98, 1975.5, 2349.3, 2637, 3135.96].slice(0, n);
    for (const f of fs) {
      const o = c.createOscillator();
      o.frequency.value = f;
      // A slow tremolo on the tone's own gain (0.012 +- 0.004), then the voice's level after it,
      // so letting the level down silences the tremolo too.
      const trem = c.createGain();
      trem.gain.value = 0.012;
      const v = c.createOscillator();
      v.frequency.value = 0.6 + Math.random();
      const vg = c.createGain();
      vg.gain.value = 0.004;
      v.connect(vg).connect(trem.gain);
      const g = c.createGain();
      g.gain.value = 0;
      o.connect(trem).connect(g).connect(this.master);
      g.connect(this.verb);
      o.start();
      v.start();
      g.gain.setTargetAtTime(1, this.now, 0.8);
      this.rodVoices.push({ o, g, v });
    }
  }

  rodOut(i, seconds = 1.2) {
    if (!this.on) return;
    const r = this.rodVoices[i];
    if (!r || r.out) return;
    r.out = true;
    r.g.gain.setTargetAtTime(0, this.now, seconds / 3);
  }

  // The rod at the front's edge loses its wall: its harmonic breaks into a warmer, detuned wobble.
  heroWobble() {
    if (!this.on) return;
    const c = this.ctx;
    this.rodOut(0, 0.6);
    const g = c.createGain();
    g.gain.value = 0;
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1600;
    this.wobbleOscs = [];
    for (const f of [659.3, 662.1]) {
      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      const v = c.createOscillator();
      v.frequency.value = 4.6;
      const vg = c.createGain();
      vg.gain.value = 5;
      v.connect(vg).connect(o.frequency);
      o.connect(lp);
      o.start();
      v.start();
      this.wobbleOscs.push(o, v);
    }
    lp.connect(g).connect(this.master);
    g.connect(this.verb);
    g.gain.setTargetAtTime(0.022, this.now, 0.4);
    this.wobble = g;
  }

  // The handoff: the motif resolves into a held chord; a soft click-ripple as the ring appears.
  chord() {
    if (!this.on) return;
    const c = this.ctx;
    const at = this.now;
    const g = c.createGain();
    this.env(g.gain, at, [[0, 0], [1.6, 0.05], [5.5, 0.045], [10, 0]]);
    const lp = c.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1800;
    for (const f of [220, 329.63, 440, 554.37]) {
      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      o.connect(lp);
      o.start(at);
      o.stop(at + 10.2);
    }
    lp.connect(g).connect(this.master);
    g.connect(this.verb);
    this.quiet();
  }

  // The hand-over, whoever plays the chord: the drone's shimmer, the rods and the wobble fade out
  // and the hiss drops to a breath, so nothing of the descent sounds on into the game.
  quiet(seconds = 4) {
    if (!this.on) return;
    const at = this.now;
    // Let the voices down, then stop their oscillators once they are silent.
    const end = at + seconds * 1.6 + 2;
    for (const r of this.rodVoices) {
      r.g.gain.cancelScheduledValues(at);
      r.g.gain.setTargetAtTime(0, at, seconds / 4);
      r.out = true;
      if (!r.stopped) {
        r.stopped = true;
        r.o.stop(end);
        r.v.stop(end);
      }
    }
    if (this.wobble) {
      this.wobble.gain.cancelScheduledValues(at);
      this.wobble.gain.setTargetAtTime(0, at + Math.min(2, seconds / 2), seconds / 4);
      for (const o of this.wobbleOscs ?? []) o.stop(end + 2);
      this.wobbleOscs = [];
    }
    this.ramp(this.shimmer.gain, 0, seconds);
    this.ramp(this.hiss.gain, 0.02, seconds);
    this.ramp(this.drone.gain, 0, seconds);
    this.ramp(this.whisper.gain, 0, 0.3);
  }

  ripple() {
    if (!this.on) return;
    const c = this.ctx;
    for (let i = 0; i < 5; i++) {
      const at = this.now + i * 0.07;
      const o = c.createOscillator();
      o.frequency.value = 2200 + i * 260;
      const g = c.createGain();
      this.env(g.gain, at, [[0, 0], [0.004, 0.03 * (1 - i * 0.15)], [0.05, 0]]);
      o.connect(g).connect(this.master);
      o.start(at);
      o.stop(at + 0.08);
    }
  }

  setBreathing(state) {
    this.breathState = state;
    if (this.on) this.nextBreath = Math.min(this.nextBreath, this.now + 0.4);
  }

  // Schedules what repeats during the opening: breaths and birds. The director calls it every frame;
  // nothing needs it after the hand-over.
  tick() {
    if (!this.on) return;
    const t = this.now;
    if (t >= this.nextBreath && !this.tideOn) {
      const s = this.breathState;
      if (s === 'unsteady') {
        const din = 1.0 + Math.random() * 0.5;
        this.breath('in', 0, { dur: din, level: 0.1, shaky: 1 });
        this.breath('out', din + 0.1, { dur: 1.3, level: 0.07 });
        this.nextBreath = t + din + 1.6 + Math.random() * 0.9;
      } else if (s === 'steady') {
        this.breath('in', 0, { dur: 1.7, level: 0.05 });
        this.breath('out', 1.85, { dur: 2.4, level: 0.045 });
        this.nextBreath = t + 4.6;
      } else this.nextBreath = t + 0.5;
    }
    if (this.nextBird && t >= this.nextBird) {
      const blackbird = Math.random() < 0.45;
      this.bird(0, { kind: blackbird ? 'blackbird' : 'small', level: blackbird ? 0.035 : 0.02, pan: Math.random() * 1.6 - 0.8 });
      this.nextBird = t + ((2.5 + Math.random() * 4.5) * Math.min(this.stretch, 3)) / this.birdRate;
    }
  }

  // After the opening (the end of the glide, or a skip): only the tide stays, quieter, with a breath
  // of hiss. Everything else of the opening is let down, whoever was playing it, and nothing the
  // timeline still sends (setScale, the whisper) can bring it back.
  settle(seconds = 3) {
    if (!this.on) return;
    this.quiet(seconds);
    this.settled = true;
    this.ramp(this.bed.gain, 0, seconds);
    this.ramp(this.breathOut.gain, 0, Math.min(2, seconds));
    this.ramp(this.tideLevel.gain, 0.32, seconds);
    this.nextBird = 0;
    this.tideOn = true;
  }

  dispose() {
    try {
      this.ctx?.close();
    } catch {
      /* already closed */
    }
    this.ctx = null;
  }
}
