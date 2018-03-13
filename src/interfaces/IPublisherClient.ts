import { SubscriptionInfo } from "../types";


export interface IPublisherClient {

    publish(topic: string, data: SubscriptionInfo): void;
}