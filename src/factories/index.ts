import { SubscriptionClient, MqttClient } from "../classes";
import { ISubscriptionClient } from '../interfaces';


export function SubscriptionClientFactory(url: string): ISubscriptionClient {
    return new SubscriptionClient(url, new MqttClient());
}