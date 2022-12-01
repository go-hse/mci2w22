import * as THREE from '../99_Lib/three.module.js';

export function createScene() {
    let scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0x808080, 0x606060));
    let light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(4, 16, 5);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);

    let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 2);
    scene.add(camera);

    let renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    document.body.appendChild(renderer.domElement);
    return { scene, camera, renderer };
}


export function boxesWithPlane(parent, noOfBoxes = 100) {
    for (let i = 0; i < noOfBoxes; ++i) {
        let height = Math.random() + 0.1;
        let box = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, 0.1), new THREE.MeshStandardMaterial({
            color: 0x1e13f0,
            roughness: 0.7,
            metalness: 0.0,
        }));
        box.position.x = Math.random() * 5 - 2.5;
        box.position.y = Math.random() * 0.1 - 1.01;
        box.position.z = Math.random() * 5 - 2.5;
        box.castShadow = true;
        parent.add(box);
    }

    let plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    plane.receiveShadow = true;
    plane.position.set(0, -1, 0);
    plane.rotation.x = Math.PI / 2;
    parent.add(plane);
}

export function createCursor(parent) {
    let cursor = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.2, 64), new THREE.MeshStandardMaterial({
        color: 0xff13f0,
        roughness: 0.7,
        metalness: 0.0,
    }));
    cursor.castShadow = true;

    parent.add(cursor);
    return cursor;
}