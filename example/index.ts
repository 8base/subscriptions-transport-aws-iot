import { SignedUrlResolver } from './SignedUrlResolver';

import { SubscriptionClient } from "../src";
import { Config } from "./config";

const client = new SubscriptionClient(
    new SignedUrlResolver(Config.iotEndpoint, Config.region)
);

const observer = {
    next: (data: any) => {
        console.log("next");
        console.log(data);
    },
    error: (err: Error) => {
        console.log("error");
        console.log(err);
    },
    complete: () => {
        console.log("complete");
    }
}

const observable = client.request( { query: "afdaf" }).subscribe(observer);


