import {
    SubscriptionClient,
    Publisher,
    IotMqttClient,
    CognitoConnectionResolver,
    OnSubscribeIotTopic,
    OnSaveSubscription,
    RedisSubscriptionEngine,
    PredefineTopicPrefix
} from "../classes";
import { Config } from "../config";
import {
    IMqttClient,
    ISubscribeHandler,
    IConnectOptionsResolver,
    ISubscriptionEngine
} from '../interfaces';

import * as path from "path";
import { SubscribeInfo } from '../types';

export namespace SubscriptionEnvironment {

    export namespace Transport {
        export function Iot(user: string): IMqttClient {
            return new IotMqttClient(user);
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

export namespace ServiceEnvironment {

    /*
        call from server
    */
    export namespace Client {
        export async function subscribe(info: SubscribeInfo) {
            const topic = PredefineTopicPrefix.onNewSubscribe;
            await PublishEnvironment.publish(topic, info);
        }

        export async function processMessage(clientId: string, topic: string, payload: any) {
            const fulltopic = path.join(PredefineTopicPrefix.onNewMessage, clientId, topic);
            await PublishEnvironment.publish(fulltopic, payload);
        }

        export async function publishMessage(clientId: string, topic: string, payload: any) {
            const fulltopic = path.join(PredefineTopicPrefix.onPublish, clientId, topic);
            await PublishEnvironment.publish(fulltopic, payload);
        }
    }

    export namespace Schema {

        export async function set(schema: string): Promise<void> {
            const topic = PredefineTopicPrefix.onSetSchema;
            await PublishEnvironment.publish(topic, { schema });
        }
    }

}

export namespace PublishEnvironment {

    export async function publish(topic: string, payload: any) {
        await (new Publisher()).publish(topic, payload);
    }

}

export namespace PolicyEnvironment {

}
