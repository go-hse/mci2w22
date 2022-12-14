// Ray and Grabbing

import * as THREE from '../99_Lib/three.module.js';

import { mouse, keyboardInteractionFunction } from "./mouse_keyboard.mjs"
import { createScene, boxesWithPlane, createCursor, randomBoxes, randomLines } from './scene.mjs';
import { create_stretch_line_func, create_selector_func } from './laser.mjs';

window.onload = function () {
    console.log("ThreeJs " + THREE.REVISION);

    let { scene, camera, renderer } = createScene();

    let world = new THREE.Group();
    world.matrixAutoUpdate = false;
    scene.add(world);

    let c1 = new THREE.Color(0x00ff00);

    const boxes = randomBoxes(scene, 10);
    boxesWithPlane(world, 100);

    let cursor = createCursor(scene);
    mouse(cursor);

    const linefunc = create_stretch_line_func(scene);
    let selectorfunc = create_selector_func(cursor, linefunc, boxes);

    const updateByKeyboard = keyboardInteractionFunction();
    const center = new THREE.Vector3(0, 0, 0);
    linefunc(0, center, c1);


    /////////////////////////////////////////////////
    /// Grabbing
    let initialGrabbed, selectedObject;

    function grabbing(grabbed) {
        let currentObject = selectorfunc(initialGrabbed !== undefined);
        if (initialGrabbed === undefined) {
            selectedObject = currentObject;
        }

        if (selectedObject && grabbed) {
            if (initialGrabbed === undefined) {
                initialGrabbed = cursor.matrix.clone().invert().multiply(selectedObject.matrix); // Ci-1 * Li
            } else {
                selectedObject.matrix.copy(cursor.matrix.clone().multiply(initialGrabbed)); // Ln = Cn * Ci-1 * Li 
            }
        } else {
            initialGrabbed = undefined;
            selectedObject = undefined;
        }
    }

    function render() {
        let { grabbed } = updateByKeyboard(world);
        grabbing(grabbed);
        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);
};
