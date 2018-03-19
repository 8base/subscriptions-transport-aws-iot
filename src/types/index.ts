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
    query?: DocumentNode;

    topic: string;

    // client: string;
}

export interface CognitoConnectOptions extends ConnectOptions {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
}