import {
    InternalAttributes,
    SQLAttributes,
    AssetRelationAttributes,
    AssetAttributes,
} from '~/constant/projection'

export const attributes = [
    ...InternalAttributes,
    ...AssetAttributes,
    ...SQLAttributes,
]

// AssetRelationAttributes
// AssetAttributes
