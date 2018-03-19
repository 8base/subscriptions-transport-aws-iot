export enum EventType {

    Table = 'Table',

    Custom = 'Custom'
}


export interface EventInfo {
    payload: string;

    type: EventType;

    accountId: string;
}