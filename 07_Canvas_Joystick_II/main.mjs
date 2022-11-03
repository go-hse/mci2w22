import { line, rect, circle, text, image, path, tri_path, drawPathFunc } from "./lib.mjs";
import { createMoveable, createJoystick } from "./moveable.mjs";

const FONTSIZE = 30;

(function Init() {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");
    let ship = createMoveable(ctx, 200, 200, tri_path(), 20);
    let joystick = createJoystick(ctx, 40, ship.move);

    const nativeWidth = 1024;
    const nativeHeight = 768;

    let scale = 1.0;
    const FILLSCALE = false;
    ctx.imageSmoothingEnabled = true;

    console.log(new Date());

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
        let scaleFillNative = Math.max(cnv.width / nativeWidth, cnv.height / nativeHeight);
        let scaleFitNative = Math.min(cnv.width / nativeWidth, cnv.height / nativeHeight);
        scale = FILLSCALE ? scaleFillNative : scaleFitNative;
        joystick.resize(nativeWidth, nativeHeight, scale);
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

    const BORDER = 20;
    function draw() {
        ctx.resetTransform();
        ctx.scale(scale, scale);
        ctx.font = FONTSIZE + "px Arial";
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        rect(ctx, BORDER, BORDER, nativeWidth - 2 * BORDER, nativeHeight - 2 * BORDER, "#aaa");
        text(ctx, 10, 20, info);
        joystick.draw();
        ship.draw();


        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}());

