import { SubscriptionInfo } from "lib/types";


export class IPublisherClient {

    publish(topic: string, data: SubscriptionInfo): void;
}