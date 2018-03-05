import { SigV4Utils } from './utils';
import { AWSCredentials } from './types';


function getCredentials() {
    return {
        accessKeyId: "",
        secretAccessKey: "",
        sessionToken: ""
    };
}


export class SignedUrlResolver {

    constructor(iotEndpoint, region) {
        this.iotEndpoint = iotEndpoint;
        this.region = region;
    }

    async resolve() {
        const sigv4utils = new SigV4Utils();
        return sigv4utils.getSignedUrl(this.iotEndpoint, this.region, getCredentials());
    }

}

export class CustomAuthUrlResolver {

    async resolve() {
        return 'wss://' + this.iotEndpoint + '/mqtt';
    }
}