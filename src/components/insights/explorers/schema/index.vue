<template>
    <div class="flex flex-col items-center w-full h-full bg-new-gray-100">
        <div class="w-full pt-2 pb-1 pl-2 pr-2">
            <Connector
                v-model:data="connectorsData"
                :bgGrayForSelector="true"
                :is-leaf-node-selectable="false"
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

            <div class="flex flex-row ml-2 mr-2 space-x-2">
                <a-input
                    v-model:value="queryText"
                    class="h-8 mt-1 rounded"
                    :class="$style.inputSearch"
                    placeholder="Search tables and views"
                >
                    <template #prefix>
                        <AtlanIcon icon="Search" color="#6F7590" />
                    </template>
                    <template #suffix>
                        <a-popover trigger="click" placement="bottomLeft">
                            <a-button
                                class="flex items-center justify-center w-6 h-6 p-2 border-none shadow-none hover:bg-new-gray-100"
                                :class="$style.filterButton"
                            >
                                <template #icon>
                                    <AtlanIcon
                                        v-if="totalFilteredCount === 0"
                                        icon="Filter"
                                        class="-ml-0.5"
                                    />
                                    <AtlanIcon
                                        v-else
                                        icon="FilterDot"
                                        class="-ml-0.5"
                                    />
                                </template>
                            </a-button>
                            <template #content>
                                <SchemaFilter @change="onFilterChange" />
                            </template>
                        </a-popover>
                    </template>
                </a-input>
            </div>
        </div>

        <div
            class="w-full px-2 py-2 pt-1 overflow-x-hidden overflow-y-auto"
            :style="
                fullSreenState
                    ? 'height: calc( 100vh - 140px )'
                    : 'height: calc( 100vh - 188px )'
            "
        >
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
    import { watchOnce, watchAtMost, watchPausable } from '@vueuse/core'

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
            const UrlDetectedAsset = inject(
                'UrlDetectedAsset'
            ) as Ref<assetInterface>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

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
                const key = `${getSchemaQualifiedName(
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

            const facets = ref(
                activeInlineTab.value.explorer.schema.facetsFilters ?? {}
            )

            watch(activeInlineTabKey, (newActiveInlineTabKey) => {
                const _index = tabs.value.findIndex(
                    (tab) => tab.key === newActiveInlineTabKey
                )
                facets.value = tabs.value[_index].explorer.schema.facetsFilters
            })
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

            /* Watcher for updating the node in tree */
            watch(assetSidebarUpdatedData, () => {
                console.log(
                    'table/ column update: ',
                    assetSidebarUpdatedData.value
                )

                if (assetSidebarUpdatedData?.value?.typeName !== 'Query') {
                    if (assetSidebarUpdatedData?.value?.guid) {
                        updateNode({
                            qualifiedName: qualifiedName(
                                assetSidebarUpdatedData.value as unknown as assetInterface
                            ),
                            entity: assetSidebarUpdatedData.value as unknown as
                                | Database
                                | Schema
                                | Table
                                | Column
                                | View,
                        })
                    }
                }
            })

            /* Watchers for updating the connectors when activeinlab change */
            watch(
                activeInlineTab,
                () => {
                    if (activeInlineTab.value) {
                        if (
                            activeInlineTab?.value?.explorer?.schema?.connectors
                                ?.attributeName &&
                            activeInlineTab?.value?.playground?.editor?.context
                                ?.attributeName
                        ) {
                            if (
                                checkConnection(
                                    activeInlineTab?.value?.explorer?.schema
                                        ?.connectors
                                ) &&
                                checkConnection(
                                    activeInlineTab?.value?.playground?.editor
                                        ?.context
                                )
                            ) {
                                connectorsData.value =
                                    activeInlineTab?.value?.explorer?.schema?.connectors
                            } else {
                                const activeInlineTabCopy: activeInlineTabInterface =
                                    { ...activeInlineTab.value }

                                const firstConnection =
                                    getFirstQueryConnection()
                                if (
                                    firstConnection &&
                                    firstConnection?.attributes?.name
                                ) {
                                    activeInlineTabCopy.explorer.schema.connectors.attributeName =
                                        'connectionQualifiedName'
                                    activeInlineTabCopy.explorer.schema.connectors.attributeValue =
                                        firstConnection?.attributes?.qualifiedName

                                    activeInlineTabCopy.playground.editor.context.attributeName =
                                        'connectionQualifiedName'
                                    activeInlineTabCopy.playground.editor.context.attributeValue =
                                        firstConnection?.attributes?.qualifiedName
                                    modifyActiveInlineTab(
                                        activeInlineTabCopy,
                                        tabs,
                                        activeInlineTabCopy.isSaved
                                    )
                                }
                            }
                        } else {
                            const activeInlineTabCopy: activeInlineTabInterface =
                                { ...activeInlineTab.value }

                            const firstConnection = getFirstQueryConnection()
                            if (
                                firstConnection &&
                                firstConnection?.attributes?.name
                            ) {
                                activeInlineTabCopy.explorer.schema.connectors.attributeName =
                                    'connectionQualifiedName'
                                activeInlineTabCopy.explorer.schema.connectors.attributeValue =
                                    firstConnection?.attributes?.qualifiedName

                                activeInlineTabCopy.playground.editor.context.attributeName =
                                    'connectionQualifiedName'
                                activeInlineTabCopy.playground.editor.context.attributeValue =
                                    firstConnection?.attributes?.qualifiedName
                                modifyActiveInlineTab(
                                    activeInlineTabCopy,
                                    tabs,
                                    activeInlineTabCopy.isSaved
                                )
                            }
                        }
                    } else {
                        connectorsData.value = {
                            attributeName: undefined,
                            attributeValue: undefined,
                        }
                    }
                },
                { immediate: true, deep: true }
            )

            function returnTreeDataItemAttributes(
                item: Database | Schema | Table | Column
            ) {
                return {
                    attributes: item.attributes,
                    entity: item,
                    key: item.attributes.qualifiedName,
                    guid: item.guid,
                    title: item.attributes.name,
                    typeName: item.typeName,
                    classifications: item.classifications,
                    ...item.attributes,
                    meanings: item.meanings,
                    isLeaf: item.typeName === 'Column',
                }
            }

            watchOnce(
                UrlDetectedAsset,
                () => {
                    if (!UrlDetectedAsset.value?.attributes?.qualifiedName)
                        return

                    const { stop, pause, resume } = watchPausable(
                        treeData,
                        () => {
                            if (
                                treeData.value.length &&
                                UrlDetectedAsset.value?.attributes
                            ) {
                                // check if schema explorer tree have this asset at 20 limit
                                const _index = treeData.value.findIndex(
                                    (el) =>
                                        el.guid === UrlDetectedAsset.value.guid
                                )
                                if (_index === -1) {
                                    // treeData.value.pop()
                                    // treeData.value.push(UrlDetectedAsset.value);

                                    if (
                                        treeData.value[
                                            treeData.value.length - 1
                                        ]?.title
                                            ?.toLowerCase()
                                            ?.includes('load more')
                                    ) {
                                        treeData.value.splice(
                                            treeData.value.length - 2,
                                            1,
                                            returnTreeDataItemAttributes(
                                                UrlDetectedAsset.value
                                            )
                                        )
                                    } else {
                                        treeData.value.splice(
                                            treeData.value.length - 1,
                                            1,
                                            returnTreeDataItemAttributes(
                                                UrlDetectedAsset.value
                                            )
                                        )
                                    }
                                }
                                const _fields =
                                    UrlDetectedAsset.value?.attributes?.qualifiedName?.split(
                                        '/'
                                    )
                                // if fields.length == 6 ->> table
                                // if fields.length == 7 ->> column
                                if (_fields.length < 7) {
                                    expandedKeys.value = [
                                        ...expandedKeys.value,
                                        UrlDetectedAsset.value.attributes
                                            .qualifiedName,
                                    ]
                                    selectedKeys.value = [
                                        UrlDetectedAsset.value.attributes
                                            .qualifiedName,
                                    ]
                                    let isExecuted = false
                                    const _intervalId = setInterval(() => {
                                        if (isExecuted) {
                                            clearInterval(_intervalId)
                                            return
                                        }
                                        const element =
                                            document.getElementsByClassName(
                                                'ant-tree-treenode-selected'
                                            )[0]
                                        if (element?.scrollIntoView) {
                                            isExecuted = true
                                            element.scrollIntoView(true)
                                            pause()
                                        }
                                    }, 1000)
                                    const _timeout = setTimeout(() => {
                                        clearInterval(_intervalId)
                                        clearTimeout(_timeout)
                                    }, 3 * 60 * 1000)
                                } else if (_fields.length > 6) {
                                    const tableQualifiedName = _fields
                                        .slice(0, _fields.length - 1)
                                        .join('/')
                                    expandedKeys.value = [
                                        ...expandedKeys.value,
                                        tableQualifiedName,
                                        UrlDetectedAsset.value.attributes
                                            .qualifiedName,
                                    ]
                                    selectedKeys.value = [
                                        UrlDetectedAsset.value.attributes
                                            .qualifiedName,
                                    ]
                                    let isExecuted = false
                                    const _intervalId = setInterval(() => {
                                        if (isExecuted) {
                                            clearInterval(_intervalId)
                                            return
                                        }
                                        const element =
                                            document.getElementsByClassName(
                                                'ant-tree-treenode-selected'
                                            )[0]
                                        if (element?.scrollIntoView) {
                                            isExecuted = true
                                            element.scrollIntoView(true)
                                            pause()
                                        }
                                    }, 1000)
                                    const _timeout = setTimeout(() => {
                                        clearInterval(_intervalId)
                                        clearTimeout(_timeout)
                                    }, 3 * 60 * 1000)
                                }
                            }
                        }
                    )
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
        margin-top: 8px !important;
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
