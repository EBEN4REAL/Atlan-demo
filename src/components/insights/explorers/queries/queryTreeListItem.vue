<template>
    <div :class="`w-full group ${item.qualifiedName}`">
        <div class="flex justify-between w-full overflow-hidden">
            <div class="flex w-full m-0">
                <div
                    v-if="item.typeName === 'QueryFolder'"
                    class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700 "
                >
                    <div class="parent-ellipsis-container py-1.5">
                        <div class="flex w-full">
                            <AtlanIcon :icon="
                                    expandedKeys.find((key) => key === item.key)
                                        ? 'FolderOpen'
                                        : 'FolderClosed'
                                "
                                class="w-5 h-5 my-auto mr-1"
                            ></AtlanIcon>
                            <span
                                class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                            >
                                {{ title(item) }}</span
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        ComputedRef,
        Ref,
        inject,
    } from 'vue'

    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { assetInterface } from '~/types/assets/asset.interface'

    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: {
        },
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
        },
        setup(props) {

            const { expandedKeys, item } = toRefs(props)
            
            const {
                title,
            } = useAssetInfo()
            

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const savedQueryType = inject('savedQueryType') as Ref<
                'all' | 'personal'
            >

            return {
                
                savedQueryType,
                item,
                expandedKeys,
                activeInlineTab,
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
