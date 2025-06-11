import { SuperAction, SuperActionEvent } from "superaction";
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
worker.postMessage({
    action: "setup_canvas",
    offscreenCanvas
}, [offscreenCanvas]);
addEventListener("#action", function (e) {
    if (!(e instanceof SuperActionEvent))
        return;
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
function sendPointerMessage(action, e) {
    if (!(e instanceof PointerEvent))
        return;
    let { x, y, movementX, movementY } = e;
    worker.postMessage({
        action,
        x,
        y,
        movementX,
        movementY,
    });
}
