<template>
    <a-tree
        :tree-data="list"
        :draggable="true"
        :block-node="true"
        :load-data="onLoadData"
        :loadedKeys="loadedKeys"
        :treeDataSimpleMode="true"
        :auto-expand-parent="false"
    >
        <template #switcherIcon>
            <AtlanIcon icon="CaretRight" class="my-auto" />
        </template>

        <template #title="entity">
            <GlossaryTreeItem2 :item="entity" />
        </template>
    </a-tree>
</template>
<script lang="ts">
    // library
    import {
        defineComponent,
        computed,
        PropType,
        ref,
        toRef,
        toRefs,
        watch,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
    import { useDebounceFn } from '@vueuse/core'
    import { useVModels } from '@vueuse/core'

    import GlossaryTreeItem2 from '@/glossary/tree/glossaryTreeItem2.vue'

    // composables
    import useGtcSearch from '~/composables/glossary/useGtcSearch'

    import getEntityStatusIcon from '@/glossary/utils/getEntityStatusIcon'

    export default defineComponent({
        components: {
            GlossaryTreeItem2,
        },
        props: {
            list: {
                type: Array,
                required: false,
                default: () => [],
            },
            onLoadData: {
                type: Function,
                required: false,
                default: () => {},
            },
            loadedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
        },
        setup(props, { emit }) {
            const { list } = toRefs(props)

            return {
                list,
            }
            // data
        },
    })
</script>
<style lang="less" module>
    .createDropdownStyles {
        :global(.ant-dropdown-menu-item) {
            @apply m-0 p-1 text-sm leading-5 rounded;
        }
    }

    .glossaryTree {
        background-color: #fafafa;

        :global(.ant-select) {
            min-width: 236px;
            width: 100%;
            @apply m-0 p-0;
        }

        :global(.ant-input-search) {
            min-width: 196px;
            height: 32px;
        }

        .tree-glossary-actions {
            .treeMode {
                @apply bg-opacity-100 !important;
            }
        }

        .treeStyles {
            max-height: calc(100vh - 11rem) !important;
            :global(.ant-tree-switcher_close) {
                @apply flex;
            }
            :global(.ant-tree-switcher_open) {
                transform: rotate(90deg);
                @apply pt-2;
            }
            :global(.ant-tree-node-selected) {
                @apply bg-black bg-opacity-5 text-primary font-bold !important;
                color: blue !important;
            }

            :global(.ant-tree-title) {
                @apply pl-1 !important;
                padding-top: 4px !important;
                padding-bottom: 4px !important;
                // max-height: 28px !important;

                &:hover {
                    @apply bg-black bg-opacity-5 !important;
                }
            }
            // :global(.ant-tree-treenode-switcher-close) {
            //     max-height: 28px !important;
            // }
            // :global(.ant-tree-treenode-switcher-open) {
            //     li {
            //         max-height: 28px !important;
            //     }
            // }
            :global(.ant-tree-node-content-wrapper) {
                @apply mb-2 border-0;
            }
        }
    }
    .parentGroup {
        :global(.parent-group-hover) {
            @apply opacity-0 !important;
        }
        &:hover {
            :global(.parent-group-hover) {
                @apply opacity-100 !important;
            }
        }
    }
</style>
