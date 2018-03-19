import {
    SubscriptionClient,
    Publisher,
    IotMqttClient,
    CognitoConnectionResolver,
    OnSubscribeIotTopic,
    RedisSubscriptionEngine,
} from "../classes";
import { Config } from "../config";
import {
    IMqttClient,
    ISubscribeHandler,
    IConnectOptionsResolver,
    ISubscriptionEngine
} from '../interfaces';


export namespace SubscriptionEnvironment {

    export namespace Transport {
        export function Iot(client: string): IMqttClient {
            return new IotMqttClient(client);
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
            this.addHandler(new OnSubscribeIotTopic(this.mqttClient));
            return new SubscriptionClient(this.resolver, this.mqttClient, this.handlers);
        }
    }

    export async function SubscriptionEngine(redisEndpoint: string, port: number): Promise<ISubscriptionEngine> {
        return await RedisSubscriptionEngine.create(redisEndpoint, port);
    }
}

export namespace PublisherEnvironment {

    export function publish(client: string, topic: string, payload: any) {
        new Publisher().publish(client, topic, payload);
    }
}

export namespace PolicyEnvironment {

}
