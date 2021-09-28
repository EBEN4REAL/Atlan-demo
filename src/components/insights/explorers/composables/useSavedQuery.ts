import { Ref, ComputedRef } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { Query } from '~/types/insights/savedQuery.interface'
import { SavedQuery } from '~/types/insights/savedQuery.interface'

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
        const newTab = {
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
                        title: savedQuery.attributes.name ?? '',
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
        if (!isInlineTabAlreadyOpened(newTab)) {
            activeInlineTabKey.value = newTab.key
            inlineTabAdd(newTab, tabsArray, activeInlineTabKey)
            // syncying inline tabarray in localstorage
            syncInlineTabsInLocalStorage(tabsArray.value)
        } else {
            // show user that this tab is already opened
        }
    }
    const transformSavedQueryResponseInfoToInlineTab = (
        savedQueryInfo: Ref<Query>
    ) => {
        console.log(savedQueryInfo, 'get from URL')
    }
    return {
        transformSavedQueryResponseInfoToInlineTab,
        openSavedQueryInNewTab,
    }
}
