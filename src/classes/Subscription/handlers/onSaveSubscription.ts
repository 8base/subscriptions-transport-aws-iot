import { ISubscribeHandler, IMqttClient } from '../../../interfaces';
import { PublishEnvironment } from '../../../factories';
import { SubscribeInfo } from '../../../types';
import * as path from "path";

export class OnSaveSubscription implements ISubscribeHandler {
    async subscribe(info: SubscribeInfo, options: any): Promise<void> {
      await PublishEnvironment.ToSubscribeQueue.publish({ ...info });
    }

}