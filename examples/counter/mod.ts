import type { ActionEventInterface } from "superaction";

import { SuperAction } from "superaction";

declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEventInterface;
	}
}

const _superAction = new SuperAction({
	target: document,
	connected: true,
	eventNames: ["click"],
});

const countEl = document.querySelector("[count]")!;
let count = parseFloat(countEl.textContent ?? "");

addEventListener("#action", function (e) {
	let { action } = e.actionParams;

	if ("increment" === action) {
		count += 1;
	}

	if ("decrement" === action) {
		count -= 1;
	}

	countEl.textContent = count.toString();
});
