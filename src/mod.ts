export type {
  SuperActionParamsInterface,
  SuperActionEventInterface,
  SuperActionInterface,
};
export { SuperActionEvent, SuperAction };

interface SuperActionParamsInterface {
  host: ParentNode;
  eventNames: string[];
  connected?: boolean;
}

interface SuperActionInterface {
  connect(): void;
  disconnect(): void;
}

interface SuperActionEventInterface extends Event {
  action: string;
  sourceEvent: Event;
}

class SuperAction {
  #params: SuperActionParamsInterface;

  constructor(params: SuperActionParamsInterface) {
    this.#params = params;
    if (this.#params.connected) this.connect();
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

class SuperActionEvent extends Event implements SuperActionEvent {
  #action: string;
  #sourceEvent: Event;

  constructor(action: string, sourceEvent: Event) {
    super("#action", { bubbles: true, composed: true });

    this.#action = action;
    this.#sourceEvent = sourceEvent;
  }

  get action(): string {
    return this.#action;
  }

  get sourceEvent(): Event {
    return this.#sourceEvent;
  }
}

function dispatchSuperAction(e: Event): void {
  let kind = getEventAttr(e.type);
  for (let node of e.composedPath()) {
    if (node instanceof Element) {
      let event = getSuperActionEvent(e, kind, node);
      if (node.hasAttribute(`${kind}_prevent-default`)) e.preventDefault();
      if (event) node.dispatchEvent(event);
      if (node.hasAttribute(`${kind}_stop-propagation`)) return;
    }
  }
}

function getEventAttr(eventType: string) {
  return `_${eventType}`;
}

function getSuperActionEvent(
  e: Event,
  type: string,
  el: Element,
): Event | undefined {
  let action = el.getAttribute(type);
  if (action) return new SuperActionEvent(action, e);
}
