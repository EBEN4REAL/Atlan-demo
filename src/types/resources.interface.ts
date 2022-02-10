// This interface is for purposes & persona, assets have a slightly different format

// export interface Link {
//     typeName: 'Link',
//     qualifiedName: string,
//     name: string,
//     url: string,
//     createdAt: number,
//     createdBy: string,
//     updatedAt?: number,
//     updatedBy?: string,
// }
export interface Link {
    "guid"?: string,
    "typeName": "Link",
    "attributes": {
        "__modifiedBy"?: string,
        "__state"?: string,
        "__createdBy": string,
        "__modificationTimestamp"?: number,
        "link": string,
        "name": string,
        "__timestamp": number
    },
    "uniqueAttributes": { "qualifiedName": string }
}

export interface Resource {
    links?: Link[]
}