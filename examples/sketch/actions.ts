interface CanvasParams {
    top: number;
    left: number;
}

interface PenParams {
    x: number;
    y: number;
    movementX: number;
    movementY: number;
}

interface SetupCanvas {
    action: "setup_canvas";
    offscreenCanvas: OffscreenCanvas;
}

interface SetCanvasParams {
    action: "set_canvas_params";
    params: CanvasParams;
}

interface SetColor {
    action: "set_color";
    color: string;
}

interface MovePen {
    action: "move_pen";
    params: PenParams;
}

interface PressPen {
    action: "press_pen";
    params: PenParams;
}

interface LiftPen {
    action: "lift_pen";
    params: PenParams;
}


type Actions = |
    SetupCanvas |
    SetCanvasParams |
    SetColor |
    MovePen |
    PressPen |
    LiftPen;

export { CanvasParams, Actions, PenParams }