
import Context from "./Context";
import { AccountSchema } from "./AccountSchema";


export enum TableAction {
    Create = 'Create',
    Update = 'Update',
    Delete = 'Delete'
}

export enum EventType {

    Table = 'Table'
}

export interface EventInfo {
    payload: string;

    type: EventType;

    accountId: string;
}

export interface TableEventInfo extends EventInfo {

    table: string;

    action: TableAction;
}

export interface ISubscriptionSink {

    publish(info: TableEventInfo, context: Context): void;
}

export interface ISubscribersStatus {

    /* async */ setActive(clientId: string): void;

    /* async */ setInactive(clientId: string): void;
}

export type Client = string;

export interface Subscription {

    topic: string;

    query: string;

    filter: string;

    isActive: boolean;
}

export interface ISubscriptionStatusEngine {

    /* async */ getSubscription(client: Client, topic: string): Promise<Subscription>;

    /* async */ setClientActive(client: Client): Promise<void>;

    /* async */ setClientInactive(client: Client): Promise<void>;

    /* async */ subscribeClient(client: Client, topic: string, query: string, filter: string): Promise<void>;

    /* async */ unsubscribeClient(client: Client, topic: string): Promise<void>;
}

