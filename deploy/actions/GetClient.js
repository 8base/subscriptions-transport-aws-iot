
const { SubscriptionEnvironment } = require("./src");
const config = require("./config.json");

module.exports.handler = (event, context, callback) => {

  console.log("event data " + JSON.stringify(event, null, 2));
  
  let engineRef = null;
  SubscriptionEnvironment.SubscriptionEngine(config.redisEndpoint)
    .then((engine) => {
      engineRef = engine;
      return engine.ClientStatus(event.clientId);
    })
    .then((status) => {
      console.log(status);
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

