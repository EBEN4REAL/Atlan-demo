<template>
    <div class="rounded" style="width: 400px; max-height: 280px">
        <div
            class="flex items-center justify-between w-full p-3 border-b border-gray-300"
        >
            <span class="text-sm font-bold text-gray-700">SQL Query</span>
            <div>
                <div
                    class="flex items-center text-sm cursor-pointer text-primary"
                    @click="handleAddNewTab"
                >
                    <AtlanIcon icon="Query" class="w-4 h-4 mr-1.5 -mt-0.5" />
                    <span>Open in new tab</span>
                </div>
            </div>
        </div>
        <SQLSnippet :text="generateSQLQuery(activeInlineTab, limitRows)" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, ComputedRef, Ref, toRaw } from 'vue'
    import SQLSnippet from '~/components/common/sql/snippet.vue'
    import { generateSQLQuery } from '~/components/insights/playground/editor/vqb/composables/generateSQLQuery'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { generateUUID } from '~/utils/helper/generator'
    import { format } from 'sql-formatter'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'VQB query Preview',
        components: {
            SQLSnippet,
        },
        props: {
            showQueryPreview: {
                type: Boolean,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { showQueryPreview } = useVModels(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const limitRows = inject('limitRows') as Ref<{
                checked: boolean
                rowsCount: number
            }>
            const { inlineTabAdd } = useInlineTab()

            //FIXME: This should be a composable, writing it here for temperory purpose
            const handleAddNewTab = () => {
                const key = generateUUID()
                const activeInlineTabCopy: activeInlineTabInterface =
                    JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))
                const inlineTabData: activeInlineTabInterface = {
                    label: `Copy ${activeInlineTabCopy.label} preview`,
                    key,
                    favico: 'https://atlan.com/favicon.ico',
                    isSaved: false,
                    queryId: undefined,
                    status: 'is_null',
                    connectionId: '',
                    description: '',
                    qualifiedName: '',
                    parentGuid: '',
                    parentQualifiedName: '',
                    isSQLSnippet: false,
                    savedQueryParentFolderTitle: undefined,
                    explorer: {
                        schema: {
                            connectors:
                                activeInlineTabCopy.explorer.schema.connectors,
                        },
                        queries: {
                            connectors: {
                                connector:
                                    activeInlineTabCopy.explorer.queries
                                        .connectors.connector,
                            },
                            collection: {
                                // copy from last tab
                                guid: activeInlineTabCopy.explorer?.queries
                                    ?.collection?.guid,
                                qualifiedName:
                                    activeInlineTabCopy.explorer?.queries
                                        ?.collection?.qualifiedName,
                                parentQualifiedName:
                                    activeInlineTabCopy.explorer?.queries
                                        ?.collection?.guid,
                            },
                        },
                    },
                    playground: {
                        vqb: {
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
                        },
                        editor: {
                            context:
                                activeInlineTabCopy.playground.editor.context,
                            text: format(
                                generateSQLQuery(
                                    activeInlineTab.value,
                                    limitRows.value
                                ),
                                {
                                    language: 'sql', // Defaults to "sql" (see the above list of supported dialects)
                                    indent: '    ', // Defaults to two spaces
                                }
                            ),

                            dataList: [],
                            columnList: [],
                            variables: [],
                            savedVariables: [],
                            limitRows: {
                                checked: false,
                                rowsCount: -1,
                            },
                        },
                        resultsPane: {
                            activeTab:
                                activeInlineTabCopy.playground?.resultsPane
                                    ?.activeTab ?? 0,
                            result: {
                                title: `${key} Result`,
                                runQueryId: undefined,
                                isQueryRunning: '',
                                queryErrorObj: {},
                                totalRowsCount: -1,
                                executionTime: -1,
                                errorDecorations: [],
                                eventSourceInstance: undefined,
                                buttonDisable: false,
                                isQueryAborted: false,
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
                        openingPos: undefined,
                        isVisible: false,
                        assetInfo: {},
                        title: activeInlineTabCopy.assetSidebar.title ?? '',
                        id: activeInlineTabCopy.assetSidebar.id ?? '',
                    },
                }
                inlineTabAdd(inlineTabData, inlineTabs, activeInlineTabKey)
                showQueryPreview.value = false
            }

            return {
                generateSQLQuery,
                activeInlineTab,
                limitRows,
                handleAddNewTab,
            }
        },
    })
</script>
<style lang="less" scoped></style>
