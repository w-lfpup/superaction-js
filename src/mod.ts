export interface ActionInterface {
	action: string;
	formData?: FormData;
	sourceEvent: Event;
}

export interface ActionEventInterface extends Event {
	actionParams: ActionInterface;
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
	actionParams: ActionInterface;

	constructor(actionParams: ActionInterface, eventInit?: EventInit) {
		super("#action", eventInit);
		this.actionParams = actionParams;
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
		let { host, eventNames } = this.#params;
		for (let name of eventNames) {
			host.removeEventListener(name, this.#boundDispatch);
		}
	}

	#dispatch(sourceEvent: Event) {
		let { type, currentTarget, target } = sourceEvent;
		if (!currentTarget) return;

		let formData: FormData | undefined;
		if (target instanceof HTMLFormElement) formData = new FormData(target);

		for (let node of sourceEvent.composedPath()) {
			if (node instanceof Element) {
				if (node.hasAttribute(`${type}:prevent-default`))
					sourceEvent.preventDefault();

				if (node.hasAttribute(`${type}:stop-immediate-propagation`))
					return;

				let action = node.getAttribute(`${type}:`);
				if (action) {
					let composed = node.hasAttribute(`${type}:composed`);
					let event = new ActionEvent(
						{ action, sourceEvent, formData },
						{ bubbles: true, composed },
					);

					this.#target.dispatchEvent(event);
				}

				if (node.hasAttribute(`${type}:stop-propagation`)) return;
			}
		}
	}
}
