import {
    InternalAttributes,
    BasicSearchAttributes,
} from '~/constant/projection'

export const attributes = [
    'name',
    'displayName',
    'dataType',
    'isPrimary',
    'isForeign',
    'isPartition',
    'name',
    'displayName',
    'typeName',
    'dataType',
    'description',
    'userDescription',
    'certificateStatus',
    'ownerUsers',
    'ownerGroups',
    'classifications',
    'tableCount',
    'viewCount',
    'columnCount',
    'connectorName',
    ...InternalAttributes,
    ...BasicSearchAttributes,
]
