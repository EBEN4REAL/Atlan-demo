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
        connectorName: string
        integrationName: string
        meanings: { displayText: string }[]
        name: string
        displayName: string
        popularityScore: number
        isPrimary: boolean
        compiledQuery: string
        qualifiedName: string
        userDescription: string
        rowCount: number
        schemaName: string
        sourceUpdatedAt: string
        tenantId: string
        viewDefinition: string
        announcementMessage: string
        announcementTitle: string
        announcementType: string
        announcementUpdatedAt: number
        announcementUpdatedBy: string

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
        isPublished?: boolean
        isTopLevelProject?: boolean
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
    entityGuid: string
    qualifiedName: string
}
