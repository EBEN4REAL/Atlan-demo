import { Ref, ComputedRef, ref, toRaw, watch } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { SavedQuery } from '~/types/insights/savedQuery.interface'
import { decodeQuery as decodeBase64Data } from '~/utils/helper/routerHelper'
import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { useEditor } from '~/components/insights/common/composables/useEditor'
import { serializeQuery } from '~/utils/helper/routerHelper'
import { message } from 'ant-design-vue'
import whoami from '~/composables/user/whoami'
import { Insights } from '~/services/atlas/api/insights'
import { generateUUID } from '~/utils/helper/generator'
import { ATLAN_PUBLIC_QUERY_CLASSIFICATION } from '~/components/insights/common/constants'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

export function useSavedQuery(
    tabsArray: Ref<activeInlineTabInterface[]>,
    activeInlineTab: ComputedRef<activeInlineTabInterface>,
    activeInlineTabKey: Ref<string>,
    treeSelectedKeys?: Ref<string[]>
) {
    const { username } = whoami()
    const { syncInlineTabsInLocalStorage } = useLocalStorageSync()
    const { getConnectorName, getConnectionQualifiedName } = useConnector()
    const { getParsedQuery } = useEditor()

    const {
        overwriteInlineTab,
        isInlineTabAlreadyOpened,
        inlineTabAdd,
        modifyActiveInlineTab,
        modifyActiveInlineTabEditor,
    } = useInlineTab(treeSelectedKeys)
    const openSavedQueryInNewTab = async (savedQuery: SavedQuery) => {
        /* --------NOTE- TEMPERORY FIX-------*/
        const defaultSchemaQualifiedNameValues =
            savedQuery.attributes.defaultSchemaQualifiedName?.split('.') ?? [
                'schemaQualifiedName',
                'default/snowflake/vqaqufvr-i/ATLAN_TRIAL/PUBLIC',
            ]
        /* --------NOTE- TEMPERORY FIX-------*/

        const newTab: activeInlineTabInterface = {
            label: savedQuery.attributes.name ?? '',
            key: savedQuery?.guid,
            favico: 'https://atlan.com/favicon.ico',
            isSaved: true,
            queryId: savedQuery.guid,
            updateTime: savedQuery.updateTime,
            updatedBy: savedQuery.updatedBy,
            connectionId: savedQuery.attributes.connectionId,
            description: savedQuery.attributes.description as string,
            qualifiedName: savedQuery.attributes.qualifiedName,
            isSQLSnippet: savedQuery.attributes.isSnippet as boolean,
            status: savedQuery.attributes.certificateStatus as string,
            explorer: {
                schema: {
                    connectors: {
                        attributeName: defaultSchemaQualifiedNameValues[0],
                        attributeValue: defaultSchemaQualifiedNameValues[1],
                    },
                },
                queries: {
                    connectors: {
                        connector: savedQuery.attributes.connectorName,
                    },
                },
            },
            playground: {
                editor: {
                    text: savedQuery.attributes.rawQuery,
                    dataList: [],
                    columnList: [],
                    variables: decodeBase64Data(
                        savedQuery.attributes.variablesSchemaBase64
                    ) as CustomVaribaleInterface[],
                },
                resultsPane: {
                    activeTab:
                        activeInlineTab.value?.playground.resultsPane
                            .activeTab ?? 0,
                    result: {
                        title: savedQuery.attributes.name,
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
                assetInfo: {},
                title: activeInlineTab.value?.assetSidebar.title ?? '',
                id: activeInlineTab.value?.assetSidebar.id ?? '',
            },
        }
        if (!isInlineTabAlreadyOpened(newTab, tabsArray)) {
            console.log('not opened')
            /* CAREFUL:-------Order is important here------ */
            inlineTabAdd(newTab, tabsArray, activeInlineTabKey)
            activeInlineTabKey.value = newTab.queryId
            /* ----------------------------- */
            debugger
            // syncying inline tabarray in localstorage
            syncInlineTabsInLocalStorage(tabsArray.value)
        } else {
            // show user that this tab is already opened
            let key = undefined
            tabsArray.value.forEach((tab) => {
                if (tab.queryId === newTab.queryId) key = tab.key
            })
            newTab.key = key
            overwriteInlineTab(newTab, tabsArray)
            activeInlineTabKey.value = key
        }
    }
    /* Involved network requests */
    const updateSavedQuery = (
        editorInstance: Ref<any>,
        isUpdating: Ref<boolean>
    ) => {
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )

        const attributeValue =
            activeInlineTab.value.explorer.schema.connectors.attributeValue
        const attributeName =
            activeInlineTab.value.explorer.schema.connectors.attributeName
        const connectorName = getConnectorName(attributeValue)
        const connectionQualifiedName =
            getConnectionQualifiedName(attributeValue)
        const connectionName = getConnectorName(attributeValue)
        const name = activeInlineTab.value.label
        const certificateStatus = activeInlineTab.value.status
        const description = activeInlineTab.value.description
        const isSQLSnippet = activeInlineTab.value.isSQLSnippet
        const editorInstanceRaw = toRaw(editorInstance.value)
        /* NEED TO CHECK IF qualifiedName will also change acc to connectors it has connectionQualifiedName */
        const qualifiedName = activeInlineTab.value.qualifiedName
        const rawQuery = editorInstanceRaw?.getValue()
        const compiledQuery = getParsedQuery(
            activeInlineTab.value.playground.editor.variables,
            editorInstanceRaw?.getValue() as string
        )
        const defaultSchemaQualifiedName =
            `${attributeName}.${attributeValue}` ?? ''
        const variablesSchemaBase64 = serializeQuery(
            activeInlineTab.value.playground.editor.variables
        )
        const body = ref({
            entity: {
                typeName: 'Query',
                attributes: {
                    connectorName,
                    name,
                    qualifiedName,
                    connectionName,
                    defaultSchemaQualifiedName,
                    certificateStatus,
                    isSnippet: isSQLSnippet,
                    connectionId: connectionQualifiedName,
                    connectionQualifiedName,
                    description,
                    owner: username.value,
                    tenantId: 'default',
                    rawQuery,
                    compiledQuery,
                    variablesSchemaBase64,
                    isPrivate: true,
                },
                relationshipAttributes: {
                    folder: {
                        guid: '4a6ccb76-02f0-4cc3-9550-24c46166a93d',
                        typeName: 'QueryFolder',
                    },
                },
            },
        })
        // console.log(body.value, 'update')
        // return
        isUpdating.value = true
        const { data, error, isLoading } = Insights.UpdateSavedQuery(body.value)

        watch([data, error, isLoading], () => {
            if (isLoading.value == false) {
                isUpdating.value = false
                if (error.value === undefined) {
                    useAddEvent('insights', 'query', 'updated', {
                        num_variables: undefined,
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
                    console.log(error.value.toString())
                    message.error({
                        content: `Error in saving query!`,
                    })
                }
            }
        })
    }
    const saveQueryToDatabase = async (
        saveQueryData: any,
        editorInstance: Ref<any>,
        saveQueryLoading: Ref<boolean>,
        showSaveQueryModal: Ref<boolean>,
        saveModalRef: Ref<any>,
        router: any,
        type: 'personal' | 'all',
        parentFolderQF: string,
        parentFolderGuid: string
    ) => {
        const editorInstanceRaw = toRaw(editorInstance.value)
        const attributeValue =
            activeInlineTab.value.explorer.schema.connectors.attributeValue
        const attributeName =
            activeInlineTab.value.explorer.schema.connectors.attributeName
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
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
        const description = saveQueryData.description
        const certificateStatus = saveQueryData.certificateStatus
        const isSQLSnippet = saveQueryData.isSQLSnippet
        const rawQuery = editorInstanceRaw?.getValue()
        const compiledQuery = getParsedQuery(
            activeInlineTab.value.playground.editor.variables,
            editorInstanceRaw?.getValue() as string
        )
        const qualifiedName = `${connectionQualifiedName}/query/user/${username.value}/${uuidv4}`
        const defaultSchemaQualifiedName =
            `${attributeName}.${attributeValue}` ?? ''
        const variablesSchemaBase64 = serializeQuery(
            activeInlineTab.value.playground.editor.variables
        )

        const body = ref<Record<string, any>>({
            entity: {
                typeName: 'Query',
                attributes: {
                    connectorName,
                    name,
                    qualifiedName,
                    connectionName,
                    defaultSchemaQualifiedName,
                    certificateStatus,
                    isSnippet: isSQLSnippet,
                    connectionQualifiedName,
                    description,
                    owner: username.value,
                    tenantId: 'default',
                    rawQuery,
                    compiledQuery,
                    variablesSchemaBase64,
                    connectionId: connectionGuid,
                    isPrivate: true,
                },
                /*TODO Created by will eventually change according to the owners*/
                isIncomplete: false,
                status: 'ACTIVE',
                createdBy: username.value,
            },
        })
        if (parentFolderQF !== 'root' && parentFolderGuid !== 'root') {
            body.value.entity.attributes.parentFolderQualifiedName =
                parentFolderQF
            body.value.entity.relationshipAttributes = {
                folder: {
                    guid: parentFolderGuid,
                    typeName: 'QueryFolder',
                },
            }
        }
        if (type === 'all') {
            body.value.entity.classifications = [
                {
                    attributes: {},
                    propagate: true,
                    removePropagationsOnEntityDelete: true,
                    typeName: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
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
                    useAddEvent('insights', 'query', 'saved', {
                        num_variables: undefined,
                    })
                    showSaveQueryModal.value = false
                    message.success({
                        content: `${name} query saved!`,
                    })
                    saveModalRef.value?.clearData()
                    const guid = data.value.mutatedEntities.CREATE[0].guid
                    console.log(data.value, 'saved')
                    if (guid) router.push(`/insights?id=${guid}`)
                    activeInlineTabCopy.queryId = guid
                    /* Not present in response */
                    activeInlineTabCopy.updateTime = Date.now()
                    activeInlineTabCopy.updatedBy = username.value
                    /* ----------------------------------------------- */
                    modifyActiveInlineTab(activeInlineTabCopy, tabsArray, true)
                } else {
                    console.log(error.value.toString())
                    message.error({
                        content: `Error in saving query!`,
                    })
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
        type: 'personal' | 'all',
        parentFolderQF: string,
        parentFolderGuid: string
    ) => {
        const editorInstanceRaw = toRaw(editorInstance.value)
        const attributeValue =
            activeInlineTab.value.explorer.schema.connectors.attributeValue
        const attributeName =
            activeInlineTab.value.explorer.schema.connectors.attributeName
        const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
            {},
            activeInlineTab.value
        )
        activeInlineTabCopy.isSaved = true
        activeInlineTabCopy.label = saveQueryData.title
        activeInlineTabCopy.status = saveQueryData.certificateStatus
        // /* Editor text */
        // activeInlineTabCopy.playground.editor.text = ''

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
        const rawQuery = editorInstanceRaw?.getValue()
        const compiledQuery = getParsedQuery(
            activeInlineTab.value.playground.editor.variables,
            editorInstanceRaw?.getValue() as string
        )
        // const rawQuery = activeInlineTabCopy.playground.editor.text
        // const compiledQuery = activeInlineTabCopy.playground.editor.text
        const qualifiedName = `${connectionQualifiedName}/query/user/${username.value}/${uuidv4}`
        const defaultSchemaQualifiedName =
            `${attributeName}.${attributeValue}` ?? ''
        const variablesSchemaBase64 = serializeQuery(
            activeInlineTab.value.playground.editor.variables
        )
        // const variablesSchemaBase64 = []

        const body = ref<Record<string, any>>({
            entity: {
                typeName: 'Query',
                attributes: {
                    connectorName,
                    name,
                    qualifiedName,
                    connectionName,
                    defaultSchemaQualifiedName,
                    certificateStatus,
                    isSnippet: isSQLSnippet,
                    connectionQualifiedName,
                    description,
                    owner: username.value,
                    tenantId: 'default',
                    rawQuery,
                    compiledQuery,
                    variablesSchemaBase64,
                    connectionId: connectionGuid,
                    isPrivate: true,
                },
                /*TODO Created by will eventually change according to the owners*/
                isIncomplete: false,
                status: 'ACTIVE',
                createdBy: username.value,
            },
        })
        if (parentFolderQF !== 'root' && parentFolderGuid !== 'root') {
            body.value.entity.attributes.parentFolderQualifiedName =
                parentFolderQF
            body.value.entity.relationshipAttributes = {
                folder: {
                    guid: parentFolderGuid,
                    typeName: 'QueryFolder',
                },
            }
        }
        if (type === 'all') {
            body.value.entity.classifications = [
                {
                    attributes: {},
                    propagate: true,
                    removePropagationsOnEntityDelete: true,
                    typeName: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
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
                    const savedQuery = data.value.mutatedEntities.CREATE[0]
                    /* properties not coming in the response */
                    savedQuery.attributes.defaultSchemaQualifiedName =
                        defaultSchemaQualifiedName
                    savedQuery.attributes.connectorName = connectorName
                    savedQuery.attributes.connectionQualifiedName =
                        connectionQualifiedName
                    savedQuery.attributes.connectionGuid = connectionGuid
                    savedQuery.attributes.connectionName = connectionName
                    savedQuery.attributes.name = name
                    savedQuery.attributes.description = description
                    savedQuery.attributes.certificateStatus = certificateStatus
                    savedQuery.attributes.isSQLSnippet = isSQLSnippet
                    /* Initial should be empty */
                    savedQuery.attributes.rawQuery = ''
                    savedQuery.attributes.compiledQuery = ''
                    savedQuery.attributes.qualifiedName = qualifiedName
                    savedQuery.attributes.variablesSchemaBase64 = []
                    /* properties not coming in the response */
                    showSaveQueryModal.value = false
                    message.success({
                        content: `${name} query saved!`,
                    })
                    saveModalRef.value?.clearData()
                    const guid = savedQuery.guid
                    console.log(data.value, 'saved')
                    if (guid) router.push(`/insights?id=${guid}`)
                    activeInlineTabCopy.queryId = guid
                    openSavedQueryInNewTab(savedQuery)
                } else {
                    console.log(error.value.toString())
                    message.error({
                        content: `Error in saving query!`,
                    })
                }
            }
        })

        return { data, error, isLoading }
    }

    const createFolder = (
        folderName: string,
        saveFolderLoading: Ref<boolean>,
        type: 'personal' | 'all',
        parentFolderQF: Ref<string>,
        parentFolderGuid: Ref<string>
    ) => {
        const attributeValue =
            activeInlineTab.value.explorer.schema.connectors.attributeValue
        const attributeName =
            activeInlineTab.value.explorer.schema.connectors.attributeName
        // const activeInlineTabCopy: activeInlineTabInterface = Object.assign(
        //     {},
        //     activeInlineTab.value
        // )
        // activeInlineTabCopy.isSaved = true
        // activeInlineTabCopy.label = saveFolderData.title
        // activeInlineTabCopy.status = saveFolderData.certificateStatus

        const uuidv4 = generateUUID()
        const connectorName = getConnectorName(attributeValue) ?? ''
        const connectionQualifiedName =
            getConnectionQualifiedName(attributeValue)
        const connectionGuid = ''
        const connectionName = getConnectorName(attributeValue)

        const name = folderName

        const qualifiedName = `${connectionQualifiedName}/query/user/${username.value}/${uuidv4}`
        const defaultSchemaQualifiedName =
            `${attributeName}.${attributeValue}` ?? ''

        const body = ref<Record<string, any>>({
            entity: {
                typeName: 'QueryFolder',
                attributes: {
                    connectorName,
                    name,
                    qualifiedName,
                    connectionName,
                    defaultSchemaQualifiedName,
                    connectionQualifiedName,
                    owner: username.value,
                    tenantId: 'default',
                    connectionId: connectionGuid,
                    isPrivate: true,
                },
                /*TODO Created by will eventually change according to the owners*/
                isIncomplete: false,
                status: 'ACTIVE',
                createdBy: username.value,
            },
        })
        if (
            parentFolderQF.value !== 'root' &&
            parentFolderGuid.value !== 'root'
        ) {
            body.value.entity.attributes.parentFolderQualifiedName =
                parentFolderQF.value
            body.value.entity.relationshipAttributes = {
                folder: {
                    guid: parentFolderGuid.value,
                    typeName: 'QueryFolder',
                },
            }
        }
        if (type === 'all') {
            body.value.entity.classifications = [
                {
                    attributes: {},
                    propagate: true,
                    removePropagationsOnEntityDelete: true,
                    typeName: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                    validityPeriods: [],
                },
            ]
        }
        // chaing loading to true
        saveFolderLoading.value = true
        const { data, error, isLoading } = Insights.CreateSavedQuery(body.value)

        watch([data, error, isLoading], () => {
            if (isLoading.value == false) {
                saveFolderLoading.value = false
                if (error.value === undefined) {
                    message.success({
                        content: `Folder ${name} created!`,
                    })
                } else {
                    console.log(error.value.toString())
                    message.error({
                        content: `Error in creating folder!`,
                    })
                }
            }
        })

        return { data, error, isLoading }
    }

    return {
        saveQueryToDatabaseAndOpenInNewTab,
        saveQueryToDatabase,
        updateSavedQuery,
        openSavedQueryInNewTab,
        createFolder,
    }
}
