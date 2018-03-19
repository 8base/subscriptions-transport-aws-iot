import { EventInfo } from "./ISubscriptionCommon";

export enum TableAction {
    Create = 'Create',
    Update = 'Update',
    Delete = 'Delete'
}


export interface TableEventInfo extends EventInfo {

    table: string;

    action: TableAction;
}

export interface ISubscriptionSink {

    publish(info: TableEventInfo): void;
}