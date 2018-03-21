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
            return new SubscriptionClient(this.resolver, this.mqttClient, this.handlers, this.room, "");
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

        export async function processMessage(room: string, topic: string, payload: any) {
            const fulltopic = path.join(PredefineTopicPrefix.onNewMessage, room, topic);
            await PublishEnvironment.publish(fulltopic, { payload });
        }

        export async function publishMessage(room: string, topic: string, payload: any) {
            const fulltopic = path.join(PredefineTopicPrefix.onPublish, room, topic);
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
