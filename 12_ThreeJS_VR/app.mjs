import * as THREE from 'three';

import { mouse, keyboardInteractionFunction } from "./mouse_keyboard.mjs"
import { createScene, boxesWithPlane, createCursor, boxes2Grab, createLine, createArrow } from './scene.mjs';
import { createVRcontrollers } from './vr.mjs';

window.onload = function () {
    console.log(`ThreeJs ${THREE.REVISION} at ${new Date()}`);

    let { scene, camera, renderer } = createScene(true);

    let world = new THREE.Group();
    world.matrixAutoUpdate = false;
    scene.add(world);

    let cursorFly = createArrow(scene, 0xff0000);
    cursorFly.visible = false;

    let cursorMove = createArrow(scene, 0x00ff00, 0.012);
    cursorMove.visible = false;

    boxesWithPlane(world, 100);
    let cursor = createCursor(scene);
    mouse(cursor);

    let last_active_controller, last_active_inputsource;
    let { controller1, controller2 } = createVRcontrollers(scene, renderer, (current, src) => {
        // called if/when controllers connect
        cursor.matrixAutoUpdate = false;
        cursor.visible = false;
        last_active_controller = current;
        last_active_inputsource = src;
        console.log(`connected ${src.handedness} device`);
    });

    let boxes = boxes2Grab(world, 15);
    let lineFunc = createLine(scene);

    const updateByKeyboard = keyboardInteractionFunction();

    let rayEnd = new THREE.Vector3();

    // postion/rotation is used to decompose cursor-matrix
    let position = new THREE.Vector3();
    let rotation = new THREE.Quaternion();
    let scale = new THREE.Vector3();

    // flying
    let initialPosition = new THREE.Vector3();
    let deltaFlyRotation = new THREE.Quaternion();
    const flySpeedRotationFactor = 0.01;
    const flySpeedTranslationFactor = -0.02;

    let rayCaster = new THREE.Raycaster();

    // 
    let initialGrabbed, inverseHand, inverseWorld, selectedObject, distance;

    function render() {
        let grabbed, squeezed, direction;

        // cursor is controlled by VR-interface OR by mouse/keyboard
        if (last_active_controller) {
            cursor.matrix.copy(last_active_controller.matrix);
            grabbed = controller1.controller.userData.isSelecting || controller2.controller.userData.isSelecting;
            squeezed = controller1.controller.userData.isSqueezeing || controller2.controller.userData.isSqueezeing;

            let gamepad = last_active_inputsource.gamepad;
            if (gamepad.axes[2] !== 0 || gamepad.axes[3] !== 0) {
                console.log(`axes: ${gamepad.axes[2]} ${gamepad.axes[3]} `);
            }

            direction = new THREE.Vector3(0, 0, -1);
        } else {
            ({ grabbed, squeezed } = updateByKeyboard(world));
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
                selectedObject.matrix.copy(inverseWorld.clone().multiply(cursor.matrix).multiply(initialGrabbed));
                rayEnd.addVectors(position, direction.multiplyScalar(distance));
                lineFunc(1, rayEnd);
            } else if (hitObject) { // connect the hit object with the hand
                selectedObject = hitObject;
                inverseWorld = world.matrix.clone().invert();
                initialGrabbed = cursor.matrix.clone().invert().multiply(world.matrix).multiply(selectedObject.matrix);
                distance = hitDistance;
            } else {
                // grab the scene if no object is hit
                if (initialGrabbed) {
                    world.matrix.copy(cursor.matrix.clone().multiply(initialGrabbed));
                } else {
                    initialGrabbed = cursor.matrix.clone().invert().multiply(world.matrix);
                }
            }
        } else {
            if (selectedObject) {
                selectedObject = undefined;
            }
            if (initialGrabbed)
                initialGrabbed = undefined;
        }


        // Navigation
        if (squeezed) {
            if (inverseHand) {
                cursorMove.matrix.copy(cursor.matrix);
                lineFunc(1, initialPosition);
                let differenceMatrix = cursor.matrix.clone().multiply(inverseHand);
                differenceMatrix.decompose(position, rotation, scale);

                // Reduce the rotation by factor 0.01
                deltaFlyRotation.set(0, 0, 0, 1);
                deltaFlyRotation.slerp(rotation.conjugate(), flySpeedRotationFactor);

                differenceMatrix.compose(position.multiplyScalar(flySpeedTranslationFactor), deltaFlyRotation, scale);
                world.matrix.premultiply(differenceMatrix);
            } else {
                cursorFly.visible = true;
                cursorMove.visible = true;
                cursorFly.matrix.copy(cursor.matrix);
                cursor.matrix.decompose(initialPosition, rotation, scale);
                inverseHand = cursor.matrix.clone().invert();
            }
        } else {
            if (inverseHand) {
                cursorFly.visible = false;
                cursorMove.visible = false;
                inverseHand = undefined;
            }
        }

        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(render);
};
