import { SubscribeInfo } from "../types";

export interface ISubscribeHandler {

    /* async */ subscribe(info: SubscribeInfo, options: any): Promise<void>;
}