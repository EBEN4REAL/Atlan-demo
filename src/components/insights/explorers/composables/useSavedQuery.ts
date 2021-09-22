import { Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'

export function useSavedQuery(
    tabsArray: Ref<activeInlineTabInterface[]>,
    activeInlineTab: Ref<activeInlineTabInterface>,
    activeInlineTabKey: Ref<string>
) {
    const { syncInlineTabsInLocalStorage } = useLocalStorageSync()
    const { isInlineTabAlreadyOpened, inlineTabAdd } = useInlineTab()

    const openSavedQueryInNewTab = (savedQuery: SavedQueryInterface) => {
        const newTab = {
            label: savedQuery.label,
            key: savedQuery.id,
            favico: 'https://atlan.com/favicon.ico',
            isSaved: true,
            queryId: savedQuery.id,
            explorer: {
                schema: {
                    connectors: {
                        connection: 'default/snowflake/vqaqufvr-i',
                        connector: 'snowflake',
                        selectedDefaultSchema: 'ATLAN_TRIAL.PUBLIC',
                        selectedDataSourceName: 'default/snowflake/vqaqufvr-i',
                    },
                },
            },
            playground: {
                editor: {
                    text: savedQuery.editor,
                    dataList: [],
                    columnList: [],
                },
                resultsPane: {
                    activeTab:
                        activeInlineTab.value?.playground.resultsPane
                            .activeTab ?? 0,
                    result: {
                        title: savedQuery.result,
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
            inlineTabAdd(newTab, tabsArray)
            activeInlineTabKey.value = newTab.key
            // syncying inline tabarray in localstorage
            syncInlineTabsInLocalStorage(tabsArray.value)
        } else {
            // show user that this tab is already opened
        }
    }
    return {
        openSavedQueryInNewTab,
    }
}
