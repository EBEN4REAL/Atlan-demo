/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
import { computed } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { useConnectionStore } from '~/store/connection'
import { assetInterface } from '~/types/assets/asset.interface'
import { getCountString, getSizeString } from '~/utils/number'

import { SourceList } from '~/constant/source'
import { assetTypeList } from '~/constant/assetType'
import { dataTypeCategoryList } from '~/constant/dataType'
import { previewTabs } from '~/constant/previewTabs'
import { profileTabs } from '~/constant/profileTabs'
import { summaryVariants } from '~/constant/summaryVariants'
import { formatDateTime } from '~/utils/date'
import useAssetStore from '~/store/asset'
import { Category, Term } from '~/types/glossary/glossary.interface'
import { useAuthStore } from '~/store/auth'
import { assetActions } from '~/constant/assetActions'
import useGlossaryStore from '~/store/glossary'
import useCustomMetadataFacet from '../custommetadata/useCustomMetadataFacet'
import useConnectionData from '../connection/useConnectionData'

// import { formatDateTime } from '~/utils/date'

// import { getCountString, getSizeString } from '~/composables/asset/useFormat'

export default function useAssetInfo() {
    const { getConnection } = useConnectionData()

    const connectionStore = useConnectionStore()

    const attributes = (asset: assetInterface) => asset?.attributes
    const anchorAttributes = (asset: Term | Category) =>
        asset?.attributes?.anchor?.attributes

    const parentCategory = (asset: assetInterface) =>
        asset?.attributes?.parentCategory

    const categories = (asset: assetInterface) => asset?.attributes?.categories

    const title = (asset: assetInterface) =>
        (attributes(asset)?.displayName || attributes(asset)?.name) ?? ''

    const getConnectorImage = (asset: assetInterface) => {
        const found =
            connectionStore.getConnectorImageMapping[
                attributes(asset)?.connectorName?.toLowerCase()
            ]
        return found
    }

    const getConnectorImageMap = computed(() => {
        return connectionStore.getConnectorImageMapping
    })

    // const connectionName = (asset: assetInterface) => {}
    //     attributes(asset)?.connectionName ?? ''

    const connectionName = (asset: assetInterface) => {
        // console.log('get asset conenction', asset.attributes.qualifiedName)

        const connection = getConnection(
            asset.attributes.connectionQualifiedName
        )
        if (connection) {
            return connection.attributes.name
        }
        return ''
    }

    const connectionQualifiedName = (asset: assetInterface) =>
        attributes(asset)?.connectionQualifiedName ?? ''

    const classifications = (asset: assetInterface) =>
        asset.classifications ?? []

    const meanings = (asset: assetInterface) =>
        attributes(asset)?.meanings ?? []
    const meaningRelationships = (asset: assetInterface) => asset.meanings ?? []

    const connectorName = (asset: assetInterface) =>
        attributes(asset)?.connectorName ?? ''

    const assetType = (asset: assetInterface) => asset?.typeName

    const assetTypeLabel = (asset: assetInterface) => {
        const found = assetTypeList.find((d) => d.id === assetType(asset))
        return found?.label
    }

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
    //     const found = assetTypeList.find((d) => d.id === assetType(asset))
    //     return found?.label
    // }
    const description = (asset: assetInterface) =>
        attributes(asset)?.userDescription ||
        attributes(asset)?.description ||
        ''

    const isUserDescription = (asset: assetInterface) =>
        !!attributes(asset)?.userDescription

    const isPrimary = (asset: assetInterface) => attributes(asset)?.isPrimary
    const isPartition = (asset: assetInterface) =>
        attributes(asset)?.isPartition
    const isDist = (asset: assetInterface) => attributes(asset)?.isDist
    const isForeign = (asset: assetInterface) => attributes(asset)?.isForeign

    const links = (asset: assetInterface) => {
        const allLinks = attributes(asset)?.links

        const activeLinks = allLinks?.filter(
            (link) => link?.attributes?.__state === 'ACTIVE'
        )
        return activeLinks
    }
    const link = (asset: assetInterface) => attributes(asset)?.link

    const getTabs = (list, typeName: string) => {
        console.log(list, typeName)
        return list.filter((i) => {
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

    const { getList: cmList } = useCustomMetadataFacet()

    const getPreviewTabs = (asset: assetInterface, inProfile: boolean) => {
        let customTabList = []
        if (cmList(assetType(asset)).length > 0) {
            customTabList = cmList(assetType(asset)).map((i) => {
                return {
                    component: 'customMetadata',
                    image: i.options?.imageId,
                    emoji: i.options?.emoji,
                    name: i.label,
                    tooltip: i.label,
                    scrubbed: true,
                    requiredInProfile: true,
                    data: i,
                    exclude: ['Query'],
                }
            })
        }
        const allTabs = [
            ...getTabs(previewTabs, assetType(asset)),
            ...customTabList,
        ]
        if (inProfile) {
            return allTabs.filter((tab) => tab.requiredInProfile === inProfile)
        }

        return allTabs
    }
    const getProfileTabs = (asset: assetInterface) => {
        return getTabs(profileTabs, assetType(asset))
    }

    const getVariants = (list, typeName: string) => {
        return list.find((i) => {
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
            return flag
        })
    }
    const getSummaryVariants = (asset: assetInterface) => {
        return getVariants(summaryVariants, assetType(asset))
    }

    const getActions = (asset) => {
        return assetActions.filter((i) => {
            let flag = true
            if (i.includes) {
                if (
                    !i.includes.some(
                        (t) =>
                            t.toLowerCase() === assetType(asset)?.toLowerCase()
                    )
                ) {
                    flag = false
                }
            }
            if (i.excludes) {
                if (
                    i.excludes.some(
                        (t) =>
                            t.toLowerCase() === assetType(asset)?.toLowerCase()
                    )
                ) {
                    flag = false
                }
            }
            return flag
        })
    }

    const getProfilePath = (asset) => {
        if (assetType(asset) === 'Column') {
            const tableGuid = asset?.attributes?.table?.guid
            if (tableGuid) {
                return `/assets/${tableGuid}/overview?column=${asset?.guid}`
            }
            const viewGuid = asset?.attributes?.view?.guid
            if (viewGuid) {
                return `/assets/${viewGuid}/overview?column=${asset?.guid}`
            }
        } else if (isGTC(asset)) {
            return `/glossary/${asset?.guid}`
        } else if (assetType(asset) === 'Query') {
            return `/insights?id=${asset.guid}&runQuery=true`
        }
        return `/assets/${asset?.guid}`
    }

    const getLineagePath = (asset) => {
        return `/assets/${asset.guid}/lineage`
    }

    const getAssetQueryPath = (asset) => {
        let queryPath = '/insights'
        const databaseQualifiedName = `${
            attributes(asset).connectionQualifiedName
        }/${attributes(asset).databaseName}`
        const schema = attributes(asset).schemaName

        if (assetType(asset) === 'Column') {
            // let tableName =
            //     attributes(asset).tableName

            const name =
                tableName(asset).length > 0 ? tableName(asset) : viewName(asset)
            const columnName = attributes(asset).name

            queryPath = `/insights?databaseQualifiedNameFromURL=${databaseQualifiedName}&schemaNameFromURL=${schema}&tableNameFromURL=${name}&columnNameFromURL=${columnName}`
        } else if (
            assetType(asset) === 'Table' ||
            assetType(asset) === 'View'
        ) {
            const tableName = attributes(asset).name
            queryPath = `/insights?databaseQualifiedNameFromURL=${databaseQualifiedName}&schemaNameFromURL=${schema}&tableNameFromURL=${tableName}`
        } else if (assetType(asset) === 'Query') {
            queryPath = `/insights?id=${asset.guid}&runQuery=true`
        } else {
            queryPath = `/insights`
        }

        return queryPath
    }

    const getAnchorName = (asset: assetInterface) =>
        anchorAttributes(asset)?.name

    const getAnchorGuid = (asset: assetInterface) =>
        attributes(asset)?.anchor?.guid

    const getAnchorQualifiedName = (asset: assetInterface) => {
        return attributes(asset)?.anchor?.uniqueAttributes?.qualifiedName
    }
    const getAnchorProfile = (asset: assetInterface) => {
        return `/glossary/${getAnchorGuid(asset)}`
    }

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

    const getConnectorsNameFromQualifiedName = (qualifiedName: string) => {
        let connectorsName: undefined | string
        const values = qualifiedName?.split('/')
        if (values?.length > 1) {
            connectorsName = values[1]
        }
        return connectorsName
    }
    const getConnectorName = (attributes: any) => {
        return getConnectorsNameFromQualifiedName(attributes?.qualifiedName)
    }

    const rowCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? attributes(asset)?.rowCount?.toLocaleString() || 'N/A'
            : getCountString(attributes(asset).rowCount)

    const columnCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? attributes(asset)?.columnCount?.toLocaleString() || 'N/A'
            : getCountString(attributes(asset)?.columnCount)

    const termsCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? asset?.termsCount?.toLocaleString() || 'N/A'
            : getCountString(asset?.termsCount)

    const categoryCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? asset?.categoryCount?.toLocaleString() || 'N/A'
            : getCountString(asset?.categoryCount)

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

    const compiledQuery = (asset: assetInterface) => {
        if (
            attributes(asset)?.compiledQuery &&
            attributes(asset)?.compiledQuery !== ''
        ) {
            return attributes(asset)?.compiledQuery
        }
        return '~'
    }
    const rawQuery = (asset: assetInterface) => {
        if (attributes(asset)?.rawQuery && attributes(asset)?.rawQuery !== '') {
            return attributes(asset)?.rawQuery
        }
        return '~'
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

    const readmeGuid = (asset: assetInterface) =>
        attributes(asset)?.readme?.guid

    const readmeContent = (asset: assetInterface) =>
        attributes(asset)?.readme?.attributes?.description

    const isEditAllowed = (asset: assetInterface) => {}

    const isScrubbed = (asset: assetInterface) => {
        if (asset?.scrubbed) {
            return true
        }
        return false
    }

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

    const dataTypeImage = (asset: assetInterface) => {
        const found = dataTypeCategoryList.find((d) =>
            d.type.find(
                (type) => type.toLowerCase() === dataType(asset)?.toLowerCase()
            )
        )
        return found?.image
    }
    // /* Use this when attributes are spread out like in child tree in insights */
    const dataTypeImageForColumn = (asset: any) => {
        const found = dataTypeCategoryList.find((d) =>
            d.type.find(
                (type) => type.toLowerCase() === asset?.dataType?.toLowerCase()
            )
        )
        console.log(found?.image, 'asset')
        return found?.image
    }

    // const tableInfo = (asset: assetInterface) => attributes(asset)?.table
    // const popularityScore = (asset: assetInterface) =>
    //     attributes(asset)?.popularityScore

    const ownerGroups = (asset: assetInterface) =>
        attributes(asset)?.ownerGroups || []

    const ownerUsers = (asset: assetInterface) =>
        attributes(asset)?.ownerUsers || []

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

    const announcementType = (asset: assetInterface) => {
        return attributes(asset)?.announcementType
    }

    const announcementTitle = (asset: assetInterface) => {
        return attributes(asset)?.announcementTitle
    }

    const announcementMessage = (asset: assetInterface) => {
        return attributes(asset)?.announcementMessage
    }

    const announcementUpdatedBy = (asset: assetInterface) => {
        return attributes(asset)?.announcementUpdatedBy
    }

    const announcementUpdatedAt = (
        asset: assetInterface,
        raw: boolean = false
    ) => {
        if (attributes(asset)?.announcementUpdatedAt) {
            return raw
                ? formatDateTime(attributes(asset)?.announcementUpdatedAt) ||
                      'N/A'
                : useTimeAgo(attributes(asset)?.announcementUpdatedAt).value
        }
        return ''
    }

    const webURL = (asset: assetInterface) => {
        return attributes(asset)?.webUrl
    }

    const isBiAsset = (asset: assetInterface) => {
        return (
            assetType(asset)?.includes('Tableau') ||
            assetType(asset)?.includes('BI')
        )
    }

    const isNonBiAsset = (asset: assetInterface) => {
        return (
            assetType(asset) === 'Table' ||
            assetType(asset) === 'View' ||
            assetType(asset) === 'Column'
        )
    }

    const discoveryStore = useAssetStore()

    const selectedAsset = computed(() => {
        return discoveryStore.selectedAsset
    })

    const glossaryStore = useGlossaryStore()

    const selectedGlossary = computed(() => {
        return glossaryStore.selectedGTC
    })

    const isGTCByType = (typeName) => {
        if (
            [
                'AtlasGlossary',
                'AtlasGlossaryTerm',
                'AtlasGlossaryCategory',
            ].includes(typeName)
        ) {
            return true
        }
        return false
    }

    const isGTC = (asset: assetInterface) => {
        if (isGTCByType(asset.typeName)) {
            return true
        }
        return false
    }

    const getHierarchy = (asset: assetInterface) => {
        const assetType_ = assetTypeList.find((a) => a.id == asset?.typeName)
        const relations: any[] = []

        if (assetType_) {
            const filtered = assetTypeList.filter((a) =>
                assetType_.parents?.includes(a.id)
            )

            filtered.forEach((f) => {
                relations.push({
                    ...f,
                    guid: asset.guid,
                    qualifiedName:
                        attributes(asset)[f.qualifiedNameAttribute as string],
                    value: attributes(asset)[f.nameAttribute as string],
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
            default: {
                break
            }
        }
        return filteredHierarchy.filter((item) => item.value !== undefined)
    }

    return {
        attributes,
        title,
        getConnectorImage,
        getConnectorName,
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
        isPrimary,
        isPartition,
        isDist,
        compiledQuery,
        rawQuery,
        definition,
        description,
        classifications,
        meanings,
        meaningRelationships,
        createdBy,
        logo,
        rowCount,
        links,
        columnCount,
        sizeBytes,
        getPreviewTabs,
        getProfileTabs,
        selectedAsset,
        readmeContent,
        getSummaryVariants,
        sourceUpdatedAt,
        sourceCreatedAt,
        sourceCreatedBy,
        sourceUpdatedBy,
        certificateStatus,
        certificateUpdatedAt,
        certificateStatusMessage,
        certificateUpdatedBy,
        announcementTitle,
        announcementMessage,
        announcementType,
        announcementUpdatedAt,
        announcementUpdatedBy,
        ownerGroups,
        ownerUsers,
        modifiedAt,
        modifiedBy,
        createdAt,
        getHierarchy,
        getTableauHierarchy,
        qualifiedName,
        getAnchorName,
        getAnchorGuid,
        getAnchorProfile,
        connectionQualifiedName,
        categoryCount,
        termsCount,
        getConnectorImageMap,
        anchorAttributes,
        readmeGuid,
        getConnectorsNameFromQualifiedName,
        dataTypeImage,
        dataTypeImageForColumn,
        assetTypeLabel,
        getActions,
        getAssetQueryPath,
        link,
        webURL,
        isBiAsset,
        selectedGlossary,
        isForeign,
        categories,
        parentCategory,
        isGTC,
        getProfilePath,
        isGTCByType,
        getAnchorQualifiedName,
        isNonBiAsset,
        getLineagePath,
        isUserDescription,
        isScrubbed,
    }
}
