<template>
    <div class="flex flex-col items-center w-full h-full bg-white border-r">
        <div class="w-full p-4 mb-3">
            <Connector
                class=""
                v-model:data="connectorsData"
                :item="{
                    id: 'connector',
                    label: 'Connector',
                    component: 'connector',
                    overallCondition: 'OR',
                    filters: [
                        {
                            attributeName: 'connector',
                            condition: 'OR',
                            isMultiple: false,
                            operator: 'eq',
                        },
                    ],
                    isDeleted: false,
                    isDisabled: false,
                    exclude: false,
                }"
                @change="handleChange"
                @update:data="setConnector"
            ></Connector>
        </div>
        <div class="w-full p-4 pt-0 overflow-y-auto scrollable-container">
            <schema-tree
                :tree-data="treeData"
                :on-load-data="onLoadData"
                :select-node="selectNode"
                :expand-node="expandNode"
                :is-loading="isInitingTree"
                :loaded-keys="loadedKeys"
                :selected-keys="selectedKeys"
                :expanded-keys="expandedKeys"
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
    import SchemaTree from './schemaTree.vue'

    import useSchemaExplorerTree from './composables/useSchemaExplorerTree'

    import { tableInterface } from '~/types/insights/table.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { tablesData } from './tablesDemoData'
    import { connectorsWidgetInterface } from '~/types/insights/connectorWidget.interface'
    import Connector from '@common/facets/connector.vue'
    import { useConnector } from '~/components/insights/common/composables/useConnector'

    export default defineComponent({
        components: { Connector, SchemaTree },
        props: {},
        setup(props, { emit }) {
            const tables: tableInterface[] = tablesData
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const { openAssetSidebar } = useAssetSidebar(tabs, activeInlineTab)
            const {
                setConnectorsDataInInlineTab,
                getDatabaseQualifiedName,
                getConnectionQualifiedName,
                getSchemaQualifiedName,
            } = useConnector()

            const isAssetSidebarOpened = (table: tableInterface) => {
                if (
                    activeInlineTab.value &&
                    activeInlineTab.value.assetSidebar
                ) {
                    if (activeInlineTab.value.assetSidebar.id === table.id)
                        return true
                }
                return false
            }

            const connectorsData: Ref<connectorsWidgetInterface> = ref(
                activeInlineTab.value.explorer.schema.connectors
            )

            const handleChange = () => {
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
                getConnectionQualifiedName(connectorsData.value.attributeValue)
            )
            const databaseQualifiedName = computed(() =>
                getDatabaseQualifiedName(connectorsData.value.attributeValue)
            )
            const schemaQualifiedName = computed(() =>
                getSchemaQualifiedName(connectorsData.value.attributeValue)
            )

            const {
                treeData,
                loadedKeys,
                isInitingTree,
                selectedKeys,
                expandedKeys,
                onLoadData,
                expandNode,
                selectNode,
            } = useSchemaExplorerTree({
                emit,
                // connectionQualifiedName: ref('default/snowflake/vqaqufvr-i'),
                // databaseQualifiedName: ref('default/snowflake/vqaqufvr-i/ATLAN_SAMPLE_DATA'),
                // schemaQualifiedName: ref('default/snowflake/vqaqufvr-i/ATLAN_SAMPLE_DATA/DBT_DEV')
                connectionQualifiedName,
                databaseQualifiedName,
                schemaQualifiedName,
            })

            /* Watchers for updating the connectors when activeinlab change */
            watch(activeInlineTab, () => {
                if (activeInlineTab.value) {
                    connectorsData.value =
                        activeInlineTab.value.explorer.schema.connectors
                }
            })

            return {
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

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
