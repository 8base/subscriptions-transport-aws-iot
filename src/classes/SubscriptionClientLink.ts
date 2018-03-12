import { ApolloLink, NextLink, Operation, FetchResult } from "apollo-link";
import { ISubscriptionClient } from '../interfaces';
import { Observable } from "zen-observable-ts";
import { GqlSubscriptionToTopic } from './Utils';


export class SubscriptionClientLink extends ApolloLink {
    private client: ISubscriptionClient;

    constructor(client: ISubscriptionClient) {
        super();
        this.client = client;
    }

    request(operation: Operation, forwardedLink: NextLink): Observable<FetchResult> {
        return this.client.subscribe(GqlSubscriptionToTopic(operation.query), { qos: 1 });
    }
}