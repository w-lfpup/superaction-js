import { SuperAction } from "superaction";

const _superAction = new SuperAction({
	host: document,
	connected: true,
	eventNames: ["click"],
});

const countEl = document.querySelector("[count]")!;
let count = parseFloat(countEl.textContent);
if (Number.isNaN(count)) count = 0;

addEventListener("#action", function (e) {
	let { type } = e.action;

	if ("increment" === type) {
		count += 1;
	}

	if ("decrement" === type) {
		count -= 1;
	}

	countEl.textContent = count.toString();
});
