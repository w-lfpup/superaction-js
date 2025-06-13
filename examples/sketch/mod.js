import { SuperAction } from "superaction";
const _superAction = new SuperAction({
    host: document,
    connected: true,
    eventNames: [
        "input",
        "pointerdown",
        "pointerup",
        "pointermove",
    ],
});
const worker = new Worker("worker.js", { type: "module" });
const canvas = document.querySelector("canvas");
const offscreenCanvas = canvas.transferControlToOffscreen();
const resizeObserver = new ResizeObserver(function () {
    sendCanvasParams();
});
resizeObserver.observe(canvas);
addEventListener("#action", function (e) {
    let { action, target, sourceEvent } = e;
    if ("set_color" === action) {
        if (target instanceof HTMLInputElement) {
            worker.postMessage({
                action,
                color: target.value,
            });
        }
    }
    sendPointerMessage(action, sourceEvent);
});
function setupCanvas() {
    worker.postMessage({
        action: "setup_canvas",
        offscreenCanvas
    }, [offscreenCanvas]);
}
function sendCanvasParams() {
    let { top, left } = canvas.getBoundingClientRect();
    let { clientWidth, clientHeight } = canvas;
    worker.postMessage({
        action: "set_canvas_params",
        params: { top, left, width: clientWidth, height: clientHeight },
    });
}
function sendPointerMessage(action, e) {
    if (e instanceof PointerEvent) {
        let { x, y, movementX, movementY } = e;
        worker.postMessage({
            action,
            params: { movementX, movementY, x, y }
        });
    }
}
setupCanvas();
sendCanvasParams();
