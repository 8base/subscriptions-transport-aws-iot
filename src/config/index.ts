export class Config {
    static iotEndpoint: string;
    static region: string;
    static userPoolId: string;
    static identityPoolId: string;
    static userPoolClientId: string;
    static debugMqttClient: boolean = false;

    static get onPubslishTopicPrefix(): string {
        return "on_publish";
    }
}