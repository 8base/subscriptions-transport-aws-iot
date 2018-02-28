import * as MQTT from "mqtt";
import { ApolloLink } from 'apollo-link';

export class SubscriptionClient {

    constructor(url) {
        if (!url) {
            throw new Error("url resolver is required.");
        }

        this.url = url;
        this.connect();
    }

    /*
        Private functions
    */

    connect() {
        this.mqttClient = MQTT.connect(this.url);

        this.mqttClient.on("error", this.onClose.bind(this));
        this.mqttClient.on("message", this.processReceivedData.bind(this));

        const clientIdTopic = "test-topic";// this.appPrefix + '/in/' + this.clientId;

        this.mqttClient.subscribe(clientIdTopic,
        {
            qos: 1
        },
        (err, data) => {
            if (err) {
                return console.log('subscribe failure', err);
            }
            console.log(`subscribing to ${clientIdTopic}`);
            console.log("data: " + JSON.stringify(data, null, 2));
        });
    
    }


    request(request) {
        const getObserver = this.getObserver.bind(this);
        const unsubscribe = this.unsubscribe.bind(this);
        const setObserver = this.setObserver.bind(this);
        
        console.log("request!");

        return {
          subscribe(observerOrNext, onError, onComplete) {
            console.log("subscribe!");
            console.log(observerOrNext);
            console.log(onError);
            console.log(onComplete);
            setObserver(getObserver(observerOrNext, onError, onComplete));

            return {
              unsubscribe: () => {
                unsubscribe();
              },
            };
          },
        };
      }

    setObserver(observer) {
        console.log("set observer!");
        this.observer = observer;
    }

    unsubscribe(opId) {
        this.mqttClient.unsubscribe("test-topic");
    }

    getObserver(observerOrNext, error, complete) {
        if (typeof observerOrNext === 'function') {
            return {
                next: (v) => observerOrNext(v),
                error: (e) => error && error(e),
                complete: () => complete && complete(),
            };
        }

        return observerOrNext;
    }

    processReceivedData(receivedData, data) {
        console.log("on receive!");
        const parsed = JSON.parse(String(data));
        console.log(Str)
        if (this.observer) {
            this.observer.next(parsed);
        }
        
    }

    onClose(reason) {
        this.status = ConnectionStatus.Close;
        console.log('Socket closed');
        console.log(reason);
        this.observer.error(reason);
    }
}

export class SubscriptionClientLink extends ApolloLink {
    constructor(client) {
        super();
        this.client = client;
    }
      
    request(operation) {
        return this.client.request(operation);
    }
}