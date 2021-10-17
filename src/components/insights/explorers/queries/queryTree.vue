TR
<template>
    <div class="max-h-screen" :class="$style.queryTreeStyles">
        <div class="h-full overflow-x-hidden">
            <div v-if="treeData.length">
                <a-tree
                    :expandedKeys="expandedKeys"
                    :selectedKeys="selectedKeys"
                    :loadedKeys="loadedKeys"
                    :tree-data="treeData"
                    :load-data="onLoadData"
                    :draggable="false"
                    :block-node="true"
                    :auto-expand-parent="false"
                    @select="selectNode"
                    @expand="expandNode"
                >
                    <template #switcherIcon>
                        <AtlanIcon icon="Caret" />
                    </template>

                    <template #title="item">
                        <QueryTreeItem
                            :item="item"
                            v-if="item.title !== 'Load more'"
                            :expandedKeys="expandedKeys"
                        />
                        <div
                            v-else
                            class="flex flex-row w-full text-sm font-bold leading-5  text-primary"
                            @click="item.click()"
                        >
                            <span v-if="item.isLoading">
                                <LoadingView
                                    size="small"
                                    class="w-1 h-1 mr-4"
                                />
                            </span>
                            <span v-else>{{ item.title }}</span>
                        </div>
                    </template>
                </a-tree>
            </div>
            <div v-else-if="isLoading">
                <LoadingView />
            </div>
            <div
                v-else-if="!treeData.length"
                class="flex flex-col items-center justify-center text-base leading-6 text-center text-gray-500  mt-14"
            >
                <div class="flex flex-col items-center justify-center">
                    <AtlanIcon
                        v-if="savedQueryType === 'personal'"
                        icon="NoSavedQueriesPersonal"
                        class="h-32 no-svaved-query-icon text-primary"
                    />
                    <AtlanIcon
                        v-else
                        icon="NoSavedQueriesAll"
                        class="h-32 no-svaved-query-icon text-primary"
                    />
                    <p
                        class="my-2 mb-0 mb-6 text-base text-gray-700  max-width-text"
                    >
                        Your {{ savedQueryType }} queries will appear here
                    </p>
                </div>
                <div>
                    <a-button
                        class="flex items-center w-48 text-sm text-gray-700 border rounded  hover:text-primary h-9"
                    >
                        <span
                            ><AtlanIcon
                                icon="NewQuery"
                                class="h-4 m-0 mr-1 -mt-0.5" /></span
                        >Create a new query</a-button
                    >
                    <p class="my-2 text-sm text-base text-gray-500">OR</p>
                    <a-button
                        class="flex items-center w-48 text-sm text-gray-700 border rounded  hover:text-primary h-9"
                    >
                        <span
                            ><AtlanIcon
                                icon="NewFolder"
                                class="h-4 m-0 mr-1 -mt-0.5" /></span
                        >Create a new folder</a-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    // library
    import { defineComponent, PropType, inject, Ref, toRefs } from 'vue'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

    // components
    import LoadingView from '@common/loaders/section.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import QueryTreeItem from './queryTreeItem.vue'

    // composables
    import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'

    // constant
    import { List as StatusList } from '~/constant/status'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import AtlanBtn from '~/components/UI/button.vue'

    export default defineComponent({
        components: {
            LoadingView,
            AtlanIcon,
            AtlanBtn,
            StatusBadge,
            QueryTreeItem,
        },
        props: {
            treeData: {
                type: Object as PropType<TreeDataItem[]>,
                required: true,
                default: () => {},
            },
            savedQueryType: {
                type: Object as PropType<string>,
                required: true,
            },
            onLoadData: {
                type: Function,
                required: false,
                default: () => {},
            },
            expandNode: {
                type: Function,
                required: false,
                default: () => {},
            },
            selectNode: {
                type: Function,
                required: false,
                default: () => {},
            },
            isLoading: {
                type: Boolean,
                required: false,
                default: false,
            },
            loadedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
            selectedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
            expandedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
        },
        setup(props, { emit }) {
            const { savedQueryType } = toRefs(props)
            // data
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

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

            return {
                savedQueryType,
                StatusList,
                isSavedQueryOpened,
                openSavedQueryInNewTab,

                // selectedKeys,
                // expandedKeys,
                // expandNode,
                // selectNode,
            }
        },
    })
</script>
<style lang="less" module>
    .queryTreeStyles {
        :global(.ant-tree-switcher_open) {
            transform: rotate(90deg);
        }
        :global(.ant-tree-title) {
            width: calc(100% - 1.5rem) !important;
        }
        :global(.ant-tree li ul) {
            padding-left: 16px !important;
        }
        :global(.ant-tree .ant-tree-title) {
            @apply pt-0 pb-0 !important;
        }
        :global(.ant-tree .ant-tree-title) {
            @apply pl-0 pr-0 !important;
        }
        :global(.ant-tree.ant-tree-block-node
                li
                .ant-tree-node-content-wrapper) {
            @apply w-full !important;
        }
        :global(.ant-tree li .ant-tree-node-content-wrapper:hover) {
            @apply bg-gray-light;
        }
        :global(.ant-tree-switcher_open) {
            transform: rotate(90deg);
        }
        :global(.ant-tree li .ant-tree-node-content-wrapper:hover) {
            @apply bg-gray-light;
        }
    }
</style>
<style lang="less" scoped>
    .no-svaved-query-icon {
        @apply w-32 !important;
    }
    .max-width-text {
        max-width: 216px;
    }
</style>
