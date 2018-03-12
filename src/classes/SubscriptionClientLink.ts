import { ApolloLink, NextLink, Operation, FetchResult } from "apollo-link";
import { Observable } from "zen-observable-ts";
import { GqlSubscriptionToTopic } from './Utils';
import { SubscriptionClient } from "./Subscription";

export class SubscriptionClientLink extends ApolloLink {
    private client: SubscriptionClient;

    constructor(client: SubscriptionClient) {
        super();
        this.client = client;
    }

    request(operation: Operation, forwardedLink: NextLink): Observable<FetchResult> {
        return this.client.subscribe(operation, { qos: 1 });
    }
}