// Mini Three.js


import * as THREE from 'three';

import { mouse, keyboardInteractionFunction } from "./mouse_keyboard.mjs"
import { createScene, boxesWithPlane, createCursor, boxes2Grab, createLine } from './scene.mjs';
import { createVRcontrollers } from './vr.mjs';

window.onload = function () {
    console.log(`ThreeJs ${THREE.REVISION} at ${new Date()}`);

    let { scene, camera, renderer } = createScene(true);

    let world = new THREE.Group();
    world.matrixAutoUpdate = false;
    scene.add(world);

    boxesWithPlane(world, 1000);

    let cursor = createCursor(scene);
    mouse(cursor);

    let last_active_controller;
    let { controller1, controller2 } = createVRcontrollers(scene, renderer, (current) => {
        // called if/when controllers connect
        cursor.matrixAutoUpdate = false;
        cursor.visible = false;
        last_active_controller = current;
    });

    let boxes = boxes2Grab(scene, 30);
    let lineFunc = createLine(scene);

    const updateByKeyboard = keyboardInteractionFunction();

    let rayEnd = new THREE.Vector3();

    // postion/rotation is used to decompose cursor-matrix
    let position = new THREE.Vector3();
    let rotation = new THREE.Quaternion();
    let scale = new THREE.Vector3();

    let rayCaster = new THREE.Raycaster();

    // 
    let initialGrabbed, selectedObject, distance;

    function render() {
        let grabbed, direction;

        // cursor is controlled by VR-interface OR by mouse/keyboard
        if (last_active_controller) {
            cursor.matrix.copy(last_active_controller.matrix);
            grabbed = controller1.userData.isSelecting || controller2.userData.isSelecting;
            direction = new THREE.Vector3(0, 0, -1);
        } else {
            grabbed = updateByKeyboard(world);
            direction = new THREE.Vector3(0, 1, 0);
        }

        cursor.matrix.decompose(position, rotation, scale);
        lineFunc(0, position);
        direction.applyQuaternion(rotation);

        let hitObject, hitDistance;

        // no object grabbed - use the ray, find an object, stored in hitObject
        if (selectedObject === undefined) {
            rayCaster.set(position, direction);
            let intersects = rayCaster.intersectObjects(boxes);
            if (intersects.length > 0) {
                lineFunc(1, intersects[0].point);
                hitObject = intersects[0].object;
                hitDistance = intersects[0].distance;
            } else {
                rayEnd.addVectors(position, direction.multiplyScalar(20));
                lineFunc(1, rayEnd);
            }
        }

        // user presses grab-button
        if (grabbed) {
            // if an object is already connected
            if (selectedObject) {
                selectedObject.matrix.copy(cursor.matrix.clone().multiply(initialGrabbed));
                rayEnd.addVectors(position, direction.multiplyScalar(distance));
                lineFunc(1, rayEnd);
            } else if (hitObject) { // connect the hit object with the hand
                selectedObject = hitObject;
                initialGrabbed = cursor.matrix.clone().invert().multiply(selectedObject.matrix);
                distance = hitDistance;
            }
        } else {
            selectedObject = undefined;
        }


        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);
};
