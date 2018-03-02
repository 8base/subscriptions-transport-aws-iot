"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_link_1 = require("apollo-link");
class SubscriptionClientLink extends apollo_link_1.ApolloLink {
    constructor(client) {
        super();
        this.client = client;
    }
    request(operation, forwardedLink) {
        // todo operation convert to topic and data
        return this.client.request(operation.getContext().topic, { qos: 1 });
    }
}
exports.SubscriptionClientLink = SubscriptionClientLink;
//# sourceMappingURL=SubscriptionClientLink.js.map