function rect(ctx, x, y, w, h, fillStyle = "#f00", strokeStyle = "#fff", lineWidth = 1) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
}

function line(ctx, x1, y1, x2, y2, strokeStyle = "#fff", lineWidth = 1) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

const startAngle = 0;
const endAngle = Math.PI * 2;

function circle(ctx, x, y, radius, fillStyle = "#fff", strokeStyle = "#000", lineWidth = 1) {
    ctx.fillStyle = fillStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;

    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, true);
    ctx.fill();
    ctx.stroke();
}

function text(ctx, x, y, txt, fillStyle = "#fff") {
    ctx.fillStyle = fillStyle;
    let bb = ctx.measureText(txt);
    ctx.fillText(txt, x - bb.width / 2, y + bb.actualBoundingBoxAscent / 2);
}


function u_path() {
    let upath = new Path2D();
    upath.moveTo(-2, -2);
    upath.lineTo(-2, 2);
    upath.lineTo(-1, 2);
    upath.lineTo(-1, -1);
    upath.lineTo(1, -1);
    upath.lineTo(1, 2);
    upath.lineTo(2, 2);
    upath.lineTo(2, -2);
    upath.closePath();
    return upath;
}

function path(ctx, p, x, y, angle, sc = 1, fillStyle = "#fff", strokeStyle = "#000", lineWidth = 1) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(sc, sc);

    ctx.fillStyle = fillStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fill(p);
    ctx.stroke(p);
    ctx.restore();
}

const FONTSIZE = 30;

(function Init() {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");

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

    let len = 0;
    let info = "no info";
    function draw() {
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        ctx.font = FONTSIZE + "px Arial";

        path(ctx, the_path, 200, 200, Math.PI / 10, 30, "#fff", "#000", 0.1);
        rect(ctx, 200, 200, 10, 10, "#f00");

        text(ctx, 30, 10, info);
        if (fingers.length !== len) {
            info = `${len} -> ${fingers.length}`;
            len = fingers.length;
        }
        for (let f in fingers) {
            circle(ctx, fingers[f].x, fingers[f].y, 45, "#f00");
        }
        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}());

