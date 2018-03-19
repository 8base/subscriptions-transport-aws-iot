
const { SubscriptionEnvironment } = require("./src");
const config = require("./config.json");

module.exports.handler = (event, context, callback) => {

  console.log("start connect to " + config.redisEndpoint);
  console.log("clientid = " + event.clientId);

  let engineRef = null;
  SubscriptionEnvironment.StatusEngine(config.redisEndpoint)
    .then(engine => {
      engineRef = engine;
      return engine.setClientActive(event.clientId);
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

