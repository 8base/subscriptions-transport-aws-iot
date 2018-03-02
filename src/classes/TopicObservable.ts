import { IObserver, SubscriptionInfo } from "../types";
import { IMqttClient } from '../interfaces';
import * as uuid from "uuid";
import { IClientSubscribeOptions } from "mqtt";
import { FetchResult } from "apollo-link";
import { Observable, ZenObservable, Observer } from 'zen-observable-ts';


export class TopicObservable<T> implements Observable<T> {
    forEach(fn: (value: T) => void): Promise<void> {
        throw new Error("Method not implemented.");
    }
    map<R>(fn: (value: T) => R): Observable<R> {
        throw new Error("Method not implemented.");
    }
    filter(fn: (value: T) => boolean): Observable<T> {
        throw new Error("Method not implemented.");
    }
    reduce<R = T>(fn: (previousValue: T | R, currentValue: T) => T | R, initialValue?: T | R): Observable<T | R> {
        throw new Error("Method not implemented.");
    }
    flatMap<R>(fn: (value: T) => ZenObservable.ObservableLike<R>): Observable<R> {
        throw new Error("Method not implemented.");
    }
    from<R>(observable: Observable<R> | ZenObservable.ObservableLike<R> | ArrayLike<R>): Observable<R> {
        throw new Error("Method not implemented.");
    }
    of<R>(...args: R[]): Observable<R> {
        throw new Error("Method not implemented.");
    }


    private topic: string;
    private options: any;


    // private observers: {[key: string]: IObserver<SubscriptionInfo>};
    private observers: Map<string, Observer<T>> = new Map();

    constructor(client: IMqttClient,topic: string, options: IClientSubscribeOptions) {
        this.topic = topic;
        this.options = options;
    }

    subscribe(observerOrNext: ((value: T) => void) | ZenObservable.Observer<T>, error?: (error: any) => void, complete?: () => void): ZenObservable.Subscription {
        const id = this.addObserver(this.getObserver(observerOrNext, error, complete));
        return {
            unsubscribe: () => this.unsubscribe(id),
            closed: false
        };
    }

    onData(data: T) {
        for(const [ id, observer ] of this.observers) {
            if (observer) {
                observer.next(data);
            }
        }
    }

    onError(err: Error) {
        for(const [ id, observer ] of this.observers) {
            observer.error(err);
        }
    }

    onComplete() {
        for(const [ id, observer ] of this.observers) {
            observer.complete();
        }
    }

    /*
        private functions
    */

    private addObserver(observer: Observer<T>): string {
        const id = uuid.v4();
        this.observers.set(id, observer);
        return id;
    }

    private unsubscribe(id: string) {
        this.observers.delete(id);
    }

    private getObserver(observerOrNext: ((Observer<T>) | ((v: T) => void)), error?: (e: Error) => void, complete?: () => void) {
        if ( typeof observerOrNext === 'function' ) {
          return {
            next: (v: T) => observerOrNext(v),
            error: (e: Error) => error && error(e),
            complete: () => complete && complete(),
          };
        }

        return observerOrNext;
      }
}