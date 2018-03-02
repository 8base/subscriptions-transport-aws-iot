import { FetchResult } from "apollo-link";
import { ISubscriptionClient, IMqttClient } from "../interfaces";
import { IClientSubscribeOptions } from 'mqtt';
import { Observable } from "zen-observable-ts";
export declare class SubscriptionClient implements ISubscriptionClient {
    private url;
    private client;
    private observables;
    constructor(url: string, client: IMqttClient);
    request(topic: string, options: IClientSubscribeOptions): Observable<FetchResult>;
    private connect();
    private onReceive(receivedData, data);
    private onClose(reason);
}
