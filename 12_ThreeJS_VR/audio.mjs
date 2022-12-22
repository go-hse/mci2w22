import * as THREE from 'three';


export function audioPlayer(camera, parent, url, eventbus) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    // create the PositionalAudio object (passing in the listener)
    const sound = new THREE.PositionalAudio(listener);

    // load a sound and set it as the PositionalAudio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(url, function (buffer) {
        sound.setBuffer(buffer);
        sound.setRefDistance(20);
        parent.add(sound);
    });

    let playing = false;

    eventbus.subscribe("play_audio", () => {
        if (!playing) {
            playing = true;
            sound.play();
            setTimeout(() => {
                playing = false;
            }, 500);
        }
    });

    return sound;
}
