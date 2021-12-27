import { Components } from '~/types/atlas/client'
export interface SavedQueryInterface {
    id: string
    label: string
    editor: string
    result: string
}

export type Attributes = {
    certificateStatus?: string
    assetStatusMessage?: string
    certificateUpdatedBy?: string
    ownerUsers?: string
    ownerGroups?: string
    adminUsers?: string
    adminGroups?:string
    viewerUsers?: string
    viewerGroups?: string
    certificateUpdatedAt?: number
    dataType?: string
    description?: string
    meanings: { displayText: string }[]
    name: string
    qualifiedName: string
    userDescription?: string
    isSnippet?: boolean
    connectorName?: string
    connectionQualifiedName: string
    connectionId: string
    defaultSchemaQualifiedName: string
    variablesSchemaBase64: string // base64 string
    isVisualQuery: boolean
    visualBuilderSchemaBase64: string
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
    collectionQualifiedName: string
    parentQualifiedName: string
    parentQualifiedName: string
}

export type SavedQueryAttributes = Attributes & {
    folder?: Components.Schemas.AtlasObjectId
    compiledQuery: string
    rawQuery: string
    collectionQualifiedName: string
    parentQualifiedName: string
    parentQualifiedName: string
}

export type QueryCollectionAttributes = Attributes

export type Folder = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName' | 'guid'
> & {
    typeName: 'Folder'
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

export type QueryCollection = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName' | 'guid'
> & {
    typeName: 'Collection'
    attributes: QueryCollectionAttributes
    guid: string
}

export type SavedQueryResponse = Omit<
    Components.Schemas.AtlasEntityWithExtInfo,
    'entity'
> & {
    entity?: SavedQuery
}
