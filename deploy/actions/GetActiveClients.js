
const { SubscriptionEnvironment } = require("../../src");
const staticConfig = require("./staticConfig.json");

module.exports.handler = (event, context, callback) => {

  console.log("event data " + JSON.stringify(event, null, 2));
  
  let engineRef = null;
  let usersRef = null;
  SubscriptionEnvironment.SubscriptionEngine(staticConfig.redisEndpoint)
    .then((engine) => {
      engineRef = engine;
      return engine.activeUsers();
    })
    .then((users) => {
      usersRef = users;
      return engineRef.disconnect();
    })
    .then(() => {
      callback(null, usersRef);
    })
    .catch(err => {
      callback(err);
    });
};

