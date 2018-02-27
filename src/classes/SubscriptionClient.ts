import { ISignedUrlResolver, ISubscriptionClient } from "../interfaces";
import { OperationOptions, Middleware, FormatedError, MessageTypes, ConnectionParams } from "../types";
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

export class SubscriptionClient implements ISubscriptionClient{

    private urlResolver: ISignedUrlResolver;
    private status: ConnectionStatus;
    
    private mqttClient: MQTT.Client;
    private appPrefix: string;

    private onNext: Function;
    private onComplete: Function;
    private onError: Function;

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
    
        let opId: string;
    
        return {
          subscribe(
            observerOrNext: ((Observer<ExecutionResult>) | ((v: ExecutionResult) => void)),
            onError?: (error: Error) => void,
            onComplete?: () => void,
          ) {
            const observer = getObserver(observerOrNext, onError, onComplete);
            

            opId = executeOperation(request, (error: Error[], result: any) => {
              if ( error === null && result === null ) {
                if ( observer.complete ) {
                  observer.complete();
                }
              } else if (error) {
                if ( observer.error ) {
                  observer.error(error[0]);
                }
              } else {
                if ( observer.next ) {
                  observer.next(result);
                }
              }
            });
    
            return {
              unsubscribe: () => {
                if ( opId ) {
                  unsubscribe(opId);
                  opId = null;
                }
              },
            };
          },
        };
      }



    public unsubscribe(opId: string) {
        //if (this.operations[opId]) {
        //    this.sendMessage(opId, MessageTypes.GQL_STOP, { subscriptionName: this.operations[opId].options.subscriptionName });
        //    delete this.operations[opId];
        //}
    }

    private executeOperation(options: OperationOptions, handler: (error: Error[], result?: any) => void): string {
        
        // this.checkOperationOptions(options, handler);
        //     if (this.operations[opId]) {
        //         processedOptions.subscriptionName =
        //             (options.query as any).definitions[0].selectionSet.selections[0].name.value;
        //         // how reliable is this and is there a better way. I want the subscription name
        //         // so i dont have to create another index just to unsubscribe
        //         this.operations[opId] = { options: processedOptions, handler };
        //         this.sendMessage(opId, MessageTypes.GQL_START, processedOptions);
        //     }
        // })
        
    }

    private getObserver<T>(
        observerOrNext: ((Observer<T>) | ((v: T) => void)),
        error?: (e: Error) => void,
        complete?: () => void,
    ) {
        if (typeof observerOrNext === 'function') {
            return {
                next: (v: T) => observerOrNext(v),
                error: (e: Error) => error && error(e),
                complete: () => complete && complete(),
            };
        }

        return observerOrNext;
    }

    private checkOperationOptions(options: OperationOptions, handler: (error: Error[], result?: any) => void) {
        const { query, variables, operationName } = options;

        // if (!query) {
        //     throw new Error('Must provide a query.');
        // }

        // if (!handler) {
        //     throw new Error('Must provide an handler.');
        // }
        // if (
        //     (!isString(query) && !getOperationAST(query as any, operationName)) ||
        //     (operationName && !isString(operationName)) ||
        //     (variables && !isObject(variables))
        // ) {
        //     throw new Error('Incorrect option types. query must be a string or a document,' +
        //         '`operationName` must be a string, and `variables` must be an object.');
        // }
    }

   // private buildMessage(id: string, type: string, payload: any): PahoMQTT.Message {
   //     const payloadToReturn = payload && payload.query ?
   //         {
    //            ...payload,
                // query: typeof payload.query === 'string' ? payload.query : print(payload.query),
    //        } :
    //        payload;

       // return new PahoMQTT.Message("test message");
        // return {
        //     id,
        //     type,
        //     payload: payloadToReturn,
        // };
  //  }

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

    private sendMessage(id: string, type: string, payload: any) {
        // this.sendMessageRaw(this.buildMessage(id, type, payload));
    }

    // send message, or queue it if connection is not open
     private sendMessageRaw() {
    //     switch (this.status) {
    //         case ConnectionStatus.Connected:
    //             const serializedMessage = new Paho.MQTT.Message(
    //                 JSON.stringify({ data: JSON.stringify(message) })); // sending to graphql api handler as a string
    //             serializedMessage.destinationName = this.appPrefix + '/out'; // topic pattern for each device connected
    //             console.log('Sending message');
    //             console.log(message);
    //             serializedMessage.retained = false;
                 this.mqttClient.send();
    //             break;
    //         case ConnectionStatus.Connecting:
    //             this.unsentMessagesQueue.push(message);
    //             break;
    //         default:
    //             // if (!this.reconnecting) {
    //             //     throw new Error('A message was not sent because socket is not connected, is closing or ' +
    //             //         'is already closed. Message was: ${JSON.parse(serializedMessage)}.');
    //             // }
    //     }
    }

    private generateOperationId(): string {
        // return String(++this.nextOperationId);
    }

    private tryReconnect() {
        // if (!this.reconnect || this.backoff.attempts >= this.reconnectionAttempts) {
        //     return;
        // }

        // if (!this.reconnecting) {
        //     Object.keys(this.operations).forEach((key) => {
        //         this.unsentMessagesQueue.push(
        //             this.buildMessage(key, MessageTypes.GQL_START, this.operations[key].options),
        //         );
        //     });
        //     this.reconnecting = true;
        // }

        // this.clearTryReconnectTimeout();

        // const delay = this.backoff.duration();
        // this.tryReconnectTimeoutId = setTimeout(() => {
        //     this.connect();
        // }, delay);
    }

    private flushUnsentMessagesQueue() {
        // this.unsentMessagesQueue.forEach((message) => {
        //     this.sendMessageRaw(message);
        // });
        // this.unsentMessagesQueue = [];
    }

    private checkConnection() {
        // if (this.wasKeepAliveReceived) {
        //     this.wasKeepAliveReceived = false;
        //     return;
        // }

        // if (!this.reconnecting) {
        //     this.close(false, true);
        // }
    }

    private checkMaxConnectTimeout() {
        this.clearMaxConnectTimeout();

        // Max timeout trying to connect
        // this.maxConnectTimeoutId = setTimeout(() => {
        //     if (this.status !== 'connected') {
        //         this.close(false, true);
        //     }
        // }, this.maxConnectTimeGenerator.duration());
    }


    private processReceivedData(receivedData: any, data: Buffer) {
        console.log("--> processReceivedData");
        console.log(receivedData);
        
        console.log(String(data));
        console.log("<-- processReceivedData");
        // let parsedMessage: any;
        // let opId: string;

        // try {
        //     parsedMessage = JSON.parse(receivedData.payloadString);
        //     opId = parsedMessage.id;
        //     this.debug && console.log('Received message');
        //     this.debug && console.log(parsedMessage);
        // } catch (e) {
        //     throw new Error(`Message must be JSON-parseable. Got: ${receivedData.payloadString}`);
        // }

        // if (
        //     [MessageTypes.GQL_DATA,
        //     MessageTypes.GQL_COMPLETE,
        //     MessageTypes.GQL_ERROR,
        //     ].indexOf(parsedMessage.type) !== -1 && !this.operations[opId]
        // ) {
        //     this.unsubscribe(opId);

        //     return;
        // }

        // switch (parsedMessage.type) {
        //     case MessageTypes.GQL_CONNECTION_ERROR:
        //         if (this.connectionCallback) {
        //             this.connectionCallback(parsedMessage.payload);
        //         }
        //         break;

        //     case MessageTypes.GQL_CONNECTION_ACK:
        //         this.eventEmitter.emit(this.reconnecting ? 'reconnected' : 'connected');
        //         this.reconnecting = false;
        //         this.backoff.reset();
        //         this.maxConnectTimeGenerator.reset();

        //         if (this.connectionCallback) {
        //             this.connectionCallback();
        //         }
        //         break;

        //     case MessageTypes.GQL_COMPLETE:
        //         this.operations[opId].handler(null, null);
        //         delete this.operations[opId];
        //         break;

        //     case MessageTypes.GQL_ERROR:
        //         this.operations[opId].handler(this.formatErrors(parsedMessage.payload), null);
        //         delete this.operations[opId];
        //         break;

        //     case MessageTypes.GQL_DATA:
        //         const parsedPayload = !parsedMessage.payload.errors ?
        //             parsedMessage.payload : { ...parsedMessage.payload, errors: this.formatErrors(parsedMessage.payload.errors) };
        //         this.operations[opId].handler(null, parsedPayload);
        //         break;

        //     case MessageTypes.GQL_CONNECTION_KEEP_ALIVE:
        //         const firstKA = typeof this.wasKeepAliveReceived === 'undefined';
        //         this.wasKeepAliveReceived = true;

        //         if (firstKA) {
        //             this.checkConnection();
        //         }

        //         if (this.checkConnectionIntervalId) {
        //             clearInterval(this.checkConnectionIntervalId);
        //             this.checkConnection();
        //         }
        //         this.checkConnectionIntervalId = setInterval(this.checkConnection.bind(this), this.timeout);
        //         break;

        //     default:
        //         throw new Error('Invalid message type!');
        // }
    }

    private onClose(reason: PahoMQTT.MQTTError) {
        this.status = ConnectionStatus.Close;
        console.log('Socket closed');
        console.log(reason);
        //if (!this.closedByUser) {
        //    this.close(false, false);
        //}
    }
}