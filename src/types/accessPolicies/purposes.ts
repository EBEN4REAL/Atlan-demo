export interface ResourcePolicies {
    name: string
    description: string
    actions: string[]
    assets: string[]
    connectionId: string
    allow: boolean
}
export interface DataPolicies {
    actions: string[]
    allow: boolean
    assets: string[]
    connectionName: string
    description: string
    maskType:
        | 'MASK_REDACT'
        | 'MASK_HASH'
        | 'MASK_SHOW_LAST_4'
        | 'MASK_SHOW_FIRST_4'
        | 'MASK_NULL'
        | 'MASK_NONE'
        | 'MASK_DATE_SHOW_YEAR'
    name: string
}

export interface IPurpose {
    id?: string
    name?: string
    displayName?: string
    description?: string
    personaType?: 'persona'
    users?: string[]
    groups?: string[]
    resourcePolicies?: ResourcePolicies[]
    // Will be camel cased from BE
    dataPolicies?: DataPolicies[]
    updatedAt?: string
    updatedBy?: string
    createdAt?: string
    createdBy?: string
}
