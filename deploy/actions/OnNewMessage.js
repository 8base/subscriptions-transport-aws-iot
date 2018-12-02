const { SubscriptionEnvironment, ServiceEnvironment, PublishEnvironment, Config } = require("../../src");
const staticConfig = require("./staticConfig.json");
const { setEnvironment } = require("./Common");


/*
  function call to process new message

  event: {
    message: {
      // data of message
    }
  }
*/

module.exports.handler = (event, context, callback) => {

  setEnvironment(staticConfig);

  console.log(JSON.stringify(event, null, 2));
  console.log("redis = " + staticConfig.redisEndpoint);

  let engineRef = null;
  let schemaRef = null;
  SubscriptionEnvironment.SubscriptionEngine(staticConfig.redisEndpoint)
    .then(engine => {
      engineRef = engine;
      return engine.getSchema(event.room, event.topic);
    })
    .then(schema => {
      //schemaRef = gql(schema);
      console.log(schema);
      //console.log(schemaRef);
      return engineRef.getSubscriptions(event.room, event.topic);
    })
    .then(subscriptions => {
      return Promise.all(subscriptions.map(subscription => {
        return {
          subscription,
          data: ServiceEnvironment.Schema.execute(schemaRef, event.message)
        }
      }
      ));
    })
    .then((res) => {
      return Promise.all(
        res.map(r =>
          PublishEnvironment.Client.sendProcessedMessageToTopic(
            r.subscription.room,
            r.subscription.user,
            r.subscription.topic,
            r.data)
        )
      );
    })
    .then(() => {
      return engineRef.disconnect();
    })
    .then(() => {
      callback();
    })
    .catch(err => {
      callback(err);
    });
};

