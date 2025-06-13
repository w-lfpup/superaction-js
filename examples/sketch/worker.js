let canvas;
let ctx;
let pen_to_paper = false;
let canvasParams;
self.addEventListener("message", function (e) {
    let { data } = e;
    if ("setup_canvas" === data.action) {
        canvas = data.offscreenCanvas;
        ctx = canvas.getContext("2d");
    }
    if ("set_canvas_params" === data.action) {
        canvas.width = data.params.width;
        canvas.height = data.params.height;
        canvasParams = data.params;
        if (ctx) {
            console.log("setup canvas");
            ctx.lineWidth = 10;
            ctx.lineCap = "round";
        }
    }
    if ("set_color" === data.action) {
        if (ctx)
            ctx.strokeStyle = data.color;
    }
    if ("press_pen" === data.action) {
        pen_to_paper = true;
    }
    if ("move_pen" === data.action) {
        if (ctx && pen_to_paper) {
            let { top, left } = canvasParams;
            let { movementY, movementX, x, y } = data.params;
            let dx = x - left;
            let dy = y - top;
            ctx.beginPath();
            ctx.moveTo(dx - movementX, dy - movementY);
            ctx.lineTo(dx, dy);
            ctx.stroke();
        }
    }
    if ("lift_pen" === data.action) {
        pen_to_paper = false;
    }
});
export {};
