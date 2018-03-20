import { DocumentNode } from 'graphql';


export interface IObserver<T> {
    next(data: any): void;
    complete(): void;
    error(err: Error): void;
}

export interface ConnectOptions {
    region: string;
    iotEndpoint: string;

}

export interface SubscribeInfo {
    query?: string;
    DocumentNode?: DocumentNode;
    topic: string;
    filter?: string;
    clientId?: string;
}

export interface CognitoConnectOptions extends ConnectOptions {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
}