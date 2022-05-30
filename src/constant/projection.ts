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
    'parentQualifiedName',
    'collectionQualifiedName',
    'visualBuilderSchemaBase64',
    'isVisualQuery',
]

export const InternalAttributes = [
    '__timestamp',
    '__modificationTimestamp',
    '__modifiedBy',
    '__createdBy',
    '__state',
    '__guid',
    '__historicalGuids',
    '__classificationNames',
    '__propagatedClassificationNames',
    '__customAttributes',
    '__labels',
    '__businessAttributes',
    'anchor',
]

export const AssetAttributes = [
    'name',
    'displayName',
    'apiName',
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
    'defaultSchemaQualifiedName',
    'defaultDatabaseQualifiedName',
    'sourceURL',
    'sourceCreatedBy',
    'sourceCreatedAt',
    'sourceUpdatedAt',
    'sourceUpdatedBy',
    'ownerUsers',
    'ownerGroups',
    'adminUsers',
    'adminGroups',
    'viewerGroups',
    'viewerUsers',
    'meanings',
    'rawQuery',
    'compiledQuery',
    'links',
    'link',
    'webUrl',
    'category',
    'lastSyncRun',
    'lastSyncRunAt',
    'lastSyncWorkflowName',
    'queryConfig',
    'rowLimit',
    'credentialStrategy',
    'allowQuery',
    'allowQueryPreview',
    'parentQualifiedName',
    'collectionQualifiedName',
    'parent',
    'readme',
    'externalLocation',
    'externalLocationFormat',
    'sql',
    'sourceDefinition',
    'sourceOwners',
    'noteText',
    'subtitleText',
    'resultMakerID',
    'sourceMetadataId',
    'sourceContentMetadataId',
    'sourceViewCount',
    'sourceChildCount',
    'folderName',
    'modelName',
    'projectName',
    'folder',
    'model',
    'workspace',
    'dashboard',
    'dataset',
    'datasource',
    'workbook',
    'site',
    'project',
    'report',
    'organization',
    'object',
    'reportCount',
    'dashboardCount',
    'datasetCount',
    'dataflowCount',
    'tileCount',
    'pageCount',
    'sourceId',
    'fieldCount',
    'objectQualifiedName',
    'dashboardType',
    'reportType',
    'detailColumns',
    'isCustom',
    'inlineHelpText',
    'picklistValues',
    'formula',
    'isPublished',
    'process',
    'bucket',
    's3ObjectCount',
    's3BucketVersioningEnabled',
    's3ObjectLastModifiedTime',
    's3BucketName',
    's3ObjectSize',
    's3ObjectStorageClass',
    's3ObjectKey',
    's3ObjectContentType',
    'awsArn',
    'awsPartition',
    'awsRegion',
    'awsAccountId',
    'awsResourceId',
    'awsOwnerName',
    'awsTags',
    's3ObjectVersionId',
]

export const SQLAttributes = [
    'rowCount',
    'columnCount',
    'sizeBytes',
    'schemaName',
    'tableName',
    'viewName',
    'databaseName',
    'databaseQualifiedName',
    'schemaQualifiedName',
    'dataType',
    'definition',
    'isPrimary',
    'order',
    'isPartition',
    'isSort',
    'isIndexed',
    'isForeign',
    'isDist',
    'table',
    'view',
    'tablePartition',
    'materialisedView',
    'database',
    'atlanSchema',
    'tableCount',
    'viewsCount',
]

export const GlossaryAttributes = [
    'categories',
    'parentCategory',
    'assignedEntities',
    'seeAlso',
]

export const GlossaryRelationAttributes = ['name']

export const AssetRelationAttributes = [
    'certificateStatus',
    'displayText',
    'name',
    'shortDescription',
    'link',
    'qualifiedName',
    '__state',
    '__timestamp',
    '__modificationTimestamp',
    '__modifiedBy',
    '__createdBy',
]

export const DefaultRelationAttributes = [
    'name',
    'qualifiedName',
    'certificateStatus',
]

// For just asset list display
export const MinimalAttributes = [
    'name',
    'displayName',
    'description',
    'displayDescription',
    'userDescription',
    'certificateStatus',
    'certificateUpdatedBy',
    'connectorName',
    'connectionName',
    'connectionQualifiedName',
    'defaultSchemaQualifiedName',
    'defaultDatabaseQualifiedName',
    'meanings',
    'category',
    'parentQualifiedName',
    'collectionQualifiedName',
    'parent',
    'sourceViewCount',
    'sourceChildCount',
    'folderName',
    'modelName',
    'projectName',
    'folder',
    'model',
    'workspace',
    'dashboard',
    'dataset',
    'datasource',
    'workbook',
    'site',
    'project',
    'report',
    'organization',
    'object',
    'reportCount',
    'dashboardCount',
    'datasetCount',
    'dataflowCount',
    'tileCount',
    'pageCount',
    'categories',
    'anchor',
    'parentCategory',
    'rowCount',
    'columnCount',
    'sizeBytes',
    'schemaName',
    'tableName',
    'viewName',
    'databaseName',
    'databaseQualifiedName',
    'schemaQualifiedName',
    'dataType',
    'definition',
    'isPrimary',
    'table',
    'view',
    'tablePartition',
    'materialisedView',
    'database',
    'tableCount',
    'viewsCount',
    'fieldCount',
    'isCustom',
    'isPartition',
    'isSort',
    'isIndexed',
    'isForeign',
    'isDist',
    'order',
    'isPublished',
    'process',
    'bucket',
    's3ObjectCount',
    's3BucketName',
]

export const BasicSearchAttributes = [
    '__timestamp',
    '__modificationTimestamp',
    '__modifiedBy',
    '__createdBy',
    '__state',
    '__guid',
    '__historicalGuids',
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
    'parent',
]

export const LineageAttributes = [
    // General
    'qualifiedName',
    'certificateStatus',
    'announcementType',
    'name',
    // SQL - For when a column assets appears top level
    'table',
    'view',
]

export const LineageAttributesPortLevel = [
    // General
    'qualifiedName',
    'certificateStatus',
    'announcementType',
    'dataType',
    'isPrimary',
    'isForeign',
    // SQL
    'table',
    'view',
]

export const ConnectionAttriibutes = [...InternalAttributes, ...AssetAttributes]
