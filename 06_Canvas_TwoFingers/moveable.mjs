import { drawPathFunc, distance } from "./lib.mjs";


function createMoveable(ctx, x, y, path, scale) {
    let alpha = 0;
    let no_of_fingers = 0;
    let inside = {};
    let drawfunc = drawPathFunc(ctx, path);
    let matrix = drawfunc(x, y, alpha, scale, "#333");
    let localInverse = DOMMatrix.fromMatrix(matrix); // matrix = M/L
    localInverse.invertSelf();

    let o_alpha = 0, o_distance = 0;
    function draw() {
        if (no_of_fingers === 0) {
            matrix = drawfunc(x, y, alpha, scale, "#333");
        }
        if (no_of_fingers === 1) {
            matrix = drawfunc(x, y, alpha, scale, "#339");
        }
        if (no_of_fingers === 2) {
            matrix = drawfunc(x, y, alpha, scale, "#939");
        }
        localInverse = DOMMatrix.fromMatrix(matrix); // matrix = M/L
        localInverse.invertSelf();
    }

    function isInside(identifier, ix, iy) {
        let localTouchPoint = localInverse.transformPoint(new DOMPoint(ix, iy));
        if (ctx.isPointInPath(path, localTouchPoint.x, localTouchPoint.y)) {
            inside[identifier] = {
                x: ix,
                y: iy,
                dx: 0,
                dy: 0
            }
        }
        let keys = Object.keys(inside);
        let f0 = keys[0];
        let f1 = keys[1];
        no_of_fingers = keys.length;
        if (no_of_fingers === 2) {
            o_alpha = Math.atan2(inside[f1].y - inside[f0].y, inside[f1].x - inside[f0].x);
            o_distance = distance(inside[f0].x, inside[f0].y, inside[f1].x, inside[f1].y)
        }
    }

    function move(touches) {
        for (let t of touches) {
            if (t.identifier in inside) {
                let o = inside[t.identifier];
                o.dx = t.pageX - o.x;
                o.dy = t.pageY - o.y;
                o.x = t.pageX;
                o.y = t.pageY;
            }
        }

        switch (no_of_fingers) {
            case 1:
                let f = Object.keys(inside)[0];
                x += inside[f].dx;
                y += inside[f].dy;
                break;
            case 2:
                let keys = Object.keys(inside);
                let f0 = keys[0];
                let f1 = keys[1];
                x += (inside[f0].dx + inside[f1].dx) / 2;
                y += (inside[f0].dy + inside[f1].dy) / 2;

                let n_alpha = Math.atan2(inside[f1].y - inside[f0].y, inside[f1].x - inside[f0].x);
                let n_distance = distance(inside[f0].x, inside[f0].y, inside[f1].x, inside[f1].y)
                alpha += n_alpha - o_alpha;
                scale *= n_distance / o_distance;
                o_alpha = n_alpha;
                o_distance = n_distance;
                break;
        }
    }

    function reset(identifier) {
        if (identifier in inside) {
            delete inside[identifier];
            no_of_fingers = Object.keys(inside).length;
        }
    }
    return {
        draw, reset, isInside, move
    };
}


export { createMoveable };