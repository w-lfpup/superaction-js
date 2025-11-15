export class ActionEvent extends Event {
    actionParams;
    constructor(actionParams, eventInit) {
        super("#action", eventInit);
        this.actionParams = actionParams;
    }
}
export class SuperAction {
    #params;
    constructor(params) {
        this.#params = params;
        if (this.#params.connected)
            this.connect();
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
export function dispatch(sourceEvent) {
    let { type, currentTarget, target } = sourceEvent;
    if (!currentTarget || !target)
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
                target.dispatchEvent(event);
            }
            if (node.hasAttribute(`${type}:stop-propagation`))
                return;
        }
    }
}
