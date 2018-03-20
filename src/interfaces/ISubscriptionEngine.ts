import { SubscribeInfo } from "../types";

export enum UserStatus {
  active = 'active',
  inactive = 'inactive'
}

export interface ISubscriptionEngine {

    /* async */ getSubscription(room: string, user: string, topic: string): Promise<SubscribeInfo>;

    /* async */ getSubscriptions(room: string, topic: string): Promise<SubscribeInfo[]>;

    /* async */ setUserActive(user: string): Promise<void>;

    /* async */ setUserInactive(user: string): Promise<void>;

    /* async */ userStatus(user: string): Promise<UserStatus>;

    /* async */ subscribeUser(room: string, user: string, topic: string, query: string, filter: string): Promise<void>;

    /* async */ unsubscribeUser(room: string, user: string, topic: string): Promise<void>;

    /* async */ disconnect(): Promise<void>;

    /* async */ getSchema(): Promise<string>;

    /* async */ setSchema(schema: string): Promise<void>;
}

