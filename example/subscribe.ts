import { SubscriptionEnvironment } from "../src/factories";
import { Config } from "../src/config";
import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from "aws-sdk";
import "isomorphic-fetch";


/*
    setup process environment
 */

process.env.AWS_IOT_ENDPOINT = "a1iocoaxmt1h7b.iot.us-east-1.amazonaws.com";
process.env.AWS_REGION = "us-east-1";
process.env.AWS_USER_POOL_ID = "us-east-1_LrSYtlfnH";
process.env.AWS_CLIENT_ID = "1lr8bpt6bbru48ou760ufcn2tt";
process.env.AWS_IDENTITY_POOL_ID = "us-east-1:7eb56e23-0840-4ffe-ab40-d0a2b5006de4";
process.env.DEBUG_MQTT_CLIENT = "true";

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

if (process.argv.length < 4) {
    console.log("invalid input args");
    process.exit(0);
}

console.log("start example");
console.log("username = " + process.argv[2]);
console.log("password = " + process.argv[3]);
console.log("region = " + Config.region);

const username = process.argv[2];
const password = process.argv[3];

const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
});

const cognitoUser = new CognitoUser({
    Username: username,
    Pool: new CognitoUserPool({
        UserPoolId: Config.userPoolId,
        ClientId: Config.clientId
    })
});

cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (session: CognitoUserSession) => {
        const client = SubscriptionEnvironment
                .Client
                .make(
                    SubscriptionEnvironment.Transport.Iot(),
                    SubscriptionEnvironment.Auth.Cognito(session.getIdToken().getJwtToken()));

        SubscriptionEnvironment.SubscribeHandlers.Iot.add(client);

        client.subscribe( { topic: "test-topic" }, { qos: 1 }).subscribe(observer);
    },
    onFailure: (err: Error) => {
        console.log(err);
    }
});