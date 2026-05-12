export interface CanvasParams {
	top: number;
	left: number;
	width: number;
	height: number;
}

interface PenParams {
	x: number;
	y: number;
	movementX: number;
	movementY: number;
}

interface SetupCanvas {
	kind: "setup_canvas";
	offscreenCanvas: OffscreenCanvas;
}

interface SetCanvasParams {
	kind: "set_canvas_params";
	params: CanvasParams;
}

interface SetColor {
	kind: "set_color";
	color: string;
}

interface MovePen {
	kind: "move_pen";
	params: PenParams;
}

interface PressPen {
	kind: "press_pen";
	params: PenParams;
}

interface LiftPen {
	kind: "lift_pen";
	params: PenParams;
}

export type Actions =
	| SetupCanvas
	| SetCanvasParams
	| SetColor
	| MovePen
	| PressPen
	| LiftPen;
