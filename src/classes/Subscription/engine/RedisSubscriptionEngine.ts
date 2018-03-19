import { ISubscriptionEngine, Client, Subscription, ClientStatus } from "../../../interfaces";
import * as Redis from "ioredis";
import * as path from "path";


export class RedisSubscriptionEngine implements ISubscriptionEngine {

  private redis: Redis.Redis;

  constructor (redis: Redis.Redis) {
    this.redis = redis;
  }

  static async create(redisEndpoint: string, port: number): Promise<ISubscriptionEngine> {
    return new Promise<ISubscriptionEngine>((resolve, reject) => {
      const redis = new Redis("test-redis.3lfqwv.ng.0001.use1.cache.amazonaws.com:6379");

      redis.on("error", (err: Error) => {
        console.log(err.message);
        reject(err);
      });

      redis.on("connect", () => {
        resolve(new RedisSubscriptionEngine(redis));
      });
    });
  }

  async disconnect(): Promise<void> {
    return await this.redis.disconnect();
  }

  async ClientStatus(client: string): Promise<ClientStatus> {
    return await this.redis.get(SubscriptionPathEngine.clientKey(client)) as ClientStatus;
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
    await this.redis.del(SubscriptionPathEngine.topicInfoKey(client, topic));
  }

  async setClientActive(client: string): Promise<void> {
    return await this.redis.set(SubscriptionPathEngine.clientKey(client), ClientStatus.active);
  }

  async setClientInactive(client: string): Promise<void> {
    return await this.redis.set(SubscriptionPathEngine.clientKey(client), ClientStatus.inactive);
  }

  /*
    Private functions
  */

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