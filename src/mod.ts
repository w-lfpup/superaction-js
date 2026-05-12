declare global {
	interface GlobalEventHandlersEventMap {
		["#action"]: ActionEventInterface;
	}
}

export interface ActionInterface {
	type: string;
	formData?: FormData;
	originElement: EventTarget;
	originEvent: Event;
}

export interface ActionEventInterface extends Event {
	action: ActionInterface;
}

export interface SuperActionParamsInterface {
	connected?: boolean;
	eventNames: string[];
	host: EventTarget;
	target?: EventTarget;
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
	#boundDispatch = this.#dispatch.bind(this);

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
			host.addEventListener(name, this.#boundDispatch);
		}
	}

	disconnect() {
		if (!this.#connected) return;
		this.#connected = false;

		let { host, eventNames } = this.#params;
		for (let name of eventNames) {
			host.removeEventListener(name, this.#boundDispatch);
		}
	}

	#dispatch(originEvent: Event) {
		let { type: eventType, currentTarget, target } = originEvent;
		if (!currentTarget) return;

		let formData: FormData | undefined;
		if (target instanceof HTMLFormElement) formData = new FormData(target);

		for (let node of originEvent.composedPath()) {
			if (node instanceof Element) {
				if (node.hasAttribute(`${eventType}:prevent-default`))
					originEvent.preventDefault();

				if (
					node.hasAttribute(`${eventType}:stop-immediate-propagation`)
				)
					return;

				let type = node.getAttribute(`${eventType}:`);
				if (type) {
					let composed = node.hasAttribute(`${eventType}:composed`);
					let event = new ActionEvent(
						{ type, originElement: node, originEvent, formData },
						{ bubbles: true, composed },
					);

					this.#target.dispatchEvent(event);
				}

				if (node.hasAttribute(`${eventType}:stop-propagation`)) return;
			}
		}
	}
}
