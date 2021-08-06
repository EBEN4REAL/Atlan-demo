import { assetInterface } from '~/types/assets/asset.interface'
import { SourceList } from '~/constant/source'
import { AssetTypeList } from '~/constant/assetType'
<<<<<<< HEAD
=======
import { dataTypeList } from '~/constant/datatype'
>>>>>>> development
import { useTimeAgo } from '@vueuse/core'

export default function useAssetInfo() {
    const attributes = (asset: assetInterface) => {
        return asset.attributes
    }
    const title = (asset: assetInterface) => {
        return attributes(asset).name
    }
    const status = (asset: assetInterface) => {
        return attributes(asset).assetStatus
    }
    const assetType = (asset: assetInterface) => {
        return asset.typeName
    }
    const assetTypeLabel = (asset: assetInterface) => {
        const found = AssetTypeList.find((d) => d.id === assetType(asset))
        return found?.label
    }
    const description = (asset: assetInterface) => {
        return (
            attributes(asset).userDescription || attributes(asset).description
        )
    }

    const logo = (asset: assetInterface) => {
        let img = ''
        const found = SourceList.find(
            (src) => src.id === attributes(asset).integrationName
        )
        if (found) img = found.image

        return img
    }
<<<<<<< HEAD
    const databaseLogo = (asset: assetInterface) => {
        let img = ''
        const found = SourceList.find(
            (src) => src.id === attributes(asset).integrationName
        )
        if (found) {
            const database = found.hierarchy.find(
                (src) => src.typeName === 'Database'
            )
            if (database?.image) img = database?.image
        }
        return img
    }
    const schemaLogo = (asset: assetInterface) => {
        let img = ''
        const found = SourceList.find(
            (src) => src.id === attributes(asset).integrationName
        )
        if (found) {
            const schema = found.hierarchy.find(
                (src) => src.typeName === 'Schema'
            )
            if (schema?.image) img = schema?.image
        }
        return img
=======

    const dataType = (asset: assetInterface) => {
        return attributes(asset)?.dataType
    }

    const dataTypeImage = (asset: assetInterface) => {
        const found = dataTypeList.find((d) =>
            d.type.find(
                (type) => type.toLowerCase() === dataType(asset).toLowerCase()
            )
        )
        return found?.image
>>>>>>> development
    }

    const integrationName = (asset: assetInterface) => {
        const name = attributes(asset).integrationName
        return name.charAt(0).toUpperCase() + name.slice(1)
    }

    const rowCount = (asset: assetInterface) => {
        return attributes(asset).rowCount
    }
    const columnCount = (asset: assetInterface) => {
        return attributes(asset).columnCount
    }
<<<<<<< HEAD
    const schemaName = (asset: assetInterface) => {
        return attributes(asset).schemaName
    }
    const databaseName = (asset: assetInterface) => {
        return attributes(asset).databaseName
    }
=======
>>>>>>> development
    const createdAt = (asset: assetInterface) => {
        return useTimeAgo(attributes(asset).__timestamp).value
    }
    const updatedAt = (asset: assetInterface) => {
        return useTimeAgo(attributes(asset).__modificationTimestamp).value
    }

    const lastCrawled = (asset: assetInterface) => {
        return useTimeAgo(attributes(asset).connectionLastSyncedAt).value
    }

    return {
<<<<<<< HEAD
        databaseLogo,
        schemaLogo,
        databaseName,
        schemaName,
=======
>>>>>>> development
        attributes,
        title,
        status,
        assetType,
        description,
<<<<<<< HEAD
=======
        dataType,
        dataTypeImage,
>>>>>>> development
        logo,
        integrationName,
        assetTypeLabel,
        rowCount,
        columnCount,
        createdAt,
        updatedAt,
        lastCrawled,
    }
}
