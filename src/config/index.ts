export class Config {
    static get iotEndpoint(): string {
        return process.env.AWS_IOT_ENDPOINT;
    }

    static get region(): string {
        return process.env.AWS_REGION;
    }

    static get userPoolId(): string {
        return process.env.AWS_USER_POOL_ID;
    }

    static get clientId(): string {
        return process.env.AWS_CLIENT_ID;
    }

    static get identityPoolId(): string {
        return process.env.AWS_IDENTITY_POOL_ID;
    }

    static get debugMqttClient(): boolean {
        return !!process.env.DEBUG_MQTT_CLIENT;
    }
}