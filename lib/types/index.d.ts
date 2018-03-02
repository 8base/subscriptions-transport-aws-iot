export declare type SubscriptionInfo = {
    id: string;
};
export interface IObserver<T> {
    next(data: any): void;
    complete(): void;
    error(err: Error): void;
}
