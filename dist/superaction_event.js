export class SuperActionEvent extends Event {
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
