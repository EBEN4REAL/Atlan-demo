// server
export const SavedQueryAttributes = [
    'connectionLastSyncedJob',
    'qualifiedName',
    'connectionName',
    'isDiscoverable',
    'alias',
    'rawQuery',
    'compiledQuery',
    'connectionId',
    'isPrivate',
    'variablesSchemaBase64',
    'isSnippet',
]

export const InternalAttributes = [
    '__timestamp',
    '__modificationTimestamp',
    '__modifiedBy',
    '__createdBy',
    '__state',
    '__guid',
    '__historicalGuids',
    '__classificationsText',
    '__classificationNames',
    '__propagatedClassificationNames',
    '__customAttributes',
    '__labels',
    'anchor',
]

export const AssetAttributes = [
    'name',
    'displayName',
    'description',
    'displayDescription',
    'userDescription',
    'certificateStatus',
    'certificateUpdatedAt',
    'certificateUpdatedBy',
    'certificateStatusMessage',
    'announcementMessage',
    'announcementTitle',
    'announcementType',
    'announcementUpdatedAt',
    'announcementUpdatedBy',
    'connectorName',
    'connectionName',
    'connectionQualifiedName',
    'sourceCreatedBy',
    'sourceCreatedAt',
    'sourceUpdatedAt',
    'sourceUpdatedBy',
    'ownerUsers',
    'ownerGroups',
    'meanings',
    'readme',
    'links',
    'link',
]

export const SQLAttributes = [
    'rowCount',
    'columnCount',
    'sizeBytes',
    'schemaName',
    'tableName',
    'viewName',
    'databaseName',
    'dataType',
    'definition',
    'isPrimary',
    'order',
    'isPartition',
    'isSort',
    'isIndexed',
    'isForeign',
    'isDist',
]

export const GlossaryRelationAttributes = ['name']

export const AssetRelationAttributes = [
    'certificateStatus',
    'readme',
    'displayText',
    'name',
    'description',
    'shortDescription',
    'link',
]

export const DefaultRelationAttributes = []

export const BasicSearchAttributes = [
    '__timestamp',
    '__modificationTimestamp',
    '__modifiedBy',
    '__createdBy',
    '__state',
    '__guid',
    '__historicalGuids',
    '__classificationsText',
    '__classificationNames',
    '__propagatedClassificationNames',
    '__customAttributes',
    '__labels',
    'name',
    'displayName',
    'description',
    'displayDescription',
    'userDescription',
    'tenantId',
    'certificateStatus',
    'certificateStatusMessage',
    'certificateUpdatedAt',
    'certificateUpdatedBy',
    'assetStatusMessage',
    'announcementMessage',
    'announcementTitle',
    'announcementType',
    'announcementUpdatedAt',
    'announcementUpdatedBy',
    'connectionLastSyncedAt',
    'connectionQualifiedName',
    'rowCount',
    'columnCount',
    'sizeBytes',
    'subType',
    'image',
    'sourceRefreshFrequency',
    'sourceCreatedBy',
    'sourceCreatedAt',
    'sourceUpdatedAt',
    'sourceUpdatedBy',
    'databaseCount',
    'databaseCrawledCount',
    'schemaCount',
    'schemaCrawledCount',
    'tableCount',
    'tableCrawledCount',
    'dataType',
    'table',
    'tableName',
    'viewName',
    'lastUpdatedByJob',
    'category',
    'host',
    'botQualifiedName',
    'schemaName',
    'databaseName',
    'logo',
    'viewDefinition',
    'popularityScore',
    'readers',
    'sourceViewCount',
    'integrationCredentialQualifiedName',
    'connectionName',
    'ownerUsers',
    'ownerGroups',
    'databaseQualifiedName',
    'isPrimary',
    'isPartition',
    'readme',
    'parent',
]

export const ConnectionAttriibutes = [...InternalAttributes, ...AssetAttributes]
