export interface ActionInterface {
    action: string;
    formData?: FormData;
    sourceEvent: Event;
}
export interface ActionEventInterface extends Event {
    actionParams: ActionInterface;
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
    actionParams: ActionInterface;
    constructor(actionParams: ActionInterface, eventInit?: EventInit);
}
export declare class SuperAction implements SuperActionInterface {
    #private;
    constructor(params: SuperActionParamsInterface);
    connect(): void;
    disconnect(): void;
}
