import { Ref, toRaw } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { generateUUID } from '~/utils/helper/generator'
import { inlineTabsDemoData } from '../dummyData/demoInlineTabData'

export function useActiveTab() {
    function generateNewActiveTab({
        activeInlineTab,
        label,
        editorText,
        isVQB,
        vqb,
        context,
        schemaConnectors,
        queryConnectors,
        assetInfo,
    }: {
        activeInlineTab: Ref<activeInlineTabInterface>
        label: string
        editorText: string
        vqb?: any
        isVQB?: boolean
        context?: object
        schemaConnectors?: object
        queryConnectors?: object
        assetInfo?: object
    }): activeInlineTabInterface {
        const activeInlineTabCopy: activeInlineTabInterface = JSON.parse(
            JSON.stringify(toRaw(activeInlineTab.value))
        )

        let vqbData = {
            panels: [
                {
                    order: 1,
                    id: 'columns',
                    hide: true,
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

        if (vqb) {
            vqbData = vqb
        }

        let contextData = activeInlineTabCopy.playground.editor.context
        if (context) {
            contextData = context as any
        }
        let schemaConnectorsData =
            activeInlineTabCopy.explorer.schema.connectors
        if (context) {
            schemaConnectorsData = schemaConnectors as any
        }

        let queryConnectorsData =
            activeInlineTabCopy.explorer.queries.connectors
        if (context) {
            queryConnectorsData = queryConnectors as any
        }
        let assetInfoData = {}
        if (assetInfo) {
            assetInfoData = assetInfo
        }

        const key = generateUUID()

        // `Copy ${activeInlineTabCopy.label} preview`

        let inlineTabData: activeInlineTabInterface = JSON.parse(
            JSON.stringify(inlineTabsDemoData[0])
        )
        inlineTabData = {
            ...inlineTabData,
            label: label,
            key,
            explorer: {
                schema: {
                    connectors: schemaConnectorsData,
                },
                queries: {
                    connectors: queryConnectorsData,
                    collection: {
                        // copy from last tab
                        guid: activeInlineTabCopy.explorer?.queries?.collection
                            ?.guid,
                        qualifiedName:
                            activeInlineTabCopy.explorer?.queries?.collection
                                ?.qualifiedName,
                        parentQualifiedName:
                            activeInlineTabCopy.explorer?.queries?.collection
                                ?.guid,
                    },
                },
            },
            playground: {
                ...inlineTabData.playground,
                isVQB: isVQB,
                vqb: vqbData,
                editor: {
                    ...inlineTabData.playground.editor,
                    context: contextData,
                    text: editorText ?? '',
                    savedVariables:
                        activeInlineTabCopy.playground.editor.savedVariables,
                    variables: activeInlineTabCopy.playground.editor.variables,
                },
            },
            assetSidebar: {
                // for taking the previous state from active tab
                openingPos: undefined,
                isVisible: false,
                assetInfo: assetInfoData,
                title: activeInlineTabCopy.assetSidebar.title ?? '',
                id: activeInlineTabCopy.assetSidebar.id ?? '',
            },
        }

        return inlineTabData
    }
    return {
        generateNewActiveTab,
    }
}
