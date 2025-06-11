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

worker.postMessage({
    kind: "setup_canvas",
    offscreenCanvas
}, [offscreenCanvas]);


addEventListener("#action", function (e: Event) {
    if (!(e instanceof SuperActionEvent)) return;

    let { action, target, sourceEvent } = e;

    if ("update_color" === action) {
        if (target instanceof HTMLInputElement) {

        }
    }

    if ("press_pen" === action) {
        if (sourceEvent instanceof PointerEvent) {
        }
    }

    if ("lift_pen" === action) {
        if (sourceEvent instanceof PointerEvent) {
        }
    }

    if ("move_pen" === action) {
        if (sourceEvent instanceof PointerEvent) {
        }
    }

    if ("move_pen_across_canvas" === action) {
        if (sourceEvent instanceof PointerEvent) {
        }
    }
});
