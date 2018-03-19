
const { SubscriptionEnvironment } = require("./src");
const config = require("./config.json");

module.exports.handler = (event, context, callback) => {
  
  console.log("start connect to " + config.redisEndpoint);
  try {
    const engine = SubscriptionEnvironment.StatusEngine(config.redisEndpoint);
    console.log("connect success ");
    console.log(engine);  
  } catch(ex) {
    console.log(ex);
  }


  callback({ message: "ok" });
}

