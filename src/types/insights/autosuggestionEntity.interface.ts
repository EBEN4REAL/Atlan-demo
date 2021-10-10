export interface autosuggestionEntity {
    guid: string
    name: string
    type: string
    order: number
    nullable: boolean
    precision: number
    scale: number
    ownerUsers: string
    assetStatus: string
    popularityScore: any
    isPrimary: boolean
    qualifiedName: string
}

export interface autosuggestionResponse {
    entities: autosuggestionEntity[]
    resultSize: number
}
