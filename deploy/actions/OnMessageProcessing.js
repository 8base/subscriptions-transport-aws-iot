
const { SubscriptionEnvironment, ClientIdTransform } = require("./src");
const config = require("./config.json");

module.exports.handler = (event, context, callback) => {
  console.log("event data " + JSON.stringify(event, null, 2));
  const user = ClientIdTransform.toUser(event.clientId);
  console.log(user);
  callback();
};

