export type functionT = {
    name: string,
    arn: string,
    handler: string
};

export type ruleT = {
    functionName: string,
    name: string,
    sql: string
};