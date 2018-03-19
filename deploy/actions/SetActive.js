
// const subscriptionEngine = require("../RedisSubscriptionStatusEngine");

module.exports.handler = (event, context, callback) => {
  // subscriptionEngine.setActive(event);
  console.log("set inactive call");
  callback();
}

