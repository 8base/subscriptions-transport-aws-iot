export interface Observer {

}

export interface ISubscriber {

    /* async */ subscribe(topic: string, options: any): Promise<any>;
}

export interface IMqttClient {

    /* */ connect(url: string): Promise<any>;

    /* */ subscribe(topic: string): Promise<any>;
}