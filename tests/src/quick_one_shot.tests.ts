import {
	elementClick,
	findElement,
} from "@w-lfpup/jackrabbit/browser/dist/commands.js";
import {
	ActionEventInterface,
	ActionInterface,
	SuperAction,
} from "../../dist/mod.js";

async function testOneShotClick() {
	let superAction = new SuperAction({
		host: document,
		eventNames: ["click"],
	});

	document.body.setHTMLUnsafe(`
		<button click:="one_shot_action">hello!</button>
	`);

	superAction.connect();
	let actionReceipt: ActionInterface | undefined;

	let cb = function (e: ActionEventInterface) {
		let { type } = e.action;
		if ("one_shot_action" === type) actionReceipt = e.action;
	};

	document.addEventListener("#action", cb);
	let buttonId = await findElement("button");
	if (!buttonId) return "failed to query button element";

	let clickResult = await elementClick(buttonId);
	if (!clickResult) return "failed to click button element";

	document.removeEventListener("#action", cb);
	superAction.disconnect();

	if (actionReceipt) return;

	return "actionReceipt is undefined";
}

export const tests = [testOneShotClick];

export const options = {
	title: import.meta.url,
};
