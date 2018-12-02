import { ISubscriptionEngine,  UserStatus } from "../../../../interfaces";
import * as Redis from "ioredis";
import * as path from "path";
import { KeysPrefix } from './keysPrefix';
import { SubscribeInfo } from '../../../../types';
import * as _ from "lodash";

/*

*/

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

  async clearAll(): Promise<void> {
    await this.redis.flushall();
  }

  async activeUsers(): Promise<string[]> {
    return await this.redis.hkeys(KeysPrefix.userStatus(UserStatus.active));
  }

  async disconnect(): Promise<void> {
    return await this.redis.disconnect();
  }


  async userStatus(user: string): Promise<UserStatus> {
    return await this.redis.hget(KeysPrefix.userStatus(UserStatus.active), user) ? UserStatus.active : UserStatus.inactive;
  }

  async getSubscription(room: string, user: string, topic: string): Promise<SubscribeInfo> {
    const subscription = await this.redis.hget(KeysPrefix.roomTopic(room, topic), user);

    if (!subscription) {
      return null;
    }

    return JSON.parse(subscription);
  }

  async getSubscriptions(room: string, topic: string): Promise<SubscribeInfo[]> {
    // filter active users
    const data = await this.redis.hgetall(KeysPrefix.roomTopic(room, topic));
    return _.transform<any, SubscribeInfo>(data, (result, subscribe: string, user: string) => {
      const parsed = JSON.parse(subscribe);
      let subscription = new SubscribeInfo();
      subscription.room = room;
      subscription.user = user;
      subscription.filter = parsed.filter;
      subscription.topic = topic;
      subscription.query = parsed.query;

      result.push(subscription);
    }, []);
  }

  async subscribeUser(room: string, user: string, topic: string, query: string, filter: string): Promise<void> {
    await this.redis.hset(KeysPrefix.roomTopic(room, topic), user, JSON.stringify( { query, filter }));
  }

  async unsubscribeUser(room: string, user: string, topic: string): Promise<void> {
    await this.redis.hdel(KeysPrefix.roomTopic(room, topic), user);
  }

  async setUserActive(user: string): Promise<void> {
    await this.redis.pipeline()
      .hset(KeysPrefix.userStatus(UserStatus.active), user, "")
      .hdel(KeysPrefix.userStatus(UserStatus.inactive), user)
      .exec((err: Error, data: any) => {
        if (err) {
          throw err;
        }
      });
  }

  async setUserInactive(user: string): Promise<void> {
    await this.redis.pipeline()
      .hset(KeysPrefix.userStatus(UserStatus.inactive), user, "")
      .hdel(KeysPrefix.userStatus(UserStatus.active), user)
      .exec((err: Error, data: any) => {
        if (err) {
          throw err;
        }
      });
  }

  async getSchema(): Promise<string> {
    return await this.redis.get(KeysPrefix.schema());
  }

  async setSchema(schema: string): Promise<void> {
    await this.redis.set(KeysPrefix.schema(), schema);
  }
}
