import { ruleT, functionT } from "./types";
import { PredefineTopicPrefix } from '../../src/classes';
import * as path from "path";

const pathToActions = path.join("deploy", "actions");

export const functions: functionT[] = [
    {
      name: "OnConnected",
      arn: "",
      handler: path.join(pathToActions, "OnConnected.handler")
    },
    {
      name: "OnDisconnected",
      arn: "",
      handler: path.join(pathToActions, "OnDisconnected.handler")
    },
    {
      name: "OnNewMessage",
      arn: "",
      handler: path.join(pathToActions, "OnNewMessage.handler")
    },
    {
      name: "GetClient",
      arn: "",
      handler: path.join(pathToActions, "GetClient.handler")
    },
    {
      name: "GetSubscription",
      arn: "",
      handler: path.join(pathToActions, "GetSubscription.handler")
    },
    {
      name: "OnNewSubscribe",
      arn: "",
      handler: path.join(pathToActions, "OnNewSubscribe.handler")
    },
    {
      name: "OnSetSchema",
      arn: "",
      handler: path.join(pathToActions, "OnSetSchema.handler")
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