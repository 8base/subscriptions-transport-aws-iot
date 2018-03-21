import { SubscribeInfo } from "../types";

export interface ISubscribeHandler {

    /*
        topic separate transfer?
    */
    /* async */ subscribe(room: string, user: string, info: SubscribeInfo, options: any): Promise<void>;
}