import { line, rect, circle, text, image, path, u_path } from "./lib.mjs";

const FONTSIZE = 30;


function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

function createButton(ctx, x, y, r, col, cb) {
    let touched = false;

    function draw() {
        if (touched)
            circle(ctx, x, y, r, "#ff0");
        else
            circle(ctx, x, y, r, col);
    }

    function is_touched(ix, iy) {
        touched = distance(ix, iy, x, y) < r;
        if (touched) cb(col);
    }

    function reset() {
        touched = false;
    }
    return {
        draw, reset, is_touched
    };
}

(function Init() {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");
    ctx.imageSmoothingEnabled = true;

    let draw_logo = image(ctx, "./img/hse.png", 0.2);

    let buttons = [];
    let lines = [];

    let lineColor = "#fff";
    buttons.push(createButton(ctx, 100, 100, 50, "#f00", (col) => {
        lineColor = col;
    }));

    buttons.push(createButton(ctx, 200, 100, 50, "#0f0", (col) => {
        lineColor = col;
    }));

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
        lines.push({
            x: touches[0].pageX,
            y: touches[0].pageY,
            c: lineColor,
            move: true
        });
        for (let t of touches) {
            console.log(`add ${t.identifier}`);
            for (let btn of buttons) {
                btn.is_touched(t.pageX, t.pageY);
            }
            fingers[t.identifier] = {
                x: t.pageX,
                y: t.pageY,
            };
        }
        let ids = Object.keys(fingers);
        if (ids.length > 3) {
            lines = [];
        }
    }

    function moveFingers(touches) {
        lines.push({
            x: touches[0].pageX,
            y: touches[0].pageY,
            c: lineColor,
            move: false
        });

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
        for (let btn of buttons) {
            btn.reset();
        }
    }

    let info = "no info";

    function draw() {
        ctx.resetTransform();
        ctx.font = FONTSIZE + "px Arial";
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        path(ctx, the_path, 200, 200, Math.PI / 2, 30, "#fff", "#000", 0.1);
        rect(ctx, 200, 200, 10, 10, "#f00");

        for (let btn of buttons) {
            btn.draw();
        }

        if (lines.length > 0) {
            ctx.lineWidth = 5;
            ctx.beginPath();
            for (let line of lines) {
                if (!line.move) {
                    ctx.lineTo(line.x, line.y);
                } else {
                    ctx.stroke();
                    ctx.strokeStyle = line.c;
                    ctx.beginPath();
                    ctx.moveTo(line.x, line.y);
                }
            }
            ctx.stroke();
        }

        text(ctx, 10, 20, info);
        draw_logo(100, 400, 0);
        for (let f in fingers) {
            circle(ctx, fingers[f].x, fingers[f].y, 20, "#f00");
        }
        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}());

