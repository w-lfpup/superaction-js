import { SuperAction } from "superaction";
const _superAction = new SuperAction({
    host: document,
    connected: true,
    eventNames: ["input", "pointerdown", "pointerup", "pointermove"],
});
const worker = new Worker("worker.js", { type: "module" });
const canvas = document.querySelector("canvas");
const offscreenCanvas = canvas.transferControlToOffscreen();
const resizeObserver = new ResizeObserver(sendCanvasParams);
resizeObserver.observe(canvas);
addEventListener("#action", function (e) {
    let { type, event } = e.action;
    if ("set_color" === type &&
        event.target instanceof HTMLInputElement) {
        worker.postMessage({
            kind: type,
            color: event.target.value,
        });
    }
    if (event instanceof PointerEvent) {
        let { x, y, movementX, movementY } = event;
        worker.postMessage({
            kind: type,
            params: { x, y, movementX, movementY },
        });
    }
});
function setupCanvas() {
    worker.postMessage({
        kind: "setup_canvas",
        offscreenCanvas,
    }, [offscreenCanvas]);
}
function sendCanvasParams() {
    let { top, left } = canvas.getBoundingClientRect();
    let { clientWidth, clientHeight } = canvas;
    worker.postMessage({
        kind: "set_canvas_params",
        params: { top, left, width: clientWidth, height: clientHeight },
    });
}
setupCanvas();
sendCanvasParams();
