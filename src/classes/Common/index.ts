
import gql from "graphql-tag";
import { DocumentNode } from 'graphql';
import { SubscribeInfo } from '../../types';
import { Operation } from "apollo-link";


export function ApolloLinkOperationToSubscribeInfo(operation: Operation): SubscribeInfo {

    let subscription = new SubscribeInfo();
    subscription.query = operation.query;
    subscription.topic = queryToTopic(operation.query);
    return subscription;
}




function queryToTopic(query: DocumentNode): string {
    return "";
}

