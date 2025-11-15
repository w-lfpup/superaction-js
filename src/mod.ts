export interface ActionInterface {
	sourceEvent: Event;
	action: string;
	formData?: FormData;
}

export interface ActionEventInterface extends Event {
	actionParams: ActionInterface;
}

// add host parameter
// what if web component listens for event, dispatches on document
export interface SuperActionParamsInterface {
	// host: ParentNode;
	target: ParentNode;
	eventNames: string[];
	connected?: boolean;
}

export interface SuperActionInterface {
	connect(): void;
	disconnect(): void;
}

export class ActionEvent extends Event implements ActionEventInterface {
	actionParams: ActionInterface;

	constructor(actionParams: ActionInterface, eventInit?: EventInit) {
		super("#action", eventInit);
		this.actionParams = actionParams;
	}
}

export class SuperAction implements SuperActionInterface {
	#params: SuperActionParamsInterface;

	constructor(params: SuperActionParamsInterface) {
		this.#params = params;
		if (this.#params.connected) this.connect();
	}

	connect() {
		let { target, eventNames } = this.#params;
		for (let name of eventNames) {
			target.addEventListener(name, dispatch);
		}
	}

	disconnect() {
		let { target, eventNames } = this.#params;
		for (let name of eventNames) {
			target.removeEventListener(name, dispatch);
		}
	}
}

export function dispatch(sourceEvent: Event) {
	let { type, currentTarget, target } = sourceEvent;
	if (!currentTarget) return;

	let formData: FormData | undefined;
	if (target instanceof HTMLFormElement) formData = new FormData(target);

	for (let node of sourceEvent.composedPath()) {
		if (node instanceof Element) {
			if (node.hasAttribute(`${type}:prevent-default`))
				sourceEvent.preventDefault();

			if (node.hasAttribute(`${type}:stop-immediate-propagation`)) return;

			let action = node.getAttribute(`${type}:`);
			if (action) {
				let composed = node.hasAttribute(`${type}:composed`);
				let event = new ActionEvent(
					{ action, sourceEvent, formData },
					{ bubbles: true, composed },
				);

				currentTarget.dispatchEvent(event);
			}

			if (node.hasAttribute(`${type}:stop-propagation`)) return;
		}
	}
}
