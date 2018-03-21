import { SubscriptionEnvironment } from "../src/factories";
import { Config } from "../src/config";
import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from "aws-sdk";
import "isomorphic-fetch";
import { } from "graphql";

import * as parseArgs from "minimist";
import * as _ from "lodash";

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



let parameters = new Map<string, string>();
_.map(parseArgs(process.argv), (value: string, key: string) => parameters.set(key, value));


Config.identityPoolId = parameters.get("identityPoolId");
Config.iotEndpoint = parameters.get("iotEndpoint");
Config.region = parameters.get("region");
Config.userPoolId = parameters.get("userPoolId");
Config.debugMqttClient = !!parameters.get("d");
Config.userPoolClientId = parameters.get("userPoolClientId");

const user = parameters.get("user");
const password = parameters.get("password");

console.log("start subscribe");

console.log("username = " + user);
console.log("password = " + password);
console.log("userPoolClientId = " + Config.userPoolClientId);
console.log("region = " + Config.region);
console.log("identityPoolId = " + Config.identityPoolId);
console.log("iotEndpoint = " + Config.iotEndpoint);
console.log("userPoolId = " + Config.userPoolId);


const authenticationDetails = new AuthenticationDetails({
    Username: user,
    Password: password,
});

const cognitoUser = new CognitoUser({
    Username: user,
    Pool: new CognitoUserPool({
        UserPoolId: Config.userPoolId,
        ClientId: Config.userPoolClientId
    })
});

cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (session: CognitoUserSession) => {
        const client = SubscriptionEnvironment
                .Client
                .create("room1", user)
                .transport(SubscriptionEnvironment.Transport.Iot)
                .authResolver(SubscriptionEnvironment.Auth.Cognito(session.getIdToken().getJwtToken()))
                .client();

        client.subscribe( { topic: "test-topic", room: "room1", user, filter: "testfilter" }, { qos: 1 }).subscribe(observer);
    },
    onFailure: (err: Error) => {
        console.log(err);
    }
});