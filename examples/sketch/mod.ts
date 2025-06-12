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

const worker = new Worker("worker.js", {type: "module"});
const canvas = document.querySelector("canvas")!;
const offscreenCanvas = canvas.transferControlToOffscreen();

addEventListener("#action", function (e: Event) {
    if (e instanceof SuperActionEvent) {
        let { action, target, sourceEvent } = e;

        if ("set_color" === action) {
            if (target instanceof HTMLInputElement) {
                worker.postMessage({
                    action,
                    color: target.value,
                })
            }
        }

        sendPointerMessage(action, sourceEvent);
    }
});

function setupCanvas() {
    worker.postMessage({
        action: "setup_canvas",
        offscreenCanvas
    }, [offscreenCanvas]);
}

function sendCanvasParams() {
    let {top, left} = canvas.getBoundingClientRect();
    top = Math.round(top);
    left = Math.round(left);
    console.log(canvas.getBoundingClientRect());
    worker.postMessage({
        action: "set_canvas_params",
        params: { top, left },
    });
}

function sendPointerMessage(action: string, e: Event) {
    if (e instanceof PointerEvent) {
        let { x, y, movementX, movementY} = e;

        worker.postMessage({
            action,
            params: { movementX, movementY, x, y }
        });
    }
}

setupCanvas();
sendCanvasParams();
