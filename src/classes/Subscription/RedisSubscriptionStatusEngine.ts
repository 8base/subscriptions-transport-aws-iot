import { ISubscriptionStatusEngine, Client, Subscription } from "../interfaces/Subscription";
import * as Redis from "ioredis";
import * as path from "path";

export class RedisSubscriptionStatusEngine implements ISubscriptionStatusEngine {

  private redis: Redis.Redis;

  constructor () {
    this.redis = new Redis("test-redis-001.3lfqwv.0001.use1.cache.amazonaws.com");
  }

  async getSubscription(client: string, topic: string): Promise<Subscription> {
    const subscription = await this.redis.get(SubscriptionPathEngine.topicInfoKey(client, topic));

    if (!subscription) {
      return null;
    }

    return JSON.parse(subscription);
  }

  async subscribeClient(client: string, topic: string, query: string, filter: string): Promise<void> {
    const fullTopic = SubscriptionPathEngine.topicInfoKey(client, topic);
    await this.redis.set(fullTopic, JSON.stringify( { query, filter }));
  }

  async unsubscribeClient(client: string, topic: string): Promise<void> {
    this.redis.pipeline().del(SubscriptionPathEngine.topicInfoKey(client, topic));
  }

  async setClientActive(client: string): Promise<void> {
    this.redis.set(SubscriptionPathEngine.clientKey(client), ClientStatus.active);
  }

  async setClientInactive(client: string): Promise<void> {
    this.redis.set(SubscriptionPathEngine.clientKey(client), ClientStatus.inactive);
  }

  /*
    Private functions
  */

}

enum ClientStatus {
  active = 'active',

  inactive = 'inactive'
}

class SubscriptionPathEngine {

  private static userPrefix = "user_status";

  private static topicInfoPrefix = "topic_info";

  static clientKey(client: string): string {
    return SubscriptionPathEngine.userPrefix + "_" + client;
  }

  static topicInfoKey(client: string, topic: string) {
    return SubscriptionPathEngine.topicInfoPrefix + "_" + client + "_" + topic;
  }
}