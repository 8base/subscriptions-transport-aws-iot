export type SubscriptionInfo = {

    id: string;
};

export interface IObserver<T> {
    next(data: any): void;
    complete(): void;
    error(err: Error): void;
}

export interface ConnectOptions {
    region: string;
    iotEndpoint: string;

}

export interface CognitoConnectOptions extends ConnectOptions {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken: string;
}