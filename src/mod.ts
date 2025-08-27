export interface ActionInterface {
	sourceEvent: Event;
	action: string;
	formData?: FormData;
}

export interface ActionEventInterface extends Event {
	actionParams: ActionInterface;
}

export interface SuperActionParamsInterface {
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
			let action = node.getAttribute(`${type}:`);
			if (!action) continue;

			if (node.hasAttribute(`${type}:prevent-default`))
				sourceEvent.preventDefault();

			if (node.hasAttribute(`${type}:stop-immediate-propagation`)) return;

			let composed = node.hasAttribute(`${type}:composed`);
			
			let event = new ActionEvent({ action, sourceEvent, formData }, { bubbles: true, composed });
			node.dispatchEvent(event);

			if (node.hasAttribute(`${type}:stop-propagation`)) return;
		}
	}
}
