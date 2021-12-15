import { classificationInterface } from '~/types/classifications/classification.interface'

export interface assetInterface {
    attributes: {
        certificateStatus?: string
        certificateUpdatedBy: string
        certificateStatusMessage: string
        ownerUsers: string[]
        ownerGroups: string[]
        viewerUsers: string[]
        viewerGroups: string[]
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
        viewName: string
        tableName: string
        description: string
        connectorName: string
        integrationName: string
        meanings: { displayText: string }[]
        name: string
        displayName: string
        popularityScore: number
        isPrimary: boolean
        isPartition: boolean
        isDist: boolean
        isForeign: boolean
        compiledQuery: string
        rawQuery: string
        qualifiedName: string
        userDescription: string
        rowCount: number
        schemaName: string
        sourceUpdatedBy: string
        sourceCreatedBy: string
        sourceCreatedAt: any
        sourceUpdatedAt: any
        tenantId: string
        definition: string
        announcementMessage: string
        announcementTitle: string
        announcementType: string
        announcementUpdatedAt: number
        announcementUpdatedBy: string
        link: string
        table?: {
            guid: string
            typeName: string
            uniqueAttributes: {
                qualifiedName: string
            }
        }
        links?: {
            guid: string
            typeName: string
            uniqueAttributes: {
                qualifiedName: string
            }
            attributes: {
                name: string
                link: string
            }
        }[]
        readme?: {
            guid: string
            typeName: string
            uniqueAttributes: {
                qualifiedName: string
            }
            attributes: {
                description: string
                name: string
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
    categoryCount: number
    termsCount: number
    scrubbed: boolean
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
