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

let camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(0, 0, 3);
scene.add(camera);

let box = new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, 0.2),
    new THREE.MeshStandardMaterial({
        color: 0x0013ff,
        flatShading: true
    }));
box.castShadow = true;
box.position.x = -1;
scene.add(box);

let static_box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1, 0.1),
    new THREE.MeshStandardMaterial({
        color: 0xff13f0,
        flatShading: true
    }));

static_box.castShadow = true;

let cursor = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.5, 4), new THREE.MeshStandardMaterial({
    color: 0xff0000,
    roughness: 0.7,
    metalness: 0.0,
}));
cursor.castShadow = true;

scene.add(cursor);

function keyboard() {
    let keys = {};


    function toggle(ev, active) {
        if (keys[ev.key] !== undefined) {
            let ko = keys[ev.key];
            if (ko.active !== active) {
                ko.active = active;
                ko.cb();
            }
            ev.preventDefault();
            ev.stopPropagation();
        } else {
            if (active === false) console.log(`Key ${ev.key} is not used`);
        }
    }
    document.addEventListener('keydown', ev => toggle(ev, true), false);
    document.addEventListener('keyup', ev => toggle(ev, false), false);
    return function (key, cb) {
        keys[key] = { active: false, cb };
    }
}

const addKey = keyboard();

addKey("Escape", () => { console.log("Escape") });
addKey("ArrowUp", () => { console.log("Up") });
addKey("ArrowDown", () => { console.log("Up") });
addKey("ArrowLeft", () => { console.log("Up") });
addKey("ArrowRight", () => { console.log("Up") });

function mouse() {
    const mouseScale = 0.002;
    let mb = [false, false, false, false];


    function onMouseMove(event) {
        const rot = event.ctrlKey;
        if (!rot && mb[0]) {
            cursor.position.x += event.movementX * mouseScale;
            cursor.position.y -= event.movementY * mouseScale;
        }
        if (!rot && mb[2]) {
            cursor.position.x += event.movementX * mouseScale;
            cursor.position.z += event.movementY * mouseScale;
        }
        if (rot && mb[0]) {
            cursor.rotation.x += event.movementX * mouseScale;
            cursor.rotation.y -= event.movementY * mouseScale;
        }
        if (rot && mb[2]) {
            cursor.rotation.x += event.movementX * mouseScale;
            cursor.rotation.z += event.movementY * mouseScale;
        }
    }

    document.addEventListener('contextmenu', event => {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }, false);

    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mousedown', ev => mb[ev.button] = true, false);
    document.addEventListener('mouseup', ev => mb[ev.button] = false, false);
}

mouse();

scene.add(static_box);
static_box.position.x = 0.5;

let renderer = new THREE.WebGLRenderer({
    antialias: false
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

let planegeometry = new THREE.PlaneGeometry(10, 10, 64);
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
    box.rotation.x = time / 1000;
    // box.rotation.y = time / 2000;
}

renderer.setAnimationLoop(render);
