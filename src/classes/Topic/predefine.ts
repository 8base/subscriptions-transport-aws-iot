
import * as path from "path";
import { TopicPrefix } from "./prefix";

export class PredefineTopics {
    static get onNewMessage(): string {
        return path.join(TopicPrefix.serviceTopic, "on_new_message");
    }

    static onRoomNewMessage(room: string): string {
        return path.join(PredefineTopics.onNewMessage, room);
    }

    static get onSetSchema(): string {
        return path.join(TopicPrefix.serviceTopic, "on_set_schema");
    }

    static get onNewSubscribe(): string {
        return path.join(TopicPrefix.serviceTopic, "on_new_subscribe");
    }

    static publicTopic(room: string, user: string, topic: string): string {
        return path.join(TopicPrefix.public, room, user, topic);
    }

    static publicRoom(room: string): string {
        return path.join(TopicPrefix.public, room);
    }
}