declare global {
    interface GlobalEventHandlersEventMap {
        ["#action"]: ActionEventInterface;
    }
}
export interface ActionInterface {
    type: string;
    formData?: FormData;
    target: EventTarget;
    event: Event;
}
export interface ActionEventInterface extends Event {
    action: ActionInterface;
}
export interface SuperActionParamsInterface {
    connected?: boolean;
    eventNames: string[];
    host: EventTarget;
    target?: EventTarget;
}
export interface SuperActionInterface {
    connect(): void;
    disconnect(): void;
}
export declare class ActionEvent extends Event implements ActionEventInterface {
    action: ActionInterface;
    constructor(action: ActionInterface, eventInit?: EventInit);
}
export declare class SuperAction implements SuperActionInterface {
    #private;
    constructor(params: SuperActionParamsInterface);
    connect(): void;
    disconnect(): void;
}
