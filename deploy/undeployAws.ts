import * as aws from "aws-sdk";

import * as parseArgs from "minimist";
import * as _ from "lodash";
import * as archiver from "archiver";
import * as fs from "fs";
import * as path from "path";

import { undeployFlow } from "./aws";

import { Config } from "../src/config";
import { PredefineTopics } from '../src/classes';

let parameters = new Map<string, string>();
_.map(parseArgs(process.argv), (value: string, key: string) => parameters.set(key, value));

aws.config.accessKeyId = parameters.get("access-key-id");
aws.config.secretAccessKey = parameters.get("secret-access-key");
aws.config.region = parameters.get("region");

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

undeployFlow()
  .then(() => {
    console.log("undeploy success");
  })
  .catch((err: Error) => {
    console.log("undeploy error = " + err.message);
  });