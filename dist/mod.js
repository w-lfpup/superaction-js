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
    #dispatch = this.#unboundDispatch.bind(this);
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
    #unboundDispatch(event) {
        dispatch(event, this.#target, this.#params.infix);
    }
}
function dispatch(event, dispatchTarget, infix = ":") {
    let { type } = event;
    for (let target of event.composedPath()) {
        if (!(target instanceof Element))
            continue;
        if (target.hasAttribute(`${type}${infix}prevent-default`))
            event.preventDefault();
        if (target.hasAttribute(`${type}${infix}stop-immediate-propagation`))
            return;
        let actionType = target.getAttribute(`${type}${infix}`);
        if (actionType) {
            let formData;
            if (target instanceof HTMLFormElement)
                formData = new FormData(target);
            let actionEvent = new ActionEvent({
                type: actionType,
                target,
                event,
                formData,
            });
            dispatchTarget.dispatchEvent(actionEvent);
        }
        if (target.hasAttribute(`${type}${infix}stop-propagation`))
            return;
    }
}
