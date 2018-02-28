import { DocumentNode } from 'graphql/language/ast';

export interface OperationOptions {
    query?: string | DocumentNode;
    variables?: Object;
    operationName?: string;

    [key: string]: any;
}

export interface Observer<T> {
    next?: (value: T) => void;
    error?: (error: Error) => void;
    complete?: () => void;
}

export interface Observable<T> {
    subscribe(observer: Observer<T>): {
        unsubscribe: () => void;
    };
}

export interface Middleware {
    applyMiddleware(options: OperationOptions, next: Function): void;
}

export type FormatedError = Error & {
    originalError?: any;
};


export type ConnectionParams = {
    [paramName: string]: any,
};