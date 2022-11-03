import { drawPathFunc, distance, circle } from "./lib.mjs";

const lerp = (start, end, amt) => start + (end - start) * amt
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const repeat = (t, m) => clamp(t - Math.floor(t / m) * m, 0, m);

function lerpTheta(a, b, t) {
    const dt = repeat(b - a, 2 * Math.PI);
    return lerp(a, a + (dt > Math.PI ? dt - 2 * Math.PI : dt), t);
}


export function createJoystick(ctx, r, cb) {
    let identifier, x = 0, y = 0;

    function draw() {
        if (identifier !== undefined) {
            circle(ctx, x, y, r, "#ff0");
        } else
            circle(ctx, x, y, r, "#0f0");
    }

    function resize(w, h) {
        x = w - r;
        y = h - r;
    }

    function is_touched(touches) {
        if (identifier === undefined) {
            for (let t of touches) {
                if (distance(x, y, t.pageX, t.pageY) < r) {
                    identifier = t.identifier;
                    return;
                }
            }
        }
    }

    function move(touches) {
        if (identifier !== undefined) {
            for (let t of touches) {
                if (t.identifier === identifier) {
                    let rn = distance(x, y, t.pageX, t.pageY);
                    if (rn > r) {
                        let dx = t.pageX - x;
                        let dy = t.pageY - y;
                        cb(dx, dy);
                    }
                    return;
                }
            }
        }
    }

    function reset(touches) {
        if (identifier !== undefined) {
            for (let t of touches) {
                if (t.identifier === identifier) {
                    cb(0, 0);
                    identifier = undefined;
                    return;
                }
            }
        }
    }
    return {
        draw, reset, is_touched, move, resize
    };
}


export function createMoveable(ctx, x, y, path, scale) {
    let alpha = 0, nalpha = 0, dx = 0, dy = 0, t = 0;
    let drawfunc = drawPathFunc(ctx, path);

    function draw() {
        x += dx / 10;
        y += dy / 10;
        t = t < 1 ? t + 0.1 : t;
        alpha = lerpTheta(alpha, nalpha, t);
        drawfunc(x, y, alpha - Math.PI / 2, scale, "#333");
    }

    function move(ndx, ndy) {
        dx = ndx;
        dy = ndy;
        nalpha = Math.atan2(dy, dx);
        t = 0.3;
    }

    return {
        draw, move
    };
}

