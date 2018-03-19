import { ruleT, functionT } from "./types";
import * as aws from "aws-sdk";

export namespace AwsRules {

    export async function deploy(iot: aws.Iot, rule: ruleT, functions: functionT[]) {
      await iot.createTopicRule( {
          ruleName: rule.name,
          topicRulePayload: {
            sql: rule.sql,
            errorAction:
            {
              lambda:
              {
                functionArn: functions.find(f => f.name === rule.functionName).arn
              }
            },
            actions: [
              {
                lambda:
                {
                  functionArn: functions.find(f => f.name === rule.functionName).arn
                }
              }
            ]
          }
        }).promise();

        console.log("deploy rule " + rule.name + " success");
    }

    export async function undeploy(iot: aws.Iot, rule: ruleT) {
        await iot.deleteTopicRule( { ruleName: rule.name }).promise();
    }
}