
const { SubscriptionEnvironment, ServiceEnvironment } = require("../../src");
const config = require("./config.json");
const { execute, parse, GraphQLSchema } = require('graphql');

/*
  function call to process new message

*/

module.exports.handler = (event, context, callback) => {
  console.log("event data " + JSON.stringify(event, null, 2));
  let engineRef = null;
  SubscriptionEnvironment.SubscriptionEngine(config.redisEndpoint)
    .then(engine => {
      engineRef = engine;
      return engine.getSubscriptions(event.room, event.topic);
    })
    .then(subscriptions => {
      console.log(subscriptions);
      subscriptions.map(subscription => {

      })
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

