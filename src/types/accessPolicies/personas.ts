export interface MetadataPolicies {
    actions: string[]
    assets: string[]
}

export interface IPersona {
    id: string
    displayName: string
    description?: string
    personaName: string
    metadataPolicies: MetadataPolicies[]
    orgPolicies: []
    roles: []
    updatedAt: string
    updatedBy: string
    createdAt: string
    createdBy: string
}
