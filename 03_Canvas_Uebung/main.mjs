function rect(ctx, x, y, w, h, fillStyle = "#f00", strokeStyle = "#fff", lineWidth = 1) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
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
        const size = cnv.width / 10;
        ctx.resetTransform();
        ctx.clearRect(0, 0, cnv.width, cnv.height);

        ctx.translate(size, size);


        for (let i = 0; i < 64; ++i) {
            let x = i % 8;
            let y = Math.floor(i / 8);
            ctx.save();
            // console.log(`${x}/${y}`);
            ctx.translate((x + 1) * size, (y + 1) * size);

            // if (i % 2 === 1)
            if (y % 2 === 0 && i % 2 === 0 || y % 2 === 1 && i % 2 === 1)
                rect(ctx, 0, 0, size, size, "#fff", "#444");
            else
                rect(ctx, 0, 0, size, size, "#000", "#444");

            ctx.restore();
        }


        window.requestAnimationFrame(draw);
    }
    resize();
    draw();
}());

