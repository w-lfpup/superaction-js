import { dispatchSuperAction } from "./dispatch_superaction.js";

export interface SuperActionParamsInterface {
	host: ParentNode;
	eventNames: string[];
	connected?: boolean;
}

export class SuperAction {
	#params: SuperActionParamsInterface;

	constructor(params: SuperActionParamsInterface) {
		this.#params = params;
		if (this.#params.connected) this.connect();
	}

	connect() {
		let {host, eventNames} = this.#params;
		for (let name of eventNames) {
			host.addEventListener(name, dispatchSuperAction);
		}
	}

	disconnect() {
		let {host, eventNames} = this.#params;
		for (let name of eventNames) {
			host.removeEventListener(name, dispatchSuperAction);
		}
	}
}