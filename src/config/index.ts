export class Config {
    static iotEndpoint: string;
    static region: string;
    static userPoolId: string;
    static identityPoolId: string;
    static userPoolClientId: string;
    static debugMqttClient: boolean = false;

}

export class PredefineTopics {
    static get messageProcessing(): string {
        return "message_processing";
    }

    static get subscribe(): string {
        return "subscribe";
    }
}