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
    previewConfig: string | null
    connectionQualifiedName: string | null
    displayName: string | null
    description: string | null
    ownerGroups: string | null
    isDiscoverable: boolean
    alias: string | null
    owner: string
    banner: string | null
    tenantId: string | null
    bannerUpdatedBy: string | null
    assetStatusUpdatedAt: number
    certificationUpdatedAt: number
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

export type BasicSearchResponse<T> = Omit<
    Components.Schemas.AtlasSearchResult,
    'entities'
> & {
    entities?: T[]
}
