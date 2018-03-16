
const subscriptionEngine = require("../RedisSubscriptionStatusEngine");

exports.handler = (event, context, callback) => {
  subscriptionEngine.setInactive(event.clientId);
  callback();
};