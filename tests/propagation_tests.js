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
    let actionReceipts = [];
    let cb = function (e) {
        actionReceipts.push(e.action);
    };
    document.addEventListener("#action", cb);
    let buttonId = await findElement("[data-test-id=one_shot]");
    if (!buttonId)
        return "failed to query button element";
    let clickResult = await elementClick(buttonId);
    if (!clickResult)
        return "failed to click button element";
    let nextButtonId = await findElement("[data-test-id=the_last_one]");
    if (!nextButtonId)
        return "failed to query button element";
    let nextClickResult = await elementClick(nextButtonId);
    if (!nextClickResult)
        return "failed to click button element";
    document.removeEventListener("#action", cb);
    superAction.disconnect();
    for (let action of actionReceipts) {
        let { kind } = action;
        if ("nooooooo" === kind || "no_dont_do_another_one" === kind) {
            return `propagation failed to stop before: "${kind}"`;
        }
    }
    if (3 !== actionReceipts.length)
        return `too many actions propagated: ${actionReceipts.length}`;
}
export const tests = [testPropagation];
export const options = {
    title: import.meta.url,
};
