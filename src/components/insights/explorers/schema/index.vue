<template>
    <div class="flex flex-col items-center w-full h-full bg-white border-r">
        <div class="w-full p-3 mb-3">
            <Connector
                class=""
                :data="connector"
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
        <div class="w-full p-3 pt-0 overflow-y-auto scrollable-container">
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
    import { defineComponent, Ref, inject, ref } from 'vue'
    
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import Connector from '@common/facets/connector.vue'
    import SchemaTree from './schemaTree.vue'
    
    import useSchemaExplorerTree from './composables/useSchemaExplorerTree'
    
    import { tableInterface } from '~/types/insights/table.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { tablesData } from './tablesDemoData'
    import { useConnector } from '~/components/insights/common/composables/useConnector'

    export default defineComponent({
        components: { Connector, SchemaTree },
        props: {},
        setup(props, { emit }) {
            const tables: tableInterface[] = tablesData
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const selectedDefaultSchema = inject(
                'selectedDefaultSchema'
            ) as Ref<string>
            const selectedDataSourceName = inject(
                'selectedDataSourceName'
            ) as Ref<string>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const { openAssetSidebar } = useAssetSidebar(tabs, activeInlineTab)
            const { setSchemaAndSoruceName, getSchemaAndSourceName } =
                useConnector()

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
            const connector = ref({
                checked: [],
            })
            const handleChange = (data) => {
                console.log(data, 'connectorChange')
                const len = data.payload.criterion.length
                if (
                    len > 0 &&
                    data.payload.criterion[len - 1]?.attributeValue
                ) {
                    const { schema, sourceName } = getSchemaAndSourceName(
                        data.payload.criterion[len - 1]?.attributeValue
                    )
                    setSchemaAndSoruceName(
                        selectedDefaultSchema,
                        selectedDataSourceName,
                        schema,
                        sourceName
                    )
                }
            }

            const setConnector = (payload: any) => {
                connector.value = payload
            }
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
                connectionQualifiedName: ref('default/snowflake/vqaqufvr-i'),
                // databaseQualifiedName: ref('default/snowflake/vqaqufvr-i/ATLAN_SAMPLE_DATA'),
                // schemaQualifiedName: ref('default/snowflake/vqaqufvr-i/ATLAN_SAMPLE_DATA/DBT_DEV')
            });

            return {
                connector,
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
