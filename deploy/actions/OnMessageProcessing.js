
const { SubscriptionEnvironment } = require("./src");
const config = require("./config.json");

module.exports.handler = (event, context, callback) => {
  console.log("event data " + JSON.stringify(event, null, 2));
  callback();
};

