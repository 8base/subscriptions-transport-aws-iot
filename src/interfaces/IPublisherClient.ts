
export interface IPublisherClient {

    /* async */ publish(client: string, topic: string, data: Buffer): Promise<void>;
}