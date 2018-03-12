import { SubscriptionClient, IotMqttClient, CognitoConnectionResolver } from "../classes";
import { ISubscriptionClient } from '../interfaces';
import { Config } from "../config";


export function SubscriptionClientFactory(idToken: string): ISubscriptionClient {
    const cognitoConnectionResolver = new CognitoConnectionResolver(idToken, Config.identityPoolId, Config.region, Config.userPoolId);
    return new SubscriptionClient(cognitoConnectionResolver, new IotMqttClient());
}