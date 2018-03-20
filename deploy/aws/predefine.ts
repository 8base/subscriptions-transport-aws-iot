import { ruleT, functionT } from "./types";
import { PredefineTopics } from '../../src/config';


export const functions: functionT[] = [
    {
      name: "OnConnected",
      arn: "",
      handler: "OnConnected.handler"
    },
    {
      name: "OnDisconnected",
      arn: "",
      handler: "OnDisconnected.handler"
    },
    {
      name: "OnMessageProcessing",
      arn: "",
      handler: "OnMessageProcessing.handler"
    },
    {
      name: "GetClient",
      arn: "",
      handler: "GetClient.handler"
    },
    {
      name: "GetSubscription",
      arn: "",
      handler: "GetSubscription.handler"
    },

    {
      name: "OnSubscribe",
      arn: "",
      handler: "OnSubscribe.handler"
    }
];

export const rules: ruleT[] = [
    {
      functionName: "OnMessageProcessing",
      name: "OnMessageProcessing",
      sql: `SELECT * FROM '${PredefineTopics.messageProcessing}'`
    },
    {
      functionName: "OnSubscribe",
      name: "OnSubscribe",
      sql: `SELECT * FROM '${PredefineTopics.subscribe}'`
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
    }
];