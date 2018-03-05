const SignedUrlResolver = require('./SignedUrlResolver');


const SubscriptionClientFactory  = require("../lib/src/factories");
const Config  = require("./config");

const resolver = new SignedUrlResolver(Config.iotEndpoint, Config.region);

const observer = {
    next: (data) => {
        console.log("next");
        console.log(data);
    },
    error: (err) => {
        console.log("error");
        console.log(err);
    },
    complete: () => {
        console.log("complete");
    }
};

console.log("start example");

let observable = null;

resolver.resolve()
    .then(url => {
        observable = SubscriptionClientFactory(url, {
            customAuthHeaders: {
                'X-Amz-CustomAuthorizer-Name': 'AuthorizerFunctionName',
                'X-Amz-CustomAuthorizer-Signature': 'Signature',
                'token': 'Token'
            }
        }).request("test-topic", { qos: 1 }).subscribe(observer);

    })
    .catch(err => console.log(err));



