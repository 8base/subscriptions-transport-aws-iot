import {
    SubscriptionClient,
    Publisher,
    IotMqttClient,
    CognitoConnectionResolver,
    OnSubscribeIotTopic,
    OnSaveSubscription,
    RedisSubscriptionEngine,
    PredefineTopics,
    executeSchema
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

        export const Iot = (user: string): IMqttClient => {
            return new IotMqttClient(user);
        };
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
        private room: string;
        private user: string;

        constructor(room: string, user: string) {
            this.room = room;
            this.user = user;
        }

        static create(room: string, user: string): Client {
            return new Client(room, user);
        }

        transport(factory: Function): Client {
            this.mqttClient = factory(this.user);
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
            return new SubscriptionClient(this.resolver, this.mqttClient, this.handlers, this.room, this.user);
        }
    }

    export async function SubscriptionEngine(redisEndpoint: string): Promise<ISubscriptionEngine> {
        return await RedisSubscriptionEngine.create(redisEndpoint);
    }
}

export namespace ServiceEnvironment {

    export namespace Schema {

        export async function execute(schema: any, values: any ): Promise<any> {
            return values;
        }
    }

    export namespace IotClientIdTransform {

        function getRandomArbitrary(min: number, max: number) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        export function clientIdToUser(clientId: string): string {
            return clientId.slice(0, -6);
        }

        export function userToClientId(user: string): string {
            return user + "_" + getRandomArbitrary(10000, 99999).toString();
        }
    }
}

export namespace PublishEnvironment {

    export namespace Room {

    }

    /*
        call from server
    */
    export namespace Client {
        export async function subscribe(info: SubscribeInfo) {
            const topic = PredefineTopics.onNewSubscribe;
            await PublishEnvironment.publish(topic, info);
        }

        export async function sendSourceMessageToTopic(room: string, topic: string, payload: any) {
            console.log(PredefineTopics.onRoomNewMessage(room));
            await PublishEnvironment.publish(
                PredefineTopics.onRoomNewMessage(room),
                {
                    message: payload,
                    room,
                    topic
                });
        }

        export async function sendProcessedMessageToTopic(room: string, user: string, topic: string, payload: any) {
            await PublishEnvironment.publish(PredefineTopics.publicTopic(room, user, topic), payload);
        }
    }

    export namespace Schema {

        export async function set(schema: string): Promise<void> {
            await PublishEnvironment.publish(PredefineTopics.onSetSchema, { schema });
        }
    }

    export async function publish(topic: string, payload: any) {
        await (new Publisher()).publish(topic, payload);
    }

}

export namespace PolicyEnvironment {

}
