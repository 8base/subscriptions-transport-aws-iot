const { SubscriptionEnvironment, ServiceEnvironment } = require.resolve("./src");
const config = require("./config.json");
const { execute, parse, GraphQLSchema } = require('graphql');
const gql = require("graphql-tag")
/*
  function call to process new message

*/

module.exports.handler = (event, context, callback) => {
  console.log("event data " + JSON.stringify(event, null, 2));
  let engineRef = null;
  let schemaRef = null;
  SubscriptionEnvironment.SubscriptionEngine(config.redisEndpoint)
    .then(engine => {
      engineRef = engine;
      return engine.getSubscriptions(event.room, event.topic);
    })
    .then(schema => {
      schemaRef = gql(schema);
      console.log(schema);
      console.log(schemaRef);
      return engineRef.getSubscriptions(event.room, event.topic);
    })
    .then(subscriptions => {
      console.log(subscriptions);
      subscriptions.map(subscription => {
        
        return execute(
          {
            schema: schemaRef,
            document: subscription.query,
            rootValue: event.payload
          }
        )
      })
    })
    .then((res) => {
      console.log(res);
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

