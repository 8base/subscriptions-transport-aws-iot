
import gql from "graphql-tag";
import { DocumentNode } from 'graphql';
import { SubscribeInfo } from '../../types';
import { Operation } from "apollo-link";


export function ApolloLinkOperationToSubscribeInfo(operation: Operation): SubscribeInfo {

    return {
        query: "",
        DocumentNode: operation.query,
        topic: queryToTopic(operation.query)
    };
}

function getRandomArbitrary(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export namespace ClientIdTransform {
    export function toUser(clientId: string): string {
        return clientId.slice(0, -6);
    }

    export function fromUser(user: string): string {
        return user + "_" + getRandomArbitrary(10000, 99999).toString();
    }
}


function queryToTopic(query: DocumentNode): string {
    return "";
}

