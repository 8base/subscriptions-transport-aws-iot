export type functionT = {
    name: string,
    arn: string,
    handler: string,
    publicAccess: boolean;
};

export type ruleT = {
    functionName: string,
    name: string,
    sql: string
};