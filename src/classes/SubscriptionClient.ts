
import { ApolloLink, Operation, NextLink, FetchResult } from "apollo-link";
import { ISubscriptionClient, IMqttClient } from "../interfaces";
import { SubscriptionInfo, IObserver } from "../types";
import { TopicObservable } from './TopicObservable';
import { IClientSubscribeOptions } from 'mqtt';
import { Observable } from "zen-observable-ts";



export class SubscriptionClient implements ISubscriptionClient {

    private url: string;
    private client: IMqttClient;

    private observables: Map<string, TopicObservable<FetchResult>> = new Map();

    constructor(url: string, client: IMqttClient) {
        if (!url) {
            throw new Error("url resolver is required.");
        }

        this.url = url;
        this.client = client;
        this.connect();
    }

    public request(topic: string, options: IClientSubscribeOptions): Observable<FetchResult> {
        const observable = new TopicObservable<FetchResult>(this.client, topic, options);
        this.observables.set(topic, observable);
        return observable;
    }

    /*
        Private functions
    */

    private connect() {
        this.client.connect(
            this.url,
            this.onReceive.bind(this),
            this.onClose.bind(this)
        );
    }

    private onReceive(receivedData: string, data: Buffer) {
        const parsed = JSON.parse(String(data));
        for(const [topic, observable] of this.observables) {
            // TODO topic filter
            observable.onData(parsed as FetchResult);
        }
    }

    private onClose(reason: Error) {
        for(const [topic, observable] of this.observables) {
            observable.onError(reason);
        }
    }

}