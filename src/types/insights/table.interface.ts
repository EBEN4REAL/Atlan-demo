import { Components } from '~/types/atlas/client'
export interface tableInterface {
    id: string
    label: string
}

export type Attributes = {
    certificateStatus?: string
    assetStatusMessage?: string
    certificateUpdatedBy?: string
    ownerUsers?: string
    ownerGroups?: string
    certificateUpdatedAt?: number
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

export type Database = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName'
> & {
    typeName: 'Database'
    attributes: Attributes
}
export type Schema = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName'
> & {
    typeName: 'Schema'
    attributes: Attributes
}
export type Table = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName'
> & {
    typeName: 'Table'
    attributes: Attributes
}
export type View = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName'
> & {
    typeName: 'View'
    attributes: Attributes
}
export type Column = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName'
> & {
    typeName: 'Column'
    attributes: Attributes
}

export type BasicSearchResponse<T> = Omit<
    Components.Schemas.AtlasSearchResult,
    'entities'
> & {
    entities?: T[]
}
