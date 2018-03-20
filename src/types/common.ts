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

/*
    room
*/

export interface SubscribeInfo {
    query?: DocumentNode;
    filter?: string;
    topic: string;
    room: string;
    user: string;
}

export enum MessageType {
    Table = 'Table',
    Custom = 'Custom'
}

export interface MessageToProcess {
    room: string;
    type: MessageType;
    payload: string;
}

export interface CognitoConnectOptions extends ConnectOptions {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
}