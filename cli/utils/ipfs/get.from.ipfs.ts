import { AxiosInstance } from "axios";
import { assertExists } from "..";

export type GetFromIpfs = (metadataHash: string) => Promise<IpfsMetadata>

export interface IpfsMetadata {
    name: string,
    from: string,
    agentId: string,
    version: string,
    imageReference: string,
    agentIdHash: string,
    timestamp: string,
    repository: string,
    publishedFrom: string,
    documentation: string
}

export default function provideGetFromIpfs(
    ipfsHttpClient: AxiosInstance
): GetFromIpfs {
    assertExists(ipfsHttpClient, 'ipfsHttpClient')

    return async function getIpfsByHash(metadataHash: string) {
        const { data } = await ipfsHttpClient.get(`/ipfs/${metadataHash}`);

        if(data && data.manifest) {
            return data.manifest;
        }

        throw Error(`No data found for ipfs hash ${metadataHash}`)
    }
}

export const formatIpfsData = (data: IpfsMetadata, isBotEnabled: boolean) => {
    return {
        name: data.name,
        agentId: data.agentIdHash,
        status: isBotEnabled ? "Enabled" : "Disabled",
        version: data.version,
        owner: data.from,
        image: data.imageReference,
        published_from: data.publishedFrom,
        timestamp: data.timestamp,
        documentation: ` https://ipfs.io/ipfs/${data.documentation}`
    }
}