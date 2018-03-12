
import { ApolloLink, Operation, NextLink, FetchResult } from "apollo-link";
import { ISubscriptionClient, IMqttClient, IConnectOptionsResolver } from "../interfaces";
import { SubscriptionInfo, IObserver } from "../types";
import { TopicObservable } from './TopicObservable';
import { IClientSubscribeOptions } from 'mqtt';
import { Observable } from "zen-observable-ts";



export class IotSubscriptionClient implements ISubscriptionClient {

    private url: string;
    private client: IMqttClient;

    private resolver: IConnectOptionsResolver;

    /*
        Observable per topic
    */
    private observables: Map<string, TopicObservable<FetchResult>> = new Map();

    constructor(resolver: IConnectOptionsResolver, client: IMqttClient) {
        this.resolver = resolver;
        this.client = client;

        this.client.connect(
            this.resolver,
            this.onReceive.bind(this),
            this.onClose.bind(this)
        );
    }

    subscribe(topic: string, options: IClientSubscribeOptions): Observable<FetchResult> {
        const observable = new TopicObservable<FetchResult>(topic, this.onRemoveObservable.bind(this, topic));

        this.client
            .subscribe(topic, options)
            .catch((err: Error) => {
                observable.onError(err);
            });

        this.observables.set(topic, observable);
        return observable;
    }

    /*
        Private functions
    */

    private onReceive(topic: string, data: any) {
        const resp = this.processResponce(data);
        this.observables.get(topic).onData(resp);
    }

    private onClose(reason: Error) {
        for(const [topic, observable] of this.observables) {
            observable.onError(reason);
        }
    }

    private onRemoveObservable(topic: string) {
        this.observables.delete(topic);
    }

    private processResponce(data: any) {
        return JSON.parse(String(data));
    }
}