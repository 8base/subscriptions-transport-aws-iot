
import { PublisherEnvironment } from "../src/factories";
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

if (process.argv.length < 4) {
    console.log("invalid argument");
    process.exit(0);
}

const topic = process.argv[2];
const payload = process.argv[3];

PublisherEnvironment.publish(topic, payload);

console.log("pusblish success");