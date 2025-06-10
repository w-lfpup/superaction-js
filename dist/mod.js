export { SuperActionEvent, SuperAction };
class SuperAction {
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
class SuperActionEvent extends Event {
    #action;
    #sourceEvent;
    constructor(action, sourceEvent) {
        super("#action", { bubbles: true, composed: true });
        this.#action = action;
        this.#sourceEvent = sourceEvent;
    }
    get action() {
        return this.#action;
    }
    get sourceEvent() {
        return this.#sourceEvent;
    }
}
function dispatchSuperAction(e) {
    let kind = getEventAttr(e.type);
    for (let node of e.composedPath()) {
        if (node instanceof Element) {
            let event = getSuperActionEvent(e, kind, node);
            if (node.hasAttribute(`${kind}_prevent-default`))
                e.preventDefault();
            if (event)
                node.dispatchEvent(event);
            if (node.hasAttribute(`${kind}_stop-propagation`))
                return;
        }
    }
}
function getEventAttr(eventType) {
    return `_${eventType}`;
}
function getSuperActionEvent(e, type, el) {
    let action = el.getAttribute(type);
    if (action)
        return new SuperActionEvent(action, e);
}
