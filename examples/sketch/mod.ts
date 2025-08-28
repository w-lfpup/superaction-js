import { SuperAction, ActionEventInterface } from "superaction";

declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEventInterface;
	}
}

const _superAction = new SuperAction({
	target: document,
	connected: true,
	eventNames: ["input", "pointerdown", "pointerup", "pointermove"],
});

const worker = new Worker("worker.js", { type: "module" });
const canvas = document.querySelector("canvas")!;
const offscreenCanvas = canvas.transferControlToOffscreen();

const resizeObserver = new ResizeObserver(sendCanvasParams);
resizeObserver.observe(canvas);

addEventListener("#action", function (e: ActionEventInterface) {
	let { target } = e;
	let { action, sourceEvent } = e.actionParams;

	// send actions to the offscreen canvas worker
	if ("set_color" === action) {
		if (target instanceof HTMLInputElement) {
			worker.postMessage({
				action,
				color: target.value,
			});
		}
	}

	// all other actions should be pointer actions
	sendPointerMessage(action, sourceEvent);
});

function setupCanvas() {
	worker.postMessage(
		{
			action: "setup_canvas",
			offscreenCanvas,
		},
		[offscreenCanvas],
	);
}

function sendCanvasParams() {
	let { top, left } = canvas.getBoundingClientRect();
	let { clientWidth, clientHeight } = canvas;
	worker.postMessage({
		action: "set_canvas_params",
		params: { top, left, width: clientWidth, height: clientHeight },
	});
}

function sendPointerMessage(action: string, e: Event) {
	if (e instanceof PointerEvent) {
		let { x, y, movementX, movementY } = e;

		worker.postMessage({
			action,
			params: { movementX, movementY, x, y },
		});
	}
}

setupCanvas();
sendCanvasParams();
