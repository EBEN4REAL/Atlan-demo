<template>
    <div class="max-h-screen container-schema-tree">
        <div class="h-full overflow-x-hidden" :class="$style.schemaTreeStyles">
            <div v-if="treeData.length">
                <a-tree
                    v-model:expandedKeys="expandedKeys"
                    v-bind="$attrs"
                    :selected-keys="selectedKeys"
                    :checked-keys="checkedKeys"
                    :loaded-keys="loadedKeys"
                    :tree-data="treeData"
                    :load-data="onLoadData"
                    :draggable="false"
                    data-test-id="tree"
                    :block-node="true"
                    :auto-expand-parent="false"
                    :class="$style.tree"
                    @select="selectNode"
                >
                    <template #switcherIcon>
                        <AtlanIcon icon="CaretRight" />
                    </template>
                    <template #title="item">
                        <SchemaTreeItem
                            v-if="item.title !== 'Load more'"
                            :item="item"
                            :hover-actions="hoverActions"
                        />
                        <div
                            v-else
                            :data-test-id="'loadMore'"
                            class="flex flex-row w-full text-sm font-bold leading-5 text-primary h-7"
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
            <div
                v-else-if="isLoading"
                class="flex items-center justify-center"
                :data-test-id="'loading'"
            >
                <LoadingView />
            </div>
            <div v-else-if="!treeData.length" :data-test-id="'noData'">
                <div
                    v-if="
                        activeInlineTab?.explorer?.schema?.connectors
                            ?.attributeName === 'connectionQualifiedName'
                    "
                    class="flex flex-col items-center justify-center text-base leading-6 text-center text-gray-500 mt-14"
                >
                    <AtlanIcon icon="NoSchema" class="no-schema-icon h-28" />
                    <p class="mt-6 mb-0 text-base text-gray-700">
                        No databases available
                    </p>
                </div>
                <div
                    v-else-if="
                        activeInlineTab?.explorer?.schema?.connectors
                            ?.attributeName === 'databaseQualifiedName'
                    "
                    class="flex flex-col items-center justify-center text-base leading-6 text-center text-gray-500 mt-14"
                >
                    <AtlanIcon icon="NoSchema" class="no-schema-icon h-28" />
                    <p class="mt-6 mb-0 text-base text-gray-700">
                        No schemas available
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    // library
    import { defineComponent, PropType, toRefs, ComputedRef, inject } from 'vue'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
    // components
    import LoadingView from '@common/loaders/section.vue'
    import { useVModels } from '@vueuse/core'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import OwnerInfoCard from '@/common/hovercards/ownerInfo.vue'
    import SchemaTreeItem from './schemaTreeItem.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { List as StatusList } from '~/constant/status'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import AtlanBtn from '~/components/UI/button.vue'

    export default defineComponent({
        components: {
            LoadingView,
            AtlanIcon,
            AtlanBtn,
            PillGroup,
            OwnerInfoCard,
            SchemaTreeItem,
        },
        props: {
            treeData: {
                type: Object as PropType<TreeDataItem[]>,
                required: true,
                default: () => {},
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
            checkedKeys: {
                type: Array as PropType<string[]>,
                required: false,
                default: () => [],
            },
            expandedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
            hoverActions: {
                type: Boolean,
                default: true,
            },
        },
        inheritAttrs: false,
        setup(props, { emit }) {
            const { hoverActions } = toRefs(props)
            const { expandedKeys } = useVModels(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            return {
                hoverActions,
                StatusList,
                activeInlineTab,
                // selectedKeys,
                expandedKeys,
                // expandNode,
                // selectNode,
            }
        },
    })
</script>
<style lang="less" scoped>
    .tree-container {
        overflow: hidden;
    }
    .no-schema-icon {
        @apply w-32 !important;
    }
</style>
<style lang="less" module>
    // @bg-selected: rgba(219, 234, 254, 1);

    .schemaTreeStyles {
        :global(.ant-tree-switcher_open) {
            transform: rotate(90deg);
        }
        :global(.ant-tree li ul) {
            padding-left: 16px !important;
        }
        :global(.ant-tree-treenode-switcher-open.ant-tree-treenode-selected
                > .ant-tree-switcher_open) {
            background-color: #fff !important;
        }
        :global(.ant-tree-treenode-selected) {
            background-color: rgba(219, 234, 254, 1) !important;
        }
        // :global(.ant-tree-treenode) {
        //     @apply hover:bg-primary-light;
        // }
        :global(.ant-tree-treenode) {
            padding-bottom: 0px !important;
            @apply hover:bg-primary-light rounded !important;
        }

        :global(.ant-tree-title) {
            width: calc(100% - 1.5rem) !important;
        }
        :global(.ant-tree-checkbox) {
            padding-top: 3px !important;
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
        // :global(.ant-tree li .ant-tree-node-content-wrapper:hover) {
        //     @apply bg-gray-light;
        // }
        :global(.ant-tree .ant-tree-treenode) {
            @apply p-0 !important;
        }
        :global(.ant-tree-treenode-switcher-open.ant-tree-treenode-selected
                > .ant-tree-switcher_open) {
            // background-color: rgba(219, 234, 254, 1) !important;
            height: 32px !important;
            justify-content: center;
            display: inline-flex !important;
            align-items: center;
            background-color: rgba(219, 234, 254, 1) !important;

            // @apply hover:bg-selected !important;
        }
        :global(.ant-tree li .ant-tree-node-content-wrapper) {
            border-radius: 0px !important;
            padding: 0 !important;
        }
        :global(.ant-tree .ant-tree-node-content-wrapper) {
            padding: 0 !important;
            overflow: hidden;
        }
        :global(.ant-tree
                .ant-tree-node-content-wrapper.ant-tree-node-selected) {
            background-color: rgba(219, 234, 254, 1) !important;
        }
        :global(.ant-tree-treenode-selected) {
            background-color: rgba(219, 234, 254, 1) !important;
            @apply hover:bg-primary-selected-focus !important;
            // ::hover {
            //     background-color: rgba(219, 234, 254, 1) !important;
            // }
        }
        :global(.ant-tree-node-content-wrapper) {
            @apply hover:bg-primary-light !important;
            transition: none !important;
        }
        :global(.ant-tree span.ant-tree-indent-unit) {
            width: 16px !important;
            // background-color: red !important;
        }
        :global(.ant-tree span.ant-tree-switcher.ant-tree-switcher-noop) {
            width: 3px !important;
            // background-color: red !important;
        }
    }
</style>
