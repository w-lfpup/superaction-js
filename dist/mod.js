export class ActionEvent extends Event {
    actionParams;
    constructor(actionParams, eventInit) {
        super("#action", eventInit);
        this.actionParams = actionParams;
    }
}
export class SuperAction {
    #connected = false;
    #boundDispatch;
    #params;
    #target;
    constructor(params) {
        this.#params = { ...params };
        this.#target = params.target ?? params.host;
        this.#boundDispatch = this.#dispatch.bind(this);
        if (this.#params.connected)
            this.connect();
    }
    connect() {
        if (this.#connected)
            return;
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
    #dispatch(sourceEvent) {
        let { type, currentTarget, target } = sourceEvent;
        if (!currentTarget)
            return;
        let formData;
        if (target instanceof HTMLFormElement)
            formData = new FormData(target);
        for (let node of sourceEvent.composedPath()) {
            if (node instanceof Element) {
                if (node.hasAttribute(`${type}:prevent-default`))
                    sourceEvent.preventDefault();
                if (node.hasAttribute(`${type}:stop-immediate-propagation`))
                    return;
                let action = node.getAttribute(`${type}:`);
                if (action) {
                    let composed = node.hasAttribute(`${type}:composed`);
                    let event = new ActionEvent({ action, sourceEvent, formData }, { bubbles: true, composed });
                    this.#target.dispatchEvent(event);
                }
                if (node.hasAttribute(`${type}:stop-propagation`))
                    return;
            }
        }
    }
}
