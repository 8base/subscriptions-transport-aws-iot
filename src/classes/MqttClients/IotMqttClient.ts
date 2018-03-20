import { IMqttClient } from '../../interfaces';
import { IClientSubscribeOptions } from 'mqtt';
import * as DeviceSdk from 'aws-iot-device-sdk';
import { CognitoConnectOptions } from "../../types";
import { IConnectOptionsResolver } from "../../interfaces";
import { Config } from '../../config';
import { ClientIdTransform } from "../Common";

export class IotMqttClient implements IMqttClient {

    private onReceive: Function = () => {};
    private onClose: Function = () => {};

    private client: DeviceSdk.device;

    constructor(user: string) {
        this.client = new DeviceSdk.device({
            region: Config.region,
            host: Config.iotEndpoint,
            clientId: ClientIdTransform.fromUser(user),
            protocol: 'wss',
            accessKeyId: '',
            secretKey:  '',
            sessionToken: '',
            debug: Config.debugMqttClient,
        })
        .on("error", () => {
            // skip
        });

        this.client.on("message", (topic: string, payload: any) => {
            this.onReceive(topic, payload);
        });

        this.client.on("offline", () => {
            this.onClose();
        });

        this.client.on("close", () => {
            this.onClose();
        });

        this.client.on("error", (err: Error) => {
            this.onClose();
        });

    }

    async connect(connectOptionsResolver: IConnectOptionsResolver, onReceive: Function, onClose: Function): Promise<void> {

        this.onReceive = onReceive;
        this.onClose = onClose;

        const options = await connectOptionsResolver.resolve();

        this.client.updateWebSocketCredentials(options.accessKeyId, options.secretAccessKey, options.sessionToken, null);
    }

    async subscribe(topic: string, options: IClientSubscribeOptions): Promise<any> {

        return new Promise((resolve, reject) => {
            this.client.subscribe(topic,
                {
                    qos: options.qos
                },
                (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(data);
                });
        });
    }


    unsubscribe(topic: string): void {
        this.client.unsubscribe(topic);
    }
}