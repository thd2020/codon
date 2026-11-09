import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { clock } from './materials.js';
import { CellPass } from './cellpass.js';
import { Water, addLights } from './water.js';
import { Bacterium } from './bacterium.js';
import { Neighbours } from './neighbours.js';
import { Player } from './player.js';
import { Metabolism } from './metabolism.js';
import { Feeding } from './feeding.js';
import { Hud } from './hud.js';
import { composeLook } from './lens.js';
import { ORGANELLE } from './palette.js';
import { Intro } from './intro.js';
import './style.css';

const params = new URLSearchParams(location.search);
const app = document.getElementById('app');

const renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
app.appendChild(renderer.domElement);

const labels = new CSS2DRenderer();
labels.setSize(innerWidth, innerHeight);
labels.domElement.className = 'labels';
app.appendChild(labels.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.02, 800);
camera.position.set(5.6, 1.8, 2.1);

const water = new Water(scene);
scene.environment = water.environment(renderer);
addLights(scene);

// Every cell (the hero and its neighbours) is drawn as one volume by this pass, lit and fogged
// with the same light and fog as the water.
const cellPass = new CellPass(scene, camera);
cellPass.setColors({
  dna: ORGANELLE.dna,
  plasmid: ORGANELLE.plasmid,
  glycogen: ORGANELLE.glycogen,
  polyP: ORGANELLE.polyphosphate,
  receptor: ORGANELLE.receptor,
  vesicle: ORGANELLE.vesicle,
});

const hero = new Bacterium({ hero: true, seed: 42 });
hero.group.rotation.set(0, -0.35, 0);
scene.add(hero.group);
cellPass.add(hero);

const neighbours = new Neighbours(scene, hero, camera, cellPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.enablePan = false;
controls.minDistance = 2.4;
controls.maxDistance = 18;
controls.minPolarAngle = 0.2;
controls.maxPolarAngle = Math.PI - 0.2;
controls.rotateSpeed = 0.6;
controls.target.set(0, 0, 0);

const player = new Player(hero, camera, controls);
player.inspect = params.has('inspect');
// ?keys=KeyW,KeyD holds keys from the start, for testing without a keyboard.
for (const k of (params.get('keys') || '').split(',').filter(Boolean)) player.keys.add(k);

const metabolism = new Metabolism(hero);
const feeding = new Feeding(scene, hero, metabolism, camera);
const hud = new Hud(scene, hero, `${import.meta.env.BASE_URL}brand/cell-icon.svg`, { metabolism, feeding });
hud.placePlaque(camera, controls.target);

// The scene renders into a target that keeps its depth, so CellPass can stop each ray at the
// first opaque thing (a bead, a flagellum, a neighbour's meshes) and veil it correctly.
const size = new THREE.Vector2();
renderer.getDrawingBufferSize(size);
const target = new THREE.WebGLRenderTarget(size.x, size.y, { type: THREE.HalfFloatType, samples: 4, depthTexture: new THREE.DepthTexture(size.x, size.y) });
const composer = new EffectComposer(renderer, target);
// scene -> cells -> water in front of the cells -> bloom -> tone mapping -> lens grade
const look = composeLook(composer, renderer, { scene, camera, cellPass, water });
const lens = look.lens;

function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  labels.setSize(innerWidth, innerHeight);
  renderer.getDrawingBufferSize(size);
  cellPass.setSize(size.x, size.y);
  water.resize(size.y, camera.fov);
}
addEventListener('resize', resize);
resize();

// The first-launch opening (docs/design/story.md §5: the garden, the dive, the soft one, the
// hand-over to this very frame). It plays on first launch or with ?intro; never with ?nointro, nor
// in headless ?frames renders unless ?intro asks. Built after composeLook (it adds its own passes)
// and resize(). While it is active it owns the camera, the hero, the water and the interface.
const intro = Intro.shouldPlay(params)
  ? new Intro({ renderer, composer, look, scene, camera, controls, cellPass, water, hero, neighbours, player, hud, feeding, params, iconUrl: `${import.meta.env.BASE_URL}brand/cell-icon.svg` })
  : null;

