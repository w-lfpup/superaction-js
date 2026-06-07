import { elementClick, findElement } from "@w-lfpup/jackrabbit";
import {
	ActionEventInterface,
	ActionInterface,
	SuperAction,
} from "../../dist/mod.js";

let superAction: SuperAction;
let actionReceipt: ActionInterface | undefined;
let cb = function (e: ActionEventInterface) {
	let { type } = e.action;
	if ("one_shot_action" === type) actionReceipt = e.action;
};

function setup() {
	superAction = new SuperAction({
		host: document,
		infix: "_",
		eventNames: ["click"],
	});

	document.body.setHTMLUnsafe(`
		<button click_="one_shot_action">hello!</button>
	`);
	superAction.connect();
	document.addEventListener("#action", cb);
}

async function testOneShotClickWithInfix() {
	let buttonId = await findElement("button");
	if (!buttonId) return "failed to query button element";

	let clickResult = await elementClick(buttonId);
	if (!clickResult) return "failed to click button element";

	if (!actionReceipt) return "actionReceipt is undefined";
	if (actionReceipt.event.type !== "click")
		return "Event found was not a click event.";
}

function tearDown() {
	superAction.disconnect();
	document.removeEventListener("#action", cb);
}

export const tests = [setup, testOneShotClickWithInfix, tearDown];

export const options = {
	title: import.meta.url,
};
