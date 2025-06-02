import { dispatchSuperAction } from "./dispatch_superaction.js";
export class SuperAction {
    #params;
    constructor(params) {
        this.#params = params;
        if (this.#params.connected)
            this.connect();
    }
    connect() {
        let { host, eventNames } = this.#params;
        for (let name of eventNames) {
            host.addEventListener(name, dispatchSuperAction);
        }
    }
    disconnect() {
        let { host, eventNames } = this.#params;
        for (let name of eventNames) {
            host.removeEventListener(name, dispatchSuperAction);
        }
    }
}
