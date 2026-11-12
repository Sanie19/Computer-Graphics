import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';


const MODELS = {
  table:  '/models/lounge-drum-table-13d029.glb',
  chair:  '/models/table-game-chair-ffa6c1.glb',
  lamp:   '/models/table-lamp-e25998.glb',
  candle: '/models/table-candle-lantern-a7b5af.glb',
  herb:   '/models/table-herb-pot-3c0cf4.glb'
};

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x15110e);
scene.fog = new THREE.Fog(0x15110e, 14, 26);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.25;

const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 60);
camera.position.set(4.8, 2.2, 5.8);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-0.2, 0.9, -0.2);
controls.maxPolarAngle = Math.PI * 0.49;
controls.minDistance = 1.5; controls.maxDistance = 9;
controls.enableDamping = true; controls.autoRotateSpeed = 0.6;
addEventListener('keydown', (e) => { if (e.key.toLowerCase() === 'r') controls.autoRotate = !controls.autoRotate; });


const std = (o) => new THREE.MeshStandardMaterial(o);
function mesh(geo, mat, x, y, z, shadow = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z); m.castShadow = shadow; m.receiveShadow = true;
  scene.add(m); return m;
}
function woodTexture(base, line, planks, vertical = false) {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d'); g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  const w = 512 / planks;
  for (let i = 0; i < planks; i++) {
    g.fillStyle = `rgba(${40 + Math.random() * 30},${20 + Math.random() * 15},10,${0.06 + Math.random() * 0.18})`;
    vertical ? g.fillRect(i * w, 0, w, 512) : g.fillRect(0, i * w, 512, w);
    g.strokeStyle = line; g.lineWidth = 2; g.beginPath();
    vertical ? (g.moveTo(i * w, 0), g.lineTo(i * w, 512)) : (g.moveTo(0, i * w), g.lineTo(512, i * w));
    g.stroke();
  }
  for (let i = 0; i < 450; i++) {
    g.strokeStyle = `rgba(0,0,0,${Math.random() * 0.06})`;
    const p = Math.random() * 512, q = Math.random() * 512, l = 40 + Math.random() * 120;
    g.beginPath();
    vertical ? (g.moveTo(p, q), g.lineTo(p + (Math.random() - .5) * 3, q + l)) : (g.moveTo(q, p), g.lineTo(q + l, p + (Math.random() - .5) * 3));
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return t;
}


const W = 9, D = 8, H = 3.4;
const floorTex = woodTexture('#a87647', 'rgba(30,15,5,.5)', 10); floorTex.repeat.set(3, 3);
const floor = mesh(new THREE.PlaneGeometry(W, D), std({ map: floorTex, roughness: 0.5 }), 0, 0, 0, false);
floor.rotation.x = -Math.PI / 2;

const wallMat = std({ color: 0x2d2824, roughness: 0.9 });
mesh(new THREE.PlaneGeometry(W, H), wallMat, 0, H / 2, -D / 2, false);
const left = mesh(new THREE.PlaneGeometry(D, H), wallMat, -W / 2, H / 2, 0, false); left.rotation.y = Math.PI / 2;
const ceil = mesh(new THREE.PlaneGeometry(W, D), std({ color: 0x1d1a18, roughness: 1 }), 0, H, 0, false); ceil.rotation.x = Math.PI / 2;

const slatMat = std({ map: woodTexture('#7a5233', 'rgba(0,0,0,.4)', 4, true), roughness: 0.6 });
for (let i = 0; i < 40; i++) mesh(new THREE.BoxGeometry(0.1, 2.7, 0.06), slatMat, -W / 2 + 0.6 + i * 0.2, 1.5, -D / 2 + 0.04);


const marble = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d'); g.fillStyle = '#ece8e2'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 14; i++) {
    g.strokeStyle = `rgba(90,90,100,${0.1 + Math.random() * 0.25})`; g.lineWidth = 1 + Math.random() * 2;
    g.beginPath(); let x = Math.random() * 512, y = 0; g.moveTo(x, y);
    while (y < 512) { x += (Math.random() - .5) * 60; y += 30; g.lineTo(x, y); }
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
})();
const CX = 1.9, CZ = -2.9, CTOP = 1.06;
mesh(new THREE.BoxGeometry(4.2, 1.0, 0.8), std({ color: 0x1f1d1c, roughness: 0.5, metalness: 0.2 }), CX, 0.5, CZ);
mesh(new THREE.BoxGeometry(4.4, 0.06, 1.0), std({ map: marble, roughness: 0.2 }), CX, 1.03, CZ + 0.02);
const steel = std({ color: 0xb9bcc0, metalness: 0.9, roughness: 0.25 });
mesh(new THREE.BoxGeometry(0.8, 0.42, 0.5), steel, 3.0, CTOP + 0.21, CZ);
mesh(new THREE.BoxGeometry(0.7, 0.05, 0.4), std({ color: 0x111111 }), 3.0, CTOP + 0.445, CZ);
mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 16), std({ color: 0x111111 }), 2.8, CTOP + 0.1, CZ + 0.3);
for (let s = 0; s < 2; s++) {
  mesh(new THREE.BoxGeometry(3.6, 0.05, 0.3), std({ color: 0x4a3322, roughness: 0.6 }), CX, 1.75 + s * 0.55, -3.8);
  for (let i = 0; i < 9; i++)
    mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.07, 16), std({ color: i % 3 ? 0xf2efe9 : 0xc9733a, roughness: 0.4 }), 0.4 + i * 0.37, 1.8 + s * 0.55 + 0.035, -3.8);
}


