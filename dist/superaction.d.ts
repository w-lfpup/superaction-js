export interface SuperActionParamsInterface {
    host: ParentNode;
    eventNames: string[];
    connected?: boolean;
}
export declare class SuperAction {
    #private;
    constructor(params: SuperActionParamsInterface);
    connect(): void;
    disconnect(): void;
}
