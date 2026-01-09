export interface ActionInterface {
	kind: string;
	formData?: FormData;
	originElement: EventTarget;
	originEvent: Event;
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
		if (!this.#connected) return;
		this.#connected = false;

		let { host, eventNames } = this.#params;
		for (let name of eventNames) {
			host.removeEventListener(name, this.#boundDispatch);
		}
	}

	#dispatch(originEvent: Event) {
		let { type, currentTarget, target } = originEvent;
		if (!currentTarget) return;

		let formData: FormData | undefined;
		if (target instanceof HTMLFormElement) formData = new FormData(target);

		for (let node of originEvent.composedPath()) {
			if (node instanceof Element) {
				if (node.hasAttribute(`${type}:prevent-default`))
					originEvent.preventDefault();

				if (node.hasAttribute(`${type}:stop-immediate-propagation`))
					return;

				let kind = node.getAttribute(`${type}:`);
				if (kind) {
					let composed = node.hasAttribute(`${type}:composed`);
					let event = new ActionEvent(
						{ kind, originElement: node, originEvent, formData },
						{ bubbles: true, composed },
					);

					this.#target.dispatchEvent(event);
				}

				if (node.hasAttribute(`${type}:stop-propagation`)) return;
			}
		}
	}
}
