
const { SubscriptionEnvironment } = require("../../src");
const staticConfig = require("./staticConfig.json");

module.exports.handler = (event, context, callback) => {

  console.log("event data " + JSON.stringify(event, null, 2));
  
  let engineRef = null;
  let statusRef = null;
  SubscriptionEnvironment.SubscriptionEngine(staticConfig.redisEndpoint)
    .then((engine) => {
      engineRef = engine;
      return engine.userStatus(event.clientId);
    })
    .then((status) => {
      statusRef = status;
      return engineRef.disconnect();
    })
    .then(() => {
      callback(null, statusRef);
    })
    .catch(err => {
      callback(err);
    });
};

