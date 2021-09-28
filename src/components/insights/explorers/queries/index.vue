<template>
    <div class="flex flex-col items-center w-full h-full bg-white">
        <div class="w-full p-4 border-b-1">
            <Connector :connector="connector" @update:data="updateConnector" />
           <div class="flex flex-row space-x-2">
                <a-input-search class="rounded mt-2" placeholder="Search" />
                <a-button class="w-8 h-8 flex mt-2 items-center p-2 rounded">
                    <AtlanIcon
                        icon="Filter"
                    />            
                </a-button>
           </div>

        </div>
        <hr class="w-full" />
        <div class="w-full h-full p-4 overflow-y-auto scrollable-container">
            <query-tree
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
    import { defineComponent, inject, Ref, ref, watch } from 'vue'
    import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useConnector } from '~/components/insights/common/composables/useConnector'

    import QueryTree from './queryTree.vue'
    import useQueryTree from './composables/useQueryTree'

    import Connector from '~/components/insights/common/connector/connectorOnly.vue'

    export default defineComponent({
        components: {QueryTree,Connector},
        props: {},
        setup(props, { emit}) {
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            const connector = ref(activeInlineTab.value.explorer.schema.connectors.connector);

            const {
                setConnectorsDataInInlineTab,
            } = useConnector()


            const savedQueries: SavedQueryInterface[] = [
                {
                    id: '1x',
                    label: ' Saved Query 1',
                    editor: 'select * from "INSTACART_ALCOHOL_ORDER_TIME" limit 10',
                    result: 'Saved Query 1',
                },

                {
                    id: '2x',
                    label: 'Saved Query 2',
                    editor: 'select * from "INSTACART_ALCOHOL_ORDER_TIME" limit 10',
                    result: 'Saved Query 2',
                },
                {
                    id: '3x',
                    label: 'Saved Query 3',
                    editor: 'select * from "INSTACART_ALCOHOL_ORDER_TIME" limit 10',
                    result: 'Saved Query 3',
                },
            ]
            const { openSavedQueryInNewTab } = useSavedQuery(
                inlineTabs,
                activeInlineTab,
                activeInlineTabKey
            )
            const isSavedQueryOpened = (savedQuery: SavedQueryInterface) => {
                let bool = false
                inlineTabs.value.forEach((tab) => {
                    if (tab.key === savedQuery.id) bool = true
                })
                return bool
            }

            const updateConnector = (value: string) => {
                setConnectorsDataInInlineTab(activeInlineTab, inlineTabs, {
                        connector: value,
                        sourceName: undefined,
                        connection: undefined,
                        schema: undefined,
                    }, 'queries')
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
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab
            });

            watch(activeInlineTabKey, (newActiveInlineTab) => {
                selectedKeys.value = [newActiveInlineTab]
            })
            
            watch(activeInlineTab, (newActiveInlineTab) => {
                if (newActiveInlineTab) {
                    connector.value = newActiveInlineTab?.explorer?.queries?.connectors
                                ?.connector
                }
            })

            return {
                isSavedQueryOpened,
                openSavedQueryInNewTab,
                savedQueries,
                connector,
                updateConnector,

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
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
