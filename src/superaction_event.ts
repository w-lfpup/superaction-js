export interface SuperActionEventInterface extends Event {
	action: string;
	sourceEvent: Event;
}

export class SuperActionEvent extends Event implements SuperActionEvent {
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
