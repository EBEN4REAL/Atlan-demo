import { classificationInterface } from '~/types/classifications/classification.interface'

export interface assetInterface {
    attributes: {
        assetStatus?: string
        assetStatusMessage: string
        assetStatusUpdatedBy: string
        ownerUsers: string
        ownerGroups: string
        assetStatusUpdatedAt: number
        columnCount: number
        connectionLastSyncedAt: number
        connectionName: string
        connectionQualifiedName: string
        dataType: string
        databaseName: string
        databaseQualifiedName: string
        description: string
        integrationName: string
        meanings: { displayText: string }[]
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
        __timestamp: number
        __modifiedBy: string
        __state: string
    }
    classificationNames: string[]
    classifications: classificationInterface[]
    displayText: string
    guid: string
    isIncomplete: false
    labels: string[]
    meaningNames: string[]
    meanings: { displayText: string }[]
    status: string
    typeName?: string
}
