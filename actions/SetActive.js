
const subscriptionEngine = require("../RedisSubscriptionStatusEngine");

exports.handler = (event, context, callback) => {
    
  subscriptionEngine.setActive(event);
  callback();
};