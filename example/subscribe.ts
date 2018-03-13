import { SubscriptionEnvironment } from "../src/factories";
import { Config } from "../src/config";
import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from "aws-sdk";
import "isomorphic-fetch";


/*
    setup process environment
 */

process.env.AWS_IOT_ENDPOINT = "";
process.env.AWS_REGION = "";
process.env.AWS_USER_POOL_ID = "";
process.env.AWS_CLIENT_ID = "";
process.env.AWS_IDENTITY_POOL_ID = "";
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
                .create()
                .transport(SubscriptionEnvironment.Transport.Iot())
                .authResolver(SubscriptionEnvironment.Auth.Cognito(session.getIdToken().getJwtToken()))
                .client();

        client.subscribe( { topic: "test-topic" }, { qos: 1 }).subscribe(observer);
    },
    onFailure: (err: Error) => {
        console.log(err);
    }
});