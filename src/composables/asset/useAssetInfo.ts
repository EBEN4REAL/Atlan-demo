import { assetInterface } from '~/types/assets/asset.interface'
import { SourceList } from '~/constant/source'
import { AssetTypeList } from '~/constant/assetType'
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
    const schemaName = (asset: assetInterface) => {
        return attributes(asset).schemaName
    }
    const databaseName = (asset: assetInterface) => {
        return attributes(asset).databaseName
    }
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
        databaseLogo,
        schemaLogo,
        databaseName,
        schemaName,
        attributes,
        title,
        status,
        assetType,
        description,
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
