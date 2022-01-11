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
        rowLimit: number
        allowQuery: boolean
        allowQueryPreview: boolean
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
        reportCount: number
        dashboardCount: number
        datasetCount: number
        dataflowCount: number
        tileCount: number
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
        queries?: {
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
        externalLocation: string
        externalLocationFormat: string
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
