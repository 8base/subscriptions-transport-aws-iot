import { ApolloLink, NextLink, Operation, FetchResult } from 'apollo-link';
import { ISubscriptionClient } from '../interfaces';
import { Observable } from 'zen-observable-ts';
export declare class SubscriptionClientLink extends ApolloLink {
    private client;
    constructor(client: ISubscriptionClient);
    request(operation: Operation, forwardedLink: NextLink): Observable<FetchResult>;
}
