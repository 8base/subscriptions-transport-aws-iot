import { ApolloLink, NextLink, Operation, FetchResult } from 'apollo-link';
import { ISubscriptionClient } from '../interfaces';
import { Observable } from 'zen-observable-ts';


export class SubscriptionClientLink extends ApolloLink {
    private client: ISubscriptionClient;
    constructor(client: ISubscriptionClient) {
        super();
        this.client = client;
    }

    request(operation: Operation, forwardedLink: NextLink): Observable<FetchResult> {
        // todo operation convert to topic and data
        return this.client.request(operation.getContext().topic, { qos: 1 });
    }
}