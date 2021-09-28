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
    columnCount?: number
    dataType?: string
    description?: string
    meanings: { displayText: string }[]
    name: string
    qualifiedName: string
    userDescription?: string
    rowCount?: number
    __createdBy: string
    __customAttributes: string
    __guid: string
    __modificationTimestamp: number
    __timestamp: number
    __modifiedBy: string
    __state: string
}


export type Folder = Omit<Components.Schemas.AtlasEntityHeader, 'attributes' | 'typeName'> & {
    typeName: 'Folder';
    attributes: Attributes
}

export type SavedQuery = Omit<Components.Schemas.AtlasEntityHeader, 'attributes' | 'typeName'> & {
    typeName: 'Query';
    attributes: Attributes
}
