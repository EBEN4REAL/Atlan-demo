import { getDialectInfo } from '~/components/insights/common/composables/getDialectInfo'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useActiveTab } from '~/components/insights/common/composables/useActiveTab'

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
    return {
        getDetectQueryTab,
    }
}
