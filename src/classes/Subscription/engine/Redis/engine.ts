import { ISubscriptionEngine,  UserStatus } from "../../../../interfaces";
import * as Redis from "ioredis";
import * as path from "path";
import { KeysPrefix } from './keysPrefix';
import { SubscribeInfo } from '../../../../types';
import * as _ from "lodash";

export class RedisSubscriptionEngine implements ISubscriptionEngine {

  private redis: Redis.Redis;

  constructor (redis: Redis.Redis) {
    this.redis = redis;
  }

  static async create(redisEndpoint: string): Promise<ISubscriptionEngine> {
    return new Promise<ISubscriptionEngine>((resolve, reject) => {
      const redis = new Redis(redisEndpoint);

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


  async userStatus(user: string): Promise<UserStatus> {
    return await this.redis.get(KeysPrefix.userStatus(user)) as UserStatus;
  }

  async getSubscription(room: string, user: string, topic: string): Promise<SubscribeInfo> {
    const subscription = await this.redis.get(KeysPrefix.topic(room, user, topic));

    if (!subscription) {
      return null;
    }

    return JSON.parse(subscription);
  }

  async getSubscriptions(room: string, topic: string): Promise<SubscribeInfo[]> {
    // filter active users
    return _.chunk(await this.redis.hgetall(KeysPrefix.roomTopic(room, topic)) as string[])
      .map<SubscribeInfo>(value => {
        const parsed = JSON.parse(value[1]);
        return {
          topic,
          room,
          user: value[0],
          query: parsed.query,
          filter: parsed.filter
        };
      });
  }

  async subscribeUser(room: string, user: string, topic: string, query: string, filter: string): Promise<void> {
    await this.redis.hset(KeysPrefix.roomTopic(room, topic), user, JSON.stringify( { query, filter }));
  }

  async unsubscribeUser(room: string, user: string, topic: string): Promise<void> {
    await this.redis.hdel(KeysPrefix.roomTopic(room, topic), user);
  }

  async setUserActive(user: string): Promise<void> {
    return await this.redis.set(KeysPrefix.userStatus(user), UserStatus.active);
  }

  async setUserInactive(user: string): Promise<void> {
    return await this.redis.set(KeysPrefix.userStatus(user), UserStatus.inactive);
  }

  async getSchema(): Promise<string> {
    return await this.redis.get(KeysPrefix.schema());
  }

  async setSchema(schema: string): Promise<void> {
    return await this.redis.set(KeysPrefix.schema(), schema);
  }
}
