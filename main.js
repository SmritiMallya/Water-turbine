import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from "https://cdn.jsdelivr.net/npm/dat.gui@0.7.9/build/dat.gui.module.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minDistance = 2;
controls.maxDistance = 50;

const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xff0083 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = -0.25;
scene.add(base);

const bladeGeometry = new THREE.BoxGeometry(0.1, 2, 1.2);
const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

const blades = [];
for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.rotation.y = (i * Math.PI * 2) / 3;
    blade.position.y = 0.5;
    blades.push(blade);
    scene.add(blade);
}

const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(5, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

const ambientLight = new THREE.AmbientLight(0xeeeeee, 0.5);
scene.add(ambientLight);

camera.position.set(5, 5, 5);

const gui = new dat.GUI();
const params = {
    rotationSpeed: 0.05,
    rotationDirection: 'Clockwise'
};

gui.add(params, 'rotationSpeed', 0, 0.2).name('Blade Rotation Speed');
gui.add(params, 'rotationDirection', ['Clockwise', 'Counterclockwise']).name('Rotation Direction');

function animate() {
    requestAnimationFrame(animate);

    blades.forEach(blade => {
        blade.rotation.y += params.rotationDirection === 'Clockwise' ? params.rotationSpeed : -params.rotationSpeed;
    });

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();