const win = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.8), new THREE.MeshBasicMaterial({ color: 0xd8e8ff }));
win.position.set(-W / 2 + 0.02, 1.9, 0.6); win.rotation.y = Math.PI / 2; scene.add(win);
const frame = std({ color: 0x0e0e0e, roughness: 0.4 });
mesh(new THREE.BoxGeometry(0.05, 1.85, 0.05), frame, -W / 2 + 0.04, 1.9, 0.6);
mesh(new THREE.BoxGeometry(0.05, 0.05, 2.65), frame, -W / 2 + 0.04, 1.9, 0.6);
mesh(new THREE.BoxGeometry(0.05, 1.85, 0.05), frame, -W / 2 + 0.04, 1.9, 1.9);
mesh(new THREE.BoxGeometry(0.05, 1.85, 0.05), frame, -W / 2 + 0.04, 1.9, -0.7);
const sun = new THREE.DirectionalLight(0xdbe8ff, 1.3);
sun.position.set(-5, 3.2, 1); sun.target.position.set(0, 0, 0.6);
sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0005;
Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 0.5, far: 20 });
scene.add(sun, sun.target);
scene.add(new THREE.HemisphereLight(0xffe9d2, 0x201510, 0.4));

function pendant(x, z, y, shadow = false) {
  mesh(new THREE.CylinderGeometry(0.005, 0.005, H - y, 6), std({ color: 0 }), x, (H + y) / 2, z, false);
  mesh(new THREE.ConeGeometry(0.22, 0.2, 32, 1, true), std({ color: 0x111111, metalness: 0.6, roughness: 0.3, side: THREE.DoubleSide }), x, y, z);
  mesh(new THREE.SphereGeometry(0.07, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffd9a0 }), x, y - 0.04, z, false);
  const l = new THREE.PointLight(0xffc27a, 7, 6, 2); l.position.set(x, y - 0.12, z);
  if (shadow) { l.castShadow = true; l.shadow.mapSize.set(512, 512); }
  scene.add(l);
}


const loader = new GLTFLoader();
const src = {};
await Promise.all(Object.keys(MODELS).map((k) => new Promise((res) =>
  loader.load(MODELS[k], (g) => { src[k] = g; res(); }, undefined, (e) => { console.error(k, e); res(); }))));

const mixers = [];

