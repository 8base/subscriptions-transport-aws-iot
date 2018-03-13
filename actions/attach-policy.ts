import * as AWS from 'aws-sdk';
import { Config } from '../src/config';


const principal = Config.identityPoolId;

const policy = process.argv[2];
if (!policy) {
    throw new Error("policy name is empty");
}

AWS.config.region = Config.region;

const iot = new AWS.Iot();
iot.attachPolicy({ policyName: policy,  target: principal }, (err: Error, data: any) => {
    if (err) {
        return console.log(err.message);
    }
    console.log("complete success");
});