import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const scene = new THREE.Scene();


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(3, 2.5, 5);


const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('scene').appendChild(renderer.domElement);



// HOUSE BODY - CUBE
// ======================

const cubeGeometry = new THREE.BoxGeometry(1.5, 1, 1.5);

const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00
});

const cube = new THREE.Mesh(
    cubeGeometry,
    cubeMaterial
);

cube.position.y = 0;

scene.add(cube);




const coneGeometry = new THREE.ConeGeometry(
    1.2,   
    1,     
    4      
);

const coneMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00
});

const cone = new THREE.Mesh(
    coneGeometry,
    coneMaterial
);


cone.position.y = 1;

cone.rotation.y = Math.PI / 4;

scene.add(cone);




const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.6
);

scene.add(ambientLight);

const pointLight = new THREE.PointLight(
    0xffffff,
    1
);

pointLight.position.set(3, 3, 3);

scene.add(pointLight);



const controls = new OrbitControls(
    camera,
    renderer.domElement
);




function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();