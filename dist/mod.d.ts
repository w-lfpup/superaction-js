export interface ActionInterface {
    sourceEvent: Event;
    action: string;
    formData?: FormData;
}
export interface ActionEventInterface extends Event {
    actionParams: ActionInterface;
}
export interface SuperActionParamsInterface {
    target: ParentNode;
    eventNames: string[];
    connected?: boolean;
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
export declare function dispatch(sourceEvent: Event): void;
