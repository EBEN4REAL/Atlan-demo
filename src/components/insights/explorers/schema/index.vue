<template>
    <div class="flex flex-col items-center w-full h-full bg-white">
        <div class="w-full p-4 pb-1">
            <Connector
                class=""
                :filterSourceIds="['powerBI', 'tableau']"
                :isLeafNodeSelectable="false"
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
        <div class="w-full px-4 pb-2">
            <SearchAndFilter
                v-model:value="queryText"
                :placeholder="`Search `"
                size="default"
                class="h-8 rounded-md shadow-none"
            >
                <template #filter>
                    <div></div>
                </template>
            </SearchAndFilter>
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
    import Connector from '~/components/insights/common/connector/connector.vue'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useUtils } from '~/components/insights/common/composables/useUtils'
    import useDiscoveryStore from '~/store/discovery'
    import { storeToRefs } from 'pinia'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    import {
        Attributes,
        Database,
        Schema,
        Table,
        Column,
        View,
    } from '~/types/insights/table.interface'

    export default defineComponent({
        components: { Connector, SchemaTree, SearchAndFilter },
        props: {},
        setup(props, { emit }) {
            const queryText = ref('')
            const { qualifiedName } = useAssetInfo()
            const storeDiscovery = useDiscoveryStore()
            const { selectedAsset } = ref()
            const isSchemaInitialized = ref(true)
            const { getFirstQueryConnection } = useUtils()
            const tables: tableInterface[] = tablesData
            const fullSreenState = inject('fullSreenState') as Ref<boolean>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

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
                // connectionQualifiedName: ref('default/snowflake/vqaqufvr-i'),
                // databaseQualifiedName: ref('default/snowflake/vqaqufvr-i/ATLAN_SAMPLE_DATA'),
                // schemaQualifiedName: ref('default/snowflake/vqaqufvr-i/ATLAN_SAMPLE_DATA/DBT_DEV')
                initSelectedKeys,
                connectionQualifiedName,
                databaseQualifiedName,
                schemaQualifiedName,
            })

            /* Watcher for updating the node in tree */
            watch(selectedAsset, () =>
                updateNode({
                    qualifiedName: qualifiedName(
                        selectedAsset as unknown as assetInterface
                    ),
                    entity: selectedAsset.value as unknown as
                        | Database
                        | Schema
                        | Table
                        | Column
                        | View,
                })
            )

            /* Watchers for updating the connectors when activeinlab change */
            watch(
                activeInlineTab,
                () => {
                    if (activeInlineTab.value) {
                        // console.log(
                        //     'location activeTab: ',
                        //     activeInlineTab.value
                        // )
                        if (
                            activeInlineTab?.value?.explorer?.schema?.connectors
                                ?.attributeName
                        ) {
                            connectorsData.value =
                                activeInlineTab?.value?.explorer?.schema?.connectors
                        } else {
                            const activeInlineTabCopy: activeInlineTabInterface =
                                Object.assign({}, activeInlineTab.value)

                            let firstConnection = getFirstQueryConnection()
                            if (
                                firstConnection &&
                                firstConnection?.attributes?.name
                            ) {
                                activeInlineTabCopy.explorer.schema.connectors.attributeName =
                                    'connectionQualifiedName'
                                activeInlineTabCopy.explorer.schema.connectors.attributeValue =
                                    firstConnection?.attributes?.qualifiedName
                                if (connectorsData.value?.attributeName) {
                                    activeInlineTabCopy.explorer.schema.connectors =
                                        connectorsData.value
                                    activeInlineTabCopy.playground.editor.context =
                                        connectorsData.value
                                }
                                // console.log(
                                //     'location activetab updated: ',
                                //     activeInlineTabCopy
                                // )
                                modifyActiveInlineTab(
                                    activeInlineTabCopy,
                                    tabs,
                                    activeInlineTabCopy.isSaved
                                )
                            } else {
                            }

                            /* Insert the already selected connector */

                            // modifyActiveInlineTab(
                            //     activeInlineTabCopy,
                            //     tabs,
                            //     activeInlineTabCopy.isSaved
                            // )
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
            console.log(selectedKeys.value, 'out')

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
