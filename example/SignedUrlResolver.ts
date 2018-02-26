import { ISignedUrlResolver } from '../src/interfaces/ISignedUrlResolver';
import { SigV4Utils } from './utils';
import { AWSCredentials } from './types';


function getCredentials(): AWSCredentials {
    // return {
    //     accessKeyId: process.env.ACCESS_KEY_ID,
    //     secretAccessKey: process.env.SECRET_ACCESS_KEY,
    //     sessionToken: process.env.SESSION_TOKEN
    // }
    return {
        accessKeyId: "AKIAIAHT44A6BKXTVKMQ",
        secretAccessKey: "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",
        sessionToken: ""
    }
}


export class SignedUrlResolver implements ISignedUrlResolver {

    private iotEndpoint: string;

    private region: string;

    constructor(iotEndpoint: string, region: string) {
        this.iotEndpoint = iotEndpoint;
        this.region = region;
    }

    async resolve(): Promise<string> {
        const sigv4utils = new SigV4Utils();
        return sigv4utils.getSignedUrl(this.iotEndpoint, this.region, getCredentials());
    }
    
}