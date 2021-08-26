import { Ref } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'
import { SourceList } from '~/constant/source'
import { AssetTypeList } from '~/constant/assetType'
import { useTimeAgo } from '@vueuse/core'
import { dataTypeList } from '~/constant/datatype'
import { getCountString } from '~/composables/asset/useFormat'

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

    const rowCount = (asset: assetInterface, raw: boolean = false) => {
        return raw
            ? attributes(asset)?.rowCount?.toLocaleString() || 'N/A'
            : getCountString(attributes(asset).rowCount)
    }
    const columnCount = (asset: assetInterface, raw: boolean = false) => {
        return raw
            ? attributes(asset)?.columnCount?.toLocaleString() || 'N/A'
            : getCountString(attributes(asset).columnCount)
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
    const createdBy = (asset: assetInterface) => {
        return attributes(asset).__createdBy
    }
    const modifiedBy = (asset: assetInterface) => {
        return attributes(asset).__modifiedBy
    }
    const updatedAt = (asset: assetInterface) => {
        return useTimeAgo(attributes(asset).__modificationTimestamp).value
    }

    const lastCrawled = (asset: assetInterface) => {
        return useTimeAgo(attributes(asset).connectionLastSyncedAt).value
    }

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
    }

    const tableInfo = (asset: assetInterface) => {
        return attributes(asset)?.table
    }
    const popularityScore = (asset: assetInterface) => {
        return attributes(asset)?.popularityScore
    }

    const ownerGroups = (asset: assetInterface) => {
        return attributes(asset)?.ownerGroups?.split(',') || []
    }

    const ownerUsers = (asset: assetInterface) => {
        return attributes(asset)?.ownerUsers?.split(',') || []
    }

    const assetStatus = (asset: assetInterface) => {
        attributes(asset)?.assetStatus
    }

    const getHierarchy = (asset: assetInterface) => {
        const assetType = AssetTypeList.find((a) => a.id == asset.typeName)
        const relations: any[] = []

        if (assetType) {
            const filtered = AssetTypeList.filter((a) =>
                assetType.parents?.includes(a.id)
            )

            filtered.forEach((f) => {
                relations.push({
                    ...f,
                    qualifiedName: attributes(asset)[f.qualifiedNameAttribute],
                    value: attributes(asset)[f.nameAttribute],
                })
            })
        }

        return relations
    }

    const getTableauProperties = (
        asset: Ref<assetInterface> | undefined,
        properties: any
    ) => {
        const data: any = []
        console.log(properties, 'properties')
        if (asset.value && properties.length > 0) {
            properties.forEach((tableauProperty: any) => {
                const { label, property } = tableauProperty
                if (attributes(asset.value)[property]) {
                    const temp = {}
                    temp.id = property
                    temp.label = label
                    temp[property] = attributes(asset.value)[property]
                    if (property === '__timestamp')
                        temp[property] = createdAt(asset.value)
                    else if (property === '__modificationTimestamp')
                        temp[property] = updatedAt(asset.value)
                    data.push(temp)
                }
            })
        }
        return data
    }

    return {
        popularityScore,
        createdBy,
        modifiedBy,
        databaseLogo,
        schemaLogo,
        databaseName,
        schemaName,
        attributes,
        title,
        status,
        assetType,
        dataType,
        dataTypeImage,
        description,
        logo,
        integrationName,
        assetTypeLabel,
        rowCount,
        columnCount,
        createdAt,
        updatedAt,
        lastCrawled,
        tableInfo,
        ownerGroups,
        ownerUsers,
        assetStatus,
        getHierarchy,
        getTableauProperties,
    }
}
