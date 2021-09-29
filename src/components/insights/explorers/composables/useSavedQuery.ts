import { Ref, ComputedRef, ref, toRaw } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { SavedQuery } from '~/types/insights/savedQuery.interface'
import { generateUUID } from '~/utils/helper/generator'
import { message } from 'ant-design-vue'

export function useSavedQuery(
    tabsArray: Ref<activeInlineTabInterface[]>,
    activeInlineTab: Ref<activeInlineTabInterface>,
    activeInlineTabKey: Ref<string>,
    treeSelectedKeys?: Ref<string[]>
) {
    const { syncInlineTabsInLocalStorage } = useLocalStorageSync()
    const { isInlineTabAlreadyOpened, inlineTabAdd } =
        useInlineTab(treeSelectedKeys)

    const openSavedQueryInNewTab = (savedQuery: SavedQuery) => {
        const newTab: activeInlineTabInterface = {
            label: savedQuery.attributes.name,
            key: savedQuery.attributes.qualifiedName,
            favico: 'https://atlan.com/favicon.ico',
            isSaved: true,
            queryId: savedQuery.attributes.qualifiedName,
            explorer: {
                schema: {
                    connectors: {
                        connection:
                            savedQuery.attributes.connectionQualifiedName,
                        connector: 'snowflake',
                        selectedDefaultSchema: 'ATLAN_TRIAL.PUBLIC',
                        selectedDataSourceName: 'default/snowflake/vqaqufvr-i',
                    },
                },
            },
            playground: {
                editor: {
                    text: savedQuery.attributes.rawQuery,
                    dataList: [],
                    columnList: [],
                    variables: [],
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
                isVisible:
                    activeInlineTab.value?.assetSidebar.isVisible ?? false,
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
            message.error({
                content: `${newTab.label} is already opened!`,
            })
        }
    }

    /* DEPRECATED FXN 

    const transformSavedQueryResponseInfoToInlineTab = (
        savedQueryInfo: Ref<SavedQuery>
    ): activeInlineTabInterface => {
        const uuidv4 = generateUUID()
        newTab.value.label = savedQueryInfo.value.attributes.name
        newTab.value.key = uuidv4
        newTab.value.queryId = savedQueryInfo.value.attributes.qualifiedName
        newTab.value.explorer.schema.connectors.connection =
            savedQueryInfo.value.attributes.connectionQualifiedName
        newTab.value.playground.editor.text =
            savedQueryInfo.value.attributes.rawQuery
        newTab.value.playground.resultsPane.result.title =
            savedQueryInfo.value.attributes.name
        console.log(savedQueryInfo, 'get from URL')
        return newTab.value
    }

    */
    return {
        openSavedQueryInNewTab,
    }
}
