export const SavedQueryAttributes = [
    'certificateUpdatedBy',
    'popularityScore',
    'assetStatusMessage',
    'connectionLastSyncedJob',
    'qualifiedName',
    'name',
    'connectionName',
    'certificateStatus',
    'ownerUsers',
    'connectionQualifiedName',
    'displayName',
    'description',
    'ownerGroups',
    'isDiscoverable',
    'alias',
    'owner',
    'certificateUpdatedAt',
    'rawQuery',
    'compiledQuery',
    'connectionId',
    'isPrivate',
    'isSnippet',
]
export const ConnectionAttributes = [
    'allowPreview',
    'allowQuery',
    'botQualifiedName',
    'botVersion',
    'category',
    'description',
    'host',
    'extra',
    'port',
    'ownerUsers',
    'ownerGroups',
    'displayName',
    'connectorName',
    'integrationCredentialQualifiedName',
]

// server property is not there for Site in atlas
export const tableauAttributes = [
    'siteName',
    'siteQualifiedName',
    'projectName',
    'projectQualifiedName',
    'topLevelProjectName',
    'topLevelProjectQualifiedName',
    'projectHierarchy',
    'workbookName',
    'workbookQualifiedName',
    'isTopLevelProject',
    'tags',
    'inputFields',
    'outputFields',
    'outputSteps',
    'datasourceName',
    'datasourceQualifiedName',
    'isDatasourcePublished',
    'tableauFullyQualifiedName',
    'upstreamTables',
    'upstreamColumns',
    'upstreamFields',
    'upstreamDatasources',
    'isPublished',
    'hasExtracts',
    'isCertified',
    'certifier',
    'certificationNote',
    'certifierDisplayName',
    'dataCategory',
    'role',
    'dataType',
    'formula',
]

export const CredentialAttributes = ['authType', 'extra']

export const BaseAttributes = [
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
]

export const GlossaryAttributes = []

export const BotsAttributes = [
    'category',
    'config',
    'description',
    'marketplaceLink',
    'name',
    'subCategory',
    'supportLink',
    'templateName',
    'version',
    'logo',
    'isSample',
]

export const JobsAttributes = [
    'arguments',
    'botQualifiedName',
    'connectionQualifiedName',
    'cronString',
    'isCron',
    'isEvent',
    'isIncomplete',
]

export const ColumnAttributes = [
    'dataType',
    'tableQualifiedName',
    'isPrimary',
    'isClustered',
    'isPartition',
    'isForeign',
    'isIndexed',
    'table',
    'view',
]

export const SavedSearchAttribute = [
    'ownerName',
    'searchType',
    'uniqueName',
    'searchParameters',
    'uiParameters',
]

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
    'certificateUpdatedAt',
    'certificateUpdatedBy',
    'assetStatusMessage',
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
]
