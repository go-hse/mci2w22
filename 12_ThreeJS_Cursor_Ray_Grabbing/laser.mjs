import * as THREE from '../99_Lib/three.module.js';


export function create_selector_func(cursor, linefunc, array_of_objects) {

    // Raycaster
    let raycaster = new THREE.Raycaster();
    let direction = new THREE.Vector3();
    let rayEnd = new THREE.Vector3();

    // for matrix de-composition
    let position = new THREE.Vector3();
    let quaternion = new THREE.Quaternion();
    let scale = new THREE.Vector3();

    let defaultColor = new THREE.Color(0xffffff);
    let hitColor = new THREE.Color(0x00ff00);
    let grabbedColor = new THREE.Color(0xff0000);

    // grabbed: hat Benutzer bereits Objekt in der Hand?
    return (grabbed = false) => {

        // Richtung nach oben: default Richtung des Cursors
        direction.set(0, 1, 0);

        // Matrix zerlegen in Position, Rotation
        cursor.matrix.decompose(position, quaternion, scale);

        // Rotation anwenden auf Richtung
        direction.applyQuaternion(quaternion);

        // Setze Linien-Anfang auf Cursor
        linefunc(0, cursor.position);

        // setze Position und Richtung des Ray-Casters
        raycaster.set(cursor.position, direction);

        // Durchfuerhung der Intersektion
        let intersects = raycaster.intersectObjects(array_of_objects);

        // Falls Objekte getroffen
        if (intersects.length > 0) {
            // Unterschiedliche Farbe falls gegriffen
            if (grabbed) {
                linefunc(1, intersects[0].point, grabbedColor);
            } else {
                linefunc(1, intersects[0].point, hitColor);
            }
            // Rueckgabe: 1. getroffenes Objekt
            return intersects[0].object;
        } else {
            // Falls nichts getroffen: berechne Endpunkt des Lasers im "Unendlichen"
            rayEnd.addVectors(cursor.position, direction.multiplyScalar(20));
            linefunc(1, rayEnd, defaultColor);
        }
    }
}

export function create_stretch_line_func(scene) {
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


