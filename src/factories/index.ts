import { SubscriptionClient, IotMqttClient, CognitoConnectionResolver, IotSubscribeHandler } from "../classes";
import { Config } from "../config";
import { IMqttClient, ISubscribeHandler, IConnectOptionsResolver } from '../interfaces';


export namespace SubscriptionEnvironment {

    export namespace Transport {
        export function Iot(): IMqttClient {
            return new IotMqttClient();
        }
    }

    export namespace Auth {
        export function Cognito(idToken: string): IConnectOptionsResolver {
            return new CognitoConnectionResolver(idToken, Config.identityPoolId, Config.region, Config.userPoolId);
        }
    }

    export namespace Client {

        export function make(transport: IMqttClient, resolver: IConnectOptionsResolver) {
            return new SubscriptionClient(resolver, transport);
        }
    }

    export namespace SubscribeHandlers {

        export namespace Iot {

            export function add(client: SubscriptionClient): SubscriptionClient {
                 client.addSubscribeHandler(new IotSubscribeHandler(client.transport));
                 return client;
            }
        }
    }

}
