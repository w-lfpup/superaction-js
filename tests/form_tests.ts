import {
	elementClick,
	findElement,
} from "@w-lfpup/jackrabbit/browser/dist/commands.js";
import { ActionEventInterface, SuperAction } from "../dist/mod.js";

async function testFormSubmission() {
	let superAction = new SuperAction({
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
	let formDataReceipt: FormData | undefined;

	let cb = function (e: ActionEventInterface) {
		let { kind, formData } = e.action;
		if ("submit_the_form" === kind && formData) formDataReceipt = formData;
	};

	document.addEventListener("#action", cb);

	let buttonId = await findElement("button");
	if (!buttonId) return "failed to query button element";
	await elementClick(buttonId);

	document.removeEventListener("#action", cb);
	superAction.disconnect();

	if (formDataReceipt) {
		let entry = formDataReceipt.get("boy-kisser");
		if ("string" === typeof entry && "on" === entry) return;
		return "boy-kisser not found";
	}

	return "formData not found";
}

export const tests = [testFormSubmission];

export const options = {
	title: import.meta.url,
};
