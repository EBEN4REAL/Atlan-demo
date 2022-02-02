import { Ref, ComputedRef, ref, toRaw, watch, inject } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import {
    SavedQuery,
    QueryCollection,
} from '~/types/insights/savedQuery.interface'
import {
    decodeQuery as decodeBase64Data,
    serializeQuery,
} from '~/utils/helper/routerHelper'
import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { useEditor } from '~/components/insights/common/composables/useEditor'
import { message } from 'ant-design-vue'
import whoami from '~/composables/user/whoami'
import { Insights } from '~/services/meta/insights/index'
import { generateUUID } from '~/utils/helper/generator'
import useAddEvent from '~/composables/eventTracking/useAddEvent'
import { useTenantStore } from '~/store/tenant'
import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
import useSetClassifications from '~/composables/discovery/useSetClassifications'
import updateAsset from '~/composables/discovery/updateAsset'
import { generateSQLQuery } from '~/components/insights/playground/editor/vqb/composables/generateSQLQuery'

export function useSavedQuery(
    tabsArray: Ref<activeInlineTabInterface[]>,
    activeInlineTab: ComputedRef<activeInlineTabInterface>,
    activeInlineTabKey: Ref<string>,
    treeSelectedKeys?: Ref<string[]>
) {
    const { username } = whoami()
    const tenantStore = useTenantStore()
    const { syncInlineTabsInLocalStorage } = useLocalStorageSync()
    const queryCollections = inject('queryCollections') as ComputedRef<
        QueryCollection[] | undefined
    >
    const {
        getConnectorName,
        getConnectionQualifiedName,
        getSchemaQualifiedName,
        getDatabaseQualifiedName,
        getConnectorsDataFromQualifiedNames,
        getConnectorsDataFromQualifiedNamesAll,
    } = useConnector()
    const { getParsedQuery } = useEditor()

    const {
        overwriteInlineTab,
        isInlineTabAlreadyOpened,
        inlineTabAdd,
        modifyActiveInlineTab,
        modifyActiveInlineTabEditor,
    } = useInlineTab(treeSelectedKeys)

    const { queryRun } = useRunQuery()

    const openSavedQueryInNewTab = async (savedQuery: SavedQuery) => {
        let decodedVariables = decodeBase64Data(
            savedQuery?.attributes?.variablesSchemaBase64
        ) as CustomVaribaleInterface[]

        const defaultSchemaQualifiedName =
            savedQuery?.attributes?.defaultSchemaQualifiedName
        const connectionQualifiedName =
            savedQuery.attributes.connectionQualifiedName

        const defaultDatabaseQualifiedName =
            savedQuery?.attributes?.defaultDatabaseQualifiedName

        const connectors = getConnectorsDataFromQualifiedNamesAll(
            connectionQualifiedName,
            defaultSchemaQualifiedName,
            defaultDatabaseQualifiedName
        )
        console.log(connectors, 'connectors')
        console.log('saved query: ', savedQuery)

        const visualBuilderSchemaBase64 =
            savedQuery?.attributes?.visualBuilderSchemaBase64
        const isVisualQuery = savedQuery?.attributes?.isVisualQuery

        let decodedVQB = decodeBase64Data(visualBuilderSchemaBase64)

        const newTab: activeInlineTabInterface = {
            attributes: savedQuery?.attributes,
            label: savedQuery?.attributes?.name ?? '',
            key: savedQuery?.guid,
            favico: 'https://atlan.com/favicon.ico',
            isSaved: true,
            queryId: savedQuery?.guid,
            updateTime:
                savedQuery?.updateTime ??
                savedQuery.attributes.__modificationTimestamp,
            updatedBy:
                savedQuery?.updatedBy ?? savedQuery.attributes.__modifiedBy,
            connectionId: savedQuery.attributes.connectionId,
            description: savedQuery.attributes.description as string,
            qualifiedName: savedQuery.attributes.qualifiedName,
            parentGuid: savedQuery.attributes?.parent?.guid,
            parentQualifiedName: savedQuery.attributes.parentQualifiedName,
            isSQLSnippet: savedQuery.attributes.isSnippet as boolean,
            status: savedQuery.attributes.certificateStatus as string,
            savedQueryParentFolderTitle: savedQuery?.parentTitle,
            collectionQualifiedName:
                savedQuery?.attributes?.collectionQualifiedName,
            explorer: {
                schema: {
                    connectors: connectors,
                },
                queries: {
                    connectors: {
                        connector: savedQuery.attributes.connectorName,
                    },
                    collection: {
                        // copy from last tab
                        guid: activeInlineTab?.value?.explorer?.queries
                            ?.collection?.guid,
                        qualifiedName:
                            savedQuery?.attributes?.collectionQualifiedName,
                        parentQualifiedName: undefined,
                    },
                },
            },
            playground: {
                isVQB: isVisualQuery ? true : false,
                vqb: isVisualQuery
                    ? decodedVQB
                    : {
                          selectedTables: [],
                          panels: [
                              {
                                  order: 1,
                                  id: 'columns',
                                  hide: true,
                                  subpanels: [
                                      {
                                          id: '1',
                                          columns: ['all'],
                                          tableData: {
                                              certificateStatus: undefined,
                                              assetType: undefined,
                                              item: {},
                                          },
                                          columnsData: [],
                                      },
                                  ],
                                  expand: true,
                              },
                          ],
                      },
                editor: {
                    text: savedQuery?.attributes?.rawQuery
                        ? savedQuery?.attributes?.rawQuery
                        : '',
                    dataList: [],
                    columnList: [],
                    variables: Array.isArray(decodedVariables)
                        ? decodedVariables
                        : [],
                    savedVariables: Array.isArray(decodedVariables)
                        ? decodedVariables
                        : [],
                    limitRows: {
                        checked: false,
                        rowsCount: -1,
                    },
                    context: {
                        ...connectors,
                    },
                },
                resultsPane: {
                    activeTab:
                        activeInlineTab.value?.playground.resultsPane
                            .activeTab ?? 0,
                    result: {
                        title: savedQuery?.attributes?.name,
                        isQueryRunning: '',
                        isQueryAborted: false,
                        queryErrorObj: {},
                        errorDecorations: [],
                        totalRowsCount: -1,
                        executionTime: -1,
                        runQueryId: undefined,
                        buttonDisable: false,
                        eventSourceInstance: undefined,
                    },
                    metadata: {},
                    queries: {},
                    joins: {},
                    filters: {},
                    impersonation: {},
                    downstream: {},
                    sqlHelp: {},
                },
            },
            assetSidebar: {
                // for taking the previous state from active tab
                isVisible: false,
                assetInfo: savedQuery,
                title: activeInlineTab.value?.assetSidebar.title ?? '',
                id: activeInlineTab.value?.assetSidebar.id ?? '',
            },
        }

        const check = isInlineTabAlreadyOpened(newTab, tabsArray)
        if (!check) {
            // console.log('saved query tab not opened')
            /* CAREFUL:-------Order is important here------ */
            inlineTabAdd(newTab, tabsArray, activeInlineTabKey)
            activeInlineTabKey.value = newTab.queryId
            /* ----------------------------- */
            // syncying inline tabarray in localstorage
            syncInlineTabsInLocalStorage(tabsArray.value)
            return
        } else {
            // console.log('saved query tab opened')
            // show user that this tab is already opened
            let key = undefined
            let index = -1
            tabsArray.value.forEach((tab, i) => {
                if (tab.queryId === newTab.queryId) {
                    key = tab.key
                    index = i
                }
            })
            newTab.key = key
            // console.log(
            //     'tab data: ',
            //     tabsArray.value[index].playground.resultsPane.result
            //         .isQueryRunning
            // )

            // stop overwrite for now
            // overwriteInlineTab(newTab, tabsArray)
            activeInlineTabKey.value = key
        }
    }

    const openSavedQueryInNewTabAndRun = (
        savedQuery,
        getData: (
            activeInlineTab,
            rows: any[],
            columns: any[],
            executionTime: number
        ) => void,
        limitRows?: Ref<{ checked: boolean; rowsCount: number }>,
        editorInstance: Ref<any>,
        monacoInstance: Ref<any>,
        onRunCompletion,
        onQueryIdGeneration
    ) => {
        openSavedQueryInNewTab({
            ...savedQuery?.value,
            parentTitle:
                savedQuery?.value?.attributes?.parent?.attributes?.name,
        })
        setTimeout(() => {
            console.log('active tab copy: ', activeInlineTab)
            queryRun(
                activeInlineTab,
                getData,
                limitRows,
                onRunCompletion,
                onQueryIdGeneration,
                savedQuery.value?.attributes.rawQuery,
                editorInstance,
                monacoInstance,
                activeInlineTab?.value?.playground?.isVQB
            )
        }, 250)
    }

    const getCollectionByQualifiedName = (qualifiedName: string) => {
        return queryCollections.value.find(
            (collection) =>
                collection.attributes.qualifiedName === qualifiedName
        )
    }

    /* Involved network requests */
    const updateSavedQuery = (
        editorInstance: Ref<any>,
        isUpdating: Ref<boolean>,
        activeInlineTab: activeInlineTabInterface,
        limitRows?: Ref<{
            checked: boolean
            rowsCount: number
        }>
    ) => {
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab
        )

        console.log('update query attribute: ', activeInlineTab)

        let visualBuilderSchemaBase64 = undefined
        let isVisualQuery = false
        let rawQuery = activeInlineTab?.playground?.editor?.text
        // if (isVQB) {
        //     visualBuilderSchemaBase64 = serializeQuery(
        //         activeInlineTabCopy?.playground.vqb
        //     )
        //     isVisualQuery = true
        // }
        if (activeInlineTabCopy.playground.isVQB && limitRows?.value) {
            visualBuilderSchemaBase64 = serializeQuery(
                activeInlineTabCopy?.playground.vqb
            )
            rawQuery = generateSQLQuery(activeInlineTab, limitRows.value)
            isVisualQuery = true
        }

        const attributeValue =
            activeInlineTab.playground.editor.context.attributeValue

        const attributeName =
            activeInlineTab.playground.editor.context.attributeName
        const connectorName = getConnectorName(attributeValue)
        const connectionQualifiedName =
            getConnectionQualifiedName(attributeValue)
        const connectionName = getConnectorName(attributeValue)
        const name = activeInlineTab?.label
        const certificateStatus = activeInlineTab?.status
        const description = activeInlineTab?.description
        const isSQLSnippet = activeInlineTab?.isSQLSnippet
        const collectionQualifiedName = getCollectionByQualifiedName(
            activeInlineTab.collectionQualifiedName
        )?.attributes.qualifiedName
        console.log(
            'update saved query collectionQualifiedName',
            collectionQualifiedName
        )
        /* NEED TO CHECK IF qualifiedName will also change acc to connectors it has connectionQualifiedName */
        const qualifiedName = activeInlineTab?.qualifiedName
        // const

        const defaultSchemaQualifiedName =
            getSchemaQualifiedName(attributeValue) ?? undefined

        const defaultDatabaseQualifiedName =
            getDatabaseQualifiedName(attributeValue) ?? undefined

        const variablesSchemaBase64 = serializeQuery(
            activeInlineTab?.playground.editor.variables
        )
        const body = ref({
            entity: {
                typeName: 'Query',
                attributes: {
                    visualBuilderSchemaBase64,
                    isVisualQuery,
                    connectorName,
                    name,
                    qualifiedName,
                    connectionName,
                    defaultSchemaQualifiedName,
                    defaultDatabaseQualifiedName,
                    certificateStatus:
                        certificateStatus === 'is_null'
                            ? undefined
                            : certificateStatus,
                    isSnippet: isSQLSnippet,
                    connectionId: connectionQualifiedName,
                    connectionQualifiedName,
                    collectionQualifiedName,
                    description,
                    ownerUsers: [username.value],
                    tenantId: 'default',
                    rawQuery,
                    variablesSchemaBase64,
                    isPrivate: true,
                    parent: {
                        guid: activeInlineTab.parentGuid,
                    },
                    parentQualifiedName: activeInlineTab?.parentQualifiedName,
                },
                guid: activeInlineTab?.queryId,
            },
        })

        // console.log('update query body: ', body.value)

        isUpdating.value = true
        const { data, error, isLoading } = Insights.UpdateSavedQuery(
            body.value,
            {}
        )

        watch([data, error, isLoading], () => {
            if (isLoading.value == false) {
                isUpdating.value = false
                if (error.value === undefined) {
                    useAddEvent('insights', 'query', 'updated', {
                        variables_count: getVariableCount(),
                        visual_query: !!activeInlineTab.playground.isVQB,
                    })
                    message.success({
                        content: `${name} query saved!`,
                    })

                    /* Not present in response */
                    activeInlineTabCopy.updateTime = Date.now()
                    activeInlineTabCopy.updatedBy = username.value
                    /* ----------------------------------------------- */
                    // making it save
                    activeInlineTabCopy.isSaved = true
                    modifyActiveInlineTab(activeInlineTabCopy, tabsArray, true)
                } else {
                    if (
                        error?.value?.response?.data?.errorCode ===
                        'ATLAS-403-00-001'
                    ) {
                        message.error(
                            `You are not allowed to create the query within the selected collection`
                        )
                    } else {
                        message.error(`Error in saving query!`)
                    }
                }
            }
        })
    }
    const saveQueryToDatabase = async (
        saveQueryData: any,
        saveQueryLoading: Ref<boolean>,
        showSaveQueryModal: Ref<boolean>,
        saveModalRef: Ref<any>,
        router: any,
        route: any,
        type: string,
        parentFolderQF: string,
        parentFolderGuid: string,
        activeInlineTab: activeInlineTabInterface,
        limitRows?: Ref<{
            checked: boolean
            rowsCount: number
        }>,
        Callback?: Function,
        routeToGuid: boolean = true,
        isVQB: boolean = false
    ) => {
        let rawQuery = activeInlineTab.playground.editor.text
        const attributeValue =
            activeInlineTab.playground.editor.context.attributeValue
        const attributeName =
            activeInlineTab.playground.editor.context.attributeName
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab
        )

        const { assetTerms, assetClassification } = saveQueryData

        activeInlineTabCopy.isSaved = true
        activeInlineTabCopy.label = saveQueryData.title
        activeInlineTabCopy.status = saveQueryData.certificateStatus

        let visualBuilderSchemaBase64 = undefined
        let isVisualQuery = false
        if (isVQB && limitRows?.value) {
            visualBuilderSchemaBase64 = serializeQuery(
                activeInlineTab?.playground.vqb
            )
            rawQuery = generateSQLQuery(activeInlineTab, limitRows.value)
            isVisualQuery = true
        }

        // {{collectionQname}}/query/{username}/random-uuid

        const uuidv4 = generateUUID()
        const connectorName = getConnectorName(attributeValue) ?? ''
        const connectionQualifiedName =
            getConnectionQualifiedName(attributeValue)
        const connectionGuid = ''
        const connectionName = getConnectorName(attributeValue)
        const name = saveQueryData.title
        const description = saveQueryData.description
        const certificateStatus = saveQueryData.certificateStatus
        const isSQLSnippet = saveQueryData.isSQLSnippet

        // const qualifiedName = `${tenantStore.tenantRaw.realm}/user/${username.value}/${uuidv4}`
        const defaultSchemaQualifiedName =
            getSchemaQualifiedName(attributeValue) ?? ''
        const variablesSchemaBase64 = serializeQuery(
            activeInlineTab?.playground.editor.variables
        )

        const collectionQualifiedName = saveQueryData?.collection
        const qualifiedName = `${collectionQualifiedName}/query/${username.value}/${uuidv4}`

        const body = ref<Record<string, any>>({
            entity: {
                typeName: 'Query',
                attributes: {
                    visualBuilderSchemaBase64,
                    isVisualQuery,
                    connectorName,
                    name,
                    qualifiedName,
                    connectionName,
                    defaultSchemaQualifiedName:
                        defaultSchemaQualifiedName ?? '',
                    certificateStatus:
                        certificateStatus === 'is_null'
                            ? undefined
                            : certificateStatus,
                    isSnippet: isSQLSnippet,
                    connectionQualifiedName: connectionQualifiedName ?? '',
                    description,
                    ownerUsers: [username.value],
                    tenantId: 'default',
                    rawQuery,
                    variablesSchemaBase64,
                    connectionId: connectionGuid,
                    isPrivate: true,
                    collectionQualifiedName,
                },
                /*TODO Created by will eventually change according to the owners*/
                isIncomplete: false,
                status: 'ACTIVE',
                createdBy: username.value,
            },
        })
        body.value.entity.attributes.parentQualifiedName = parentFolderQF
        body.value.entity.attributes.parent = {
            guid: parentFolderGuid,
        }
        if (type && type.length && parentFolderQF == 'root') {
            body.value.entity.classifications = [
                {
                    attributes: {},
                    propagate: true,
                    removePropagationsOnEntityDelete: true,
                    typeName: type,
                    validityPeriods: [],
                },
            ]
        }
        // chaing loading to true
        saveQueryLoading.value = true
        const { data, error, isLoading } = Insights.CreateSavedQuery(body.value)

        watch([data, error, isLoading], () => {
            if (isLoading.value == false) {
                saveQueryLoading.value = false
                if (error.value === undefined) {
                    linkTerms(
                        assetTerms,
                        {
                            guid: data?.value?.mutatedEntities?.CREATE[0]?.guid,
                            collectionQualifiedName: collectionQualifiedName,
                            parentFolderGuid: parentFolderGuid,
                            parentFolderQF: parentFolderQF,
                            qualifiedName:
                                data?.value?.mutatedEntities?.CREATE[0]
                                    ?.attributes?.qualifiedName,
                            name: name,
                        },
                        'Query'
                    )

                    linkClassification(
                        assetClassification,
                        {
                            guid: data?.value?.mutatedEntities?.CREATE[0]?.guid,
                            collectionQualifiedName: collectionQualifiedName,
                            parentFolderGuid: parentFolderGuid,
                            parentFolderQF: parentFolderQF,
                            qualifiedName:
                                data?.value?.mutatedEntities?.CREATE[0]
                                    ?.attributes?.qualifiedName,
                            name: name,
                        },
                        'Query'
                    )

                    useAddEvent('insights', 'query', 'saved', {
                        variables_count: getVariableCount(),
                        visual_query: !!activeInlineTab.playground.isVQB,
                    })
                    showSaveQueryModal.value = false
                    message.success({
                        content: `${name} query saved!`,
                    })
                    saveModalRef.value?.clearData()
                    const guid = data.value.mutatedEntities.CREATE[0].guid
                    console.log(data.value, 'saved')
                    /* Not present in response */
                    activeInlineTabCopy.updateTime = Date.now()
                    activeInlineTabCopy.updatedBy = username.value
                    /* ----------------------------------------------- */
                    activeInlineTabCopy.qualifiedName = qualifiedName
                    activeInlineTabCopy.queryId = guid
                    modifyActiveInlineTab(activeInlineTabCopy, tabsArray, true)
                    if (routeToGuid) {
                        if (guid) {
                            const queryParams = { id: guid }
                            if (route?.query?.vqb) queryParams.vqb = true
                            router.push({
                                path: `insights`,
                                query: queryParams,
                            })
                        }
                    }
                    if (Callback) Callback()
                } else {
                    if (
                        error?.value?.response?.data?.errorCode ===
                        'ATLAS-403-00-001'
                    ) {
                        message.error(
                            `You are not allowed to create the query within the selected collection`
                        )
                    } else {
                        message.error(`Error in saving query!`)
                    }
                    /* Saving error in errorRef */
                    if (Callback) Callback(error)
                }
            }
        })
    }

    const saveQueryToDatabaseAndOpenInNewTab = (
        saveQueryData: any,
        editorInstance: Ref<any>,
        saveQueryLoading: Ref<boolean>,
        showSaveQueryModal: Ref<boolean>,
        saveModalRef: Ref<any>,
        router: any,
        route,
        type: string,
        parentFolderQF: string,
        parentFolderGuid: string,
        limitRows?: Ref<{
            checked: boolean
            rowsCount: number
        }>,
        isVQB: boolean = false
    ) => {
        let rawQuery = ''
        const editorInstanceRaw = toRaw(editorInstance.value)
        // eslint-disable-next-line prefer-destructuring
        const attributeValue =
            activeInlineTab.value.explorer.schema.connectors.attributeValue
        // eslint-disable-next-line prefer-object-spread

        // /* Editor text */
        // activeInlineTabCopy.playground.editor.text = ''
        const uuidv4 = generateUUID()

        const { assetTerms, assetClassification } = saveQueryData

        let visualBuilderSchemaBase64 = undefined
        let isVisualQuery = false
        if (isVQB && limitRows?.value) {
            visualBuilderSchemaBase64 = serializeQuery(
                activeInlineTab.value?.playground.vqb
            )
            rawQuery = generateSQLQuery(activeInlineTab.value, limitRows.value)
            isVisualQuery = true
        }

        const connectorName = getConnectorName(attributeValue) ?? ''
        const connectionQualifiedName =
            getConnectionQualifiedName(attributeValue)
        const connectionName = getConnectorName(attributeValue)
        const name = saveQueryData.title
        const { description } = saveQueryData
        const { certificateStatus } = saveQueryData
        const { isSQLSnippet } = saveQueryData
        const defaultSchemaQualifiedName =
            getSchemaQualifiedName(attributeValue) ?? ''
        const defaultDatabaseQualifiedName =
            getDatabaseQualifiedName(attributeValue) ?? undefined
        const variablesSchemaBase64 = []
        // const uuidv4 = generateUUID()
        const collectionQualifiedName = saveQueryData?.collection
        const qualifiedName = `${collectionQualifiedName}/query/${username.value}/${uuidv4}`
        // const variablesSchemaBase64 = []

        const body = ref<Record<string, any>>({
            entity: {
                typeName: 'Query',
                attributes: {
                    visualBuilderSchemaBase64,
                    isVisualQuery,
                    connectorName,
                    name,
                    qualifiedName,
                    connectionName,
                    defaultSchemaQualifiedName,
                    certificateStatus:
                        certificateStatus === 'is_null'
                            ? undefined
                            : certificateStatus,
                    isSnippet: isSQLSnippet,
                    connectionQualifiedName,
                    defaultDatabaseQualifiedName,
                    description,
                    ownerUsers: [username.value],
                    tenantId: 'default',
                    rawQuery,
                    variablesSchemaBase64,
                    isPrivate: true,
                    collectionQualifiedName,
                },
                /*TODO Created by will eventually change according to the owners*/
                isIncomplete: false,
                status: 'ACTIVE',
                createdBy: username.value,
            },
        })
        body.value.entity.attributes.parentQualifiedName = parentFolderQF
        if (parentFolderQF.includes('/folder')) {
            body.value.entity.attributes.parent = {
                guid: parentFolderGuid,
                typeName: 'Folder',
            }
        } else {
            body.value.entity.attributes.parent = {
                guid: parentFolderGuid,
                typeName: 'Collection',
            }
        }
        // chaing loading to true
        saveQueryLoading.value = true
        const { data, error, isLoading } = Insights.CreateSavedQuery(
            body.value,
            {}
        )

        watch([data, error, isLoading], () => {
            if (isLoading.value === false) {
                saveQueryLoading.value = false
                if (error.value === undefined) {
                    linkTerms(
                        assetTerms,
                        {
                            guid: data?.value?.mutatedEntities?.CREATE[0]?.guid,
                            collectionQualifiedName: collectionQualifiedName,
                            parentFolderGuid: parentFolderGuid,
                            parentFolderQF: parentFolderQF,
                            qualifiedName:
                                data?.value?.mutatedEntities?.CREATE[0]
                                    ?.attributes?.qualifiedName,
                            name: name,
                        },
                        'Query'
                    )

                    linkClassification(
                        assetClassification,
                        {
                            guid: data?.value?.mutatedEntities?.CREATE[0]?.guid,
                            collectionQualifiedName: collectionQualifiedName,
                            parentFolderGuid: parentFolderGuid,
                            parentFolderQF: parentFolderQF,
                            qualifiedName:
                                data?.value?.mutatedEntities?.CREATE[0]
                                    ?.attributes?.qualifiedName,
                            name: name,
                        },
                        'Query'
                    )

                    const savedQuery = data.value.mutatedEntities.CREATE[0]

                    const parentGuid = parentFolderGuid
                    const parentQualifiedName =
                        data.value.mutatedEntities.CREATE[0].attributes
                            .parentQualifiedName

                    savedQuery.attributes.variablesSchemaBase64 = []
                    savedQuery.attributes = {
                        ...savedQuery.attributes,
                        parent: {
                            guid: parentGuid,
                            qualifiedName: parentQualifiedName,
                        },
                    }

                    showSaveQueryModal.value = false
                    message.success(`${name} query saved!`)
                    saveModalRef.value?.clearData()
                    // const guid = savedQuery.guid
                    console.log(data.value, 'saved')
                    if (savedQuery.guid) {
                        const queryParams = { id: savedQuery.guid }
                        if (route?.query?.vqb) queryParams.vqb = true
                        router.push({ path: `insights`, query: queryParams })
                    }

                    openSavedQueryInNewTab(savedQuery)
                } else {
                    if (
                        error?.value?.response?.data?.errorCode ===
                        'ATLAS-403-00-001'
                    ) {
                        message.error(
                            `You are not allowed to create the query within the selected collection`
                        )
                    } else {
                        message.error(`Error in saving query!`)
                    }
                }
            }
        })

        return { data, error, isLoading }
    }

    const createFolder = (
        folderName: string,
        saveFolderLoading: Ref<boolean>,
        type: string,
        parentFolderQF: Ref<string>,
        parentFolderGuid: Ref<string>,
        collection: ComputedRef<QueryCollection>
    ) => {
        console.log('parentFolderQF', parentFolderQF.value)
        const attributeValue =
            activeInlineTab.value.explorer.schema.connectors.attributeValue
        const attributeName =
            activeInlineTab.value.explorer.schema.connectors.attributeName

        const uuidv4 = generateUUID()
        const connectorName = getConnectorName(attributeValue) ?? ''
        console.log(connectorName, 'connectorName')
        const connectionQualifiedName =
            getConnectionQualifiedName(attributeValue)
        const connectionGuid = ''
        const connectionName = getConnectorName(attributeValue)
        const collectionQualifiedName =
            collection.value.attributes.qualifiedName

        const name = folderName

        const qualifiedName = `${collectionQualifiedName}/folder/${username.value}/${uuidv4}`

        const defaultSchemaQualifiedName =
            `${attributeName}.${attributeValue}` ?? ''

        const body = ref<Record<string, any>>({
            entity: {
                typeName: 'Folder',
                attributes: {
                    // connectorName,
                    name,
                    qualifiedName,
                    // connectionName,
                    // defaultSchemaQualifiedName,
                    // connectionQualifiedName,
                    collectionQualifiedName,
                    ownerUsers: [username.value],
                    tenantId: 'default',
                    // connectionId: connectionGuid,
                    isPrivate: true,
                },
                /*TODO Created by will eventually change according to the owners*/
                isIncomplete: false,
                status: 'ACTIVE',
                createdBy: username.value,
            },
        })

        body.value.entity.attributes.parentQualifiedName = parentFolderQF.value
        if (parentFolderQF.value.includes('/folder')) {
            // parent is folder
            body.value.entity.attributes.parent = {
                guid: parentFolderGuid.value,
                typeName: 'Folder',
            }
        } else {
            // parent is collection
            body.value.entity.attributes.parent = {
                guid: parentFolderGuid.value,
                typeName: 'Collection',
            }
        }
        // chaing loading to true
        saveFolderLoading.value = true
        const { data, error, isLoading } = Insights.CreateQueryFolder(
            body.value,
            {}
        )

        watch([data, error, isLoading], () => {
            if (isLoading.value == false) {
                saveFolderLoading.value = false
                if (error.value === undefined) {
                    message.success({
                        content: `Folder ${name} created!`,
                    })
                    useAddEvent('insights', 'folder', 'created')
                } else {
                    if (
                        error?.value?.response?.data?.errorCode ===
                        'ATLAS-403-00-001'
                    ) {
                        message.error(
                            `You are not allowed to create the folder within the selected collection`
                        )
                    } else {
                        message.error(`Error in saving the folder!`)
                    }
                }
            }
        })

        return { data, error, isLoading }
    }

    const saveQueryToDatabaseWithTerms = async (
        assetTerms: any,
        assetClassification: any,
        saveQueryData: any,
        saveQueryLoading: Ref<boolean>,
        showSaveQueryModal: Ref<boolean>,
        saveModalRef: Ref<any>,
        router: any,
        route,
        parentFolderQF: string,
        parentFolderGuid: string,
        activeInlineTab: activeInlineTabInterface,
        Callback?: Function,
        limitRows?: Ref<{
            checked: boolean
            rowsCount: number
        }>,
        routeToGuid: boolean = true,
        isVQB: boolean = false
    ) => {
        let rawQuery = activeInlineTab?.playground?.editor?.text
        const attributeValue =
            activeInlineTab.playground.editor.context.attributeValue
        const attributeName =
            activeInlineTab.playground.editor.context.attributeName
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab
        )
        activeInlineTabCopy.isSaved = true
        activeInlineTabCopy.label = saveQueryData.title
        activeInlineTabCopy.status = saveQueryData.certificateStatus

        const uuidv4 = generateUUID()

        const connectorName = getConnectorName(attributeValue) ?? ''
        const connectionQualifiedName =
            getConnectionQualifiedName(attributeValue)
        const connectionGuid = ''
        const connectionName = getConnectorName(attributeValue)
        const name = saveQueryData.title
        const { description } = saveQueryData
        const { certificateStatus } = saveQueryData
        const { isSQLSnippet } = saveQueryData

        const defaultSchemaQualifiedName =
            getSchemaQualifiedName(attributeValue) ?? undefined
        const defaultDatabaseQualifiedName =
            getDatabaseQualifiedName(attributeValue) ?? undefined
        getSchemaQualifiedName(attributeValue) ?? undefined
        const variablesSchemaBase64 = serializeQuery(
            activeInlineTab?.playground.editor.variables
        )

        let visualBuilderSchemaBase64 = undefined
        let isVisualQuery = false

        if (activeInlineTabCopy.playground.isVQB && limitRows?.value) {
            visualBuilderSchemaBase64 = serializeQuery(
                activeInlineTabCopy?.playground.vqb
            )
            rawQuery = generateSQLQuery(activeInlineTab, limitRows.value)
            isVisualQuery = true
        }

        const collectionQualifiedName = saveQueryData?.collection
        const qualifiedName = `${collectionQualifiedName}/query/${username.value}/${uuidv4}`

        const body = ref<Record<string, any>>({
            entity: {
                typeName: 'Query',
                attributes: {
                    connectorName,
                    visualBuilderSchemaBase64,
                    isVisualQuery,
                    name,
                    qualifiedName,
                    connectionName,
                    defaultSchemaQualifiedName:
                        defaultSchemaQualifiedName ?? '',
                    certificateStatus:
                        certificateStatus === 'is_null'
                            ? undefined
                            : certificateStatus,
                    isSnippet: isSQLSnippet,
                    connectionQualifiedName: connectionQualifiedName ?? '',
                    defaultDatabaseQualifiedName,
                    description,
                    ownerUsers: [username.value],
                    tenantId: 'default',
                    rawQuery,
                    variablesSchemaBase64,
                    connectionId: connectionGuid,
                    isPrivate: false,
                    collectionQualifiedName,
                },
                /*TODO Created by will eventually change according to the owners*/
                isIncomplete: false,
                status: 'ACTIVE',
                createdBy: username.value,
            },
        })
        body.value.entity.attributes.parentQualifiedName = parentFolderQF
        if (parentFolderQF.includes('/folder')) {
            // folder is parent
            body.value.entity.attributes.parent = {
                guid: parentFolderGuid,
                typeName: 'Folder',
            }
        } else {
            // collection is parent
            body.value.entity.attributes.parent = {
                guid: parentFolderGuid,
                typeName: 'Collection',
            }
        }
        console.log('hola hola hola parentFolderQF', parentFolderQF)
        // chaing loading to true
        saveQueryLoading.value = true
        const { data, error, isLoading } = Insights.CreateSavedQuery(
            body.value,
            {}
        )

        watch([data, error, isLoading], () => {
            if (isLoading.value == false) {
                saveQueryLoading.value = false
                if (error.value === undefined) {
                    if (Callback) {
                        Callback(parentFolderGuid, 'query')
                    }

                    linkTerms(
                        assetTerms,
                        {
                            guid: data?.value?.mutatedEntities?.CREATE[0]?.guid,
                            collectionQualifiedName: collectionQualifiedName,
                            parentFolderGuid: parentFolderGuid,
                            parentFolderQF: parentFolderQF,
                            qualifiedName:
                                data?.value?.mutatedEntities?.CREATE[0]
                                    ?.attributes?.qualifiedName,
                            name: name,
                        },
                        'Query'
                    )

                    linkClassification(
                        assetClassification,
                        {
                            guid: data?.value?.mutatedEntities?.CREATE[0]?.guid,
                            collectionQualifiedName: collectionQualifiedName,
                            parentFolderGuid: parentFolderGuid,
                            parentFolderQF: parentFolderQF,
                            qualifiedName:
                                data?.value?.mutatedEntities?.CREATE[0]
                                    ?.attributes?.qualifiedName,
                            name: name,
                        },
                        'Query'
                    )

                    // handleCancel()
                    // console.log('checked terms: ', assetTerms.value)

                    useAddEvent('insights', 'query', 'saved', {
                        variables_count: getVariableCount(),
                        visual_query: !!activeInlineTab.playground.isVQB,
                    })
                    showSaveQueryModal.value = false
                    message.success({
                        content: `${name} query saved!`,
                    })
                    saveModalRef.value?.clearData()
                    const guid = data.value.mutatedEntities.CREATE[0].guid

                    const parentGuid = parentFolderGuid
                    const parentQualifiedName =
                        data.value.mutatedEntities.CREATE[0].attributes
                            .parentQualifiedName

                    console.log(data.value, 'saved')
                    /* Not present in response */
                    activeInlineTabCopy.updateTime = Date.now()
                    activeInlineTabCopy.updatedBy = username.value
                    /* ----------------------------------------------- */
                    activeInlineTabCopy.qualifiedName = qualifiedName
                    activeInlineTabCopy.queryId = guid

                    activeInlineTabCopy.parentGuid = parentGuid
                    activeInlineTabCopy.parentQualifiedName =
                        parentQualifiedName
                    activeInlineTabCopy.collectionQualifiedName =
                        collectionQualifiedName

                    const {
                        data: data2,
                        error: error2,
                        isLoading: isLoading2,
                    } = Insights.GetSavedQuery(guid, {})

                    watch([data2, error2, isLoading2], () => {
                        if (isLoading2.value == false) {
                            if (error2.value === undefined) {
                                // console.log('saved query entity: ', data2.value)
                                activeInlineTabCopy.assetSidebar.assetInfo =
                                    data2.value?.entity

                                activeInlineTabCopy.explorer.queries.collection.qualifiedName =
                                    collectionQualifiedName
                                // activeInlineTabCopy.assetSidebar.assetInfo=data2.value?.entities
                            }
                        }
                    })

                    modifyActiveInlineTab(activeInlineTabCopy, tabsArray, true)
                    if (routeToGuid) {
                        if (guid) {
                            const queryParams = { id: guid }
                            if (route?.query?.vqb) queryParams.vqb = true
                            router.push({
                                path: `insights`,
                                query: queryParams,
                            })
                        }
                    }
                } else {
                    // console.log('query error: ', error.value.response.data.errorCode)
                    if (
                        error?.value?.response?.data?.errorCode ===
                        'ATLAS-403-00-001'
                    ) {
                        message.error(
                            `You are not allowed to create the query within the selected collection`
                        )
                    } else {
                        message.error(`Error in saving query!`)
                    }

                    /* Saving error in errorRef */
                    if (Callback) Callback(error)
                }
            }
        })
    }

    const getVariableCount = () => {
        const variables = activeInlineTab.value.playground.editor.variables
        if (!variables || !variables.length) {
            return 0
        }
        return variables.length
    }

    const linkTerms = (assetTerms, assetData, type) => {
        if (assetTerms?.length) {
            let data2 = assetTerms.map((el) => {
                return {
                    typeName: 'AtlasGlossaryTerm',
                    guid: el,
                }
            })
            const body = ref({
                entities: [
                    {
                        guid: assetData?.guid,
                        typeName: type,
                        attributes: {
                            collectionQualifiedName:
                                assetData?.collectionQualifiedName,
                            name: assetData?.name,
                            parent: {
                                guid: assetData?.parentFolderGuid,
                                typeName: assetData?.parentFolderQF.includes(
                                    '/folder'
                                )
                                    ? 'Folder'
                                    : 'Collection',
                                uniqueAttributes: {
                                    qualifiedName: assetData?.parentFolderQF,
                                },
                            },
                            parentQualifiedName: assetData?.parentFolderQF,
                            qualifiedName: assetData?.qualifiedName,
                            tenantId: 'default',
                        },
                        relationshipAttributes: {
                            meanings: [...data2],
                        },
                    },
                ],
            })

            const {
                mutate: mutateAsset,
                isLoading: isLoadingTerm,
                isReady: isReadyTerm,
                error: isTermError,
            } = updateAsset(body)

            mutateAsset()

            watch([isLoadingTerm, isTermError], () => {
                // console.log('terms linked: ')
            })
        }
    }

    const linkClassification = (assetClassification, assetData, type) => {
        if (assetClassification?.length) {
            let data2 = assetClassification.map((el) => {
                return {
                    entityGuid: assetData?.guid,
                    propagate: true,
                    removePropagationsOnEntityDelete: true,
                    typeName: el,
                }
            })

            const classificationBody = ref({
                guidHeaderMap: {
                    [assetData?.guid]: {
                        classifications: data2,
                        attributes: {
                            collectionQualifiedName:
                                assetData?.collectionQualifiedName,
                            name: assetData?.name,
                            parent: {
                                guid: assetData?.parentFolderGuid,
                                typeName: assetData?.parentFolderQF.includes(
                                    '/folder'
                                )
                                    ? 'Folder'
                                    : 'Collection',
                            },
                            parentQualifiedName: assetData?.parentFolderQF,
                            qualifiedName: assetData?.qualifiedName,
                            tenantId: 'default',
                        },
                        guid: assetData?.guid,
                        typeName: type,
                    },
                },
            })

            const {
                mutate: mutateClassification,
                isLoading: isLoadingClassification,
                isReady: isReadyClassification,
                error: isErrorClassification,
            } = useSetClassifications(classificationBody)

            mutateClassification()

            watch([isLoadingClassification, isErrorClassification], () => {
                console.log('classification linked: ')
            })
        }
    }

    return {
        saveQueryToDatabaseAndOpenInNewTab,
        saveQueryToDatabase,
        updateSavedQuery,
        openSavedQueryInNewTab,
        createFolder,
        saveQueryToDatabaseWithTerms,
        openSavedQueryInNewTabAndRun,
    }
}
