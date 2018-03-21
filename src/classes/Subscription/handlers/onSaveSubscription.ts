import { ISubscribeHandler, IMqttClient } from '../../../interfaces';
import { PublishEnvironment } from '../../../factories';
import { SubscribeInfo } from '../../../types';
import * as path from "path";

export class OnSaveSubscription implements ISubscribeHandler {
    async subscribe(room: string, user: string, info: SubscribeInfo, options: any): Promise<void> {
      await PublishEnvironment.Client.subscribe(info);
    }

}