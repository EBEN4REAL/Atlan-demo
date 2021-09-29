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
            activeInlineTabKey.value = newTab.key
        }
    }

    return {
        openSavedQueryInNewTab,
    }
}
