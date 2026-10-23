import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbde0fe);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(3, 2, 5);
camera.lookAt(0, 0.5, 0);


const houseGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
const houseMaterial = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });
const house = new THREE.Mesh(houseGeometry, houseMaterial);
house.position.y=1;
scene.add(house);


const roofGeometry = new THREE.ConeGeometry(1.3, 1, 32);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x994422 });
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 2.5;
scene.add(roof);



const light = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(3, 5, 5);
scene.add(directionalLight);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


function animate() {
    requestAnimationFrame(animate);

   controls.update();
    // house.rotation.y += 0.0005;
    // roof.rotation.x += 0.0005;

    renderer.render(scene, camera);
}

animate();

