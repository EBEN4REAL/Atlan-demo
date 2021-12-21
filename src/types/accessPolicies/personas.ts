export interface MetadataPolicies {
    id?: string
    name: string
    description: string
    actions: string[]
    assets: string[]
    connectionId: string
    allow: boolean
    isNew?: boolean
    createdBy: string
    createdAt: number
}

export interface DataPolicies {
    id?: string
    actions: string[]
    allow: boolean
    assets: string[]
    connectionName: string
    description: string
    connectionId: string
    maskType:
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
    createdBy: string
    createdAt: number
}

export interface IPersona {
    id?: string
    enabled?: boolean
    name?: string
    displayName?: string
    description?: string
    personaType?: 'persona'
    users?: string[]
    groups?: string[]
    metadataPolicies?: MetadataPolicies[]
    // Will be camel cased from BE
    dataPolicies?: DataPolicies[]
    updatedAt?: number
    updatedBy?: string
    createdAt?: number
    createdBy?: string
}

export interface IUser {
    email: string
    firstName: string
    lastName: string
    username: string
}

export interface IGroup {
    alias: string
    description: string
    memberCountString: string
    memberCount: number
    id: string
    name: string
    user_count: string
}

export interface IEnableDisablePayload {
    action: string
}
