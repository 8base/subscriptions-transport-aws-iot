import { SignedUrlResolver } from './SignedUrlResolver';

import { SubscriptionClientFactory } from "../src/factories";
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
        observable = SubscriptionClientFactory(url).request("test-topic", { qos: 1 }).subscribe(observer);

    })
    .catch(err => console.log(err));



