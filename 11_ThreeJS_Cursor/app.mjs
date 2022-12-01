// Mini Three.js

import * as THREE from '../99_Lib/three.module.js';

import { mouse, keyboardInteractionFunction } from "./mouse_keyboard.mjs"
import { createScene, boxesWithPlane, createCursor, boxes2Grab, createLine } from './scene.mjs';

window.onload = function () {
    console.log("ThreeJs " + THREE.REVISION);

    let { scene, camera, renderer } = createScene();

    let world = new THREE.Group();
    world.matrixAutoUpdate = false;
    scene.add(world);

    boxesWithPlane(world, 1000);

    let cursor = createCursor(scene);
    mouse(cursor);

    let boxes = boxes2Grab(scene, 30);
    let lineFunc = createLine(scene);


    const updateByKeyboard = keyboardInteractionFunction();

    let rayEnd = new THREE.Vector3();

    let position = new THREE.Vector3();
    let rotation = new THREE.Quaternion();
    let scale = new THREE.Vector3();

    let rayCaster = new THREE.Raycaster();

    let initialGrabbed, selectedObject;

    function render() {
        let grabbed = updateByKeyboard(world);
        lineFunc(0, cursor.position);

        let direction = new THREE.Vector3(0, 1, 0);
        cursor.matrix.decompose(position, rotation, scale);
        direction.applyQuaternion(rotation);

        rayCaster.set(cursor.position, direction);
        let intersects = rayCaster.intersectObjects(boxes);
        if (intersects.length > 0) {
            lineFunc(1, intersects[0].point);
            selectedObject = intersects[0].object;
            if (grabbed) {
                if (initialGrabbed === undefined) {
                    initialGrabbed = cursor.matrix.clone().invert().multiply(selectedObject.matrix);
                } else {
                    selectedObject.matrix.copy(cursor.matrix.clone().multiply(initialGrabbed));
                }
            } else {
                initialGrabbed = undefined;
                selectedObject = undefined;
            }

        } else {
            rayEnd.addVectors(cursor.position, direction.multiplyScalar(20));
            lineFunc(1, rayEnd);
        }

        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);
};
