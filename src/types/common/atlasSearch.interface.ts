import { Components } from '~/api/atlas/client'

export type BasicSearchResponse<T> = Omit<Components.Schemas.AtlasSearchResult, 'entities'> & {
    entities?: T[],
}

export type RelationshipSearchResponse<T> = Omit<Components.Schemas.AtlasSearchResult, 'entities'> & {
    entities?: T[],
}