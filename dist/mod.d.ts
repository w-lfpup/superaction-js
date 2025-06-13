export type { SuperActionParamsInterface, SuperActionEventInterface, SuperActionInterface };
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
declare class SuperAction {
    #private;
    constructor(params: SuperActionParamsInterface);
    connect(): void;
    disconnect(): void;
}
declare class SuperActionEvent extends Event implements SuperActionEvent {
    #private;
    constructor(action: string, sourceEvent: Event);
    get action(): string;
    get sourceEvent(): Event;
}
