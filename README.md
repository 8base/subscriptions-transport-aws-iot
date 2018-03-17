# subscriptions-transport-aws-iot

This library was created to simplify serverless subscription mechanism.

There are two environments: `subsription` and `publisher`. 

## Subscription

`Subscription` is uesd to start a websocket communication with the AWS IoT service. The library uses Amazon Cognito for authentication.

### Example

To start subscription service you have to 
 
  1. Setup environment variables

    AWS_IOT_ENDPOINT
    AWS_REGION
    AWS_USER_POOL_ID
    AWS_CLIENT_ID
    AWS_IDENTITY_POOL_ID

  2. Get idToken from Cognito service 
  3. Create Subscription Client. Example
  ```
        const client = SubscriptionEnvironment
              .Client
              .create()
              .transport(SubscriptionEnvironment.Transport.Iot())
              .authResolver(SubscriptionEnvironment.Auth.Cognito(session.getIdToken().getJwtToken()))
              .client();
  ```
  4. Subscribe to a topic. This function return observable.
  ```
    observable = client.subscribe( { topic: "test-topic" }, { qos: 1 });
  ```
  5. Subscribe on observable object
  ```
  observable.subscribe( { next: () => {}, error: () => {} });
  ```
  
