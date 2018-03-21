import { ruleT, functionT } from "./types";
import * as path from "path";
import { PredefineTopicPrefix } from '../../src/classes';

export const functions: functionT[] = [
    {
      name: "OnConnected",
      arn: "",
      handler: "index.OnConnected"
    },
    {
      name: "OnDisconnected",
      arn: "",
      handler: "index.OnDisconnected"
    },
    {
      name: "OnNewMessage",
      arn: "",
      handler: "index.OnNewMessage"
    },
    {
      name: "GetClient",
      arn: "",
      handler: "index.GetClient"
    },
    {
      name: "GetSubscription",
      arn: "",
      handler: "index.GetSubscription"
    },
    {
      name: "GetSubscriptions",
      arn: "",
      handler: "index.GetSubscriptions"
    },
    {
      name: "OnNewSubscribe",
      arn: "",
      handler: "index.OnNewSubscribe"
    },
    {
      name: "OnSetSchema",
      arn: "",
      handler: "index.OnSetSchema"
    }
];

export const rules: ruleT[] = [
    {
      functionName: "OnNewMessage",
      name: "OnNewMessage",
      sql: `SELECT * FROM '${PredefineTopicPrefix.onNewMessage}'`
    },
    {
      functionName: "OnNewSubscribe",
      name: "OnNewSubscribe",
      sql: `SELECT * FROM '${PredefineTopicPrefix.onNewSubscribe}'`
    },
    {
      functionName: "OnConnected",
      name: "OnConnected",
      sql: `SELECT * FROM '$aws/events/presence/connected/#'`
    },
    {
      functionName: "OnDisconnected",
      name: "OnDisconnected",
      sql: `SELECT * FROM '$aws/events/presence/disconnected/#'`
    },
    {
      functionName: "OnSetSchema",
      name: "OnSetSchema",
      sql: `SELECT * FROM '${PredefineTopicPrefix.onSetSchema}'`
    }
];