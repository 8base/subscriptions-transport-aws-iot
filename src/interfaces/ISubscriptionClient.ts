import { SubscriptionInfo } from '../types';
import { IClientSubscribeOptions } from 'mqtt';
import { Observable } from 'zen-observable-ts';
import { FetchResult } from 'apollo-link';

export interface ISubscriptionClient {

    subscribe(topic: string, options: IClientSubscribeOptions): Observable<FetchResult>;
}

