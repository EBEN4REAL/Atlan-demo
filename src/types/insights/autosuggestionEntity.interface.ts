export interface autosuggestionEntityColumn {
    guid: string
    name: string
    type: string
    order: number
    nullable: boolean
    precision: number
    scale: number
    ownerUsers: string
    certificateStatus: string
    popularityScore: any
    isPrimary: boolean
    qualifiedName: string
}
export interface autosuggestionEntity {
    attributes: any;
    name: string
    tableQN?: string
    columns?: autosuggestionEntityColumn
    guid?: string
    type?: string
    order?: number
    nullable?: boolean
    precision?: number
    scale?: number
    ownerUsers?: string
    certificateStatus?: string
    popularityScore?: any
    isPrimary?: boolean
    qualifiedName?: string
}

export interface autosuggestionResponse {
    entities: autosuggestionEntity[]
    resultSize: number
}
