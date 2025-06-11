import type { Actions } from "./actions.ts";

let canvas: OffscreenCanvas;
let ctx: OffscreenCanvasRenderingContext2D | null;

self.addEventListener("message", function(e: MessageEvent<Actions>) {
    let {data} = e;

    if ("setup_canvas" === data.action) {
        canvas = data.offscreenCanvas;
        ctx = canvas.getContext("2d");

        console.log("added the canvas!");
    }

    if ("set_color" === data.action) {
        console.log("set color!")
    }

    if ("move_pen" === data.action) {
    }

    if ("press_pen" === data.action) {
    }

    if ("lift_pen" === data.action) {
    }

    if ("move_pen" === data.action) {
    }
});
