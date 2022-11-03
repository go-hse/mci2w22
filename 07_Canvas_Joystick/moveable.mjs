import { drawPathFunc, distance, circle } from "./lib.mjs";

export function createJoystick(ctx, r, cb) {
    let identifier, ialpha = undefined, rotation = 0, x = 0, y = 0;

    function draw() {
        if (identifier !== undefined) {
            if (rotation !== undefined) {
                ctx.fillStyle = "#666";
                ctx.lineWidth = 10;
                ctx.strokeStyle = "#777";
                ctx.beginPath();
                let rscale = rotation * 10;
                if (rotation < 0)
                    ctx.arc(x, y, r + 10, ialpha, ialpha + rscale, true);
                else
                    ctx.arc(x, y, r + 10, ialpha + rscale, ialpha, true);
                ctx.fill();
                ctx.stroke();
            }
            circle(ctx, x, y, r, "#ff0");
        } else
            circle(ctx, x, y, r, "#0f0");
    }

    function resize(w, h) {
        x = w - 100;
        y = h - 100;
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
                        let nalpha = Math.atan2(t.pageY - y, t.pageX - x);
                        if (ialpha === undefined) {
                            ialpha = nalpha;
                        }
                        rotation = (nalpha - ialpha) / 20;
                        cb(2 * rn / r, rotation);
                    }
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
                    ialpha = undefined;
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
    let alpha = 0, speed = 0, rotation = 0;
    let drawfunc = drawPathFunc(ctx, path);

    function draw() {
        alpha += rotation;
        x += speed * Math.cos(alpha);
        y += speed * Math.sin(alpha);
        drawfunc(x, y, alpha - Math.PI / 2, scale, "#333");
    }

    function move(s, r) {
        speed = s;
        rotation = r;
    }

    return {
        draw, move
    };
}

