import { ruleT, functionT } from "./types";
import * as path from "path";
import { PredefineTopics } from '../../src/classes';


export const functions: functionT[] = [
    {
      name: "OnConnected",
      arn: "",
      handler: "index.OnConnected",
      publicAccess: false
    },
    {
      name: "OnDisconnected",
      arn: "",
      handler: "index.OnDisconnected",
      publicAccess: false
    },
    {
      name: "OnNewMessage",
      arn: "",
      handler: "index.OnNewMessage",
      publicAccess: true
    },
    {
      name: "GetClient",
      arn: "",
      handler: "index.GetClient",
      publicAccess: false
    },
    {
      name: "GetSubscription",
      arn: "",
      handler: "index.GetSubscription",
      publicAccess: false
    },
    {
      name: "GetSubscriptions",
      arn: "",
      handler: "index.GetSubscriptions",
      publicAccess: false
    },
    {
      name: "OnNewSubscribe",
      arn: "",
      handler: "index.OnNewSubscribe",
      publicAccess: false
    },
    {
      name: "OnSetSchema",
      arn: "",
      handler: "index.OnSetSchema",
      publicAccess: false
    },
    {
      name: "GetActiveClients",
      arn: "",
      handler: "index.GetActiveClients",
      publicAccess: false
    },
    {
      name: "ClearAll",
      arn: "",
      handler: "index.ClearAll",
      publicAccess: false
    },
    {
      name: "PublishToTopic",
      arn: "",
      handler: "index.PublishToTopic",
      publicAccess: true
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