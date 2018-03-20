import {
    SubscriptionClient,
    Publisher,
    IotMqttClient,
    CognitoConnectionResolver,
    OnSubscribeIotTopic,
    OnSaveSubscription,
    RedisSubscriptionEngine,
} from "../classes";
import { Config, PredefineTopics } from "../config";
import {
    IMqttClient,
    ISubscribeHandler,
    IConnectOptionsResolver,
    ISubscriptionEngine
} from '../interfaces';

import * as path from "path";

export namespace SubscriptionEnvironment {

    export namespace Transport {
        export function Iot(clientId: string): IMqttClient {
            return new IotMqttClient(clientId);
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
        private clientId: string;

        constructor(clientId: string) {
            this.clientId = clientId;
        }

        static create(clientId: string): Client {
            return new Client(clientId);
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
            this.addHandler(new OnSaveSubscription());
            return new SubscriptionClient(this.resolver, this.mqttClient, this.handlers, this.clientId);
        }
    }

    export async function SubscriptionEngine(redisEndpoint: string): Promise<ISubscriptionEngine> {
        return await RedisSubscriptionEngine.create(redisEndpoint);
    }
}

export namespace PublishEnvironment {

    export namespace ToMessageProcessing {
        export async function publish(client: string, topic: string, payload: any) {
            const resultTopic = path.join(PredefineTopics.messageProcessing, client, topic);
            await (new Publisher()).publish(resultTopic, payload);
        }
    }

    export namespace ToSubscribeQueue {
        export async function publish(payload: any) {
            const topic = PredefineTopics.subscribe;
            await (new Publisher()).publish(topic, payload);
        }
    }

}

export namespace PolicyEnvironment {

}
