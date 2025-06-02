export interface SuperActionParamsInterface {
    host: ParentNode;
    eventNames: string[];
    connected?: boolean;
}
export interface SuperActionInterface {
    connect(): void;
    disconnect(): void;
}
export interface SuperActionEventInterface extends Event {
    action: string;
    sourceEvent: Event;
}
export declare class SuperAction {
    #private;
    constructor(params: SuperActionParamsInterface);
    connect(): void;
    disconnect(): void;
}
export declare class SuperActionEvent extends Event implements SuperActionEvent {
    #private;
    constructor(action: string, sourceEvent: Event);
    get action(): string;
    get sourceEvent(): Event;
}
