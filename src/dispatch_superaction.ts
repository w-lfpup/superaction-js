import { SuperActionEvent } from "./superaction_event.js";

export function dispatchSuperAction(e: Event): void {
	let kind = getEventAttr(e.type);
	for (let node of e.composedPath()) {
		if (node instanceof Element) {
			let event = getSuperActionEvent(e, kind, node);
			if (node.hasAttribute(`${kind}_prevent-default`)) e.preventDefault();
			if (event) node.dispatchEvent(event);
			if (node.hasAttribute(`${kind}_stop-propagation`)) return;
		}
	}
}

function getEventAttr(eventType: string) {
	return `_${eventType}`;
}

function getSuperActionEvent(
	e: Event,
	type: string,
	el: Element,
): Event | undefined {
	let action = el.getAttribute(type);
	if (action) return new SuperActionEvent(action, e);
}
