import { line, rect, circle, text, image, path, u_path } from "./lib.mjs";

const FONTSIZE = 30;

(function Init() {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");
    ctx.imageSmoothingEnabled = true;

    let draw_logo = image(ctx, "./img/hse.png", 0.2);

    console.log(new Date());

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
    }
    addEventListener("resize", resize);

    cnv.addEventListener("touchstart", (evt) => {
        evt.preventDefault();
        setFingers(evt.changedTouches);
    }, true);

    cnv.addEventListener("touchmove", (evt) => {
        evt.preventDefault();
        moveFingers(evt.changedTouches);
    }, true);

    cnv.addEventListener("touchend", (evt) => {
        evt.preventDefault();
        rmFingers(evt.changedTouches);
    }, true);


    const the_path = u_path();

    let fingers = {};

    function setFingers(touches) {
        for (let t of touches) {
            console.log(`add ${t.identifier}`);
            fingers[t.identifier] = {
                x: t.pageX,
                y: t.pageY,
            };
        }
    }

    function moveFingers(touches) {
        for (let t of touches) {
            fingers[t.identifier] = {
                x: t.pageX,
                y: t.pageY,
            };
        }
    }

    function rmFingers(touches) {
        for (let t of touches) {
            delete fingers[t.identifier];
        }
    }

    let info = "no info";

    function draw() {
        ctx.resetTransform();
        ctx.font = FONTSIZE + "px Arial";
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        path(ctx, the_path, 200, 200, Math.PI / 2, 30, "#fff", "#000", 0.1);
        rect(ctx, 200, 200, 10, 10, "#f00");

        text(ctx, 10, 20, info);
        draw_logo(100, 400, 0);
        for (let f in fingers) {
            circle(ctx, fingers[f].x, fingers[f].y, 45, "#f00");
        }
        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}());

