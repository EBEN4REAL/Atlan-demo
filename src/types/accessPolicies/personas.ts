export interface MetadataPolicies {
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
    maskingOption: 'MASK_HASH'
    name: string
}

export interface IPersona {
    id?: string
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
