
import gql from "graphql-tag";
import { DocumentNode } from 'graphql';
import { SubscribeInfo } from '../../types';
import { Operation } from "apollo-link";


export function ApolloLinkOperationToSubscribeInfo(operation: Operation): SubscribeInfo {

    return {
        query: operation.query,
        topic: queryToTopic(operation.query)
    };
}

function queryToTopic(query: DocumentNode): string {
    return "";
}
