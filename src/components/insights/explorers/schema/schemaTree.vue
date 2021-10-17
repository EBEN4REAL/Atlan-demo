<template>
    <div class="max-h-screen">
        <div class="h-full overflow-x-hidden" :class="$style.schemaTreeStyles">
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
                    :class="$style.tree"
                    @expand="expandNode"
                >
                    <template #switcherIcon>
                        <AtlanIcon icon="Caret" />
                    </template>
                    <template #title="item">
                        <SchemaTreeItem
                            :item="item"
                            v-if="item.title !== 'Load more'"
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
            <div v-else-if="isLoading" class="flex items-center justify-center">
                <LoadingView />
            </div>
            <div
                v-else-if="!treeData.length"
                class="flex flex-col justify-center text-base leading-6 text-center text-gray-500  mt-14"
            >
                <AtlanIcon icon="NoSchema" class="no-schema-icon h-28" />
                <p class="mt-2 mb-0 text-base text-gray-700">
                    No schemas available
                </p>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    // library
    import { defineComponent, computed, PropType, ref, toRef, watch } from 'vue'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

    // components
    import LoadingView from '@common/loaders/section.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import OwnerInfoCard from '~/components/discovery/preview/hovercards/ownerInfo.vue'
    import Avatar from '~/components/common/avatar.vue'
    import Classifications from '@common/sidebar/classifications.vue'
    import ClassificationInfoCard from '~/components/discovery/preview/hovercards/classificationInfo.vue'
    import SchemaTreeItem from './schemaTreeItem.vue'

    // composables

    // constant
    import { List as StatusList } from '~/constant/status'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import AtlanBtn from '~/components/UI/button.vue'
    import { KeyMaps } from '~/api/keyMap'

    export default defineComponent({
        components: {
            LoadingView,
            AtlanIcon,
            AtlanBtn,
            Tooltip,
            PillGroup,
            OwnerInfoCard,
            Avatar,
            Classifications,
            ClassificationInfoCard,
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
            expandedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
        },
        setup(props, { emit }) {
            // data
            return {
                StatusList,
                // selectedKeys,
                // expandedKeys,
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
</style>
<style lang="less" module>
    .schemaTreeStyles {
        :global(.ant-tree-switcher_open) {
            transform: rotate(90deg);
        }
        :global(.ant-tree li ul) {
            padding-left: 16px !important;
        }
    }

    :global(.ant-tree-title) {
        width: calc(100% - 1.5rem) !important;
    }
    :global(.ant-tree .ant-tree-title) {
        @apply pt-0 pb-0 !important;
    }
    :global(.ant-tree .ant-tree-title) {
        @apply pl-0 pr-0 !important;
    }
    :global(.ant-tree.ant-tree-block-node li .ant-tree-node-content-wrapper) {
        @apply w-full !important;
    }

    :global(.ant-tree li .ant-tree-node-content-wrapper:hover) {
        @apply bg-gray-light;
    }
    :global(.ant-tree li .ant-tree-node-content-wrapper:hover) {
        @apply bg-gray-light;
    }
    // :global(.ant-tree-treenode-switcher-open.ant-tree-treenode-selected
    //         > .ant-tree-switcher_open) {
    //     background-color: rgba(219, 234, 254, 1) !important;
    //     height: 32px !important;
    //     justify-content: center;
    //     display: inline-flex !important;
    //     align-items: center;
    // }
    // :global(.ant-tree li .ant-tree-node-content-wrapper) {
    //     border-radius: 0px !important;
    // }
    // :global(.ant-tree-treenode-switcher-close.ant-tree-treenode-selected
    //         > .ant-tree-switcher_open) {
    //     background-color: rgba(219, 234, 254, 1) !important;
    //     height: 32px !important;
    //     justify-content: center;
    //     display: inline-flex !important;
    //     align-items: center;
    // }
    // :global(.ant-tree-switcher) {
    //     @apply pl-5 pr-2 !important;
    // }
    // :global(.ant-tree-treenode-switcher-close:hover) {
    //     background-color: #e5e5e5 !important;
    // }
    // :global(.ant-tree-treenode-switcher-close:hover) {
    //     background-color: #e5e5e5 !important;
    // }
    .no-schema-icon {
        @apply w-32 !important;
    }
</style>
