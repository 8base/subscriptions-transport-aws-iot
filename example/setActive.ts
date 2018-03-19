import { SubscriptionEnvironment } from "../src/factories";
import { Config } from "../src/config";
import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserSession } from 'amazon-cognito-identity-js';
import * as AWS from "aws-sdk";
import "isomorphic-fetch";


/*
    setup process environment
*/


const client = "testclient";
console.log;("set active = " + client);
const engine = SubscriptionEnvironment.StatusEngine("test-redis.3lfqwv.ng.0001.use1.cache.amazonaws.com:6379");

console.log;("connect with redis success");

engine.setClientActive(client);

console.log;("set client active success");