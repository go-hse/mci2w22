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


(function Init() {
    let cnv = document.getElementById("cnv");
    let ctx = cnv.getContext("2d");

    console.log(new Date());

    function resize() {
        cnv.width = window.innerWidth;
        cnv.height = window.innerHeight;
    }
    addEventListener("resize", resize);


    function getTime() {
        let now = new Date();
        let sec = now.getSeconds();
        let min = now.getMinutes();
        let hrs = now.getHours();
        if (hrs >= 12) hrs -= 12;
        return {
            sec,
            min,
            hrs
        };
    }

    function draw() {
        const { sec, min, hrs } = getTime();

        const size = cnv.width / 3;
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        ctx.translate(cnv.width / 2, cnv.height / 2);
        rect(ctx, 0, 0, 10, 10, "#f00");

        ctx.save();
        let angle = sec * Math.PI / 30;
        ctx.rotate(angle);
        line(ctx, 0, 0, 0, -size, "#f00", 4);
        ctx.restore();

        ctx.save();
        angle = min * Math.PI / 30;
        ctx.rotate(angle);
        line(ctx, 0, 0, 0, -size, "#fff", 8);
        ctx.restore();

        ctx.save();
        angle = hrs * Math.PI / 6;
        ctx.rotate(angle);
        line(ctx, 0, 0, 0, -size / 2, "#fff", 8);
        ctx.restore();

        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}());

