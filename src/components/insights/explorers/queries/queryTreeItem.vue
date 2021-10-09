<template>
    <div class="w-full group">
        <div class="flex justify-between w-full overflow-hidden">
            <div class="flex w-full m-0">
                <div
                    class="flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700 "
                >
                    <!--FOLDER NODE -->
                    <div
                        class="relative flex w-full z py-1.5"
                        v-if="item.typeName === 'QueryFolder'"
                    >
                        <div class="flex w-full">
                            <AtlanIcon
                                :icon="
                                    expandedKeys.find((key) => key === item.key)
                                        ? 'FolderOpen'
                                        : 'FolderClosed'
                                "
                                class="w-5 h-5 my-auto mr-1"
                            ></AtlanIcon>
                            <span class="text-sm leading-5 tracking-wide">{{
                                item.title
                            }}</span>
                        </div>
                    </div>
                    <!------------------------------->
                    <!--SAVED QUERY NODE -->
                    <a-popover placement="rightTop" v-else>
                        <template #content>
                            <div>
                                <QueryItemPopover :item="item" />
                            </div>
                        </template>
                        <div class="relative flex w-full z py-1.5">
                            <div class="flex w-full">
                                <span class="text-sm leading-5 tracking-wide">{{
                                    item.title
                                }}</span>
                                <div class="ml-1 mt-0.5">
                                    <StatusBadge
                                        v-if="item.typeName !== 'QueryFolder'"
                                        :status-id="
                                            item?.attributes?.assetStatus
                                        "
                                        :show-chip-style-status="false"
                                        :show-no-status="true"
                                        :show-label="false"
                                        class="flex-none"
                                    ></StatusBadge>
                                </div>
                            </div>

                            <div
                                v-if="item.typeName !== 'QueryFolder'"
                                class="
                                    absolute
                                    right-4
                                    flex
                                    items-center
                                    mt-0.5
                                    text-gray-500
                                    transition
                                    duration-300
                                    opacity-0
                                    group-hover:opacity-100
                                "
                                :class="
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-gray-light via-gray-light'
                                "
                            >
                                <div
                                    class="pl-2 pr-2 ml-16"
                                    :class="
                                        item?.selected
                                            ? 'tree-light-color'
                                            : 'bg-gray-light'
                                    "
                                    @click.stop="
                                        () => actionClick('info', item)
                                    "
                                >
                                    <a-tooltip placement="top">
                                        <template #title
                                            >Open preview sidebar</template
                                        >

                                        <AtlanIcon
                                            icon="Info"
                                            :class="
                                                item?.selected
                                                    ? 'tree-light-color'
                                                    : ''
                                            "
                                            class="w-4 h-4 my-auto"
                                        ></AtlanIcon>
                                    </a-tooltip>
                                </div>
                                <div
                                    class="bg-gray-light"
                                    @click.stop="
                                        () => actionClick('bookmark', item)
                                    "
                                >
                                    <a-tooltip placement="top">
                                        <template #title>Bookmark</template>

                                        <AtlanIcon
                                            icon="BookmarkOutlined"
                                            :class="
                                                item?.selected
                                                    ? 'tree-light-color'
                                                    : ''
                                            "
                                            class="w-4 h-4 my-auto"
                                        ></AtlanIcon>
                                    </a-tooltip>
                                </div>
                            </div>
                        </div>
                    </a-popover>
                    <!------------------------------->
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
        toRaw,
        watch,
    } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { assetInterface } from '~/types/assets/asset.interface'
    import QueryItemPopover from '~/components/insights/explorers/queries/queryItemPopover.vue'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import StatusBadge from '@common/badge/status/index.vue'

    export default defineComponent({
        components: { QueryItemPopover, StatusBadge },
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
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const editorInstanceRef = inject('editorInstance') as Ref<any>
            const editorInstance = toRaw(editorInstanceRef.value)
            const {
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                title,
            } = useAssetInfo()
            const { isSameNodeOpenedInSidebar } = useSchema()
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )

            const actionClick = (action: string, t: assetInterface) => {
                /* Here t->enity->assetInfo */
                switch (action) {
                    case 'info': {
                        // i button clicked on the same node -> close the sidebar
                        if (isSameNodeOpenedInSidebar(t, activeInlineTab)) {
                            /* Close it if it is already opened */
                            closeAssetSidebar(activeInlineTab.value)
                        } else {
                            const activeInlineTabCopy: activeInlineTabInterface =
                                Object.assign({}, activeInlineTab.value)
                            activeInlineTabCopy.assetSidebar.assetInfo = t
                            activeInlineTabCopy.assetSidebar.isVisible = true
                            openAssetSidebar(activeInlineTabCopy)
                        }

                        break
                    }
                    case 'bookmark': {
                        break
                    }
                }
            }

            return {
                item,
                expandedKeys,
                activeInlineTab,
                isPrimary,
                title,
                assetType,
                dataType,
                dataTypeImage,
                actionClick,
                dataTypeImageForColumn,
            }
        },
    })
</script>
<style lang="less" scoped>
    .tree-container {
        overflow: hidden;
    }
    .nooverflow {
        display: inline-block;
        overflow: hidden !important;
        overflow-wrap: normal;
        text-overflow: ellipsis;
        white-space: nowrap !important;
        width: 0;
        min-width: 100%;
    }
    .popover-width {
        min-width: 440px;
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
