import { SuperAction, ActionEventInterface } from "superaction";

const _superAction = new SuperAction({
	host: document,
	connected: true,
	eventNames: ["input", "pointerdown", "pointerup", "pointermove"],
});

// Setup workers
const worker = new Worker("worker.js", { type: "module" });
const canvas = document.querySelector("canvas")!;
const offscreenCanvas = canvas.transferControlToOffscreen();

const resizeObserver = new ResizeObserver(sendCanvasParams);
resizeObserver.observe(canvas);

// send actions to the offscreen canvas worker
addEventListener("#action", function (e: ActionEventInterface) {
	let { type, event } = e.action;

	// set color action needs input value
	if ("set_color" === type && event.target instanceof HTMLInputElement) {
		worker.postMessage({
			kind: type,
			color: event.target.value,
		});
	}

	// other pointer actions
	if (event instanceof PointerEvent) {
		let { x, y, movementX, movementY } = event;

		worker.postMessage({
			kind: type,
			params: { x, y, movementX, movementY },
		});
	}
});

// Initialize offscreen canvas
function setupCanvas() {
	worker.postMessage(
		{
			kind: "setup_canvas",
			offscreenCanvas,
		},
		[offscreenCanvas],
	);
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
