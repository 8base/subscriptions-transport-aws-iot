
const { SubscriptionEnvironment } = require("../../src");
const staticConfig = require("./staticConfig.json");

module.exports.handler = (event, context, callback) => {

  console.log("event data " + JSON.stringify(event, null, 2));
  
  let engineRef = null;
  let subscriptionRef = null;
  SubscriptionEnvironment.SubscriptionEngine(staticConfig.redisEndpoint)
    .then((engine) => {
      engineRef = engine;
      return engine.getSubscription(event.room, event.user, event.topic);
    })
    .then((subscription) => {
      subscriptionRef = subscription;
      return engineRef.disconnect();
    })
    .then(() => {
      callback(null, subscriptionRef);
    })
    .catch(err => {
      callback(err);
    });
};

