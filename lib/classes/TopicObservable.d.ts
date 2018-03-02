import { IMqttClient } from '../interfaces';
import { IClientSubscribeOptions } from "mqtt";
import { Observable, ZenObservable } from 'zen-observable-ts';
export declare class TopicObservable<T> implements Observable<T> {
    forEach(fn: (value: T) => void): Promise<void>;
    map<R>(fn: (value: T) => R): Observable<R>;
    filter(fn: (value: T) => boolean): Observable<T>;
    reduce<R = T>(fn: (previousValue: T | R, currentValue: T) => T | R, initialValue?: T | R): Observable<T | R>;
    flatMap<R>(fn: (value: T) => ZenObservable.ObservableLike<R>): Observable<R>;
    from<R>(observable: Observable<R> | ZenObservable.ObservableLike<R> | ArrayLike<R>): Observable<R>;
    of<R>(...args: R[]): Observable<R>;
    private topic;
    private options;
    private observers;
    constructor(client: IMqttClient, topic: string, options: IClientSubscribeOptions);
    subscribe(observerOrNext: ((value: T) => void) | ZenObservable.Observer<T>, error?: (error: any) => void, complete?: () => void): ZenObservable.Subscription;
    onData(data: T): void;
    onError(err: Error): void;
    onComplete(): void;
    private addObserver(observer);
    private unsubscribe(id);
    private getObserver(observerOrNext, error?, complete?);
}
