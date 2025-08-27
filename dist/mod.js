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
    if (!currentTarget)
        return;
    // I forget if a formdata element can be reused but important to find out
    let formData;
    if (target instanceof HTMLFormElement)
        formData = new FormData(target);
    for (let node of sourceEvent.composedPath()) {
        if (node instanceof Element) {
            let kind = node.getAttribute(`${type}:`);
            if (!kind)
                continue;
            if (node.hasAttribute(`${type}:prevent-default`))
                sourceEvent.preventDefault();
            if (node.hasAttribute(`${type}:stop-immediate-propagation`))
                return;
            let composed = node.hasAttribute(`${type}:composed`);
            dispatchActionEvent({
                el: node,
                sourceEvent,
                composed,
                formData,
            });
            if (node.hasAttribute(`${type}:stop-propagation`))
                return;
        }
    }
}
function dispatchActionEvent(dispatchParams) {
    let actionParams = getActionParams(dispatchParams);
    if (!actionParams)
        return;
    let { el, composed } = dispatchParams;
    let event = new ActionEvent(actionParams, { bubbles: true, composed });
    el.dispatchEvent(event);
}
function getActionParams(dispatchParams) {
    let { el, sourceEvent, formData } = dispatchParams;
    let { type } = sourceEvent;
    let action = el.getAttribute(`${type}:`);
    if (action)
        return { action, sourceEvent, formData };
}
