import { SubscriptionClient, MqttClient } from "../classes";
import { ISubscriptionClient } from '../interfaces';


export function SubscriptionClientFactory(url: string, options: any): ISubscriptionClient {
    return new SubscriptionClient(url, options, new MqttClient());
}