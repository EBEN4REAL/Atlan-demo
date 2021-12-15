import { Ref } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { assetInterface } from '~/types/assets/asset.interface'
import { SourceList } from '~/constant/source'
import { assetTypeList } from '~/constant/assetType'
import { dataTypeCategoryList } from '~/constant/dataType'

import { formatDateTime } from '~/utils/date'

import { getCountString, getSizeString } from './useFormat'
import useConnectionData from '../connection/useConnectionData'

export default function useAssetInfo() {
    const { getConnection } = useConnectionData()

    const attributes = (asset: assetInterface) => asset?.attributes
    const title = (asset: assetInterface) => attributes(asset)?.name ?? ''
    const status = (asset: assetInterface) =>
        attributes(asset)?.certificateStatus
    const assetType = (asset: assetInterface) => asset?.typeName
    const assetState = (asset: assetInterface) => asset?.status?.toLowerCase()
    const assetTypeLabel = (asset: assetInterface) => {
        const found = assetTypeList.find((d) => d.id === assetType(asset))
        return found?.label
    }
    const description = (asset: assetInterface) =>
        attributes(asset).userDescription || attributes(asset).description
    const isPrimary = (asset: assetInterface) => attributes(asset)?.isPrimary

    const logo = (asset: assetInterface) => {
        let img = ''

        const found = attributes(asset)?.integrationName
            ? SourceList.find(
                  (src) => src.id === attributes(asset)?.integrationName
              )
            : SourceList.find(
                  (src) =>
                      src.id === attributes(asset)?.qualifiedName?.split('/')[1]
              )

        if (found) img = found.image

        return img
    }
    const databaseLogo = (asset: assetInterface) => {
        let img = ''
        const found = SourceList.find(
            (src) => src.id === attributes(asset)?.integrationName
        )
        if (found) {
            const database = found?.hierarchy.find(
                (src) => src.typeName === 'Database'
            )
            if (database?.image) img = database?.image
        }
        return img
    }
    const schemaLogo = (asset: assetInterface) => {
        let img = ''
        const found = SourceList.find(
            (src) => src.id === attributes(asset)?.integrationName
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
        const name = attributes(asset)?.integrationName
        return name.charAt(0).toUpperCase() + name.slice(1)
    }

    const rowCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? attributes(asset)?.rowCount?.toLocaleString() || 'N/A'
            : getCountString(attributes(asset).rowCount)
    const getConnectorsNameFromQualifiedName = (qualifiedName: string) => {
        let connectorsName: undefined | string = undefined
        const values = qualifiedName?.split('/')
        if (values?.length > 1) {
            connectorsName = values[1]
        }
        return connectorsName
    }
    const getConnectorName = (attributes: any) => {
        return (
            attributes?.connectorName ??
            getConnectorsNameFromQualifiedName(attributes?.qualifiedName)
        )
    }

    const columnCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? attributes(asset)?.columnCount?.toLocaleString() || 'N/A'
            : getCountString(attributes(asset).columnCount)
    const sizeBytes = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? attributes(asset)?.sizeBytes?.toLocaleString() || 'N/A'
            : getSizeString(attributes(asset).sizeBytes)

    const sourceUpdatedAt = (asset: assetInterface, raw: boolean = false) => {
        if (attributes(asset)?.sourceUpdatedAt) {
            return raw
                ? formatDateTime(attributes(asset)?.sourceUpdatedAt) || 'N/A'
                : useTimeAgo(attributes(asset)?.sourceUpdatedAt).value
        }
        return ''
    }
    const sourceCreatedAt = (asset: assetInterface, raw: boolean = false) => {
        if (attributes(asset)?.sourceCreatedAt) {
            return raw
                ? formatDateTime(attributes(asset)?.sourceCreatedAt) || 'N/A'
                : useTimeAgo(attributes(asset)?.sourceCreatedAt).value
        }
        return ''
    }

    const sourceUpdatedBy = (asset: assetInterface) =>
        attributes(asset)?.sourceUpdatedBy || ''

    const sourceCreatedBy = (asset: assetInterface) =>
        attributes(asset)?.sourceCreatedBy || ''

    const viewDefinition = (asset: assetInterface) =>
        attributes(asset)?.viewDefinition || ''

    const qualifiedName = (asset: assetInterface) =>
        attributes(asset)?.qualifiedName
    const schemaName = (asset: assetInterface) => attributes(asset)?.schemaName
    const databaseName = (asset: assetInterface) =>
        attributes(asset)?.databaseName
    const createdAt = (asset: assetInterface, raw: boolean = false) => {
        if (attributes(asset)?.__timestamp)
            if (raw)
                return formatDateTime(attributes(asset)?.__timestamp) || 'N/A'
            else
                return useTimeAgo(attributes(asset)?.__timestamp).value || 'N/A'
        return 'N/A'
    }

    const createdBy = (asset: assetInterface) => attributes(asset)?.__createdBy

    const modifiedBy = (asset: assetInterface) =>
        attributes(asset)?.__modifiedBy
    const updatedAt = (asset: assetInterface, raw: boolean = false) => {
        if (attributes(asset)?.__modificationTimestamp)
            if (raw)
                return (
                    formatDateTime(
                        attributes(asset)?.__modificationTimestamp
                    ) || 'N/A'
                )
            else
                return (
                    useTimeAgo(attributes(asset)?.__modificationTimestamp)
                        .value || 'N/A'
                )
        return 'N/A'
    }
    const previewURL = (asset: assetInterface) => {
        if (attributes(asset)?.__customAttributes) {
            const customAttributes = JSON.parse(
                attributes(asset)?.__customAttributes?.split()
            )
            if (customAttributes.previewURL) return customAttributes.previewURL
        }
        return null
    }

    const lastCrawled = (asset: assetInterface) =>
        useTimeAgo(attributes(asset)?.connectionLastSyncedAt).value

    const dataType = (asset: assetInterface) => attributes(asset)?.dataType

    const dataTypeImage = (asset: assetInterface) => {
        const found = dataTypeCategoryList.find((d) =>
            d.type.find(
                (type) => type.toLowerCase() === dataType(asset)?.toLowerCase()
            )
        )
        return found?.image
    }
    /* Use this when attributes are spread out like in child tree in insights */
    const dataTypeImageForColumn = (asset: any) => {
        const found = dataTypeCategoryList.find((d) =>
            d.type.find(
                (type) => type.toLowerCase() === asset?.dataType?.toLowerCase()
            )
        )
        console.log(found?.image, 'asset')
        return found?.image
    }

    const tableInfo = (asset: assetInterface) => attributes(asset)?.table
    const popularityScore = (asset: assetInterface) =>
        attributes(asset)?.popularityScore

    const ownerGroups = (asset: assetInterface) =>
        attributes(asset)?.ownerGroups

    const ownerUsers = (asset: assetInterface) => attributes(asset)?.ownerUsers

    const certificateStatus = (asset: assetInterface) => {
        return attributes(asset)?.certificateStatus
    }

    const getHierarchy = (asset: assetInterface) => {
        const assetType = assetTypeList.find((a) => a.id == asset?.typeName)
        const relations: any[] = []

        if (assetType) {
            const filtered = assetTypeList.filter((a) =>
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
        const hierarchyKeys = [
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
                value: attributes(asset).name,
                icon: 'TableauWorkbook',
            },
        ]
        const TableauWorksheet = [
            {
                id: 'tableauWorkbook',
                label: 'Workbook',
                value: attributes(asset).workbookName,
                icon: 'TableauWorkbook',
            },
            {
                id: 'tableauWorksheet',
                label: 'Worksheet',
                value: attributes(asset).name,
                icon: 'TableauWorksheet',
            },
        ]
        const TableauDashboard = [
            {
                id: 'tableauWorkbook',
                label: 'Workbook',
                value: attributes(asset).workbookName,
                icon: 'TableauWorkbook',
            },
            {
                id: 'TableauDashboard',
                label: 'Dashboard',
                value: attributes(asset).name,
                icon: 'TableauDashboard',
            },
        ]
        const TableauEmbeddedDatasource = [
            {
                id: 'tableauWorkbook',
                label: 'Workbook',
                value: attributes(asset).workbookName,
                icon: 'TableauWorkbook',
            },
            {
                id: 'tableauEmbeddedDatasource',
                label: 'Embedded Datasource',
                value: attributes(asset).name,
                icon: 'TableauEmbeddedDatasource',
            },
        ]
        const TableauPublishedDatasource = [
            {
                id: 'tableauWorkbook',
                label: 'Workbook',
                value: attributes(asset).workbookName,
                icon: 'TableauWorkbook',
            },
            {
                id: 'tableauPublishedDatasource',
                label: 'Published Datasource',
                value: attributes(asset).name,
                icon: 'TableauPublishedDatasource',
            },
        ]
        const TableauDatasourceField = [
            {
                id: 'tableauWorkbook',
                label: 'Workbook',
                value: attributes(asset).workbookName,
                icon: 'TableauWorkbook',
            },
            attributes(asset).isPublished
                ? {
                      id: 'tableauPublishedDatasource',
                      label: 'Published Datasource',
                      value: attributes(asset).datasourceName,
                      icon: 'TableauPublishedDatasource',
                  }
                : {
                      id: 'tableauEmbeddedDatasource',
                      label: 'Embedded Datasource',
                      value: attributes(asset).datasourceName,
                      icon: 'TableauEmbeddedDatasource',
                  },
            {
                id: 'tableauDatasourceField',
                label: 'Tableau DatasourceField',
                value: attributes(asset).name,
                icon: 'TableauDatasourceField',
            },
        ]

        hierarchyKeys.forEach((item) => {
            // console.log(attributes(asset),item.id)
            filteredHierarchy.push({
                id: item.id,
                label: item.label,
                icon: item.icon,
                value: attributes(asset)[item.id] ?? attributes(asset).name,
            })
        })
        switch (asset.typeName) {
            case 'TableauSite': {
                filteredHierarchy = [
                    {
                        id: 'connectionName',
                        label: 'Server',
                        value: attributes(asset).connectionName,
                        icon: 'connectionName',
                    },
                    {
                        id: 'siteName',
                        label: 'Site',
                        value: attributes(asset).name,
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
                        value: attributes(asset).connectionName,
                        icon: 'connectionName',
                    },
                    {
                        id: 'siteName',
                        label: 'Site',
                        value: attributes(asset).siteName,
                        icon: 'SiteName',
                    },
                    {
                        id: 'tableauProject',
                        label: 'Project',
                        value: attributes(asset).name,
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
                if (attributes(asset).isPublished) {
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
                const { label, property, relatedProperty } = tableauProperty
                if (attributes(asset.value)[property]) {
                    const temp = {}
                    temp.id = property
                    temp.label = label
                    if (relatedProperty) temp.relatedProperty = relatedProperty
                    temp[property] = attributes(asset.value)[property]
                    if (property === '__timestamp') {
                        temp[property] = createdAt(asset.value)
                        if (relatedProperty)
                            temp[relatedProperty] = createdAt(asset.value, true)
                    } else if (property === '__modificationTimestamp') {
                        temp[property] = updatedAt(asset.value)
                        if (relatedProperty)
                            temp[relatedProperty] = updatedAt(asset.value, true)
                    }
                    data.push(temp)
                }
            })
        }
        return data
    }

    return {
        getConnectorName,
        getConnectorsNameFromQualifiedName,
        isPrimary,
        dataTypeImageForColumn,
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
        sourceCreatedAt,
        sourceCreatedBy,
        sourceUpdatedBy,
        lastCrawled,
        assetState,
        tableInfo,
        ownerGroups,
        ownerUsers,
        certificateStatus,
        getHierarchy,
        getTableauProperties,
        getTableauHierarchy,
        previewURL,
        viewDefinition,
        qualifiedName,
    }
}
