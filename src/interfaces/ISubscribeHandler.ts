import { SubscribeInfo } from "../types";

export interface ISubscribeHandler {

    /*
        topic separate transfer?
    */
    /* async */ subscribe(info: SubscribeInfo, options: any): Promise<void>;
}