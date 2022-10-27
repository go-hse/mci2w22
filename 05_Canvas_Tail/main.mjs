import { line, rect, circle, text, image, path, tri_path, drawPathFunc } from "./lib.mjs";
import { createMoveable } from "./moveable.mjs";

const FONTSIZE = 30;

(function Init() {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");
    let cursor = createMoveable(ctx, 100, 100, tri_path());

    ctx.imageSmoothingEnabled = true;

    console.log(new Date());

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
    }
    addEventListener("resize", resize);

    cnv.addEventListener("touchstart", (evt) => {
        evt.preventDefault();
        for (let e of evt.changedTouches) {
            cursor.isInside(e.identifier, e.pageX, e.pageY);
        }
    }, true);

    cnv.addEventListener("touchmove", (evt) => {
        evt.preventDefault();
        for (let e of evt.changedTouches) {
            cursor.move(e.identifier, e.pageX, e.pageY);
        }
    }, true);

    cnv.addEventListener("touchend", (evt) => {
        evt.preventDefault();
        for (let e of evt.changedTouches) {
            cursor.reset(e.identifier);
        }
    }, true);

    let info = "no info";

    function draw() {
        ctx.resetTransform();
        ctx.font = FONTSIZE + "px Arial";
        ctx.clearRect(0, 0, cnv.width, cnv.height);
        text(ctx, 10, 20, info);
        cursor.draw();
        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}());

