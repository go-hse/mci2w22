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

function randomColor() {
    let grays = [];
    let colors = [];
    const NO_OF_COLORS = 10;
    for (let i = 0; i < NO_OF_COLORS; ++i) {
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        grays.push(new THREE.Color(`rgb(${g}, ${g}, ${g})`))
        colors.push(new THREE.Color(`rgb(${r}, ${g}, ${b})`))
    }

    return (use_gray = false) => {
        let idx = Math.floor(Math.random() * NO_OF_COLORS);
        if (use_gray) {
            return grays[idx];
        } else {
            return colors[idx];
        }
    };
}


export function randomBoxes(parent, noOfBoxes = 100) {
    let arr = [];
    const rc = randomColor();
    for (let i = 0; i < noOfBoxes; ++i) {
        let height = Math.random() * 0.2 + 0.2;
        let box = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, 0.1), new THREE.MeshStandardMaterial({
            color: rc(true),
            roughness: 0.7,
            metalness: 0.0,
        }));
        box.position.x = Math.random() - 0.5;
        box.position.y = Math.random() - 0.5;
        box.position.z = Math.random() - 0.5;
        box.rotation.x = Math.random() * Math.PI;
        box.rotation.z = Math.random() * Math.PI;
        box.castShadow = true;
        box.updateMatrix();
        box.matrixAutoUpdate = false;
        parent.add(box);
        arr.push(box);
    }
    return arr;
}

export function randomLines(parent, noOfLines = 100) {
    const rc = randomColor();
    for (let i = 0; i < noOfLines; ++i) {
        const points = [];

        let material = new THREE.LineBasicMaterial({
            color: rc()
        });

        let p1 = new THREE.Vector3(0, 1, 0);
        points.push(p1.randomDirection());
        points.push(new THREE.Vector3(0, 0, 0));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        parent.add(new THREE.Line(geometry, material));
    }
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

export function create_stretch_line(scene) {
    let material = new THREE.LineBasicMaterial({
        color: 0xffffff
    });

    const points = [];
    points.push(new THREE.Vector3(- 10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    let line = new THREE.Line(geometry, material);
    scene.add(line);

    // Liste der Koordinaten im Puffer
    let positions = line.geometry.attributes.position.array;

    // idx: Index des Punktes im Array: 0 oder 1
    return (idx, pos, color) => {
        idx *= 3;  // gehe auf x-Position
        positions[idx++] = pos.x;
        positions[idx++] = pos.y;
        positions[idx++] = pos.z;
        line.geometry.attributes.position.needsUpdate = true

        // falls die Linien-Farbe geändert wurde
        if (line.material.color !== color) {
            line.material.color = color
            line.material.needsUpdate = true;
        }
    }
}
