import { SuperAction, SuperActionEvent } from "superaction";
const _superAction = new SuperAction({
    host: document,
    connected: true,
    eventNames: [
        "input",
        "change",
        "pointerdown",
        "pointerup",
        "pointermove",
    ],
});
const countEl = document.querySelector("canvas");
addEventListener("#action", function (e) {
    if (!(e instanceof SuperActionEvent))
        return;
    let { action } = e;
    console.log(action);
    if ("update_color" === action) {
    }
    if ("press_pen" === action) {
    }
    if ("lift_pen" === action) {
    }
    if ("move_pen" === action) {
    }
    if ("move_pen_across_canvas" === action) {
    }
});
