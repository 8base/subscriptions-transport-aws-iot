import { ruleT, functionT } from "./types";
import * as path from "path";
import { PredefineTopics } from '../../src/classes';


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
    },
    {
      name: "GetActiveClients",
      arn: "",
      handler: "index.GetActiveClients"
    },
    {
      name: "ClearAll",
      arn: "",
      handler: "index.ClearAll"
    },
    {
      name: "PublishToTopic",
      arn: "",
      handler: "index.PublishToTopic"
    }
];

export const rules: ruleT[] = [
    {
      functionName: "OnNewMessage",
      name: "OnNewMessage",
      sql: `SELECT * FROM '${PredefineTopics.onNewMessage}/#'`
    },
    {
      functionName: "OnNewSubscribe",
      name: "OnNewSubscribe",
      sql: `SELECT * FROM '${PredefineTopics.onNewSubscribe}'`
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
      sql: `SELECT * FROM '${PredefineTopics.onSetSchema}'`
    }
];