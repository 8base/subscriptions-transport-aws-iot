
export interface ISignedUrlResolver {

    /* async */ resolve(): Promise<string>;
}