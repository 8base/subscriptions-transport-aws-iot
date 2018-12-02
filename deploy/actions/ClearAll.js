
const { SubscriptionEnvironment } = require("../../src");
const staticConfig = require("./staticConfig.json");

module.exports.handler = (event, context, callback) => {

  console.log("event data " + JSON.stringify(event, null, 2));
  
  let engineRef = null;
  SubscriptionEnvironment.SubscriptionEngine(staticConfig.redisEndpoint)
    .then((engine) => {
      engineRef = engine;
      return engine.clearAll();
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

