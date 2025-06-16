import type { Actions, CanvasParams } from "./actions.ts";

let canvas: OffscreenCanvas;
let ctx: OffscreenCanvasRenderingContext2D | null;
let pen_to_paper = false;
let canvasParams: CanvasParams;

self.addEventListener("message", function(e: MessageEvent<Actions>) {
    let {data} = e;

    if ("setup_canvas" === data.action) {
        canvas = data.offscreenCanvas;
        ctx = canvas.getContext("2d");
    }

    if ("set_canvas_params" === data.action) {
        canvas.width = data.params.width;
        canvas.height = data.params.height;
        canvasParams = data.params;
        if (ctx) {
            ctx.lineWidth = 10;
            ctx.lineCap = "round";
        }
    }

    if ("set_color" === data.action) {
        let {color} = data;
        if (ctx) {
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
        }
    }

    if ("press_pen" === data.action) {
        pen_to_paper = true;
        if (ctx) {
            // create first point
            ctx.beginPath();
            let {top, left} = canvasParams;
            let {x, y} = data.params;

            let dx = x - left;
            let dy = y - top;

            ctx.arc(dx, dy, ctx.lineWidth * 0.5, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.closePath();

            // start a "line"
            ctx.beginPath();
        }
    }

    if ("move_pen" === data.action) {
        if (ctx && pen_to_paper) {
            let {top, left} = canvasParams;
            let {movementY, movementX, x, y} = data.params;

            let dx = x - left;
            let dy = y - top;

            ctx.moveTo(dx - movementX, dy - movementY);
            ctx.lineTo(dx, dy);
            ctx.stroke();
        }
    }

    if ("lift_pen" === data.action) {
        pen_to_paper = false;
        ctx?.closePath();
    }
});

