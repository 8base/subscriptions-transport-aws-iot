export type Client = string;

export interface Subscription {

    topic: string;

    query: string;

    filter: string;

    isActive: boolean;
}

export enum ClientStatus {
  active = 'active',
  inactive = 'inactive'
}

export interface ISubscriptionEngine {

    /* async */ getSubscription(client: Client, topic: string): Promise<Subscription>;

    /* async */ setClientActive(client: Client): Promise<void>;

    /* async */ setClientInactive(client: Client): Promise<void>;

    /* async */ ClientStatus(client: Client): Promise<ClientStatus>;

    /* async */ subscribeClient(client: Client, topic: string, query: string, filter: string): Promise<void>;

    /* async */ unsubscribeClient(client: Client, topic: string): Promise<void>;

    /* async */ disconnect(): Promise<void>;
}

