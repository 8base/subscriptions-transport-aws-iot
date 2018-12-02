import { DocumentNode } from 'graphql';
import { PredefineTopics } from '../classes/Topic';

/*
    room
*/

export class SubscribeInfo {

  public get fullTopic(): string {
    return PredefineTopics.publicTopic(this.room, this.user, this.topic);
  }

  query?: DocumentNode;
  filter?: string;

  topic: string;
  room: string;
  user: string;
}
