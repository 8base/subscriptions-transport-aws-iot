import * as aws from "aws-sdk";

import * as parseArgs from "minimist";
import * as _ from "lodash";
import * as archiver from "archiver";
import * as fs from "fs";
import * as path from "path";

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


const lib = path.join(__dirname, '../');
const root = path.join(__dirname, '../../');
const deployFile = path.join(root, 'deploy.zip');
const output = fs.createWriteStream(deployFile);

const archive = archiver('zip', {});

const functions = [
  {
    name: "SetActive",
    handler: "SetActive.handler"
  },
  {
    name: "SetInactive",
    handler: "SetInactive.handler"
  }
];

const deploy = async (lambda: aws.Lambda, name: string, funcpath: string) => {
  let req: aws.Lambda.Types.CreateFunctionRequest;
  req = {
      FunctionName: name,
      Runtime: "nodejs6.10",
      Role: role,
      Handler: funcpath,
      Code: {
          ZipFile: fs.readFileSync(deployFile)
      },
      MemorySize: 512
  };

  await lambda.createFunction(req).promise();
};

const undeploy = async (lambda: aws.Lambda, name: string) => {
  let req: aws.Lambda.Types.DeleteFunctionRequest;
  req = {
      FunctionName: name
  };

  try {
    await lambda.deleteFunction(req).promise();
  } catch(ex) {}
};

archive.on('error', function(err: Error) {
  throw err;
});

archive.pipe(output);

const config = JSON.stringify({ redisEndpoint });
archive.append(config, { name: "config.json" });

archive.on("warning", (err: Error) => {
  console.log(err.message);
});

archive.on("end", async () => {
  console.log("complete build zip. Start deploy functions");
  const lambda = new aws.Lambda();

  await Promise.all(functions.map( async f => await undeploy(lambda, f.name)));
  await Promise.all(functions.map( async f => await deploy(lambda, f.name, f.handler)));

  console.log("deploy functions complete");
});

const nodeModulesPath = path.join(root, "node_modules");
// ["aws-sdk", "buffer", "events", "jmespath", "querystring", "sax", "url", "uuid", "xml2js", "xmlbuilder"]
//   .map((moduleName: string, index: number) => {
//     archive.directory(path.join(nodeModulesPath, moduleName), path.join("node_modules", moduleName));
//   });

archive.directory(nodeModulesPath, "node_modules");
archive.directory(path.join(lib, "src"), "src");
archive.directory(path.join(lib, "deploy", "actions"), false);

archive.finalize();
