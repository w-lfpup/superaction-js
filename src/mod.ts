declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEventInterface;
	}
	interface ElementEventMap {
		["#action"]: ActionEventInterface;
	}
}

export interface ActionInterface {
	type: string;
	formData?: FormData;
	target: EventTarget;
	event: Event;
}

export interface ActionEventInterface extends Event {
	action: ActionInterface;
}
type hello = HTMLElementEventMap;
export interface SuperActionParamsInterface {
	connected?: boolean;
	eventNames: string[];
	host: EventTarget;
	target?: EventTarget;
	infix?: string;
}

export interface SuperActionInterface {
	connect(): void;
	disconnect(): void;
}

export class ActionEvent extends Event implements ActionEventInterface {
	action: ActionInterface;

	constructor(action: ActionInterface, eventInit?: EventInit) {
		super("#action", eventInit);
		this.action = action;
	}
}

export class SuperAction implements SuperActionInterface {
	#connected = false;
	#params: SuperActionParamsInterface;
	#target: EventTarget;

	constructor(params: SuperActionParamsInterface) {
		this.#params = { ...params };
		this.#target = params.target ?? params.host;

		if (this.#params.connected) this.connect();
	}

	connect() {
		if (this.#connected) return;
		this.#connected = true;

		let { host, eventNames } = this.#params;
		for (let name of eventNames) {
			host.addEventListener(name, this.#dispatch);
		}
	}

	disconnect() {
		if (!this.#connected) return;
		this.#connected = false;

		let { host, eventNames } = this.#params;
		for (let name of eventNames) {
			host.removeEventListener(name, this.#dispatch);
		}
	}

	#dispatch = this.#unboundDispatch.bind(this);
	#unboundDispatch(event: Event) {
		let { type, currentTarget, target } = event;
		if (!currentTarget) return;

		let { infix = ":" } = this.#params;
		for (let node of event.composedPath()) {
			if (node instanceof Element) {
				if (node.hasAttribute(`${type}${infix}prevent-default`))
					event.preventDefault();

				if (
					node.hasAttribute(
						`${type}${infix}stop-immediate-propagation`,
					)
				)
					return;

				let actionType = node.getAttribute(`${type}${infix}`);
				if (actionType) {
					let formData: FormData | undefined;
					if (target instanceof HTMLFormElement)
						formData = new FormData(target);

					let actionEvent = new ActionEvent(
						{ type: actionType, target: node, event, formData },
						{ bubbles: true },
					);

					this.#target.dispatchEvent(actionEvent);
				}

				if (node.hasAttribute(`${type}${infix}stop-propagation`))
					return;
			}
		}
	}
}
