import { classificationInterface } from '~/types/classifications/classification.interface'

export interface assetInterface {
    attributes: {
        certificateStatus?: string
        assetStatusMessage: string
        certificateUpdatedBy: string
        ownerUsers: string
        ownerGroups: string
        certificateUpdatedAt: number
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
        isPrimary: boolean
        qualifiedName: string
        userDescription: string
        rowCount: number
        schemaName: string
        sourceUpdatedAt: string
        tenantId: string
        viewDefinition: string
        banner?: {
            message: string
            username: string
            timestamp: number
        }
        bannerMessage: string
        bannerUpdatedAt: number
        bannerUpdatedBy: string

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
