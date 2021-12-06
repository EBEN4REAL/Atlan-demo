<template>
    <div class="flex flex-col items-center w-full h-full bg-white">
        <div class="w-full p-4 pt-2 pb-0">
            <div class="flex flex-row space-x-2" style="width: 85%">
                <SearchAndFilter
                    v-model:value="queryText"
                    :placeholder="`Search`"
                    class="mb-2 bg-white"
                    :autofocus="true"
                    size="minimal"
                >
                    <template #prefix>
                        <AtlanIcon icon="Search" color="#6F7590" />
                    </template>
                </SearchAndFilter>
            </div>
        </div>

        <div
            class="w-full px-4 py-2 pt-1 overflow-x-hidden overflow-y-auto"
            :style="
                fullSreenState
                    ? 'height: calc( 100vh - 140px )'
                    : 'height: calc( 100vh - 40px )'
            "
        >
            <schema-tree
                :tree-data="treeData"
                :on-load-data="onLoadData"
                :select-node="selectNode"
                :expand-node="expandNode"
                :is-loading="isInitingTree"
                :loaded-keys="loadedKeys"
                :selected-keys="selectedKeys"
                v-model:expanded-keys="expandedKeys"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        inject,
        ref,
        watch,
        computed,
        ComputedRef,
    } from 'vue'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import SchemaTree from './Tree.vue'
    import useSchemaExplorerTree from '~/components/insights/explorers/schema/composables/useSchemaExplorerTree'
    import { tableInterface } from '~/types/insights/table.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
    import Connector from '~/components/insights/common/connector/connector.vue'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useUtils } from '~/components/insights/common/composables/useUtils'
    import { getBISourceTypes } from '~/composables/connection/getBISourceTypes'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    export default defineComponent({
        components: { Connector, SchemaTree, SearchAndFilter },
        setup(props, { emit }) {
            const queryText = ref('')
            const { getFirstQueryConnection } = useUtils()
            const tables: tableInterface[] = []
            const fullSreenState = inject('fullSreenState') as Ref<boolean>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const BItypes = getBISourceTypes()
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const { openAssetSidebar } = useAssetSidebar(tabs, activeInlineTab)
            const {
                setConnectorsDataInInlineTab,
                getDatabaseQualifiedName,
                getConnectionQualifiedName,
                getSchemaQualifiedName,
            } = useConnector()
            const { modifyActiveInlineTab } = useInlineTab()

            const isAssetSidebarOpened = (table: tableInterface) => {
                if (
                    activeInlineTab.value &&
                    activeInlineTab.value?.assetSidebar
                ) {
                    if (activeInlineTab.value?.assetSidebar?.id === table.id)
                        return true
                }
                return false
            }

            const connectorsData: Ref<connectorsWidgetInterface> = ref(
                activeInlineTab.value?.explorer?.schema?.connectors ?? {
                    attributeName: undefined,
                    attributeValue: undefined,
                }
            )

            const handleChange = () => {
                /* Here we are making a change, so isSaved will be false */
                // activeInlineTab.value.isSaved = false
                setConnectorsDataInInlineTab(
                    activeInlineTab,
                    tabs,
                    connectorsData,
                    'schema'
                )
            }

            const setConnector = (payload: any) => {
                connectorsData.value = payload
            }

            const connectionQualifiedName = computed(() =>
                !getConnectionQualifiedName(
                    connectorsData.value?.attributeValue
                )?.endsWith('undefined')
                    ? getConnectionQualifiedName(
                          connectorsData.value?.attributeValue
                      )
                    : undefined
            )
            const databaseQualifiedName = computed(() =>
                !getDatabaseQualifiedName(
                    connectorsData.value?.attributeValue
                )?.endsWith('undefined')
                    ? getDatabaseQualifiedName(
                          connectorsData.value.attributeValue
                      )
                    : undefined
            )
            const schemaQualifiedName = computed(() =>
                !getSchemaQualifiedName(
                    connectorsData.value?.attributeValue
                )?.endsWith('undefined')
                    ? getSchemaQualifiedName(
                          connectorsData.value.attributeValue
                      )
                    : undefined
            )
            const initSelectedKeys = computed(() => {
                /* KEY - SchemaqualifiedName/tableName */
                let key = `${getSchemaQualifiedName(
                    activeInlineTab.value?.explorer?.schema?.connectors
                        .attributeValue
                )}/${activeInlineTab.value?.assetSidebar?.assetInfo?.title}`
                return key
            })

            const facets = ref({})
            const sortOrderTable = ref('')
            const sortOrderColumn = ref('')
            const onFilterChange = (type, value) => {
                if (type === 'sortOrderTable') {
                    sortOrderTable.value = value
                }
                if (type === 'sortOrderColumn') {
                    sortOrderColumn.value = value
                }
                if (type === 'facets') {
                    facets.value = { ...value }
                }

                // console.log('filters: ', {
                //     facets: facets.value,
                //     sortOrderTable: sortOrderTable.value,
                //     sortOrderColumn: sortOrderColumn.value,
                // })
            }

            let searchResultType = ref('table')
            const {
                treeData,
                loadedKeys,
                isInitingTree,
                selectedKeys,
                expandedKeys,
                onLoadData,
                expandNode,
                selectNode,
                updateNode,
            } = useSchemaExplorerTree({
                emit,
                queryText,
                facets,
                sortOrderTable,
                sortOrderColumn,
                searchResultType,
                initSelectedKeys,
                connectionQualifiedName,
                databaseQualifiedName,
                schemaQualifiedName,
            })

            /* Watchers for updating the connectors when activeinlab change */
            watch(
                activeInlineTab,
                () => {
                    if (activeInlineTab.value) {
                        if (
                            activeInlineTab?.value?.playground?.editor?.context
                                ?.attributeName
                        ) {
                            connectorsData.value =
                                activeInlineTab?.value?.playground?.editor?.context
                        }
                    } else {
                        connectorsData.value = {
                            attributeName: undefined,
                            attributeValue: undefined,
                        }
                    }
                },
                { immediate: true }
            )

            return {
                queryText,
                fullSreenState,
                connectorsData,
                setConnector,
                isAssetSidebarOpened,
                openAssetSidebar,
                handleChange,
                tables,
                treeData,
                loadedKeys,
                isInitingTree,
                selectedKeys,
                expandedKeys,
                onLoadData,
                expandNode,
                selectNode,
                BItypes,
                onFilterChange,
            }
        },
    })
    /*
    {
                connection: 'default/snowflake/bvscezvng',
                connector: 'snowflake',
                databaseQualifiedName:
                    'default/snowflake/vqaqufvr-i/SNOWFLAKE_SAMPLE_DATA',
                schemaQualifiedName:
                    'default/snowflake/bvscezvng/SNOWFLAKE_SAMPLE_DATA/TPCDS_SF10TCL',
            }
    */
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .active-placeholder {
        @apply bg-primary text-white;
    }
    .scrollable-container {
        height: calc(100vh - 14rem);
    }
</style>

<style lang="css" module>
    .inputSearch {
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05) !important;
        background-color: #fff !important;
        border: 1px solid #e9ebf1 !important;
        color: #6f7590 !important;
        border-radius: 8px !important;
    }
    :global(.ant-input) {
        color: #6f7590 !important;
    }
    input::placeholder {
        color: #6f7590 !important;
    }
    .filterButton {
        background: #ffffff;
        border: 1px solid #e9ebf1;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
