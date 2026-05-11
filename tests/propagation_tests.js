import { elementClick, findElement, } from "@w-lfpup/jackrabbit/browser/dist/commands.js";
import { SuperAction, } from "../dist/mod.js";
async function testPropagation() {
    let superAction = new SuperAction({
        host: document,
        connected: true,
        eventNames: ["click"],
    });
    document.body.setHTMLUnsafe(`
		<section
			click:="no_dont_do_another_one">
			<section
				click:="another_one"
				click:stop_propagation>
				<button click:="one_shot">hello!</button>
			</section>
			<section
				click:="nooooooo"
				click:stop_immediate_propagation>
				<button click:="the_last_one">hello!</button>
			</section>
		</section>
	`);
    superAction.connect();
    let actionReceipts = [];
    let cb = function (e) {
        let { kind } = e.action;
        actionReceipts.push(e.action);
    };
    document.addEventListener("#action", cb);
    let buttonId = await findElement("button");
    if (!buttonId)
        return "failed to query button element";
    let clickResult = await elementClick(buttonId);
    if (!clickResult)
        return "failed to click button element";
    document.removeEventListener("#action", cb);
    superAction.disconnect();
    let fails = [];
    for (let action of actionReceipts) {
        let { kind } = action;
        if ("nooooooo" === kind || "no_dont_do_another_one" === kind) {
            fails.push(`action should not have propagated: ${kind}`);
        }
    }
    if (2 !== actionReceipts.length)
        fails.push(`too many actions propagated: ${actionReceipts.length}`);
    return "actionReceipt is undefined";
}
export const tests = [testPropagation];
export const options = {
    title: import.meta.url,
};