function place(key, x, z, { yaw = 0, s = 1, y = 0 } = {}) {
  const g = src[key]; if (!g) return null;
  const obj = g.scene.clone(true);
  obj.scale.multiplyScalar(s);                               
  const box = new THREE.Box3().setFromObject(obj), c = box.getCenter(new THREE.Vector3());
  obj.position.set(-c.x, -box.min.y, -c.z);
  const wrap = new THREE.Group(); wrap.add(obj);
  wrap.position.set(x, y, z);                                   
  wrap.rotation.y = yaw;                                       
  wrap.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.receiveShadow = true; } });
  scene.add(wrap);
  if (g.animations.length) {                                    
    const mx = new THREE.AnimationMixer(obj);
    g.animations.forEach((a) => mx.clipAction(a).play()); mixers.push(mx);
  }
  return { wrap, box: new THREE.Box3().setFromObject(wrap) };
}

function chairsAround(cx, cz, r, n, start, s = 1.0) {
  for (let i = 0; i < n; i++) {
    const a = start + (i * 2 * Math.PI) / n;
    const c = place('chair', cx + Math.cos(a) * r, cz + Math.sin(a) * r,
      { yaw: Math.atan2(-Math.cos(a), -Math.sin(a)) + (Math.random() - .5) * 0.15, s });
    const sw = c && c.wrap.getObjectByName('swivel'); if (sw) sw.rotation.y = (Math.random() - .5) * 0.6;
  }
}

const TS = 1.4;                    
const TOP = 0.55 * TS;


const A = [-1.4, 0.9];
const rug = mesh(new THREE.CircleGeometry(1.7, 64), std({ color: 0x3b3a3c, roughness: 1 }), A[0], 0.006, A[1], false);
rug.rotation.x = -Math.PI / 2;
place('table', A[0], A[1], { s: TS });
chairsAround(A[0], A[1], 0.9, 4, Math.PI / 4);
place('candle', A[0] - 0.12, A[1] + 0.05, { y: TOP, s: 1.2 });
place('herb', A[0] + 0.15, A[1] - 0.1, { y: TOP, s: 1.2 });


const B = [2.3, 1.3];
place('table', B[0], B[1], { s: 1.3, yaw: 0.6 });
chairsAround(B[0], B[1], 0.8, 2, Math.PI * 0.1, 0.95);
place('lamp', B[0], B[1], { y: 0.55 * 1.3, s: 0.8 });


const C = [-3.0, -1.6];
place('table', C[0], C[1], { s: 1.3 });
chairsAround(C[0], C[1], 0.8, 2, Math.PI * 0.75, 0.95);
place('candle', C[0], C[1], { y: 0.55 * 1.3, s: 1.2 });


for (let i = 0; i < 3; i++) place('chair', 0.95 + i * 0.85, -2.1, { yaw: Math.PI, s: 1.45 });


place('lamp', 0.45, CZ, { y: CTOP, s: 1.0 });
place('herb', 1.2, CZ + 0.15, { y: CTOP, s: 1.0 });
place('herb', 1.6, CZ - 0.1, { y: CTOP, s: 0.8 });
place('candle', 4.0, CZ + 0.2, { y: CTOP, s: 1.0 });


pendant(A[0], A[1], 2.1, true); pendant(B[0], B[1], 2.1); pendant(C[0], C[1], 2.1);
pendant(1.2, CZ + 0.1, 2.0); pendant(2.6, CZ + 0.1, 2.0);
const lampGlow = new THREE.PointLight(0xffb866, 2.5, 2.5, 2); lampGlow.position.set(0.45, CTOP + 0.4, CZ); scene.add(lampGlow);
const lampGlow2 = new THREE.PointLight(0xffb866, 2.5, 2.5, 2); lampGlow2.position.set(B[0], 0.72 + 0.35, B[1]); scene.add(lampGlow2);
const candleGlow = new THREE.PointLight(0xff9a45, 1.2, 1.5, 2); candleGlow.position.set(A[0] - 0.12, TOP + 0.3, A[1] + 0.05); scene.add(candleGlow);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight);
});
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = clock.getDelta(), t = clock.elapsedTime;
  mixers.forEach((m) => m.update(dt));
  candleGlow.intensity = 1.1 + Math.sin(t * 9) * 0.12 + Math.sin(t * 23) * 0.06;
  controls.update(); renderer.render(scene, camera);
});