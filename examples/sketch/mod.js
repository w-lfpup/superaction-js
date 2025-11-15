import { SuperAction } from "superaction";
const _superAction = new SuperAction({
    host: document,
    connected: true,
    eventNames: ["input", "pointerdown", "pointerup", "pointermove"],
});
// Setup workers
const worker = new Worker("worker.js", { type: "module" });
const canvas = document.querySelector("canvas");
const offscreenCanvas = canvas.transferControlToOffscreen();
const resizeObserver = new ResizeObserver(sendCanvasParams);
resizeObserver.observe(canvas);
// Add reactions
addEventListener("#action", function (e) {
    let { action, sourceEvent } = e.actionParams;
    // send actions to the offscreen canvas worker
    // set color action needs input value
    if ("set_color" === action &&
        sourceEvent.target instanceof HTMLInputElement) {
        worker.postMessage({
            action,
            color: sourceEvent.target.value,
        });
    }
    // other pointer actions
    if (sourceEvent instanceof PointerEvent) {
        let { x, y, movementX, movementY } = sourceEvent;
        worker.postMessage({
            action,
            params: { x, y, movementX, movementY },
        });
    }
});
// Initialize offscreen canvas
function setupCanvas() {
    worker.postMessage({
        action: "setup_canvas",
        offscreenCanvas,
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
setupCanvas();
sendCanvasParams();
