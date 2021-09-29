import { classificationInterface } from '~/types/classifications/classification.interface'

export interface assetInterface {
    attributes: {
        assetStatus?: string
        assetStatusMessage: string
        assetStatusUpdatedBy: string
        ownerUsers: string
        ownerGroups: string
        assetStatusUpdatedAt: number
        order: number
        columnCount: number
        sizeBytes: number
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
        displayName: string
        popularityScore: number
        qualifiedName: string
        userDescription: string
        rowCount: number
        schemaName: string
        sourceUpdatedAt: string
        tenantId: string
        viewDefinition: string
        table?: {
            guid: string
            typeName: string
            uniqueAttributes: {
                qualifiedName: string
            }
        }
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
    typeName: string
    qualifiedName: string
}
