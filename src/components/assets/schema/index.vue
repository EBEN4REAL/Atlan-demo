<template>
    <div class="flex flex-col items-center w-full h-full bg-new-gray-100">
        Tree

        <schema-tree
            v-model:expanded-keys="expandedKeys"
            :tree-data="treeData"
            :on-load-data="onLoadData"
            :select-node="selectNode"
            :expand-node="expandNode"
            :is-loading="isInitingTree"
            :loaded-keys="loadedKeys"
            :selected-keys="selectedKeys"
            :totalFilteredCount="totalFilteredCount"
            :queryText="queryText"
        />
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
        toRaw,
    } from 'vue'
    import { storeToRefs } from 'pinia'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import SchemaTree from './schemaTree.vue'

    import useSchemaExplorerTree from './composables/useSchemaExplorerTree'

    import {
        tableInterface,
        Attributes,
        Database,
        Schema,
        Table,
        Column,
        View,
    } from '~/types/insights/table.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { tablesData } from './tablesDemoData'
    import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
    // import Connector from '~/components/insights/common/connector/connector.vue'
    import Connector from '~/components/insights/common/connector/connectorNew.vue'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useUtils } from '~/components/insights/common/composables/useUtils'
    import useAssetStore from '~/store/asset'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { getBISourceTypes } from '~/composables/connection/getBISourceTypes'
    import SchemaFilter from './schemaFilter.vue'

    export default defineComponent({
        components: { Connector, SchemaTree, SchemaFilter },
        props: {},
        setup(props, { emit }) {
            const queryText = ref('')
            const { qualifiedName } = useAssetInfo()
            const storeDiscovery = useAssetStore()
            const { selectedAsset } = ref()
            const isSchemaInitialized = ref(true)
            const { getFirstQueryConnection, checkConnection } = useUtils()
            const tables: tableInterface[] = tablesData
            const fullSreenState = inject('fullSreenState') as Ref<boolean>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            const BItypes = getBISourceTypes()
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                tabs,
                activeInlineTab
            )
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
                activeInlineTab?.value?.explorer?.schema?.connectors ?? {
                    attributeName: undefined,
                    attributeValue: undefined,
                }
            )

            const assetSidebarUpdatedData = inject(
                'assetSidebarUpdatedData'
            ) as Ref<Object>

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
                const key = ''
                return key
            })
            /* WE CAN USE THIS FXN LATER */
            // const selectNodeAndToggleAssetSidebar = (selected, event) => {
            //     if (event.selectedNodes?.length > 0) {
            //         const item = event.selectedNodes[0]?.props
            //         if (item.typeName === 'LoadMore') return
            //         if (selected.length > 0) {
            //             const activeInlineTabCopy: activeInlineTabInterface =
            //                 Object.assign({}, activeInlineTab.value)
            //             activeInlineTabCopy.assetSidebar.assetInfo = item
            //             activeInlineTabCopy.assetSidebar.isVisible = true
            //             openAssetSidebar(activeInlineTabCopy)
            //         }
            //     } else {
            //         /* Close it if it is already opened */
            //         closeAssetSidebar(activeInlineTab.value)
            //     }
            //     selectNode(selected, event)
            // }

            const facets = ref({})

            const sortOrderTable = ref('name.keyword-asc')
            const sortOrderColumn = ref('order-asc')
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
            }

            const totalFilteredCount = computed(() => {
                let count = 0
                try {
                    Object.keys(facets.value ?? {}).forEach((key) => {
                        if (Array.isArray(facets.value[key])) {
                            if (facets.value[key].length > 0) {
                                count += 1
                            }
                        } else if (
                            typeof facets.value[key] === 'object' &&
                            facets.value[key] !== null
                        ) {
                            if (Object.keys(facets.value[key]).length > 0) {
                                count += 1
                            }
                        }
                    })
                } catch (e) {
                    console.error(e)
                }
                return count
            })

            const searchResultType = ref('table')
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

                // connectionQualifiedName: ref('default/snowflake/vqaqufvr-i'),
                // databaseQualifiedName: ref('default/snowflake/vqaqufvr-i/ATLAN_SAMPLE_DATA'),
                // schemaQualifiedName: ref('default/snowflake/vqaqufvr-i/ATLAN_SAMPLE_DATA/DBT_DEV')
                initSelectedKeys,
                connectionQualifiedName,
                databaseQualifiedName,
                schemaQualifiedName,
            })

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
                totalFilteredCount,
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
        border-radius: 4px;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
