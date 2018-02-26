import { SignedUrlResolver } from './SignedUrlResolver';

import { SubscriptionClient } from "../src";
import { Config } from "./config";

const client = new SubscriptionClient(
    new SignedUrlResolver(Config.iotEndpoint, Config.region)
);

