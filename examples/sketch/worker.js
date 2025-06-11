let canvas;
let ctx;
self.addEventListener("message", function (e) {
    let { data } = e;
    if ("setup_canvas" === data.action) {
        canvas = data.offscreenCanvas;
        ctx = canvas.getContext("2d");
        console.log("added the canvas!");
    }
    if ("set_color" === data.action) {
        console.log("set color!");
    }
    if ("move_pen" === data.action) {
    }
});
export {};
