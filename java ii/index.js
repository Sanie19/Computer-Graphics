import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 7, 12);


const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe:true });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);


const pointLight = new THREE.PointLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 1);

scene.add(pointLight, ambientLight);


const earthOrbit = new THREE.Group();
scene.add(earthOrbit);

const earthGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2266ff, wireframe:true });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

earth.position.x = 3;
earthOrbit.add(earth);


const moonOrbit = new THREE.Group();
earth.add(moonOrbit);

const moonGeometry = new THREE.SphereGeometry(0.12, 16, 16);
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

moon.position.x = 0.7;
moonOrbit.add(moon);


const marsOrbit = new THREE.Group();
scene.add(marsOrbit);

const marsGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const marsMaterial = new THREE.MeshStandardMaterial({ color: 0xcc4422, wireframe:true });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);

mars.position.x = 5;
marsOrbit.add(mars);


const phobosOrbit = new THREE.Group();
mars.add(phobosOrbit);

const phobosGeometry = new THREE.SphereGeometry(0.08, 16, 16);
const phobosMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const phobos = new THREE.Mesh(phobosGeometry, phobosMaterial);

phobos.position.x = 0.5;
phobosOrbit.add(phobos);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene').appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


function animate() {
    requestAnimationFrame(animate);

   
    earthOrbit.rotation.y += 0.005;
    earth.rotation.y += 0.01;

    
    moonOrbit.rotation.y += 0.03;

  
    marsOrbit.rotation.y += 0.003;
    mars.rotation.y += 0.008;

    
    phobosOrbit.rotation.y += 0.05;

    controls.update();
    renderer.render(scene, camera);
}

animate();
