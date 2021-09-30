import { Components } from '~/api/atlas/client'
export interface SavedQueryInterface {
    id: string
    label: string
    editor: string
    result: string
}

export type Attributes = {
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
    isSnippet?: boolean
    integrationName?: string
    connectionQualifiedName: string
    connectionId: string
    defaultSchemaQualifiedName: string
    variablesSchemaBase64: string // base64 string
    owner?: string
    __createdBy: string
    __customAttributes: string
    __guid: string
    __modificationTimestamp: number
    __timestamp: number
    __modifiedBy: string
    __state: string
}

export type QueryFolderAttributes = Attributes & {
    parentFolder?: Components.Schemas.AtlasObjectId
    columns?: Components.Schemas.AtlasObjectId[]
}

export type SavedQueryAttributes = Attributes & {
    folder?: Components.Schemas.AtlasObjectId
    compiledQuery: string
    rawQuery: string
}

export type Folder = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName' | 'guid'
> & {
    typeName: 'QueryFolder'
    attributes: QueryFolderAttributes
    guid: string
}

export type SavedQuery = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName' | 'guid'
> & {
    typeName: 'Query'
    attributes: SavedQueryAttributes
    guid: string
}

export type SavedQueryResponse = Omit<
    Components.Schemas.AtlasEntityWithExtInfo,
    'entity'
> & {
    entity?: SavedQuery
}
