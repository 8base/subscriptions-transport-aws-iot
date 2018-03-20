import * as path from "path";



  export class PredefineTopicPrefix {

    private static serviceTopic = "service";

    private static public = "public";

    private static clientStatusTopic = "client_status";

    static get onNewMessage(): string {
        return path.join(PredefineTopicPrefix.serviceTopic, "on_new_message");
    }

    static get onSetSchema(): string {
        return path.join(PredefineTopicPrefix.serviceTopic, "on_set_schema");
    }

    static get onNewSubscribe(): string {
        return path.join(PredefineTopicPrefix.serviceTopic, "on_new_subscribe");
    }

    static get onPublish(): string {
        return path.join(PredefineTopicPrefix.public, "on_processed_message");
    }
}