import { SubscriptionInfo } from '../types';
import { IClientSubscribeOptions } from 'mqtt';
import { Observable } from 'zen-observable-ts';
import { FetchResult } from 'apollo-link';

export interface ISubscriptionClient {

    request(topic: string, options: IClientSubscribeOptions): Observable<FetchResult>;
}

export interface IMqttClient {

    connect(url: string, options: any, onReceive: Function, onClose: Function): void;

    subscribe(topic: string, options: IClientSubscribeOptions): void;

    unsubscribe(topic: string): void;
}