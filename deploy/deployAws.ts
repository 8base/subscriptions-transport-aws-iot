import * as aws from "aws-sdk";

import * as parseArgs from "minimist";
import * as _ from "lodash";
import * as archiver from "archiver";
import * as fs from "fs";
import * as path from "path";

import { deployFlow } from "./aws";

import { Config } from "../src/config";
import { PredefineTopicPrefix } from '../src/classes/Common/TopicPrefix';

let parameters = new Map<string, string>();
_.map(parseArgs(process.argv), (value: string, key: string) => parameters.set(key, value));

aws.config.accessKeyId = parameters.get("access-key-id");
aws.config.secretAccessKey = parameters.get("secret-access-key");
aws.config.region = parameters.get("region");
const role = parameters.get("role-name");

const redisEndpoint = parameters.get("redis-endpoint");

if (!aws.config.accessKeyId) {
  console.log("access key not present");
  process.exit(0);
}

if (!aws.config.secretAccessKey) {
  console.log("secret key not present");
  process.exit(0);
}

console.log("access key id = " + aws.config.accessKeyId);
console.log("secret access key = " + aws.config.secretAccessKey);
console.log("region = " + aws.config.region);
console.log("role = " + role);
console.log("redis endpoint = " + redisEndpoint);

const config = JSON.stringify(
  {
    redisEndpoint,
    topicPrefixes: {
      onPublish: PredefineTopicPrefix.onPublish
    }
  });

deployFlow(config, role)
  .then(() => {
    console.log("deploy success");
  })
  .catch((err: Error) => {
    console.log("deploy error = " + err.message);
  });