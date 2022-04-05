import { ref, Ref, watch } from 'vue'
import { getDialectInfo } from '~/components/insights/common/composables/getDialectInfo'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useActiveTab } from '~/components/insights/common/composables/useActiveTab'
import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
import { invoke, until, watchOnce } from '@vueuse/core'
import { message } from 'ant-design-vue'

import {
    AssetAttributes,
    SavedQueryAttributes,
    InternalAttributes,
    AssetRelationAttributes,
} from '~/constant/projection'

export function useQuery() {
    function getDetectQueryTab({
        databaseQualifiedNameFromURL,
        schemaNameFromURL,
        tableNameFromURL,
        openVQB,
        columnNameFromURL,
        activeInlineTab,
    }): activeInlineTabInterface {
        // for assetQuote Info of different sources
        const { getConnectorName } = useConnector()
        const { generateNewActiveTab } = useActiveTab()
        const assetQuoteType = getDialectInfo(
            getConnectorName(
                `${databaseQualifiedNameFromURL}/${schemaNameFromURL}/${tableNameFromURL}`
            ) ?? ''
        )

        let vqbData =
            openVQB === 'true'
                ? {
                      selectedTables: [
                          {
                              tableQualifiedName: `${databaseQualifiedNameFromURL}/${schemaNameFromURL}/${tableNameFromURL}`,
                              addedBy: 'column',
                          },
                      ],
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
                                          item: {},
                                          assetType: 'Table',
                                      },
                                      columnsData: [],
                                      tableQualfiedName: `${databaseQualifiedNameFromURL}/${schemaNameFromURL}/${tableNameFromURL}`,
                                  },
                              ],
                              expand: false,
                          },
                      ],
                  }
                : {
                      selectedTables: [],
                      panels: [
                          {
                              order: 1,
                              id: 'columns',
                              hide: false,
                              subpanels: [
                                  {
                                      id: '1',
                                      tableQualifiedName: undefined,
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
                  }

        let editorText = ''

        if (columnNameFromURL) {
            // editorText = `\/* ${tableNameFromURL} preview *\/\nSELECT ${columnNameFromURL} FROM \"${tableNameFromURL}\" LIMIT 50;\n`
            editorText = `-- ${assetQuoteType}${tableNameFromURL}${assetQuoteType} preview \nSELECT ${assetQuoteType}${columnNameFromURL}${assetQuoteType} FROM ${assetQuoteType}${tableNameFromURL}${assetQuoteType} LIMIT 50;\n`
        } else {
            // editorText = `\/* ${tableNameFromURL} preview *\/\nSELECT * FROM \"${tableNameFromURL}\" LIMIT 50;\n`
            editorText = `-- ${assetQuoteType}${tableNameFromURL}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${tableNameFromURL}${assetQuoteType} LIMIT 50;\n`
        }
        // const newText = `${editorText}${prevText}`

        const attributeName = 'schemaQualifiedName'
        const attributeValue = `${databaseQualifiedNameFromURL}/${schemaNameFromURL}`
        const context = {
            attributeName,
            attributeValue,
        }

        const queryConnectors = {
            attributeName,
            attributeValue,
        }
        const schemaConnectors = {
            attributeName,
            attributeValue,
        }

        const queryTab = generateNewActiveTab({
            activeInlineTab,
            label: `${tableNameFromURL} preview`,
            editorText,
            context,
            queryConnectors,
            schemaConnectors,
            vqb: vqbData,
            isVQB: openVQB === 'true' ? true : false,
        })

        return queryTab
    }
    function getAssetInfo({
        assetGuidFromURL,
        tabsArray,
        key,
    }: {
        assetGuidFromURL: any
        tabsArray: Ref<activeInlineTabInterface[]>
        key: string
    }) {
        if (!assetGuidFromURL) return
        const defaultAttributes = ref([
            ...InternalAttributes,
            ...AssetAttributes,
            ...SavedQueryAttributes,
        ])

        const facets = ref({
            guid: assetGuidFromURL,
        })

        // fetching asset info
        const { list, error, isLoading } = useDiscoverList({
            facets,
            dependentKey: ref('insights_saved_query'),
            relationAttributes: ref(AssetRelationAttributes),
            attributes: defaultAttributes,
            limit: ref(1),
        })

        try {
            invoke(async () => {
                await until(isLoading).toBe(true)
                watchOnce(list, () => {
                    // debugger
                    if (list.value.length) {
                        const _index = tabsArray.value.findIndex(
                            (tab) => tab.key === key
                        )
                        tabsArray.value[_index].assetSidebar.assetInfo = list
                            .value[0] as any
                        tabsArray.value[_index].assetSidebar.isVisible = true
                        console.log(list.value)
                    }
                })
                watchOnce(error, () => {
                    if (error.value) {
                        message.error('Failed to fetch asset info!')
                    }
                })
            })
        } catch (e) {
            console.error(e)
        }
    }
    return {
        getDetectQueryTab,
        getAssetInfo,
    }
}
