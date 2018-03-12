import { IConnectOptionsResolver } from "../../interfaces";
import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails } from 'amazon-cognito-identity-js';
import * as AWS from "aws-sdk";


export class CognitoConnectionResolver implements IConnectOptionsResolver {

    private userPoolId: string;
    private region: string;
    private identityPoolId: string;
    private idToken: string;

    constructor(idToken: string, identityPoolId: string, region: string, userPoolId: string) {
        this.idToken = idToken;
        this.userPoolId = userPoolId;
        this.identityPoolId = identityPoolId;
        this.region = region;
    }

    async resolve() {
        return new Promise((resolve: any, reject:any) => {

            const providerKey = `cognito-idp.${this.region}.amazonaws.com/${this.userPoolId}`;

            AWS.config.region = this.region;
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: this.identityPoolId,
                Logins: {
                    [providerKey]: this.idToken
                }
            });

            (<AWS.Credentials>AWS.config.credentials).get((error) => {
                if (error) {
                    return reject(error);
                }

                const { accessKeyId, secretAccessKey, sessionToken } = AWS.config.credentials;

                resolve({
                    accessKeyId,
                    secretAccessKey,
                    sessionToken
                });
            });
        });
    }

}