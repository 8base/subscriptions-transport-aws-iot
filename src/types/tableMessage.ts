import { MessageToProcess } from "./common";

export enum TableAction {
    Create = 'Create',
    Update = 'Update',
    Delete = 'Delete'
}

export interface TableMessageToProcess extends MessageToProcess {
    table: string;
    action: TableAction;
}