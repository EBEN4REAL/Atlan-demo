<template>
    <div
        class="`w-9/11 group`"
        :style="`opacity: ${
            selectedFolderHide?.guid === item?.guid ? 0.5 : 1
        };`"
        :id="`${item.qualifiedName}-selector`"
    >
        <div class="flex justify-between w-full overflow-hidden item-center">
            <div class="flex w-full m-0">
                <div
                    v-if="item.typeName === 'Folder'"
                    class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700"
                >
                    <div class="py-1 parent-ellipsis-container">
                        <div class="flex w-full">
                            <AtlanIcon
                                :icon="
                                    expandedKeys.find((key) => key === item.key)
                                        ? 'FolderOpen'
                                        : 'FolderClosed'
                                "
                                class="w-4 h-4 mr-1"
                                style="margin-top: 3px"
                            ></AtlanIcon>
                            <span
                                class="text-sm text-gray-700 parent-ellipsis-container-base mt-0.5"
                                >{{ title(item) }}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
            <AtlanIcon
                v-if="selectedNewFolder?.guid === item?.guid"
                icon="Check"
                class="w-4 h-4 pr-4 mt-2 text-primary"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        components: {},
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
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
        setup(props) {
            const { expandedKeys, item } = toRefs(props)
            const { title } = useAssetInfo()

            return {
                item,
                expandedKeys,
                title,
            }
        },
    })
</script>
<style lang="less" scoped>
    .tree-container {
        overflow: hidden;
    }

    .popover-width {
        max-width: 440px;
        min-height: 228px;
    }
    .margin-align-top {
        margin-top: -1px;
    }
    .primary-key-color {
        color: #3ca5bc;
    }
    /* Tree selection actions bg change */
    .tree-light-color {
        background-color: #dbe9fe;
    }
    .via-tree-light-color {
        --tw-gradient-stops: var(--tw-gradient-from), #dbe9fe,
            var(--tw-gradient-to, rgba(244, 246, 253, 0)) !important;
    }
    .from-tree-light-color {
        --tw-gradient-from: #dbe9fe !important;
    }
    .parent-ellipsis-container {
        display: flex;
        align-items: center;
        min-width: 0;
    }
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .parent-ellipsis-container-extension {
        flex-shrink: 0;
    }

    /* ------------------------------- */
</style>
<style lang="less" module>
    :global(.ant-popover-inner-content) {
        // min-width: 440px !important;
        max-width: none !important;
        // min-height: 228px !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
