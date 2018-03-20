
import { SourceCode } from "./sourceCode";
import * as aws from "aws-sdk";
import { functions, rules } from './predefine';
import { AwsFunctions } from "./functions";
import { AwsRules } from "./rules";

export async function deployFlow(config: string, role: string) {

    const archive = await SourceCode.archive(config);
    console.log("complete build zip. Start deploy functions");

    const lambda = new aws.Lambda();
    await Promise.all(functions.map( async f => await AwsFunctions.undeploy(lambda, f.name)));
    let uploadedFunctions = await Promise.all(functions.map( async f => await AwsFunctions.deploy(lambda, archive.path, f, role)));

    await SourceCode.removeArchive(archive.path);

    console.log("start create iot rules");
    const iot = new aws.Iot();
    await Promise.all(rules.map( async r => await AwsRules.undeploy(iot, r)));
    await Promise.all(rules.map( async r => await AwsRules.deploy(iot, lambda, r, uploadedFunctions)));

}