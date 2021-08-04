export interface assetInterface {
    attributes: {
        assetStatus?: string
        assetStatusUpdatedAt: number
        columnCount: number
        connectionLastSyncedAt: number
        connectionName: string
        connectionQualifiedName: string
        databaseName: string
        databaseQualifiedName: string
        description: string
        integrationName: string
        meanings: string[]
        name: string
        popularityScore: number
        qualifiedName: string
        rowCount: number
        schemaName: string
        sourceUpdatedAt: number
        tenantId: string
        viewDefinition: string
        __createdBy: string
        __customAttributes: string
        __guid: string
        __modificationTimestamp: number
        __modifiedBy: string
        __state: string
    }
    classificationNames: string[]
    displayText: string
    guid: string
    isIncomplete: false
    labels: string[]
    meaningNames: string[]
    meanings: string[]
    status: string
    typeName?: string
}
