export interface MetadataPolicies {
    actions: string[]
    assets: string[]
    connectionId: string
    allow: boolean
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
    sqlPolicies?: []
    updatedAt?: string
    updatedBy?: string
    createdAt?: string
    createdBy?: string
}
