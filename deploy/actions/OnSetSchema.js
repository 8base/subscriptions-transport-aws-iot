
const { SubscriptionEnvironment } = require("../../src");
const config = require("./config.json");

/*
  Function call from onSaveSubscription handler
*/

module.exports.handler = (event, context, callback) => {

  let engineRef = null;
  SubscriptionEnvironment.SubscriptionEngine(config.redisEndpoint)
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
      console.log(err.message);
      callback();
    });
};

