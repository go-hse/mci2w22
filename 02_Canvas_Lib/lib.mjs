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
    ctx.fillText(txt, x, y + bb.actualBoundingBoxAscent / 2);
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

function image(ctx, src, sc) {
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

export { line, rect, circle, text, image, path, u_path };