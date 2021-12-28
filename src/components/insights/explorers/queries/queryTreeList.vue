<template>
    <div class="max-h-screen" :class="$style.queryTreeStyles">
        <div class="h-full overflow-x-hidden query-tree-root-div">
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
                    @expand="onExpand"
                >
                    <template #switcherIcon>
                        <AtlanIcon icon="CaretRight" />
                    </template>

                    <template #title="item">
                        <QueryTreeListItem
                            :item="item"
                            v-if="item.typeName === 'Folder'"
                            :expandedKeys="expandedKeys"
                            :selectedNewFolder="selectedNewFolder"
                            :selectedFolderHide="selectedFolderHide"
                        />
                        <!-- <div
                            class="flex items-center h-8 text-sm text-gray-500"
                            v-if="item?.title === `emptyNode`"
                        >
                            <span>folder is empty,&nbsp;</span
                            ><span class="text-primary"
                                >create a folder&nbsp;</span
                            ><span> here</span>
                        </div> -->
                        <div
                            v-else-if="item.title === 'Load more'"
                            class="flex flex-row w-full text-sm font-bold leading-5 text-primary"
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
        </div>
    </div>
</template>
<script lang="ts">
    // library
    import { defineComponent, PropType, inject, Ref, toRefs } from 'vue'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

    // components
    import LoadingView from '@common/loaders/section.vue'
    import QueryTreeListItem from './queryTreeListItem.vue'

    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import AtlanBtn from '~/components/UI/button.vue'

    export default defineComponent({
        components: {
            LoadingView,
            AtlanIcon,
            AtlanBtn,
            QueryTreeListItem,
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
            selectedNewFolder: {
                type: Object,
                required: false,
            },
            selectedFolderHide: {
                type: Object,
                required: false,
            },
        },
        emits: ['createFolderInput'],

        setup(props, { emit }) {
            // data
            const onExpand = (expanded: string[], event: any) => {
                console.log('expansion: ', {
                    expanded,
                    event,
                })
                if (props.selectedFolderHide?.guid === event?.node?.guid) {
                } else {
                    props.expandNode(expanded, event)
                }
            }
            return {
                onExpand,
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
            @apply bg-gray-100;
        }
        :global(.ant-tree-switcher) {
            width: 16px !important;
        }

        :global(.ant-tree .ant-tree-node-content-wrapper) {
            padding: 0 !important;
            overflow: hidden;
            @apply h-8 !important;
        }

        :global(.ant-tree-treenode) {
            padding-bottom: 0px !important;
            @apply hover:bg-gray-100 !important;
            transition: none !important;
            padding-left: 24px !important;
        }
        :global(.ant-tree-node-content-wrapper) {
            @apply hover:bg-gray-100 !important;
            transition: none !important;
        }

        :global(.ant-tree-node-selected) {
            @apply bg-primary-light !important;
            @apply hover:bg-primary-light !important;
            // @apply hover:bg-gray-light !important;
        }
        :global(.ant-tree-treenode-selected) {
            @apply bg-primary-light !important;
            @apply hover:bg-primary-light !important;
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
