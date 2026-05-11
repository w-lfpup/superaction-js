import { elementClick, log, findElement } from "@w-lfpup/jackrabbit/browser/dist/commands.js";
import { SuperAction } from "../dist/mod.js";
async function testOneShotClick() {
    let superAction = new SuperAction({
        host: document,
        eventNames: ["click"],
    });
    document.body.setHTMLUnsafe(`
		<button click:"one_shot_action">hello!</button>
	`);
    superAction.connect();
    let actionReceipt;
    let cb = function (e) {
        log("callback was evoked");
        let { kind } = e.action;
        actionReceipt = e.action;
    };
    document.addEventListener("#action", cb);
    let buttonId = await findElement("button");
    await log(`button id: ${buttonId}`);
    if (!buttonId)
        return "failed to query button element";
    let clickResult = await elementClick(buttonId);
    await log(`clickResult: ${clickResult}`);
    document.removeEventListener("#action", cb);
    superAction.disconnect();
    if (actionReceipt)
        return;
    return "actionReceipt is undefined";
}
export const tests = [testOneShotClick];
export const options = {
    title: import.meta.url,
};
