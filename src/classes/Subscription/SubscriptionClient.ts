
import { ApolloLink, Operation, NextLink, FetchResult } from "apollo-link";
import { ISubscribeHandler, IMqttClient, IConnectOptionsResolver } from "../../interfaces";
import { SubscribeInfo } from "../../types";
import { TopicObservable } from '../Topic';
import { IClientSubscribeOptions } from 'mqtt';
import { Observable } from "zen-observable-ts";
import { PredefineTopics } from '../Topic';

export class SubscriptionClient {

    private url: string;
    private mqttClient: IMqttClient;

    private resolver: IConnectOptionsResolver;

    private handlers: ISubscribeHandler[];
    /*
        Observable per topic
    */
    private observables: Map<string, TopicObservable<FetchResult>> = new Map();

    private user: string;
    private room: string;

    constructor(resolver: IConnectOptionsResolver, mqttClient: IMqttClient, handlers: ISubscribeHandler[], room: string, user: string) {
        this.resolver = resolver;
        this.mqttClient = mqttClient;
        this.handlers = handlers;
        this.room = room;
        this.user = user;

        this.mqttClient.connect(
            this.resolver,
            this.onReceive.bind(this),
            this.onClose.bind(this)
        );
    }

    subscribe(info: SubscribeInfo, options: IClientSubscribeOptions): Observable<FetchResult> {
        info.room = this.room;
        info.user = this.user;
        const observable = new TopicObservable<FetchResult>(this.onRemoveObservable.bind(this, info.fullTopic));

        Promise.all(this.handlers.map(handler => handler.subscribe(info, options)))
            .catch((err: Error) => {
                observable.onError(err);
            });

        this.observables.set(info.fullTopic, observable);
        return observable;
    }

    /*
        Private functions
    */

    private onReceive(topic: string, data: any) {
        const resp = this.processResponce(data);
        const handler = this.observables.get(topic);
        if (resp && handler) {
            handler.onData(resp);
        }
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