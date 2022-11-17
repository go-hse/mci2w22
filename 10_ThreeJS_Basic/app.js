import * as THREE from '../99_Lib/three.module.js';
console.log("ThreeJs " + THREE.REVISION);

let scene = new THREE.Scene();
scene.add(new THREE.HemisphereLight(0x202080, 0x606060));

let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(4, 16, 5);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

scene.add(light);

let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 3);
scene.add(camera);

let box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.2),
    new THREE.MeshStandardMaterial({
        color: 0xff1300,
        flatShading: true
    }));
box.castShadow = true;
scene.add(box);

let static_box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1),
    new THREE.MeshStandardMaterial({
        color: 0xff13f0,
        flatShading: true
    }));

static_box.castShadow = true;

scene.add(static_box);
static_box.position.x = 0.5;

let renderer = new THREE.WebGLRenderer({
    antialias: false
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

let planegeometry = new THREE.PlaneGeometry(2, 2, 64);
let planematerial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })

let plane = new THREE.Mesh(planegeometry, planematerial);
plane.receiveShadow = true;
plane.position.set(0, -0.5, 0);
plane.rotation.x = Math.PI / 2;
scene.add(plane);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function render(time) {
    renderer.render(scene, camera);
    // box.rotation.x = time / 1000;
    box.rotation.y = time / 2000;
}

renderer.setAnimationLoop(render);
