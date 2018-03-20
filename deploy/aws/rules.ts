import { ruleT, functionT } from "./types";
import * as aws from "aws-sdk";
import * as uuid from "uuid";

export namespace AwsRules {

    export async function deploy(iot: aws.Iot, lambda: aws.Lambda, rule: ruleT, functions: functionT[]) {
      await iot.createTopicRule( {
          ruleName: rule.name,
          topicRulePayload: {
            sql: rule.sql,
            awsIotSqlVersion: "2016-03-23",
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

        const topicRule = await iot.getTopicRule({ ruleName: rule.name}).promise();

        await lambda.addPermission({
          FunctionName: rule.functionName,
          Action: "lambda:InvokeFunction",
          StatementId: uuid.v4(),
          Principal: "iot.amazonaws.com",
          SourceArn: topicRule.ruleArn
        }).promise();

        console.log("deploy rule " + rule.name + " success");
    }

    export async function undeploy(iot: aws.Iot, rule: ruleT) {
      try {
        await iot.deleteTopicRule( { ruleName: rule.name }).promise();
      } catch(ex) {}
    }
}