"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const classes_1 = require("../classes");
function SubscriptionClientFactory(url) {
    return new classes_1.SubscriptionClient(url, new classes_1.MqttClient());
}
exports.SubscriptionClientFactory = SubscriptionClientFactory;
//# sourceMappingURL=index.js.map