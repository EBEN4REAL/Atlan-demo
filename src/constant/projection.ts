// server

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

export const ConnectionAttriibutes = [...InternalAttributes, ...AssetAttributes]