// ?frames=N renders N fixed steps and stops, for screenshots on slow software renderers.
const maxFrames = +params.get('frames') || Infinity;
let frames = 0;
const timer = new THREE.Timer();
let t = 0;

// Frame-time governor for play. Every cell is ray-marched at the full drawing-buffer resolution,
// which a mid-range GPU at devicePixelRatio 2 cannot always hold at 60 fps. Measured over a few
// seconds, slow frames first lower CellPass's march quality, then the resolution it renders at
// (it is composited back at full size); fast frames bring them back one step at a time. The
// opening runs its own governor, and headless ?frames renders keep full quality.
const GOVERN = [
  { quality: 1, scale: 1 },
  { quality: 0.8, scale: 1 },
  { quality: 0.8, scale: 0.8 },
  { quality: 0.65, scale: 0.7 },
  { quality: 0.5, scale: 0.6 },
];
const governor = { level: 0, ema: 1 / 60, wait: 2 };
function govern(raw) {
  if (maxFrames < Infinity || intro?.active || !(raw > 0) || raw > 0.5) return; // a hidden tab's gap is not a slow frame
  governor.ema += (raw - governor.ema) * 0.05;
  governor.wait -= raw;
  if (governor.wait > 0) return;
  let next = governor.level;
  if (governor.ema > 1 / 45 && next < GOVERN.length - 1) next++;
  else if (governor.ema < 1 / 57 && next > 0) next--;
  if (next === governor.level) return;
  // after a step down, 2 s before the next judgement; after a step back up, 4 s, so it does not hunt
  governor.wait = next > governor.level ? 2 : 4;
  governor.level = next;
  applyLevel(next);
}
function applyLevel(level) {
  cellPass.quality = GOVERN[level].quality;
  if (cellPass.resolutionScale !== GOVERN[level].scale) {
    cellPass.resolutionScale = GOVERN[level].scale;
    renderer.getDrawingBufferSize(size);
    cellPass.setSize(size.x, size.y);
  }
}
// ?govern=N starts at governor level N (0-4), to see what a slow GPU gets.
if (params.has('govern')) {
  governor.level = Math.min(Math.max(Math.round(+params.get('govern')) || 0, 0), GOVERN.length - 1);
  applyLevel(governor.level);
}

function frame(now) {
  timer.update(now);
  const raw = timer.getDelta();
  govern(raw);
  const real = maxFrames < Infinity ? 1 / 60 : Math.min(raw, 1 / 20);
  if (++frames >= maxFrames) renderer.setAnimationLoop(null);
  window.__frames = frames;
  // World time runs at the opening's pace while it plays (slow motion, the time-lapse); inspect's
  // slow motion only once the game has the cell.
  const opening = !!intro?.active;
  const dt = real * (opening ? intro.timeScale : player.inspect ? 0.25 : 1);
  t += dt;
  clock.uTime.value = t;
  if (lens.uniforms.uTime) lens.uniforms.uTime.value = t;

  if (opening) {
    intro.update(real);
    // In the Garden (millimetres) the drop isn't drawn at all.
    if (!intro.inGarden) neighbours.update(dt);
  } else {
    const drive = player.update(dt);
    metabolism.update(dt, { thrust: player.requested, oxygen: feeding.state.oxygen });
    player.motorPower = metabolism.state.motorPower;
    hero.update(dt, drive);
    feeding.update(dt, { keys: player.keys, inspect: player.inspect });
    neighbours.update(dt);
    player.follow(real);
    hud.zoom(real, camera, controls.target, player.inspect);
    controls.update();
  }

  if (!intro?.inGarden) {
    // While the opening drives the camera it says where the water's depth of field should focus.
    water.update(camera, intro?.focus ?? camera.position.distanceTo(hero.group.position));
    hud.update(real, camera, player, metabolism.state, feeding.state);
  }

  composer.render();
  labels.render(scene, camera);
}
renderer.setAnimationLoop(frame);

window.codon = { scene, camera, hero, player, controls, metabolism, feeding, cellPass, renderer, intro, governor };
