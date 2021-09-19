import { Ref } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'
import { SourceList } from '~/constant/source'
import { AssetTypeList } from '~/constant/assetType'
import { useTimeAgo } from '@vueuse/core'
import { dataTypeList } from '~/constant/datatype'
import { getCountString,getSizeString } from '~/composables/asset/useFormat'

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
            (src) => src.id === attributes(asset)?.integrationName
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
    const sizeBytes = (asset: assetInterface, raw: boolean = false) => {

        console.log(attributes(asset)?.sizeBytes);
        return raw
            ? attributes(asset)?.sizeBytes?.toLocaleString() || 'N/A'
            : getSizeString(attributes(asset).sizeBytes)
    }

    const sourceUpdatedAt = (asset: assetInterface) => {
        return useTimeAgo(attributes(asset)?.sourceUpdatedAt).value
    }
    

    const schemaName = (asset: assetInterface) => {
        return attributes(asset)?.schemaName
    }
    const databaseName = (asset: assetInterface) => {
        return attributes(asset)?.databaseName
    }
    const createdAt = (asset: assetInterface) => {
        return useTimeAgo(attributes(asset)?.__timestamp).value
    }
    const createdBy = (asset: assetInterface) => {
        return attributes(asset)?.__createdBy
    }
    const modifiedBy = (asset: assetInterface) => {
        return attributes(asset)?.__modifiedBy
    }
    const updatedAt = (asset: assetInterface) => {
        return useTimeAgo(attributes(asset)?.__modificationTimestamp).value
    }
    const previewURL = (asset: assetInterface) => {
        const customAttributes = JSON.parse(attributes(asset).__customAttributes.split())
        if (customAttributes.previewURL)
            return customAttributes.previewURL
        return null
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
                    guid: asset.guid,
                    qualifiedName: attributes(asset)[f.qualifiedNameAttribute],
                    value: attributes(asset)[f.nameAttribute],
                })
            })
        }

        return relations
    }
    const getTableauHierarchy = (asset: assetInterface) => {
        let filteredHierarchy = []
        let hierarchyKeys = [
            {
                id: 'connectionName',
                label: 'Server',
                value: '',
                icon: 'connectionName',
            },
            { id: 'siteName', label: 'Site', value: '', icon: 'SiteName' },
        ]

        /* project */
        const TableauProject: any = []
        // inserting projects if project is nested or not
        const projectHierarchy = attributes(asset)?.projectHierarchy
            ? [...attributes(asset)?.projectHierarchy]
            : []
        projectHierarchy.push({
            id: 'tableauProject',
            label: 'Project',
            value: attributes(asset)?.projectName,
            icon: 'TableauProject',
        })
        const firstProject = projectHierarchy.shift()
        TableauProject.push({
            ...firstProject,
            icon: 'TableauProject',
            label: 'Project',
            subProjects: projectHierarchy,
        })

        /* -----------------------------*/

        const TableauWorkbook = [
            {
                id: 'tableauWorkbook',
                label: 'Workbook',
                value: attributes(asset)['name'],
                icon: 'TableauWorkbook',
            },
        ]
        const TableauWorksheet = [
            {
                id: 'tableauWorkbook',
                label: 'Workbook',
                value: attributes(asset)['workbookName'],
                icon: 'TableauWorkbook',
            },
            {
                id: 'tableauWorksheet',
                label: 'Worksheet',
                value: attributes(asset)['name'],
                icon: 'TableauWorksheet',
            },
        ]
        const TableauDashboard = [
            {
                id: 'tableauWorkbook',
                label: 'Workbook',
                value: attributes(asset)['workbookName'],
                icon: 'TableauWorkbook',
            },
            {
                id: 'TableauDashboard',
                label: 'Dashboard',
                value: attributes(asset)['name'],
                icon: 'TableauDashboard',
            },
        ]
        const TableauEmbeddedDatasource = [
            {
                id: 'tableauWorkbook',
                label: 'Workbook',
                value: attributes(asset)['workbookName'],
                icon: 'TableauWorkbook',
            },
            {
                id: 'tableauEmbeddedDatasource',
                label: 'Embedded Datasource',
                value: attributes(asset)['name'],
                icon: 'TableauEmbeddedDatasource',
            },
        ]
        const TableauPublishedDatasource = [
            {
                id: 'tableauWorkbook',
                label: 'Workbook',
                value: attributes(asset)['workbookName'],
                icon: 'TableauWorkbook',
            },
            {
                id: 'tableauPublishedDatasource',
                label: 'Published Datasource',
                value: attributes(asset)['name'],
                icon: 'TableauPublishedDatasource',
            },
        ]
        const TableauDatasourceField = [
            {
                id: 'tableauWorkbook',
                label: 'Workbook',
                value: attributes(asset)['workbookName'],
                icon: 'TableauWorkbook',
            },
            attributes(asset)['isPublished']
                ? {
                    id: 'tableauPublishedDatasource',
                    label: 'Published Datasource',
                    value: attributes(asset)['datasourceName'],
                    icon: 'TableauPublishedDatasource',
                }
                : {
                    id: 'tableauEmbeddedDatasource',
                    label: 'Embedded Datasource',
                    value: attributes(asset)['datasourceName'],
                    icon: 'TableauEmbeddedDatasource',
                },
            {
                id: 'tableauDatasourceField',
                label: 'Tableau DatasourceField',
                value: attributes(asset)['name'],
                icon: 'TableauDatasourceField',
            },
        ]

        hierarchyKeys.forEach((item) => {
            // console.log(attributes(asset),item.id)
            filteredHierarchy.push({
                id: item.id,
                label: item.label,
                icon: item.icon,
                value: attributes(asset)[item.id] ?? attributes(asset)['name'],
            })
        })
        switch (asset.typeName) {
            case 'TableauSite': {
                filteredHierarchy = [
                    {
                        id: 'connectionName',
                        label: 'Server',
                        value: attributes(asset)['connectionName'],
                        icon: 'connectionName',
                    },
                    {
                        id: 'siteName',
                        label: 'Site',
                        value: attributes(asset)['name'],
                        icon: 'SiteName',
                    },
                ]
                break
            }
            case 'TableauProject': {
                filteredHierarchy = [
                    {
                        id: 'connectionName',
                        label: 'Server',
                        value: attributes(asset)['connectionName'],
                        icon: 'connectionName',
                    },
                    {
                        id: 'siteName',
                        label: 'Site',
                        value: attributes(asset)['siteName'],
                        icon: 'SiteName',
                    },
                    {
                        id: 'tableauProject',
                        label: 'Project',
                        value: attributes(asset)['name'],
                        icon: 'TableauProject',
                    },
                ]
                break
            }

            case 'TableauWorkbook': {
                filteredHierarchy = [...filteredHierarchy, ...TableauProject]
                filteredHierarchy = [...filteredHierarchy, ...TableauWorkbook]
                break
            }
            case 'TableauWorksheet': {
                filteredHierarchy = [...filteredHierarchy, ...TableauProject]
                filteredHierarchy = [...filteredHierarchy, ...TableauWorksheet]
                break
            }
            case 'TableauDashboard': {
                filteredHierarchy = [...filteredHierarchy, ...TableauProject]
                filteredHierarchy = [...filteredHierarchy, ...TableauDashboard]
                break
            }
            case 'TableauDatasourceField': {
                filteredHierarchy = [...filteredHierarchy, ...TableauProject]
                filteredHierarchy = [
                    ...filteredHierarchy,
                    ...TableauDatasourceField,
                ]
                break
            }
            case 'TableauDatasource': {
                // isPublished - true (published datasoruce) or vice versa
                if (attributes(asset)['isPublished']) {
                    filteredHierarchy = [
                        ...filteredHierarchy,
                        ...TableauProject,
                    ]
                    filteredHierarchy = [
                        ...filteredHierarchy,
                        ...TableauPublishedDatasource,
                    ]
                } else {
                    filteredHierarchy = [
                        ...filteredHierarchy,
                        ...TableauProject,
                    ]
                    filteredHierarchy = [
                        ...filteredHierarchy,
                        ...TableauEmbeddedDatasource,
                    ]
                }
                break
            }
        }
        return filteredHierarchy.filter((item) => item.value !== undefined)
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
        sizeBytes,
        createdAt,
        updatedAt,
        sourceUpdatedAt,
        lastCrawled,
        tableInfo,
        ownerGroups,
        ownerUsers,
        assetStatus,
        getHierarchy,
        getTableauProperties,
        getTableauHierarchy,
        previewURL,
    }
}
