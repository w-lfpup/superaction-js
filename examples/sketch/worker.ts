import type { Actions } from "./actions.ts";

let canvas: OffscreenCanvas;
let ctx: OffscreenCanvasRenderingContext2D | null;

self.addEventListener("message", function(e: MessageEvent<Actions>) {
    let {kind} = e.data as Actions;

    if ("setup_canvas" === kind) {
        canvas = e.data.offscreenCanvas;
        ctx = canvas.getContext("2d");

        console.log("added the canvas!");
    }
});
