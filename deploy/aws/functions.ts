import { functionT } from "./types";
import * as aws from "aws-sdk";
import * as fs from "fs";

export namespace AwsFunctions {

    export async function deploy(lambda: aws.Lambda, archivePath: string, func: functionT, role: string): Promise<functionT> {
        const subnets = ["subnet-ac5bb5e6"];
        if (func.publicAccess) {
            subnets.push("subnet-ab5d9ae1");
        }

        let req: aws.Lambda.Types.CreateFunctionRequest;
        req = {
            FunctionName: func.name,
            Runtime: "nodejs6.10",
            Role: role,
            Handler: func.handler,
            Code: {
                ZipFile: fs.readFileSync(archivePath)
            },
            VpcConfig: {
              SubnetIds: subnets,
              SecurityGroupIds: ["sg-6ebc6e18"]
            },
            MemorySize: 512
        };

        const resp = await lambda.createFunction(req).promise();
        console.log("deploy function " + func.name + " complete: arn = " + resp.FunctionArn);
        console.log("subnets = " + JSON.stringify(subnets));

        return {
            name: func.name,
            arn: resp.FunctionArn,
            handler: func.handler,
            publicAccess: func.publicAccess
        };
    }

    export async function undeploy(lambda: aws.Lambda, name: string) {
        let req: aws.Lambda.Types.DeleteFunctionRequest;
        req = {
            FunctionName: name
        };

        try {
          await lambda.deleteFunction(req).promise();
        } catch(ex) {}
    }
}