
const { SubscriptionEnvironment } = require("../../src");
const staticConfig = require("./staticConfig.json");

module.exports.handler = (event, context, callback) => {

  console.log("clientid = " + event.clientId);

  let engineRef = null;
  SubscriptionEnvironment.StatusEngine(staticConfig.redisEndpoint)
    .then(engine => {
      engineRef = engine;
      return engine.setUserActive(event.clientId);
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

