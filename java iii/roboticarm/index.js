import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(8, 6, 12);
camera.lookAt(0, 3, 0);


const armMaterial = new THREE.MeshStandardMaterial({color: 0x3399ff});
const jointMaterial = new THREE.MeshStandardMaterial({color: 0x555555});
const handMaterial = new THREE.MeshStandardMaterial({color: 0xffaa55});
const fingerMaterial = new THREE.MeshStandardMaterial({color: 0xffcc88});


const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const base = new THREE.Mesh(baseGeometry, jointMaterial);
scene.add(base);


const shoulder = new THREE.Group();
shoulder.position.y = 0.5;
base.add(shoulder);

const shoulderJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    jointMaterial
);
shoulder.add(shoulderJoint);

const upperArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 3, 0.7),
    armMaterial
);
upperArm.position.y = 1.5;
shoulder.add(upperArm);


const elbow = new THREE.Group();
elbow.position.y = 3;
shoulder.add(elbow);

const elbowJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.45, 32, 32),
    jointMaterial
);
elbow.add(elbowJoint);

const forearm = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 2.5, 0.6),
    armMaterial
);
forearm.position.y = 1.25;
elbow.add(forearm);


const wrist = new THREE.Group();
wrist.position.y = 2.5;
elbow.add(wrist);

const wristJoint = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 32, 32),
    jointMaterial
);
wrist.add(wristJoint);


const palm = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.5, 0.4),
    handMaterial
);
palm.position.y = 0.9;
wrist.add(palm);


const fingers = [];


const fingerLengths = [0.9, 1.2, 1.05, 0.7];
const fingerPositions = [-0.55, -0.18, 0.19, 0.56];

for (let i = 0; i < 4; i++) {

    const fingerJoint = new THREE.Group();

    fingerJoint.position.set(fingerPositions[i], 0.75, 0);

    palm.add(fingerJoint);

    const fingerGeometry = new THREE.BoxGeometry(
        0.25,
        fingerLengths[i],
        0.25
    );

    const finger = new THREE.Mesh(fingerGeometry, fingerMaterial);

    finger.position.y = fingerLengths[i] / 2;

    fingerJoint.add(finger);

    fingers.push(fingerJoint);
}


const thumbJoint = new THREE.Group();

thumbJoint.position.set(-0.9, -0.25, 0);

palm.add(thumbJoint);

const thumbGeometry = new THREE.BoxGeometry(0.3, 0.65, 0.3);

const thumb = new THREE.Mesh(thumbGeometry, fingerMaterial);

thumb.position.y = 0.325;

thumbJoint.add(thumb);


thumbJoint.rotation.z = THREE.MathUtils.degToRad(45);


fingers.push(thumbJoint);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);


const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({color: 0xcccccc})
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.25;
scene.add(ground);

const grid = new THREE.GridHelper(20, 20);
scene.add(grid);


const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById('scene').appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3, 0);
controls.enableDamping = true;
controls.update();


shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

const rotationStep = THREE.MathUtils.degToRad(5);


window.addEventListener('keydown', function(event) {

    const key = event.code.startsWith('Digit')
    ? event.code.replace('Digit', '')
    : event.key.toLowerCase();

   
    if (key === 'q') shoulder.rotation.z += rotationStep;
    if (key === 'a') shoulder.rotation.z -= rotationStep;

    if (key === 'w') elbow.rotation.z += rotationStep;
    if (key === 's') elbow.rotation.z -= rotationStep;

    if (key === 'e') wrist.rotation.z += rotationStep;
    if (key === 'd') wrist.rotation.z -= rotationStep;

    
    if (key >= '1' && key <= '5') {

        const index = Number(key) - 1;

        const finger = fingers[index];

        
        const direction = event.shiftKey ? 1 : -1;

        const minAngle = index === 4
            ? THREE.MathUtils.degToRad(20)
            : THREE.MathUtils.degToRad(-80);

        const maxAngle = index === 4
            ? THREE.MathUtils.degToRad(100)
            : THREE.MathUtils.degToRad(0);

        
       finger.rotation.x = THREE.MathUtils.clamp(
       finger.rotation.x + rotationStep * direction,
       THREE.MathUtils.degToRad(-90),
       THREE.MathUtils.degToRad(0)
);

    }

});


function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();
