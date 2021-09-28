import { Ref } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
import { SavedQuery } from '~/types/insights/savedQuery.interface'

export function useSavedQuery(
    tabsArray: Ref<activeInlineTabInterface[]>,
    activeInlineTab: Ref<activeInlineTabInterface>,
    activeInlineTabKey: Ref<string>
) {
    const { syncInlineTabsInLocalStorage } = useLocalStorageSync()
    const { isInlineTabAlreadyOpened, inlineTabAdd } = useInlineTab()

    const openSavedQueryInNewTab = (savedQuery: SavedQuery) => {
        const newTab = {
            label: savedQuery.attributes.name,
            key: savedQuery.guid,
            favico: 'https://atlan.com/favicon.ico',
            isSaved: true,
            queryId: savedQuery.guid,
            explorer: {
                schema: {
                    connectors: {
                        connection: savedQuery.attributes.connectionQualifiedName,
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
            inlineTabAdd(newTab, tabsArray, activeInlineTabKey)
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
