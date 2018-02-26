import { OperationOptions, Middleware, FormatedError, ConnectionParams, Observable, Observer } from "../types";
import { ExecutionResult } from 'graphql/execution/execute';
import * as EventEmitter from 'eventemitter3';


export interface ICliTopic {

    publish(): void;
}


export interface ICliSubscriptionClient {

    subscribe(topic: string): ICliTopic;
}

export interface ISubscriptionClient {
    close(isForced: boolean, closedByUser: boolean): void;

    request(request: OperationOptions): Observable<ExecutionResult>;

    on(eventName: string, callback: EventEmitter.ListenerFn, context?: any): Function;

    onConnected(callback: EventEmitter.ListenerFn, context?: any): Function;

    onConnecting(callback: EventEmitter.ListenerFn, context?: any): Function;

    onDisconnected(callback: EventEmitter.ListenerFn, context?: any): Function;

    onReconnected(callback: EventEmitter.ListenerFn, context?: any): Function;

    onReconnecting(callback: EventEmitter.ListenerFn, context?: any): Function;


    unsubscribe(opId: string): void;

    unsubscribeAll(): void;

    /* async */ applyMiddlewares(options: OperationOptions): Promise<OperationOptions>;


    use(middlewares: Middleware[]): ISubscriptionClient;
}