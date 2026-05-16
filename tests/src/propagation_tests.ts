import {
	elementClick,
	findElement,
} from "@w-lfpup/jackrabbit/browser/dist/commands.js";
import {
	ActionEventInterface,
	ActionInterface,
	SuperAction,
} from "../../dist/mod.js";

let superAction: SuperAction;
let actionReceipts: ActionInterface[] = [];
let cb = function (e: ActionEventInterface) {
	actionReceipts.push(e.action);
};

function setup() {
	superAction = new SuperAction({
		host: document,
		connected: true,
		eventNames: ["click"],
	});

	document.body.setHTMLUnsafe(`
		<section
			click:="no_dont_do_another_one">
			<section
				click:="another_one"
				click:stop-propagation>
				<button
					data-test-id="one_shot"
					click:="one_shot">hello!</button>
			</section>
			<section
				click:="nooooooo"
				click:stop-immediate-propagation>
				<button
					data-test-id="the_last_one"
					click:="the_last_one">hello!</button>
			</section>
		</section>
	`);

	superAction.connect();
	document.addEventListener("#action", cb);
}

async function testPropagation() {
	let buttonId = await findElement("[data-test-id=one_shot]");
	if (!buttonId) return "failed to query button element";

	let clickResult = await elementClick(buttonId);
	if (!clickResult) return "failed to click button element";

	let nextButtonId = await findElement("[data-test-id=the_last_one]");
	if (!nextButtonId) return "failed to query button element";

	let nextClickResult = await elementClick(nextButtonId);
	if (!nextClickResult) return "failed to click button element";

	for (let action of actionReceipts) {
		let { type } = action;
		if ("nooooooo" === type || "no_dont_do_another_one" === type) {
			return `propagation failed to stop before: "${type}"`;
		}
	}
	if (3 !== actionReceipts.length)
		return `too many actions propagated: ${actionReceipts.length}`;
}

function tearDown() {
	document.removeEventListener("#action", cb);
	superAction.disconnect();
}

export const tests = [setup, testPropagation, tearDown];

export const options = {
	title: import.meta.url,
};
