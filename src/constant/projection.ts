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
]

export const SQLAttributes = [
    'rowCount',
    'columnCount',
    'sizeBytes',
    'schemaName',
    'databaseName',
    'dataType',
    'definition',
]

export const AssetRelationAttributes = ['certificateStatus']

export const ConnectionAttriibutes = [...InternalAttributes, ...AssetAttributes]
