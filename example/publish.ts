
import { PublishEnvironment } from "../src/factories";
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

if (process.argv.length < 4) {
    console.log("invalid argument");
    process.exit(0);
}

const topic = process.argv[2];
const payload = process.argv[3];

// PublishEnvironment.publish(topic, payload);

console.log("pusblish success");