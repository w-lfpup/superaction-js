import {
	elementClick,
	findElement,
} from "@w-lfpup/jackrabbit";
import { ActionEventInterface, SuperAction } from "../../dist/mod.js";

let superAction: SuperAction;
let formDataReceipt: FormData | undefined;
let cb = function (e: ActionEventInterface) {
	let { type, formData } = e.action;
	if ("submit_the_form" === type && formData) formDataReceipt = formData;
};

function setup() {
	superAction = new SuperAction({
		host: document,
		connected: true,
		eventNames: ["submit"],
	});

	document.body.setHTMLUnsafe(`
		<form submit:="submit_the_form" submit:prevent-default>
			<input type=checkbox name=boy-kisser checked>
			<button
				type=submit
				submit:="confess_your_cwimes">
				confess!!
			</button>
		</form>
	`);

	superAction.connect();
	document.addEventListener("#action", cb);
}

async function testFormSubmission() {
	let buttonId = await findElement("button");
	if (!buttonId) return "failed to query button element";
	await elementClick(buttonId);

	document.removeEventListener("#action", cb);

	if (formDataReceipt) {
		let entry = formDataReceipt.get("boy-kisser");
		if ("string" === typeof entry && "on" === entry) return;
		return "boy-kisser not found";
	}

	return "formData not found";
}

function tearDown() {
	superAction.disconnect();
	document.removeEventListener("#action", cb);
}

export const tests = [setup, testFormSubmission, tearDown];

export const options = {
	title: import.meta.url,
};
