# subscriptions-transport-aws-iot

Library was created to simplify serverless subscription mechanism.

There are two environment: subsription and publisher. 

## Subscription

Subscription use for start websocket communication with services such as IoT or something else. At moment there are present implementation of IoT service.
To connect with remote websocket service use authentication service. At moment there are present Cognito authentication.

### Example

To start subscription service you have to 
 
  1. Setup process environment

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
              .authResolver(SubscriptionEnvironment.Auth.Cognito(session.getIdToken().getJwtToken()));
  ```
  4. Subscribe on topic. This function return observable.
  ```
    observable = client.subscribe( { topic: "test-topic" }, { qos: 1 });
  ```
  5. Subscribe on observable object
  ```
  observable.subscribe( { next: () => {}, error: () => {} });
  ```
  
