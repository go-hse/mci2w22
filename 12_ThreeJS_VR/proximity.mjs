import * as THREE from 'three';


export function proximitySensor(scene, name, position, eventbus) {

    // radius, widthSegments, heightSegments
    const radius = 0.1;
    const proximityDistance = 5;
    const segments = 16;
    const geometry = new THREE.SphereGeometry(radius, segments * 2, segments);

    const material = new THREE.MeshStandardMaterial({
        color: 0x1e13f0,
        roughness: 0.7,
        metalness: 0.0,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphere.position.copy(position);

    eventbus.subscribe("cursor_position", (pos) => {
        const dist = position.distanceTo(pos);
        const condition = dist < proximityDistance * radius;
        eventbus.publish(condition ? `${name}On` : `${name}Off`, true);
        if (condition) {
            sphere.material.color.setHex(0xff0000);
            eventbus.publish("play_audio", true);
        } else {
            sphere.material.color.setHex(0xffff00);
        }
    });

}