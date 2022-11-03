import { line, rect, circle, text, image, path, tri_path, drawPathFunc } from "./lib.mjs";
import { createMoveable, createJoystick } from "./moveable.mjs";

const FONTSIZE = 30;

(function Init() {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");
    let ship = createMoveable(ctx, 200, 200, tri_path(), 10);
    let joystick = createJoystick(ctx, 40, ship.move);


    ctx.imageSmoothingEnabled = true;

    console.log(new Date());

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
        joystick.resize(cnv.width, cnv.height);
    }
    addEventListener("resize", resize);

    cnv.addEventListener("touchstart", (evt) => {
        evt.preventDefault();
        joystick.is_touched(evt.changedTouches);
    }, true);

    cnv.addEventListener("touchmove", (evt) => {
        evt.preventDefault();
        joystick.move(evt.changedTouches);
    }, true);

    cnv.addEventListener("touchend", (evt) => {
        evt.preventDefault();
        joystick.reset(evt.changedTouches);
    }, true);

    let info = "no info";

    function draw() {
        ctx.resetTransform();
        ctx.font = FONTSIZE + "px Arial";
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        text(ctx, 10, 20, info);
        joystick.draw();
        ship.draw();
        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}());

