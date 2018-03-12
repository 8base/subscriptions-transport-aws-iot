import { IClientSubscribeOptions } from 'mqtt';

export interface IConnectOptionsResolver {

    /* async */ resolve(): Promise<any>;
}

export interface IMqttClient {

    /* async */ connect(resolver: IConnectOptionsResolver, onReceive: Function, onClose: Function): Promise<void>;

    /* async */ subscribe(topic: string, options: IClientSubscribeOptions): Promise<any>;

    unsubscribe(topic: string): void;
}