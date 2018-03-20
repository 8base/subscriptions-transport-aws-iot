
export interface IPublisherClient {

    /* async */ publish(topic: string, data: any): Promise<void>;
}