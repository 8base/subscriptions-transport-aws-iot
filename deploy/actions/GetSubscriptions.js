
const { SubscriptionEnvironment } = require("../../src");
const staticConfig = require("./staticConfig.json");

module.exports.handler = (event, context, callback) => {

  console.log("event data " + JSON.stringify(event, null, 2));
  
  let engineRef = null;
  let subscriptionsRef = null;
  SubscriptionEnvironment.SubscriptionEngine(staticConfig.redisEndpoint)
    .then((engine) => {
      engineRef = engine;
      return engine.getSubscriptions(event.room, event.topic);
    })
    .then((subscriptions) => {
      subscriptionsRef = subscriptions;
      return engineRef.disconnect();
    })
    .then(() => {
      callback(null, subscriptionsRef);
    })
    .catch(err => {
      callback(err);
    });
};

