import { ApolloLink, NextLink, Operation, FetchResult } from "apollo-link";
import { Observable } from "zen-observable-ts";
import { ApolloLinkOperationToSubscribeInfo } from '../Common';
import { SubscriptionClient } from "./SubscriptionClient";

export class SubscriptionClientLink extends ApolloLink {
    private client: SubscriptionClient;

    constructor(client: SubscriptionClient) {
        super();
        this.client = client;
    }

    request(operation: Operation, forwardedLink: NextLink): Observable<FetchResult> {
        return this.client.subscribe( ApolloLinkOperationToSubscribeInfo(operation), { qos: 1 });
    }
}