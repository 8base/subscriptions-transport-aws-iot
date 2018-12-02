
const { PublishEnvironment } = require("../../src");
const staticConfig = require("./staticConfig.json");
const { setEnvironment } = require("./Common");

module.exports.handler = (event, context, callback) => {
  
  setEnvironment(staticConfig);

  console.log(JSON.stringify(event, null, 2));
  
  PublishEnvironment.publish(event.topic, event.message)
    .then(() => {
      callback();
    })
    .catch(err => {
      callback(err);
    });
};

