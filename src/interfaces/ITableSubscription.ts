import { TableMessageToProcess } from '../types';

export interface ISubscriptionSink {

    publish(info: TableMessageToProcess): void;
}