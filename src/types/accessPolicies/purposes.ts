export interface MetadataPolicies {
    id?: string
    name: string
    description: string
    type: string
    actions: string[]
    allow: boolean
    groups: string[]
    users: string[]
    isNew?: boolean
}
export interface DataPolicies {
    id?: string
    actions: string[]
    allow: boolean
    groups: string[]
    users: string[]
    description: string
    type: string
    mask:
        | 'null'
        | 'MASK_REDACT'
        | 'MASK_HASH'
        | 'MASK_SHOW_LAST_4'
        | 'MASK_SHOW_FIRST_4'
        | 'MASK_NULL'
        | 'MASK_NONE'
        | 'MASK_DATE_SHOW_YEAR'
    name: string
    isNew?: boolean
}

export interface IPurpose {
    id?: string
    tags: string[]
    enabled?: boolean
    name?: string
    displayName?: string
    description?: string
    personaType?: 'persona'
    users?: string[]
    groups?: string[]
    metadataPolicies?: MetadataPolicies[]
    dataPolicies?: DataPolicies[]
    updatedAt?: string
    updatedBy?: string
    createdAt?: string
    createdBy?: string
}
