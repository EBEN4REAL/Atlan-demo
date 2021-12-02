export interface ClassificationInterface {
    guid: string
    name: string
    displayName: string
    category?: string
    createdBy: string
    updatedBy: string
    createTime: Date
    updateTime: Date
    description?: string
    attributeDefs: Array<any>
    typeName: string
    isAutoClassification: boolean
    propagate: boolean
    entityTypes: Array<any>
    entityGuid: string
    subTypes: Array<any>
    superTypes: Array<any>
    typeVersion: string
    version: number
    propagatedBy: string
    options: Record<string, any>
}
