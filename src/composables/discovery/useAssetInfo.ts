/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
import { computed } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { useConnectionStore } from '~/store/connection'
import { assetInterface } from '~/types/assets/asset.interface'
import { getCountString, getSizeString } from '~/utils/number'

// import { SourceList } from '~/constant/source'
// import { AssetTypeList } from '~/constant/assetType'
import { dataTypeCategoryList } from '~/constant/datatype'
import { previewList } from '~/constant/previewTabs'
import { formatDateTime } from '~/utils/date'
import useDiscoveryStore from '~/store/discovery'

// import { formatDateTime } from '~/utils/date'

// import { getCountString, getSizeString } from '~/composables/asset/useFormat'

export default function useAssetInfo() {
    const connectionStore = useConnectionStore()

    const attributes = (asset: assetInterface) => asset?.attributes
    const title = (asset: assetInterface) =>
        (attributes(asset)?.displayName || attributes(asset)?.name) ?? ''

    const getConnectorImage = (asset: assetInterface) => {
        const found =
            connectionStore.getConnectorImageMapping[
                attributes(asset)?.connectorName?.toLowerCase()
            ]
        return found
    }
    const connectionName = (asset: assetInterface) =>
        attributes(asset)?.connectionName ?? ''

    const connectionQualifiedName = (asset: assetInterface) =>
        attributes(asset)?.connectionQualifiedName ?? ''

    const classifications = (asset: assetInterface) =>
        asset.classifications ?? []

    const meanings = (asset: assetInterface) =>
        attributes(asset)?.meanings ?? []
    const meaningRelationships = (asset: assetInterface) => asset.meanings ?? []

    const connectorName = (asset: assetInterface) =>
        attributes(asset)?.connectorName ?? ''

    // const status = (asset: assetInterface) =>
    //     attributes(asset)?.certificateStatus
    const assetType = (asset: assetInterface) => asset?.typeName

    const databaseName = (asset: assetInterface) =>
        attributes(asset)?.databaseName ?? ''

    const schemaName = (asset: assetInterface) =>
        attributes(asset)?.schemaName ?? ''

    const tableName = (asset: assetInterface) =>
        attributes(asset)?.tableName ?? ''

    const viewName = (asset: assetInterface) =>
        attributes(asset)?.viewName ?? ''
    // const assetState = (asset: assetInterface) => asset?.status?.toLowerCase()
    // const assetTypeLabel = (asset: assetInterface) => {
    //     const found = AssetTypeList.find((d) => d.id === assetType(asset))
    //     return found?.label
    // }
    const description = (asset: assetInterface) =>
        attributes(asset).userDescription || attributes(asset).description

    const isPrimary = (asset: assetInterface) => attributes(asset)?.isPrimary
    const isPartition = (asset: assetInterface) =>
        attributes(asset)?.isPartition
    const isDist = (asset: assetInterface) => attributes(asset)?.isDist

    const getPreviewTabs = (typeName: string) => {
        return previewList.filter((i) => {
            let flag = true
            if (i.includes) {
                if (
                    !i.includes.some(
                        (t) => t.toLowerCase() === typeName?.toLowerCase()
                    )
                ) {
                    flag = false
                }
            }
            if (i.excludes) {
                if (
                    i.excludes.some(
                        (t) => t.toLowerCase() === typeName?.toLowerCase()
                    )
                ) {
                    flag = false
                }
            }
            return flag
        })
    }

    const previewTabs = (asset: assetInterface, context: string) => {
        return getPreviewTabs(assetType(asset))
    }

    // const logo = (asset: assetInterface) => {
    //     let img = ''

    //     const found = attributes(asset)?.integrationName
    //         ? SourceList.find(
    //               (src) => src.id === attributes(asset)?.integrationName
    //           )
    //         : SourceList.find(
    //               (src) =>
    //                   src.id === attributes(asset)?.qualifiedName?.split('/')[1]
    //           )

    //     if (found) img = found.image

    //     return img
    // }
    // const databaseLogo = (asset: assetInterface) => {
    //     let img = ''
    //     const found = SourceList.find(
    //         (src) => src.id === attributes(asset)?.integrationName
    //     )
    //     if (found) {
    //         const database = found.hierarchy.find(
    //             (src) => src.typeName === 'Database'
    //         )
    //         if (database?.image) img = database?.image
    //     }
    //     return img
    // }
    // const schemaLogo = (asset: assetInterface) => {
    //     let img = ''
    //     const found = SourceList.find(
    //         (src) => src.id === attributes(asset)?.integrationName
    //     )
    //     if (found) {
    //         const schema = found.hierarchy.find(
    //             (src) => src.typeName === 'Schema'
    //         )
    //         if (schema?.image) img = schema?.image
    //     }
    //     return img
    // }

    // const integrationName = (asset: assetInterface) => {
    //     const name = attributes(asset)?.integrationName
    //     return name.charAt(0).toUpperCase() + name.slice(1)
    // }

    // const getConnectorsNameFromQualifiedName = (qualifiedName: string) => {
    //     let connectorsName: undefined | string = undefined
    //     const values = qualifiedName?.split('/')
    //     if (values?.length > 1) {
    //         connectorsName = values[1]
    //     }
    //     return connectorsName
    // }
    // const getConnectorName = (attributes: any) => {
    //     return (
    //         attributes?.connectorName ??
    //         getConnectorsNameFromQualifiedName(attributes?.qualifiedName)
    //     )
    // }

    const rowCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? attributes(asset)?.rowCount?.toLocaleString() || 'N/A'
            : getCountString(attributes(asset).rowCount)
    const columnCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? attributes(asset)?.columnCount?.toLocaleString() || 'N/A'
            : getCountString(attributes(asset).columnCount)

    const sizeBytes = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? attributes(asset)?.sizeBytes?.toLocaleString() || 'N/A'
            : getSizeString(attributes(asset).sizeBytes)

    const dataType = (asset: assetInterface) => attributes(asset)?.dataType

    const dataTypeCategory = (asset: assetInterface) => {
        return dataTypeCategoryList.find((item) =>
            item.type.some(
                (i) =>
                    i.toLowerCase() ===
                    attributes(asset)?.dataType?.toLowerCase()
            )
        )
    }

    const dataTypeCategoryLabel = (asset: assetInterface) =>
        dataTypeCategory(asset)?.label

    const dataTypeCategoryImage = (asset: assetInterface) => {
        return dataTypeCategory(asset)?.image
    }

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

    const definition = (asset: assetInterface) =>
        attributes(asset)?.definition || ''

    const qualifiedName = (asset: assetInterface) =>
        attributes(asset)?.qualifiedName
    // const schemaName = (asset: assetInterface) => attributes(asset)?.schemaName
    // const databaseName = (asset: assetInterface) =>
    //     attributes(asset)?.databaseName

    const createdAt = (asset: assetInterface, raw: boolean = false) => {
        if (attributes(asset)?.__timestamp)
            if (raw)
                return formatDateTime(attributes(asset)?.__timestamp) || 'N/A'
            else
                return useTimeAgo(attributes(asset)?.__timestamp).value || 'N/A'
        return 'N/A'
    }

    const modifiedAt = (asset: assetInterface, raw: boolean = false) => {
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

    const createdBy = (asset: assetInterface) => attributes(asset)?.__createdBy

    const modifiedBy = (asset: assetInterface) =>
        attributes(asset)?.__modifiedBy

    // const modifiedBy = (asset: assetInterface) =>
    //     attributes(asset)?.__modifiedBy

    // const previewURL = (asset: assetInterface) => {
    //     if (attributes(asset)?.__customAttributes) {
    //         const customAttributes = JSON.parse(
    //             attributes(asset)?.__customAttributes?.split()
    //         )
    //         if (customAttributes.previewURL) return customAttributes.previewURL
    //     }
    //     return null
    // }

    // const lastCrawled = (asset: assetInterface) =>
    //     useTimeAgo(attributes(asset)?.connectionLastSyncedAt).value

    // const dataTypeImage = (asset: assetInterface) => {
    //     const found = dataTypeList.find((d) =>
    //         d.type.find(
    //             (type) => type.toLowerCase() === dataType(asset)?.toLowerCase()
    //         )
    //     )
    //     return found?.image
    // }
    // /* Use this when attributes are spread out like in child tree in insights */
    // const dataTypeImageForColumn = (asset: any) => {
    //     const found = dataTypeList.find((d) =>
    //         d.type.find(
    //             (type) => type.toLowerCase() === asset?.dataType?.toLowerCase()
    //         )
    //     )
    //     console.log(found?.image, 'asset')
    //     return found?.image
    // }

    // const tableInfo = (asset: assetInterface) => attributes(asset)?.table
    // const popularityScore = (asset: assetInterface) =>
    //     attributes(asset)?.popularityScore

    const ownerGroups = (asset: assetInterface) =>
        attributes(asset)?.ownerGroups?.split(',') || []

    const ownerUsers = (asset: assetInterface) =>
        attributes(asset)?.ownerUsers?.split(',') || []

    const certificateStatus = (asset: assetInterface) => {
        return attributes(asset)?.certificateStatus
    }
    const certificateStatusMessage = (asset: assetInterface) => {
        return attributes(asset)?.certificateStatusMessage
    }
    const certificateUpdatedBy = (asset: assetInterface) => {
        return attributes(asset)?.certificateUpdatedBy
    }

    const certificateUpdatedAt = (
        asset: assetInterface,
        raw: boolean = false
    ) => {
        if (attributes(asset)?.certificateUpdatedAt) {
            return raw
                ? formatDateTime(attributes(asset)?.certificateUpdatedAt) ||
                      'N/A'
                : useTimeAgo(attributes(asset)?.certificateUpdatedAt).value
        }
        return ''
    }

    const discoveryStore = useDiscoveryStore()

    const selectedAsset = computed(() => {
        return discoveryStore.selectedAsset
    })

    // const getHierarchy = (asset: assetInterface) => {
    //     const assetType = AssetTypeList.find((a) => a.id == asset?.typeName)
    //     const relations: any[] = []

    //     if (assetType) {
    //         const filtered = AssetTypeList.filter((a) =>
    //             assetType.parents?.includes(a.id)
    //         )

    //         filtered.forEach((f) => {
    //             relations.push({
    //                 ...f,
    //                 guid: asset.guid,
    //                 qualifiedName: attributes(asset)[f.qualifiedNameAttribute],
    //                 value: attributes(asset)[f.nameAttribute],
    //             })
    //         })
    //     }

    //     return relations
    // }
    // const getTableauHierarchy = (asset: assetInterface) => {
    //     let filteredHierarchy = []
    //     const hierarchyKeys = [
    //         {
    //             id: 'connectionName',
    //             label: 'Server',
    //             value: '',
    //             icon: 'connectionName',
    //         },
    //         { id: 'siteName', label: 'Site', value: '', icon: 'SiteName' },
    //     ]

    //     /* project */
    //     const TableauProject: any = []
    //     // inserting projects if project is nested or not
    //     const projectHierarchy = attributes(asset)?.projectHierarchy
    //         ? [...attributes(asset)?.projectHierarchy]
    //         : []
    //     projectHierarchy.push({
    //         id: 'tableauProject',
    //         label: 'Project',
    //         value: attributes(asset)?.projectName,
    //         icon: 'TableauProject',
    //     })
    //     const firstProject = projectHierarchy.shift()
    //     TableauProject.push({
    //         ...firstProject,
    //         icon: 'TableauProject',
    //         label: 'Project',
    //         subProjects: projectHierarchy,
    //     })

    //     /* -----------------------------*/

    //     const TableauWorkbook = [
    //         {
    //             id: 'tableauWorkbook',
    //             label: 'Workbook',
    //             value: attributes(asset).name,
    //             icon: 'TableauWorkbook',
    //         },
    //     ]
    //     const TableauWorksheet = [
    //         {
    //             id: 'tableauWorkbook',
    //             label: 'Workbook',
    //             value: attributes(asset).workbookName,
    //             icon: 'TableauWorkbook',
    //         },
    //         {
    //             id: 'tableauWorksheet',
    //             label: 'Worksheet',
    //             value: attributes(asset).name,
    //             icon: 'TableauWorksheet',
    //         },
    //     ]
    //     const TableauDashboard = [
    //         {
    //             id: 'tableauWorkbook',
    //             label: 'Workbook',
    //             value: attributes(asset).workbookName,
    //             icon: 'TableauWorkbook',
    //         },
    //         {
    //             id: 'TableauDashboard',
    //             label: 'Dashboard',
    //             value: attributes(asset).name,
    //             icon: 'TableauDashboard',
    //         },
    //     ]
    //     const TableauEmbeddedDatasource = [
    //         {
    //             id: 'tableauWorkbook',
    //             label: 'Workbook',
    //             value: attributes(asset).workbookName,
    //             icon: 'TableauWorkbook',
    //         },
    //         {
    //             id: 'tableauEmbeddedDatasource',
    //             label: 'Embedded Datasource',
    //             value: attributes(asset).name,
    //             icon: 'TableauEmbeddedDatasource',
    //         },
    //     ]
    //     const TableauPublishedDatasource = [
    //         {
    //             id: 'tableauWorkbook',
    //             label: 'Workbook',
    //             value: attributes(asset).workbookName,
    //             icon: 'TableauWorkbook',
    //         },
    //         {
    //             id: 'tableauPublishedDatasource',
    //             label: 'Published Datasource',
    //             value: attributes(asset).name,
    //             icon: 'TableauPublishedDatasource',
    //         },
    //     ]
    //     const TableauDatasourceField = [
    //         {
    //             id: 'tableauWorkbook',
    //             label: 'Workbook',
    //             value: attributes(asset).workbookName,
    //             icon: 'TableauWorkbook',
    //         },
    //         attributes(asset).isPublished
    //             ? {
    //                   id: 'tableauPublishedDatasource',
    //                   label: 'Published Datasource',
    //                   value: attributes(asset).datasourceName,
    //                   icon: 'TableauPublishedDatasource',
    //               }
    //             : {
    //                   id: 'tableauEmbeddedDatasource',
    //                   label: 'Embedded Datasource',
    //                   value: attributes(asset).datasourceName,
    //                   icon: 'TableauEmbeddedDatasource',
    //               },
    //         {
    //             id: 'tableauDatasourceField',
    //             label: 'Tableau DatasourceField',
    //             value: attributes(asset).name,
    //             icon: 'TableauDatasourceField',
    //         },
    //     ]

    //     hierarchyKeys.forEach((item) => {
    //         // console.log(attributes(asset),item.id)
    //         filteredHierarchy.push({
    //             id: item.id,
    //             label: item.label,
    //             icon: item.icon,
    //             value: attributes(asset)[item.id] ?? attributes(asset).name,
    //         })
    //     })
    //     switch (asset.typeName) {
    //         case 'TableauSite': {
    //             filteredHierarchy = [
    //                 {
    //                     id: 'connectionName',
    //                     label: 'Server',
    //                     value: attributes(asset).connectionName,
    //                     icon: 'connectionName',
    //                 },
    //                 {
    //                     id: 'siteName',
    //                     label: 'Site',
    //                     value: attributes(asset).name,
    //                     icon: 'SiteName',
    //                 },
    //             ]
    //             break
    //         }
    //         case 'TableauProject': {
    //             filteredHierarchy = [
    //                 {
    //                     id: 'connectionName',
    //                     label: 'Server',
    //                     value: attributes(asset).connectionName,
    //                     icon: 'connectionName',
    //                 },
    //                 {
    //                     id: 'siteName',
    //                     label: 'Site',
    //                     value: attributes(asset).siteName,
    //                     icon: 'SiteName',
    //                 },
    //                 {
    //                     id: 'tableauProject',
    //                     label: 'Project',
    //                     value: attributes(asset).name,
    //                     icon: 'TableauProject',
    //                 },
    //             ]
    //             break
    //         }

    //         case 'TableauWorkbook': {
    //             filteredHierarchy = [...filteredHierarchy, ...TableauProject]
    //             filteredHierarchy = [...filteredHierarchy, ...TableauWorkbook]
    //             break
    //         }
    //         case 'TableauWorksheet': {
    //             filteredHierarchy = [...filteredHierarchy, ...TableauProject]
    //             filteredHierarchy = [...filteredHierarchy, ...TableauWorksheet]
    //             break
    //         }
    //         case 'TableauDashboard': {
    //             filteredHierarchy = [...filteredHierarchy, ...TableauProject]
    //             filteredHierarchy = [...filteredHierarchy, ...TableauDashboard]
    //             break
    //         }
    //         case 'TableauDatasourceField': {
    //             filteredHierarchy = [...filteredHierarchy, ...TableauProject]
    //             filteredHierarchy = [
    //                 ...filteredHierarchy,
    //                 ...TableauDatasourceField,
    //             ]
    //             break
    //         }
    //         case 'TableauDatasource': {
    //             // isPublished - true (published datasoruce) or vice versa
    //             if (attributes(asset).isPublished) {
    //                 filteredHierarchy = [
    //                     ...filteredHierarchy,
    //                     ...TableauProject,
    //                 ]
    //                 filteredHierarchy = [
    //                     ...filteredHierarchy,
    //                     ...TableauPublishedDatasource,
    //                 ]
    //             } else {
    //                 filteredHierarchy = [
    //                     ...filteredHierarchy,
    //                     ...TableauProject,
    //                 ]
    //                 filteredHierarchy = [
    //                     ...filteredHierarchy,
    //                     ...TableauEmbeddedDatasource,
    //                 ]
    //             }
    //             break
    //         }
    //     }
    //     return filteredHierarchy.filter((item) => item.value !== undefined)
    // }

    // const getTableauProperties = (
    //     asset: Ref<assetInterface> | undefined,
    //     properties: any
    // ) => {
    //     const data: any = []
    //     console.log(properties, 'properties')
    //     if (asset.value && properties.length > 0) {
    //         properties.forEach((tableauProperty: any) => {
    //             const { label, property, relatedProperty } = tableauProperty
    //             if (attributes(asset.value)[property]) {
    //                 const temp = {}
    //                 temp.id = property
    //                 temp.label = label
    //                 if (relatedProperty) temp.relatedProperty = relatedProperty
    //                 temp[property] = attributes(asset.value)[property]
    //                 if (property === '__timestamp') {
    //                     temp[property] = createdAt(asset.value)
    //                     if (relatedProperty)
    //                         temp[relatedProperty] = createdAt(asset.value, true)
    //                 } else if (property === '__modificationTimestamp') {
    //                     temp[property] = updatedAt(asset.value)
    //                     if (relatedProperty)
    //                         temp[relatedProperty] = updatedAt(asset.value, true)
    //                 }
    //                 data.push(temp)
    //             }
    //         })
    //     }
    //     return data

    return {
        title,
        getConnectorImage,
        connectionName,
        assetType,
        databaseName,
        schemaName,
        tableName,
        viewName,
        connectorName,
        dataType,
        dataTypeCategoryLabel,
        dataTypeCategoryImage,
        // getConnectorName,
        // getConnectorsNameFromQualifiedName,
        isPrimary,
        isPartition,
        isDist,
        definition,
        description,
        classifications,
        meanings,
        meaningRelationships,
        // dataTypeImageForColumn,
        // popularityScore,
        createdBy,
        // modifiedBy,
        // databaseLogo,
        // schemaLogo,
        // databaseName,
        // schemaName,
        // attributes,
        // title,
        // status,
        // assetType,
        // dataType,
        // dataTypeImage,
        // description,
        // logo,
        // integrationName,
        // assetTypeLabel,
        rowCount,
        columnCount,
        sizeBytes,
        previewTabs,
        selectedAsset,
        // sizeBytes,
        // createdAt,
        // updatedAt,
        sourceUpdatedAt,
        sourceCreatedAt,
        sourceCreatedBy,
        sourceUpdatedBy,
        certificateStatus,
        certificateUpdatedAt,
        certificateStatusMessage,
        certificateUpdatedBy,
        // lastCrawled,
        // assetState,
        // tableInfo,
        ownerGroups,
        ownerUsers,
        modifiedAt,
        modifiedBy,
        createdAt,

        // getHierarchy,
        // getTableauProperties,
        // getTableauHierarchy,
        // previewURL,
        // viewDefinition,
        qualifiedName,
        connectionQualifiedName,
    }
}
