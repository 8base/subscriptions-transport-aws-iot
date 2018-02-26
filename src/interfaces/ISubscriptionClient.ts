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
    request(request: OperationOptions): Observable<ExecutionResult>;

}