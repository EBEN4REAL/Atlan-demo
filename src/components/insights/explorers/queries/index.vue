<template>
    <div class="flex flex-col items-center w-full h-full p-3 bg-white">
        <div class="w-full h-32 mb-3 rounded placeholder"></div>
        <!-- <template v-for="query in savedQueries" :key="query.id">
            <div
                class="flex items-center justify-center w-full px-2 py-2 mb-3 rounded cursor-pointer "
                @click="() => openSavedQueryInNewTab(query)"
                :class="
                    isSavedQueryOpened(query)
                        ? 'active-placeholder'
                        : 'placeholder'
                "
            >
                {{ query.label }}
            </div>
        </template> -->
        <div class="w-full h-full p-3 pt-0 overflow-y-auto scrollable-container">
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
    import { defineComponent, inject, Ref } from 'vue'
    import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'

    import QueryTree from './queryTree.vue'
    import useQueryTree from './composables/useQueryTree'

    export default defineComponent({
        components: {QueryTree},
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

            return {
                isSavedQueryOpened,
                openSavedQueryInNewTab,
                savedQueries,

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
