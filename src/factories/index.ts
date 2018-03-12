import { SubscriptionClient, IotMqttClient, CognitoConnectionResolver, IotSubscribeHandler } from "../classes";
import { Config } from "../config";
import { IMqttClient, ISubscribeHandler } from '../interfaces';


export namespace SubsctiptionClients {

    export namespace Iot {

        export namespace CognitoAuth {

            export class Constructor {
                private subscriptionClient: SubscriptionClient;

                private mqttClient: IMqttClient = new IotMqttClient();

                static create(idToken: string): Constructor {
                    const cognitoConnectionResolver = new CognitoConnectionResolver(idToken, Config.identityPoolId, Config.region, Config.userPoolId);
                    return new Constructor(cognitoConnectionResolver).addPredefineHandlers();
                }

                addHandler(handler: ISubscribeHandler): Constructor {
                    this.subscriptionClient.addSubscribeHandler(handler);
                    return this;
                }

                client() {
                    return this.subscriptionClient;
                }

                private constructor(resolver: CognitoConnectionResolver) {
                    this.subscriptionClient = new SubscriptionClient(resolver, this.mqttClient);
                }

                private addPredefineHandlers(): Constructor {
                    this.subscriptionClient.addSubscribeHandler(new IotSubscribeHandler(this.mqttClient));
                    return this;
                }
            }
        }
    }
}




}
