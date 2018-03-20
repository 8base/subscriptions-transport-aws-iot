
export interface IPublisherClient {

    /* async */ publish(topic: string, data: Buffer): Promise<void>;
}