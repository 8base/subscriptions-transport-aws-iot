
const { SubscriptionEnvironment, ServiceEnvironment } = require("../../src");
const staticConfig = require("./staticConfig.json");

module.exports.handler = (event, context, callback) => {

  console.log("event data " + JSON.stringify(event, null, 2));
  
  let engineRef = null;
  
  const user = ServiceEnvironment.IotClientIdTransform.clientIdToUser(event.clientId);

  SubscriptionEnvironment.SubscriptionEngine(staticConfig.redisEndpoint)
    .then(engine => {
      engineRef = engine;
      return engine.setUserActive(user);
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

