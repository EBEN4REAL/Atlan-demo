import { Components } from '~/api/atlas/client'
export interface SavedQueryInterface {
    id: string
    label: string
    editor: string
    result: string
}

export type Attributes = {
    assetStatusUpdatedBy: string | null
    popularityScore: number
    assetStatusMessage: string | null
    integrationName: string
    connectionLastSyncedJob: string
    qualifiedName: string
    name: string
    connectionName: string
    assetStatus: string | null
    ownerUsers: string | null
    connectionQualifiedName: string | null
    displayName: string | null
    description: string | null
    ownerGroups: string | null
    isDiscoverable: boolean
    alias: string | null
    owner: string
    assetStatusUpdatedAt: number
    rawQuery: string
    compiledQuery: string
    connectionId: string
    isPrivate: boolean
    isSnippet: boolean
}

export type Query = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName'
> & {
    typeName: 'Query'
    attributes: Attributes
}

export type SavedQueryResponse = Omit<
    Components.Schemas.AtlasEntityWithExtInfo,
    'entity'
> & {
    entity?: Query
}

export type BasicSearchResponse<T> = Omit<
    Components.Schemas.AtlasSearchResult,
    'entities'
> & {
    entities?: T[]
}
