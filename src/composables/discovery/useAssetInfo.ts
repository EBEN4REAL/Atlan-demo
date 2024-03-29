/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */
import { computed, toRefs } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { useConnectionStore } from '~/store/connection'
import { assetInterface } from '~/types/assets/asset.interface'
import { getCountString, getSizeString } from '~/utils/number'

import { SourceList } from '~/constant/source'
import { assetTypeList } from '~/constant/assetType'
import { dataTypeCategoryList } from '~/constant/dataType'
import {
    previewTabs,
    JiraPreviewTab,
    SlackResourcesTab,
} from '~/constant/previewTabs'
import { profileTabs } from '~/constant/profileTabs'
import { summaryVariants } from '~/constant/summaryVariants'
import { formatDateTime } from '~/utils/date'
import useAssetStore from '~/store/asset'
import whoami from '~/composables/user/whoami'
import { Category, Term } from '~/types/glossary/glossary.interface'
import { useAuthStore } from '~/store/auth'
import { assetActions } from '~/constant/assetActions'
import useGlossaryStore from '~/store/glossary'
import useCustomMetadataFacet from '../custommetadata/useCustomMetadataFacet'
import useConnectionData from '../connection/useConnectionData'
import integrationStore from '~/store/integrations/index'

import { usePersonaStore } from '~/store/persona'
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

    const { role } = whoami()
    const categories = (asset: assetInterface) => asset?.attributes?.categories
    const seeAlso = (asset: assetInterface) => asset?.attributes?.seeAlso
    const antonyms = (asset: assetInterface) => asset?.attributes?.antonyms
    const synonyms = (asset: assetInterface) => asset?.attributes?.synonyms
    const preferredTerms = (asset: assetInterface) =>
        asset?.attributes?.preferredTerms
    const preferredToTerms = (asset: assetInterface) =>
        asset?.attributes?.preferredToTerms

    const parentWorkspace = (asset: assetInterface) =>
        attributes(asset)?.workspace

    const parentReport = (asset: assetInterface) => attributes(asset)?.report

    const parentDataset = (asset: assetInterface) => attributes(asset)?.dataset

    const parentDashboard = (asset: assetInterface) =>
        attributes(asset)?.dashboard

    const parentProject = (asset: assetInterface) => attributes(asset)?.project

    const parentDatasource = (asset: assetInterface) =>
        attributes(asset)?.datasource

    const parentWorkbook = (asset: assetInterface) =>
        attributes(asset)?.workbook

    const parentSite = (asset: assetInterface) => attributes(asset)?.site

    const parentFolder = (asset: assetInterface) => attributes(asset)?.folder

    const parentModel = (asset: assetInterface) => attributes(asset)?.model

    const parentOrganization = (asset: assetInterface) =>
        attributes(asset)?.organization

    const parentObject = (asset: assetInterface) => attributes(asset)?.object

    const parentBucket = (asset: assetInterface) => attributes(asset)?.bucket

    const reportCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.reportCount, true)

    const dashboardCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.dashboardCount, true)

    const datasetCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.datasetCount, true)

    const dataflowCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.dataflowCount, true)

    const tileCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.tileCount, true)

    const pageCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.pageCount, true)

    const fieldCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.fieldCount, true)

    const powerBITableColumnCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.powerBITableColumnCount, true)

    const powerBITableMeasureCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.powerBITableMeasureCount, true)

    const title = (asset: assetInterface) =>
        (attributes(asset)?.displayName ||
            attributes(asset)?.name ||
            attributes(asset)?.qualifiedName) ??
        ''
    const apiName = (asset: assetInterface) => attributes(asset)?.apiName ?? ''

    const getConnectorImage = (asset: assetInterface) => {
        const found =
            connectionStore.getConnectorImageMapping[
                attributes(asset)?.connectorName?.toLowerCase()
            ]
        return found
    }

    const getConnectorLabel = (asset: assetInterface) => {
        const found =
            connectionStore.getConnectorLabelMapping[
                attributes(asset)?.connectorName?.toLowerCase()
            ]
        return found
    }

    const getConnectorLabelByName = (name: string) => {
        const found = connectionStore.getConnectorLabelMapping[name]
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

    const connectionGuid = (asset: assetInterface) => {
        const connection = getConnection(
            asset.attributes.connectionQualifiedName
        )
        if (connection) {
            return connection?.guid
        }
        return ''
    }

    const connectionQualifiedName = (asset: assetInterface) =>
        attributes(asset)?.connectionQualifiedName ?? ''

    const classifications = (asset: assetInterface) =>
        asset?.classifications ?? []

    const meanings = (asset: assetInterface) =>
        attributes(asset)?.meanings ?? []

    const assignedEntities = (asset: Term) =>
        asset?.attributes?.assignedEntities

    const meaningRelationships = (asset: assetInterface) =>
        asset?.meanings ?? []

    const connectorName = (asset: assetInterface) =>
        attributes(asset)?.connectorName ?? ''

    const assetType = (asset: assetInterface) => asset?.typeName

    const assetTypeLabel = (asset: assetInterface) => {
        const found = assetTypeList.find((d) => d.id === assetType(asset))
        return found?.label
    }
    const assetTypeImage = (asset: assetInterface) => {
        const found = assetTypeList.find((d) => d.id === assetType(asset))
        return found?.image
    }

    const assetTypeRelations = (asset: assetInterface) => {
        const found = assetTypeList.find((d) => d.id === assetType(asset))
        return found?.relationships
    }

    const databaseName = (asset: assetInterface) =>
        attributes(asset)?.databaseName ?? ''

    const databaseQualifiedName = (asset: assetInterface) =>
        attributes(asset)?.databaseQualifiedName

    const schemaQualifiedName = (asset: assetInterface) =>
        attributes(asset)?.schemaQualifiedName

    const parentDatabase = (asset: assetInterface) =>
        attributes(asset)?.database

    const schemaName = (asset: assetInterface) =>
        attributes(asset)?.schemaName ?? ''

    const parentSchema = (asset: assetInterface) =>
        attributes(asset)?.atlanSchema

    const parentTable = (asset: assetInterface) => attributes(asset)?.table

    const parentView = (asset: assetInterface) => attributes(asset)?.view

    const parentProcess = (asset: assetInterface) => attributes(asset)?.process

    const tableName = (asset: assetInterface) =>
        attributes(asset)?.tableName ?? ''

    const viewName = (asset: assetInterface) =>
        attributes(asset)?.viewName ?? ''
    const assetState = (asset: assetInterface) => asset?.status?.toLowerCase()
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
    const isSort = (asset: assetInterface) => attributes(asset)?.isSort
    const isIndexed = (asset: assetInterface) => attributes(asset)?.isIndexed

    const connectionRowLimit = (asset: assetInterface) =>
        attributes(asset)?.rowLimit
    const allowQuery = (asset: assetInterface) => attributes(asset)?.allowQuery
    const allowQueryPreview = (asset: assetInterface) =>
        attributes(asset)?.allowQueryPreview

    const links = (asset: assetInterface) => {
        const allLinks = attributes(asset)?.links

        const activeLinks = allLinks?.filter(
            (link) => link?.attributes?.__state === 'ACTIVE'
        )
        return activeLinks
    }

    const hasLineage = (asset: assetInterface) => {
        return attributes(asset)?.__hasLineage
    }

    function isValidHttpUrl(string) {
        let url

        try {
            url = new URL(string)
        } catch (_) {
            return false
        }

        return url.protocol === 'http:' || url.protocol === 'https:'
    }

    const link = (asset: assetInterface) => {
        if (isValidHttpUrl(attributes(asset)?.link)) {
            return attributes(asset)?.link
        }
        return ''
    }

    const queries = (asset: assetInterface) => attributes(asset)?.queries

    const getTabs = (list, typeName: string) => {
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
            if (i?.includeRoles) {
                if (
                    !i?.includeRoles?.some(
                        (t) => t?.toLowerCase() === role.value?.toLowerCase()
                    )
                ) {
                    flag = false
                }
            }

            return flag
        })
    }

    const { getList: cmList } = useCustomMetadataFacet()
    const discoveryStore = useAssetStore()

    const getPreviewTabs = (asset: assetInterface, inProfile: boolean) => {
        const store = integrationStore()
        const { tenantJiraStatus, tenantSlackStatus } = toRefs(store)
        let customTabList = []
        if (cmList(assetType(asset))?.length > 0) {
            customTabList = cmList(assetType(asset)).map((i) => {
                return {
                    component: 'customMetadata',
                    excludes: ['Query', 'Folder', 'Collection'],
                    image: i.options?.imageId || i.options?.logoUrl,
                    emoji: i.options?.emoji,
                    name: i.label,
                    tooltip: i.label,
                    scrubbed: true,
                    requiredInProfile: true,
                    data: i,
                    analyticsKey: 'custom_metadata',
                }
            })
        }

        let allTabs = [
            ...getTabs(previewTabs, assetType(asset)),
            ...(tenantSlackStatus.value.configured
                ? getTabs([SlackResourcesTab], assetType(asset))
                : []),
            ...(tenantJiraStatus.value.configured
                ? getTabs([JiraPreviewTab], assetType(asset))
                : []),
            ...getTabs(customTabList, assetType(asset)),
        ]

        if (
            connectorName(asset).toLowerCase() === 'glue' ||
            connectorName(asset).toLowerCase() === 'netsuite'
        ) {
            allTabs = allTabs.filter((tab) => tab.name !== 'Queries')
        }

        if (inProfile) {
            return allTabs.filter((tab) => tab.requiredInProfile === inProfile)
        }

        const personaStore = usePersonaStore()
        const { globalState } = toRefs(discoveryStore)

        const currentPersona = computed(() => {
            return personaStore.list.filter(
                (persona) => persona.id === globalState?.value[1]
            )[0]
        })

        if (currentPersona?.value?.attributes?.preferences) {
            const {
                attributes: {
                    preferences: { customMetadataDenyList },
                },
            } = currentPersona.value
            allTabs = allTabs.filter(
                (tab) => !customMetadataDenyList.includes(tab?.data?.guid)
            )
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

    const getProfilePath = (asset, appendOverview = false) => {
        if (assetType(asset) === 'Column') {
            const tableGuid =
                asset?.attributes?.table?.guid ||
                asset?.attributes?.tablePartition?.guid
            if (tableGuid) {
                return `/assets/${tableGuid}/overview?column=${asset?.guid}`
            }
            const viewGuid =
                asset?.attributes?.view?.guid ||
                asset?.attributes?.materialisedView?.guid
            if (viewGuid) {
                return `/assets/${viewGuid}/overview?column=${asset?.guid}`
            }
        } else if (assetType(asset) === 'SalesforceField') {
            const objectGuid = asset?.attributes?.object?.guid
            if (objectGuid) {
                return `/assets/${objectGuid}/overview?field=${asset?.guid}`
            }
        } else if (isGTC(asset)) {
            return `/glossary/${asset?.guid}`
        } else if (assetType(asset) === 'Query') {
            return `/insights?id=${asset.guid}`
        } else if (assetType(asset) === 'Collection') {
            return `/insights?col_id=${asset.guid}`
        } else if (
            assetType(asset) === 'Process' ||
            assetType(asset) === 'ColumnProcess' ||
            assetType(asset) === 'BIProcess'
        ) {
            return null
        } else if (appendOverview) {
            return `/assets/${asset.guid}/overview`
        }
        return `/assets/${asset?.guid}`
    }

    const getLineagePath = (asset) => {
        if (assetType(asset) === 'Column') {
            const tableGuid = asset?.attributes?.table?.guid
            if (tableGuid) {
                return `/assets/${tableGuid}/lineage`
            }
            const viewGuid = asset?.attributes?.view?.guid
            if (viewGuid) {
                return `/assets/${viewGuid}/lineage`
            }
        }
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
                tableName(asset)?.length > 0
                    ? tableName(asset)
                    : viewName(asset)
            const columnName = attributes(asset).name

            queryPath = `/insights?databaseQualifiedNameFromURL=${databaseQualifiedName}&schemaNameFromURL=${schema}&tableNameFromURL=${name}&columnNameFromURL=${columnName}&guid=${asset.guid}`
        } else if (
            assetType(asset) === 'Table' ||
            assetType(asset) === 'View'
        ) {
            const tableName = attributes(asset).name
            queryPath = `/insights?databaseQualifiedNameFromURL=${databaseQualifiedName}&schemaNameFromURL=${schema}&tableNameFromURL=${tableName}&guid=${asset.guid}`
        } else if (assetType(asset) === 'Query') {
            queryPath = `/insights?id=${asset.guid}`
        } else if (assetType(asset) === 'Collection') {
            queryPath = `/insights?col_id=${asset.guid}`
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
            : getCountString(attributes(asset).rowCount, false)

    const columnCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? attributes(asset)?.columnCount?.toLocaleString() || 'N/A'
            : getCountString(attributes(asset)?.columnCount, true)

    const tableCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? attributes(asset)?.tableCount?.toLocaleString() || 'N/A'
            : getCountString(attributes(asset).tableCount, false)

    const viewCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? attributes(asset)?.viewsCount?.toLocaleString() || 'N/A'
            : getCountString(attributes(asset).viewsCount, false)

    const termsCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? asset?.termsCount?.toLocaleString() || 'N/A'
            : getCountString(asset?.termsCount, true)

    const categoryCount = (asset: assetInterface, raw: boolean = false) =>
        raw
            ? asset?.categoryCount?.toLocaleString() || 'N/A'
            : getCountString(asset?.categoryCount, true)

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

    const powerBIColumnDataTypeImage = (asset: assetInterface) => {
        return dataTypeCategoryList.find((item) =>
            item.type.some(
                (i) =>
                    i.toLowerCase() ===
                    attributes(asset)?.powerBIColumnDataType?.toLowerCase()
            )
        )?.image
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
    const lastSyncRun = (asset: assetInterface) => {
        const runId = attributes(asset)?.lastSyncRun
        if (runId) {
            return {
                id: runId,
                url: `/workflows/${runId
                    .split('-')
                    .slice(0, -1)
                    .join('-')}/runs?name=${runId}`,
            }
        }
    }

    const lastSyncRunAt = (asset: assetInterface, raw: boolean = false) => {
        if (attributes(asset)?.lastSyncRunAt) {
            return raw
                ? formatDateTime(attributes(asset)?.lastSyncRunAt) || 'N/A'
                : useTimeAgo(attributes(asset)?.lastSyncRunAt).value
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

    const readme = (asset: assetInterface) => attributes(asset)?.readme

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

    const adminGroups = (asset: assetInterface) =>
        attributes(asset)?.adminGroups || []

    const adminUsers = (asset: assetInterface) =>
        attributes(asset)?.adminUsers || []

    const viewerGroups = (asset: assetInterface) =>
        attributes(asset)?.viewerGroups || []

    const viewerUsers = (asset: assetInterface) =>
        attributes(asset)?.viewerUsers || []

    const certificateStatus = (asset: assetInterface) => {
        return attributes(asset)?.certificateStatus
    }
    const certificateStatusMessage = (asset: assetInterface) => {
        return attributes(asset)?.certificateStatusMessage
    }
    const certificateUpdatedBy = (asset: assetInterface) => {
        const username = attributes(asset)?.certificateUpdatedBy
        return username?.startsWith('service-account-apikey-')
            ? 'API token'
            : username
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

    const sourceURL = (asset: assetInterface) => {
        return attributes(asset)?.sourceURL
    }

    const isBiAsset = (asset: assetInterface) => {
        return (
            assetType(asset)?.includes('Tableau') ||
            assetType(asset)?.includes('BI') ||
            assetType(asset)?.includes('Looker') ||
            assetType(asset)?.includes('DataStudio')
        )
    }
    const isSaasAsset = (asset: assetInterface) => {
        return assetType(asset)?.includes('Salesforce')
    }

    const isObjectAsset = (asset: assetInterface) => {
        return assetType(asset)?.includes('S3')
    }

    const isSQLAsset = (asset: assetInterface) => {
        return (
            assetType(asset) === 'Table' ||
            assetType(asset) === 'View' ||
            assetType(asset) === 'MaterialisedView' ||
            assetType(asset) === 'TablePartition' ||
            assetType(asset) === 'Column'
        )
    }

    const selectedAsset = computed(() => {
        return discoveryStore.selectedAsset
    })

    const glossaryStore = useGlossaryStore()

    const selectedGlossary = computed(() => {
        return glossaryStore.selectedGTC
    })

    const authStore = useAuthStore()

    const selectedAssetUpdatePermission = (
        asset: assetInterface,
        secondaryEvaluation = false,
        action = 'ENTITY_UPDATE',
        typeName?
    ) => {
        let evaluations: any = []

        // Anything that isn't a selectedAsset in store - any drawer, column items in columns tab
        if (secondaryEvaluation) {
            evaluations = authStore?.secondaryEvaluations
        } else {
            evaluations = authStore?.evaluations
        }

        if (typeName) {
            const evaluationObject = evaluations.find(
                (ev) =>
                    (ev?.entityGuidEnd1 === asset?.guid ||
                        ev?.entityGuidEnd2 === asset?.guid) &&
                    ev?.action === action &&
                    (ev?.entityTypeEnd1 === typeName ||
                        ev?.entityTypeEnd2 === typeName)
            )
            return evaluationObject?.allowed
        }

        return evaluations.find(
            (ev) => ev?.entityGuid === asset?.guid && ev?.action === action
        )?.allowed
    }

    const columnUpdatePermission = (
        asset: assetInterface,
        action = 'ENTITY_UPDATE',
        typeName?
    ) => {
        const evaluations = authStore?.columnEvaluations

        if (typeName) {
            const evaluationObject = evaluations.find(
                (ev) =>
                    ev?.entityIdEnd2 === asset?.attributes?.qualifiedName &&
                    ev?.action === action &&
                    (ev?.entityTypeEnd1 === typeName ||
                        ev?.entityTypeEnd2 === typeName)
            )
            return evaluationObject?.allowed
        }

        return evaluations.find(
            (ev) =>
                ev?.entityId === asset?.attributes?.qualifiedName &&
                ev?.action === action
        )?.allowed
    }

    const assetPermission = (permission) => {
        return !!authStore?.permissions.find((per) => per === permission)
    }

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

    const isCustom = (asset: assetInterface) => {
        if (attributes(asset)?.isCustom) {
            return true
        }
        return false
    }

    const isPublished = (asset: assetInterface) =>
        attributes(asset)?.isPublished

    const isGTC = (asset: assetInterface) => {
        if (isGTCByType(asset.typeName)) {
            return true
        }
        return false
    }

    const isProcess = (asset: assetInterface) => {
        return assetType(asset) === 'Process'
    }

    const getProcessSQL = (asset: assetInterface) => {
        return attributes(asset)?.sql
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

    const externalLocation = (asset: assetInterface) =>
        attributes(asset)?.externalLocation || ''
    const externalLocationFormat = (asset: assetInterface) =>
        attributes(asset)?.externalLocationFormat || ''

    const sourceId = (asset: assetInterface) =>
        attributes(asset)?.sourceId || '-'

    const fieldsLookerQuery = (asset: assetInterface) =>
        attributes(asset)?.fields || []

    const sourceOwners = (asset: assetInterface) =>
        attributes(asset)?.sourceOwners

    const resultMakerID = (asset: assetInterface) =>
        attributes(asset)?.resultMakerID || '-'

    const sourceMetadataId = (asset: assetInterface) =>
        attributes(asset)?.sourceMetadataId || '-'

    const sourceContentMetadataId = (asset: assetInterface) =>
        attributes(asset)?.sourceContentMetadataId || '-'

    const sourceViewCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.sourceViewCount, true)

    const sourceChildCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.sourceChildCount, true)

    const detailColumns = (asset: assetInterface) =>
        attributes(asset)?.detailColumns || []

    const picklistValues = (asset: assetInterface) =>
        attributes(asset)?.picklistValues || []

    const formula = (asset: assetInterface) => attributes(asset)?.formula

    const awsArn = (asset: assetInterface) => attributes(asset)?.awsArn || '-'

    const awsPartition = (asset: assetInterface) =>
        attributes(asset)?.awsPartition || '-'

    const awsService = (asset: assetInterface) =>
        attributes(asset)?.awsService || '-'

    const awsRegion = (asset: assetInterface) =>
        attributes(asset)?.awsRegion || '-'

    const awsAccountId = (asset: assetInterface) =>
        attributes(asset)?.awsAccountId || '-'

    const awsResourceId = (asset: assetInterface) =>
        attributes(asset)?.awsResourceId || '-'

    const awsOwnerName = (asset: assetInterface) =>
        attributes(asset)?.awsOwnerName || '-'

    const awsOwnerId = (asset: assetInterface) =>
        attributes(asset)?.awsOwnerId || '-'

    const awsTags = (asset: assetInterface) => attributes(asset)?.awsTags || []

    const s3ObjectCount = (asset: assetInterface) =>
        getCountString(attributes(asset)?.s3ObjectCount, true)

    const s3BucketVersioningEnabled = (asset: assetInterface) =>
        !!attributes(asset)?.s3BucketVersioningEnabled

    const s3BucketName = (asset: assetInterface) =>
        attributes(asset)?.s3BucketName || '-'

    const s3ObjectSize = (asset: assetInterface) =>
        attributes(asset)?.s3ObjectSize || '-'

    const s3ObjectStorageClass = (asset: assetInterface) =>
        attributes(asset)?.s3ObjectStorageClass || '-'

    const s3ObjectKey = (asset: assetInterface) =>
        attributes(asset)?.s3ObjectKey || '-'

    const s3ObjectLastModifiedTime = (asset: assetInterface) => {
        if (attributes(asset)?.s3ObjectLastModifiedTime) {
            return raw
                ? formatDateTime(attributes(asset)?.s3ObjectLastModifiedTime) ||
                      'N/A'
                : useTimeAgo(attributes(asset)?.s3ObjectLastModifiedTime).value
        }
        return '-'
    }

    const s3ObjectContentType = (asset: assetInterface) =>
        attributes(asset)?.s3ObjectContentType || '-'

    const s3ObjectContentDisposition = (asset: assetInterface) =>
        attributes(asset)?.s3ObjectContentDisposition || '-'

    const s3ObjectVersionId = (asset: assetInterface) =>
        attributes(asset)?.s3ObjectVersionId || '-'

    const googleService = (asset: assetInterface) =>
        attributes(asset)?.googleService || '-'

    const googleProjectName = (asset: assetInterface) =>
        attributes(asset)?.googleProjectName || '-'

    const googleProjectId = (asset: assetInterface) =>
        attributes(asset)?.googleProjectId || '-'

    const googleProjectNumber = (asset: assetInterface) =>
        attributes(asset)?.googleProjectNumber || '-'

    const dataStudioAssetType = (asset: assetInterface) =>
        attributes(asset)?.dataStudioAssetType || '-'

    const dataStudioAssetTitle = (asset: assetInterface) =>
        attributes(asset)?.dataStudioAssetTitle || '-'

    const dataStudioAssetOwner = (asset: assetInterface) =>
        attributes(asset)?.dataStudioAssetOwner || '-'

    const isTrashedDataStudioAsset = (asset: assetInterface) =>
        !!attributes(asset)?.isTrashedDataStudioAsset

    const powerBIMeasureExpression = (asset: assetInterface) =>
        attributes(asset)?.powerBIMeasureExpression || ''

    const powerBIColumnDataType = (asset: assetInterface) =>
        attributes(asset)?.powerBIColumnDataType

    return {
        dataTypeCategory,
        attributes,
        assetState,
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
        detailColumns,
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
        getConnectorLabel,
        anchorAttributes,
        readmeGuid,
        readme,
        getConnectorsNameFromQualifiedName,
        dataTypeImage,
        dataTypeImageForColumn,
        assetTypeLabel,
        assetTypeImage,
        getActions,
        getAssetQueryPath,
        link,
        webURL,
        isBiAsset,
        selectedGlossary,
        fieldsLookerQuery,
        isForeign,
        isSort,
        categories,
        seeAlso,
        preferredTerms,
        preferredToTerms,
        antonyms,
        synonyms,
        parentCategory,
        sourceOwners,
        isGTC,
        getProfilePath,
        isGTCByType,
        getAnchorQualifiedName,
        selectedAssetUpdatePermission,
        isSQLAsset,
        isSaasAsset,
        isObjectAsset,
        getLineagePath,
        isUserDescription,
        isScrubbed,
        assignedEntities,
        adminGroups,
        adminUsers,
        viewerGroups,
        viewerUsers,
        connectionRowLimit,
        allowQuery,
        allowQueryPreview,
        queries,
        assetPermission,
        assetTypeRelations,
        externalLocation,
        externalLocationFormat,
        parentWorkspace,
        parentReport,
        parentDashboard,
        parentDataset,
        reportCount,
        dashboardCount,
        datasetCount,
        dataflowCount,
        tileCount,
        pageCount,
        connectionGuid,
        isProcess,
        getProcessSQL,
        parentProject,
        parentDatasource,
        parentWorkbook,
        sourceURL,
        parentSite,
        resultMakerID,
        sourceMetadataId,
        sourceContentMetadataId,
        sourceViewCount,
        parentFolder,
        parentModel,
        parentDatabase,
        parentSchema,
        parentTable,
        parentView,
        parentProcess,
        sourceChildCount,
        tableCount,
        viewCount,
        parentOrganization,
        parentObject,
        parentBucket,
        lastSyncRun,
        lastSyncRunAt,
        sourceId,
        fieldCount,
        apiName,
        isCustom,
        picklistValues,
        formula,
        getConnectorLabelByName,
        isIndexed,
        isPublished,
        databaseQualifiedName,
        schemaQualifiedName,
        awsArn,
        awsPartition,
        awsService,
        awsRegion,
        awsAccountId,
        awsResourceId,
        awsOwnerName,
        awsOwnerId,
        awsTags,
        s3ObjectCount,
        s3BucketVersioningEnabled,
        s3ObjectLastModifiedTime,
        s3BucketName,
        s3ObjectSize,
        s3ObjectStorageClass,
        s3ObjectKey,
        s3ObjectContentType,
        s3ObjectContentDisposition,
        s3ObjectVersionId,
        columnUpdatePermission,
        hasLineage,
        googleService,
        googleProjectName,
        googleProjectId,
        googleProjectNumber,
        dataStudioAssetType,
        dataStudioAssetTitle,
        dataStudioAssetOwner,
        isTrashedDataStudioAsset,
        powerBITableColumnCount,
        powerBITableMeasureCount,
        powerBIMeasureExpression,
        powerBIColumnDataType,
        powerBIColumnDataTypeImage,
    }
}
