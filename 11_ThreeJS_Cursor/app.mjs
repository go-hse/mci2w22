// Mini Three.js

import * as THREE from '../99_Lib/three.module.js';

import { mouse, keyboardInteractionFunction } from "./mouse_keyboard.mjs"
import { createScene, boxesWithPlane, createCursor } from './scene.mjs';

window.onload = function () {
    console.log("ThreeJs " + THREE.REVISION);

    let { scene, camera, renderer } = createScene();

    let world = new THREE.Group();
    world.matrixAutoUpdate = false;
    scene.add(world);

    boxesWithPlane(world, 100);

    let cursor = createCursor(scene);
    mouse(cursor);

    const updateByKeyboard = keyboardInteractionFunction();

    function render() {
        updateByKeyboard(world);
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);
};
