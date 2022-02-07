// This interface is for purposes & persona, assets have a slightly different format

export interface Link {
    typeName: 'Link',
    qualifiedName: string,
    name: string,
    url: string,
    createdAt: number,
    createdBy: string,
    updatedAt?: number,
    updatedBy?: string,
}

export interface Resource {
    links?: Link[]
}