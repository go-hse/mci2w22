import * as THREE from '../99_Lib/three.module.js';

export function keyboard() {
    let keys = {};

    function toggle(event, active) {
        if (keys[event.key]) {
            let ko = keys[event.key];
            if (ko.active != active) {
                ko.active = active;
                ko.callback(active)
            }
            event.preventDefault();
            event.stopPropagation();
        } else {
            console.log("unused key", event.key);
        }
    }

    document.addEventListener('keydown', ev => toggle(ev, true));
    document.addEventListener('keyup', ev => toggle(ev, false));

    return function (key, callback) {
        keys[key] = {
            active: false,
            callback
        };
    }
}

export function mouse(cursor) {
    const movescale = 0.002;
    let mb = [false, false, false, false]

    function toggle(event, active) {
        mb[event.which] = active;
    }

    function onMouseMove(event) {
        let dx = event.movementX * movescale;
        let dy = event.movementY * movescale;
        let rot = event.ctrlKey;
        if (!rot && mb[1]) {
            cursor.position.x += dx;
            cursor.position.y -= dy;
        }
        if (!rot && mb[3]) {
            cursor.position.x += dx;
            cursor.position.z += dy;
        }
        if (rot && mb[1]) {
            cursor.rotation.y += dx;
            cursor.rotation.x -= dy;
        }
        if (rot && mb[3]) {
            cursor.rotation.y += dx;
            cursor.rotation.z -= dy;
        }
    }

    document.addEventListener('mousedown', ev => toggle(ev, true));
    document.addEventListener('mouseup', ev => toggle(ev, false));
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('contextmenu', event => {
        event.preventDefault();
        event.stopPropagation();
        return false;
    }, false);
}


export function keyboardInteractionFunction() {
    let forward = 0, leftright = 0, speed = 0.01, grabbed = false;

    let addKey = keyboard();

    addKey("Escape", down => {
        forward = 0;
        leftright = 0;
    });

    addKey("ArrowUp", down => {
        forward += speed;
    });

    addKey("ArrowDown", down => {
        forward -= speed;
    });

    addKey("ArrowLeft", down => {
        leftright -= 0.01;
    });

    addKey("ArrowRight", down => {
        leftright += 0.01;
    });

    addKey(" ", down => {
        grabbed = down;
    });


    let rot_speed = new THREE.Quaternion();
    let trans_speed = new THREE.Vector3();
    let scale = new THREE.Vector3(1, 1, 1);
    let speed_matrix = new THREE.Matrix4();

    return (world) => {
        trans_speed.z = forward;
        rot_speed.setFromAxisAngle(new THREE.Vector3(0, 1, 0), leftright);
        speed_matrix.compose(trans_speed, rot_speed, scale);
        world.matrix.premultiply(speed_matrix);
        return { grabbed };
    }
}