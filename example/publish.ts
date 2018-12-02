
import { PublishEnvironment, ServiceEnvironment } from "../src/factories";
import { Config } from "../src/config";
import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from "aws-sdk";
import "isomorphic-fetch";
import * as parseArgs from "minimist";
import _ = require("lodash");


let parameters = new Map<string, string>();
_.map(parseArgs(process.argv), (value: string, key: string) => parameters.set(key, value));

AWS.config.region = parameters.get("region");
Config.iotEndpoint = parameters.get("iotEndpoint");

console.log("iotEndpoint = " + Config.iotEndpoint);
console.log("region = " + AWS.config.region);

PublishEnvironment.Client.sendSourceMessageToTopic("room1", "test-topic", JSON.stringify({ data: " { \"kokoko\": \"ololo\" } " }))
    .then(() => {
        console.log("pusblish success");
    })
    .catch((err: Error) => {
        console.log(err.message);
    });

