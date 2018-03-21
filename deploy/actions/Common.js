const { Config } = require("../../src");
const aws = require("aws-sdk");

exports.setEnvironment = function(staticConfig) {
    Config.iotEndpoint = staticConfig.iotEndpoint;

    aws.config.region = staticConfig.region;
}
  