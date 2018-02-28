import { ISignedUrlResolver, ISubscriptionClient } from "../interfaces";
import { OperationOptions, Middleware, FormatedError, ConnectionParams } from "../types";
import { ExecutionResult } from 'graphql/execution/execute';
import $$observable from 'symbol-observable';
import { Observable, Observer } from '../types';
import * as EventEmitter from 'eventemitter3';

// import * as PahoMQTT from "paho-mqtt";
import * as uuid from "uuid";
import * as MQTT from "mqtt";


enum ConnectionStatus {
    Connecting, Connected, Offline, Close
}

export class SubscriptionClient implements ISubscriptionClient {

    private urlResolver: ISignedUrlResolver;
    private status: ConnectionStatus;

    private mqttClient: MQTT.Client;
    private appPrefix: string;

    private observer: Observer<any>;

    constructor(urlResolver: ISignedUrlResolver) {
        if (!urlResolver) {
            throw new Error("url resolver is required.");
        }

        this.urlResolver = urlResolver;
        this.connect();
    }

    /*
        Private functions
    */

    private async connect() {
        this.urlResolver.resolve()
            .then((url: string) => {

                this.mqttClient = MQTT.connect(url);

                this.mqttClient.on("error", this.onClose.bind(this));
                this.mqttClient.on("message", this.processReceivedData.bind(this));

                const clientIdTopic = "test-topic";// this.appPrefix + '/in/' + this.clientId;

                this.mqttClient.subscribe(clientIdTopic,
                {
                    qos: 1
                },
                (err: Error, data: any) => {
                    if (err) {
                        return console.log('subscribe failure', err);
                    }
                    console.log(`subscribing to ${clientIdTopic}`);
                    console.log("data: " + JSON.stringify(data, null, 2));
                });
            })
            .catch((err) => {
                this.status = ConnectionStatus.Offline;
                console.log('connection error', err);
                // this.close(false, false);
            });
    }


    public request(request: OperationOptions): Observable<ExecutionResult> {
        const getObserver = this.getObserver.bind(this);
        const unsubscribe = this.unsubscribe.bind(this);
        const setObserver = this.setObserver.bind(this);

        return {
          subscribe(
            observerOrNext: ((Observer<ExecutionResult>) | ((v: ExecutionResult) => void)),
            onError?: (error: Error) => void,
            onComplete?: () => void,
          ) {
            setObserver(getObserver(observerOrNext, onError, onComplete));

            return {
              unsubscribe: () => {
                unsubscribe();
              },
            };
          },
        };
      }

    private setObserver(observer: any) {
        this.observer = observer;
    }

    public unsubscribe(opId: string) {
        this.mqttClient.unsubscribe("test-topic");
    }

    private getObserver<T>(
        observerOrNext: ((Observer<T>) | ((v: T) => void)),
        error?: (e: Error) => void,
        complete?: () => void,
    ): Observer<T> {
        if (typeof observerOrNext === 'function') {
            return {
                next: (v: T) => observerOrNext(v),
                error: (e: Error) => error && error(e),
                complete: () => complete && complete(),
            };
        }

        return observerOrNext;
    }


    // ensure we have an array of errors
    private formatErrors(errors: any): FormatedError[] {
        if (Array.isArray(errors)) {
            return errors;
        }

        // TODO  we should not pass ValidationError to callback in the future.
        // ValidationError
        if (errors && errors.errors) {
            return this.formatErrors(errors.errors);
        }

        if (errors && errors.message) {
            return [errors];
        }

        return [{
            name: 'FormatedError',
            message: 'Unknown error',
            originalError: errors,
        }];
    }



    private processReceivedData(receivedData: any, data: Buffer) {
        this.observer.next(String(data));
    }

    private onClose(reason: Error) {
        this.status = ConnectionStatus.Close;
        console.log('Socket closed');
        console.log(reason);
        this.observer.error(reason);
    }
}