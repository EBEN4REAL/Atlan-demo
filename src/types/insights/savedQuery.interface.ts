import { Components } from '~/api/atlas/client'
export interface SavedQueryInterface {
    id: string
    label: string
    editor: string
    result: string
}

export type Attributes =  {
    assetStatus?: string
    assetStatusMessage?: string
    assetStatusUpdatedBy?: string
    ownerUsers?: string
    ownerGroups?: string
    assetStatusUpdatedAt?: number
    dataType?: string
    description?: string
    meanings: { displayText: string }[]
    name: string
    qualifiedName: string
    userDescription?: string

    parentFolder?: Components.Schemas.AtlasObjectId;
    columns?:Components.Schemas.AtlasObjectId[];

    owner?: string;
    __createdBy: string
    __customAttributes: string
    __guid: string
    __modificationTimestamp: number
    __timestamp: number
    __modifiedBy: string
    __state: string
}


export type Folder = Omit<Components.Schemas.AtlasEntityHeader, 'attributes' | 'typeName' | 'guid'> & {
    typeName: 'QueryFolder';
    attributes: Attributes;
    guid: string
}

export type SavedQuery = Omit<Components.Schemas.AtlasEntityHeader, 'attributes' | 'typeName' | 'guid'> & {
    typeName: 'Query';
    attributes: Omit<Attributes, 'columns' | 'parentFolder'> & {
        folder?: Components.Schemas.AtlasObjectId;
    };
    guid: string;
}
