import { SignedUrlResolver } from './SignedUrlResolver';

import { SubscriptionClient } from "../src";
import { Config } from "./config";

const resolver = new SignedUrlResolver(Config.iotEndpoint, Config.region);

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
};

console.log("start example");

let observable = null;

resolver.resolve()
    .then(url => {
        observable = (new SubscriptionClient(url)).request( { query: "afdaf" }).subscribe(observer);

    })
    .catch(err => console.log(err));



