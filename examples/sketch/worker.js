let canvas;
let ctx;
self.addEventListener("message", function (e) {
    let { kind } = e.data;
    if ("setup_canvas" === kind) {
        canvas = e.data.offscreenCanvas;
        ctx = canvas.getContext("2d");
        console.log("added the canvas!");
    }
});
export {};
