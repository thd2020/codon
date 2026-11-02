import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { clock } from './materials.js';
import { Water } from './water.js';
import { Bacterium } from './bacterium.js';
import { Neighbours } from './neighbours.js';
import { Player } from './player.js';
import { Hud } from './hud.js';
import { LensShader } from './lens.js';
import { WATER } from './palette.js';
import './style.css';

const params = new URLSearchParams(location.search);
const app = document.getElementById('app');

const renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.AgXToneMapping;
renderer.toneMappingExposure = 1.15;
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
scene.environmentIntensity = 0.9;

scene.add(new THREE.HemisphereLight(0xcfeff2, 0x061a2a, 1.4));
const sun = new THREE.DirectionalLight(WATER.sun, 1.8);
sun.position.set(3, 10, 2);
scene.add(sun);
const rim = new THREE.DirectionalLight(0x6fb8ff, 1.2);
rim.position.set(-4, -2, -6);
scene.add(rim);

const hero = new Bacterium({ hero: true, seed: 42 });
hero.group.rotation.y = -0.35;
scene.add(hero.group);

const neighbours = new Neighbours(scene, hero, camera);

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
const hud = new Hud(scene, hero, `${import.meta.env.BASE_URL}brand/cell-icon.svg`);
hud.placePlaque(camera, controls.target);

const rtSize = new THREE.Vector2();
renderer.getDrawingBufferSize(rtSize);
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(rtSize.x, rtSize.y, { type: THREE.HalfFloatType, samples: 4 }));
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.28, 0.6, 0.9);
composer.addPass(bloom);
const lens = new ShaderPass(LensShader);
composer.addPass(lens);
composer.addPass(new OutputPass());

function resize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  labels.setSize(innerWidth, innerHeight);
  renderer.getDrawingBufferSize(rtSize);
  lens.uniforms.uRes.value = [rtSize.x, rtSize.y];
  water.resize(rtSize.y, camera.fov);
}
addEventListener('resize', resize);
resize();

// ?frames=N renders N fixed steps and stops, for screenshots on slow software renderers.
const maxFrames = +params.get('frames') || Infinity;
let frames = 0;
const timer = new THREE.Timer();
let t = 0;
function frame(now) {
  timer.update(now);
  const real = maxFrames < Infinity ? 1 / 60 : Math.min(timer.getDelta(), 1 / 20);
  if (++frames >= maxFrames) renderer.setAnimationLoop(null);
  window.__frames = frames;
  const dt = real * (player.inspect ? 0.25 : 1);
  t += dt;
  clock.uTime.value = t;
  lens.uniforms.uTime.value = t;

  const drive = player.update(dt);
  hero.update(dt, drive);
  neighbours.update(dt);
  player.follow(real);
  hud.zoom(real, camera, controls.target, player.inspect);
  controls.update();

  water.update(camera, camera.position.distanceTo(hero.group.position));
  hud.update(real, camera, player);

  composer.render();
  labels.render(scene, camera);
}
renderer.setAnimationLoop(frame);

window.codon = { scene, camera, hero, player, controls };
