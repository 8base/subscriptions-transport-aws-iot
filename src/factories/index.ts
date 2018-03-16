import { SubscriptionClient, Publisher, IotMqttClient, CognitoConnectionResolver, IotSubscribeHandler } from "../classes";
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

    export class Client {
        private mqttClient: IMqttClient;
        private resolver: IConnectOptionsResolver;
        private handlers: ISubscribeHandler[] = [];

        static create(): Client {
            return new Client();
        }

        transport(transport: IMqttClient): Client {
            this.mqttClient = transport;
            return this;
        }

        authResolver(resolver: IConnectOptionsResolver): Client {
            this.resolver = resolver;
            return this;
        }

        addHandler(handler: ISubscribeHandler): Client {
            this.handlers.push(handler);
            return this;
        }

        client() {

            this.addHandler(PredefineSubscribeHandlers.Iot(this.mqttClient));

            return new SubscriptionClient(this.resolver, this.mqttClient, this.handlers);
        }
    }

    export namespace PredefineSubscribeHandlers {
        export function Iot(mqttClient: IMqttClient): ISubscribeHandler {
            return new IotSubscribeHandler(mqttClient);
        }
    }

}

export namespace PublisherEnvironment {

    export function publish(topic: string, payload: any) {
        new Publisher().publish(topic, payload);
    }
}

export namespace PolicyEnvironment {

}