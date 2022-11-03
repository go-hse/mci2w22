export function rect(ctx, x, y, w, h, fillStyle = "#f00", strokeStyle = "#fff", lineWidth = 1) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
}

export function line(ctx, x1, y1, x2, y2, strokeStyle = "#fff", lineWidth = 1) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

const startAngle = 0;
const endAngle = Math.PI * 2;

export function circle(ctx, x, y, radius, fillStyle = "#fff", strokeStyle = "#000", lineWidth = 1) {
    ctx.fillStyle = fillStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, true);
    ctx.fill();
    ctx.stroke();
}

export function tri_path() {
    let the_path = new Path2D();
    the_path.moveTo(2, 0);
    the_path.lineTo(0, 5);
    the_path.lineTo(-2, 0);
    the_path.lineTo(-4, -1);
    the_path.lineTo(-2, -2);
    the_path.lineTo(2, -2);
    the_path.lineTo(4, -1);
    the_path.lineTo(2, 0);
    the_path.closePath();
    return the_path;
}

export function drawPathFunc(ctx, path) {
    return (x, y, angle, scale, color) => {
        ctx.fillStyle = color;
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(scale, scale);
        let m = ctx.getTransform();
        ctx.fill(path);
        ctx.resetTransform();
        return m;
    };
}


export function text(ctx, x, y, txt, fillStyle = "#fff") {
    ctx.fillStyle = fillStyle;
    let bb = ctx.measureText(txt);
    ctx.fillText(txt, x, y + bb.actualBoundingBoxAscent / 2);
}

export function u_path() {
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

export function path(ctx, p, x, y, angle, sc = 1, fillStyle = "#fff", strokeStyle = "#000", lineWidth = 1) {
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

export function image(ctx, src, sc) {
    let img = new Image();
    img.src = src;
    let ratio = 0;

    img.addEventListener('load', () => {
        ratio = img.naturalWidth / img.naturalHeight;
        console.log('Imaged loaded: ', ratio);
    });

    return (x, y, angle) => {
        if (ratio > 0) {
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.scale(sc, sc);
            ctx.drawImage(img, 0, 0);
            ctx.restore();
        }
    }
}

export function distance(x1, y1, x2, y2) {
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

