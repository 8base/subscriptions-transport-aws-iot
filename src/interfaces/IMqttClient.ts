
export interface IMqttClient {

    subscribe(): Promise<any>;

    onError(): Promise<any>;
}