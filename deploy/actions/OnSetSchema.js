
const { SubscriptionEnvironment } = require("../../src");
const staticConfig = require("./staticConfig.json");

/*
  Function call from onSaveSubscription handler
*/

module.exports.handler = (event, context, callback) => {

  let engineRef = null;
  SubscriptionEnvironment.SubscriptionEngine(staticConfig.redisEndpoint)
    .then(engine => {
      engineRef = engine;
      return engine.setSchema(event.schema);
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

