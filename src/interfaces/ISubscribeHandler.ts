import { Operation } from "apollo-link";

export interface ISubscribeHandler {

    /* async */ subscribe(operation: Operation, options: any): Promise<void>;
}