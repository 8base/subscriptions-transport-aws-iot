import { ruleT, functionT } from "./types";
import { Config } from '../../src/config';


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
      name: "GetDataFromRedis",
      arn: "",
      handler: "GetDataFromRedis.handler"
    }
];

export const rules: ruleT[] = [
    {
      functionName: "OnMessageProcessing",
      name: "OnMessageProcessing",
      sql: `SELECT * FROM '${Config.onPubslishTopicPrefix}'`
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