export class ActionEvent extends Event {
    action;
    constructor(action, eventInit) {
        super("#action", eventInit);
        this.action = action;
    }
}
export class SuperAction {
    #connected = false;
    #params;
    #target;
    constructor(params) {
        this.#params = { ...params };
        this.#target = params.target ?? params.host;
        if (this.#params.connected)
            this.connect();
    }
    connect() {
        if (this.#connected)
            return;
        this.#connected = true;
        let { host, eventNames } = this.#params;
        for (let name of eventNames) {
            host.addEventListener(name, this.#dispatch);
        }
    }
    disconnect() {
        if (!this.#connected)
            return;
        this.#connected = false;
        let { host, eventNames } = this.#params;
        for (let name of eventNames) {
            host.removeEventListener(name, this.#dispatch);
        }
    }
    #dispatch = this.#unboundDispatch.bind(this);
    #unboundDispatch(event) {
        let { type, currentTarget, target } = event;
        if (!currentTarget)
            return;
        let formData;
        if (target instanceof HTMLFormElement)
            formData = new FormData(target);
        let { infix } = this.#params;
        for (let node of event.composedPath()) {
            if (node instanceof Element) {
                if (node.hasAttribute(`${type}${infix}prevent-default`))
                    event.preventDefault();
                if (node.hasAttribute(`${type}${infix}stop-immediate-propagation`))
                    return;
                let actionType = node.getAttribute(`${type}${infix}`);
                if (actionType) {
                    let composed = node.hasAttribute(`${type}${infix}composed`);
                    let actionEvent = new ActionEvent({ type: actionType, target: node, event, formData }, { bubbles: true, composed });
                    this.#target.dispatchEvent(actionEvent);
                }
                if (node.hasAttribute(`${type}${infix}stop-propagation`))
                    return;
            }
        }
    }
}
