import { Ref, ComputedRef, ref, toRaw, watch } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { SavedQuery } from '~/types/insights/savedQuery.interface'
import { decodeQuery as decodeBase64Data } from '~/utils/helper/routerHelper'
import { CustomVaribaleInterface } from '~/types/insights/customVariable.interface'
import { generateUUID } from '~/utils/helper/generator'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { useEditor } from '~/components/insights/common/composables/useEditor'
import { serializeQuery } from '~/utils/helper/routerHelper'
import { message } from 'ant-design-vue'
import whoami from '~/composables/user/whoami'
import { Insights } from '~/services/atlas/api/insights'

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
        isInlineTabAlreadyOpened,
        inlineTabAdd,
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
            label: savedQuery.attributes.name,
            key: savedQuery.attributes.qualifiedName,
            favico: 'https://atlan.com/favicon.ico',
            isSaved: true,
            queryId: savedQuery.guid,
            connectionId: savedQuery.attributes.connectionId,
            description: savedQuery.attributes.description as string,
            qualifiedName: savedQuery.attributes.qualifiedName,
            isSQLSnippet: savedQuery.attributes.isSnippet as boolean,
            status: savedQuery.attributes.assetStatus as string,
            explorer: {
                schema: {
                    connectors: {
                        attributeName: defaultSchemaQualifiedNameValues[0],
                        attributeValue: defaultSchemaQualifiedNameValues[1],
                    },
                },
                queries: {
                    connectors: {
                        connector: savedQuery.attributes.integrationName,
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
            activeInlineTabKey.value = newTab.key
            inlineTabAdd(newTab, tabsArray, activeInlineTabKey)
            // syncying inline tabarray in localstorage
            syncInlineTabsInLocalStorage(tabsArray.value)
        } else {
            // show user that this tab is already opened
            activeInlineTabKey.value = newTab.key
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
        const integrationName = getConnectorName(attributeValue)
        const connectionQualifiedName =
            getConnectionQualifiedName(attributeValue)
        const connectionName = getConnectorName(attributeValue)
        const name = activeInlineTab.value.label
        const assetStatus = activeInlineTab.value.status
        const connectionId = activeInlineTab.value.connectionId
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
                    integrationName,
                    name,
                    qualifiedName,
                    connectionName,
                    defaultSchemaQualifiedName,
                    assetStatus,
                    isSnippet: isSQLSnippet,
                    connectionQualifiedName,
                    description,
                    owner: username.value,
                    tenantId: 'default',
                    rawQuery,
                    compiledQuery,
                    variablesSchemaBase64,
                    connectionId,
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
                    message.success({
                        content: `${name} query saved!`,
                    })
                    // making it save
                    activeInlineTabCopy.isSaved = true
                    modifyActiveInlineTabEditor(
                        activeInlineTabCopy,
                        tabsArray,
                        true
                    )
                } else {
                    console.log(error.value.toString())
                    message.error({
                        content: `Error in saving query!`,
                    })
                }
            }
        })
    }

    return {
        updateSavedQuery,
        openSavedQueryInNewTab,
    }
}
