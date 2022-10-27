import { drawPathFunc, distance } from "./lib.mjs";


const SAMPLES = 10;
const MIN_DIST = 20;

function createMoveable(ctx, x, y, path) {
    let pipe = [];
    let alpha = 0;
    let inside = false;
    let drawfunc = drawPathFunc(ctx, path, 20);
    let matrix = drawfunc(x, y, alpha, "#333");
    let localInverse = DOMMatrix.fromMatrix(matrix); // matrix = M/L
    localInverse.invertSelf();

    function draw() {
        if (inside) {
            matrix = drawfunc(x, y, alpha, "#333");
            if (pipe.length > 5) {
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.moveTo(pipe[0].x, pipe[0].y);
                for (let i = 1; i < pipe.length; ++i) {
                    let pt = pipe[i];
                    ctx.lineTo(pt.x, pt.y);
                }
                ctx.stroke();
            }
        } else {
            matrix = drawfunc(x, y, alpha, "#339");
        }
    }

    let ox, oy, ident;
    function isInside(identifier, ix, iy) {
        let localTouchPoint = localInverse.transformPoint(new DOMPoint(ix, iy));
        inside = ctx.isPointInPath(path, localTouchPoint.x, localTouchPoint.y);
        if (inside) {
            ident = identifier;
            ox = ix;
            oy = iy;
            pipe = [];
        }
    }

    function move(identifier, nx, ny) {
        if (ident === identifier) {
            pipe.push({ x: nx, y: ny });
            if (pipe.length > SAMPLES) {
                let { x, y } = pipe.shift();
                if (distance(nx, ny, x, y) > MIN_DIST) {
                    alpha = Math.atan2(y - ny, x - nx) + Math.PI / 2;
                }
            }
            x += nx - ox;
            y += ny - oy;
            ox = nx;
            oy = ny;
        }
    }

    function reset(identifier) {
        if (ident === identifier) {
            inside = false;
            ident = undefined;
            localInverse = DOMMatrix.fromMatrix(matrix); // matrix = M/L
            localInverse.invertSelf();
        }
    }
    return {
        draw, reset, isInside, move
    };
}


export { createMoveable };