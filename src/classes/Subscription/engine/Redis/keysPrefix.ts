import { UserStatus } from '../../../../interfaces';


/*
  keys prefixs
  user_status_<user> = active / inactive
  users_in_room_<room> = [user1, user2]
  subscribed_topics_<room>_<user>_
*/


export class KeysPrefix {

    private static clientStatusPrefix = "user_status";

    private static topicInfoPrefix = "subscribed_topic";

    private static usersInRoomPrefix = "users_in_room";

    private static roomTopicPrefix = "room_topic";

    private static schemaPrefix = "schema";

    static userStatus(status: UserStatus): string {
      return `${KeysPrefix.clientStatusPrefix}_${status.toString()}`;
    }

    static usersInRoom(room: string): string {
      return `${KeysPrefix.usersInRoomPrefix}_${room}`;
    }

    static roomTopic(room: string, topic: string): string {
      return `${KeysPrefix.roomTopicPrefix}_${room}_${topic}`;
    }

    static schema(): string {
      return KeysPrefix.schemaPrefix;
    }
  }