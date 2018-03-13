
import { ApolloLink, Operation, NextLink, FetchResult } from "apollo-link";
import { ISubscribeHandler, IMqttClient, IConnectOptionsResolver } from "../../interfaces";
import { SubscribeInfo } from "../../types";
import { TopicObservable } from '../Common';
import { IClientSubscribeOptions } from 'mqtt';
import { Observable } from "zen-observable-ts";

export class SubscriptionClient {

    private url: string;
    private mqttClient: IMqttClient;

    private resolver: IConnectOptionsResolver;

    private handlers: ISubscribeHandler[] = [];
    /*
        Observable per topic
    */
    private observables: Map<string, TopicObservable<FetchResult>> = new Map();

    constructor(resolver: IConnectOptionsResolver, mqttClient: IMqttClient) {
        this.resolver = resolver;
        this.mqttClient = mqttClient;

        this.mqttClient.connect(
            this.resolver,
            this.onReceive.bind(this),
            this.onClose.bind(this)
        );
    }

    subscribe(info: SubscribeInfo, options: IClientSubscribeOptions): Observable<FetchResult> {
        const observable = new TopicObservable<FetchResult>(this.onRemoveObservable.bind(this, info.topic));

        Promise.all(this.handlers.map(handler => handler.subscribe(info, options)))
            .catch((err: Error) => {
                observable.onError(err);
            });

        this.observables.set(info.topic, observable);
        return observable;
    }

    addSubscribeHandler(handler: ISubscribeHandler) {
        this.handlers.push(handler);
    }

    get transport() {
        return this.mqttClient;
    }
    /*
        Private functions
    */

    private onReceive(topic: string, data: any) {
        const resp = this.processResponce(data);
        if (resp)
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
        try {
            return JSON.parse(String(data));
        } catch(ex) {
            console.log("input data " + data + " is not json format");
        }
        return null;
    }
}