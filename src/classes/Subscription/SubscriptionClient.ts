
import { ApolloLink, Operation, NextLink, FetchResult } from "apollo-link";
import { ISubscribeHandler, IMqttClient, IConnectOptionsResolver } from "../../interfaces";
import { SubscriptionInfo, IObserver } from "../../types";
import { TopicObservable } from '../TopicObservable';
import { IClientSubscribeOptions } from 'mqtt';
import { Observable } from "zen-observable-ts";
import { GqlQueryToTopic } from '../Utils';



export class SubscriptionClient {

    private url: string;
    private client: IMqttClient;

    private resolver: IConnectOptionsResolver;

    private handlers: ISubscribeHandler[] = [];
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

    subscribe(operation: Operation, options: IClientSubscribeOptions): Observable<FetchResult> {

        const topic = GqlQueryToTopic(operation.query);

        const observable = new TopicObservable<FetchResult>(this.onRemoveObservable.bind(this, topic));

        Promise.all(this.handlers.map(handler => handler.subscribe(operation, options)))
            .catch((err: Error) => {
                observable.onError(err);
            });

        this.observables.set(topic, observable);
        return observable;
    }

    addSubscribeHandler(handler: ISubscribeHandler) {
        this.handlers.push(handler);
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