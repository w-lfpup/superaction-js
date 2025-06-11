interface PenAction {
    x: number;
    y: number;
    movementX: number;
    movementY: number;
}

interface SetupCanvas {
    action: "setup_canvas";
    offscreenCanvas: OffscreenCanvas;
}

interface SetColor {
    action: "set_color";
    color: string;
}

interface MovePen extends PenAction {
    action: "move_pen";
}

interface PressPen extends PenAction {
    action: "press_pen";
}

interface LiftPen extends PenAction {
    action: "lift_pen";
}

interface MovePenAcrossCanvas extends PenAction {
    action: "move_pen_across_canvas";
}

export type Actions = |
    SetupCanvas |
    SetColor |
    MovePen |
    PressPen |
    LiftPen |
    MovePenAcrossCanvas;
