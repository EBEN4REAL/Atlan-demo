<template>
    <div class="w-full group">
        <div class="flex justify-between w-full overflow-hidden">
            <div class="flex w-full m-0">
                <div
                    class="flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700 "
                >
                    <!--For Column-->
                    <div
                        v-if="assetType(item) == 'Column'"
                        class="relative flex items-center justify-between w-full "
                    >
                        <div class="flex w-full">
                            <component
                                :is="dataTypeImage(item)"
                                class="
                                    flex-none
                                    w-auto
                                    h-4
                                    mr-1
                                    mt-0.5
                                    text-gray-500
                                "
                            ></component>
                            <span
                                class="mb-0 text-sm leading-5 tracking-wide  nooverflow"
                            >
                                {{ title(item) }}
                            </span>
                        </div>
                        <div
                            class="flex items-center text-xs text-gray-500 mr-7"
                            v-if="isPrimary(item)"
                        >
                            <div class="flex items-center">
                                <a-tooltip>
                                    <template #title>Pkey</template>
                                    <AtlanIcon
                                        icon="PrimaryKey"
                                        class="w-4 h-4 my-auto mr-1  primary-key-color"
                                    ></AtlanIcon>
                                </a-tooltip>
                            </div>
                            {{ dataType(item) }}
                        </div>
                    </div>
                    <!------------------------------->
                    <!--For Others -->
                    <div v-else class="relative flex w-full">
                        <AtlanIcon
                            :icon="assetType(item)"
                            class="w-4 h-4 my-auto mr-1"
                        ></AtlanIcon>
                        <span
                            class="mb-0 text-sm leading-5 tracking-wide  nooverflow"
                        >
                            {{ title(item) }}
                        </span>
                        <div
                            class="absolute flex items-center h-full text-gray-500 transition duration-300 opacity-0  margin-align-top right-6 group-hover:opacity-100"
                            :class="
                                item?.selected
                                    ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                    : 'bg-gradient-to-l from-gray-light via-gray-light'
                            "
                        >
                            <div
                                class="pl-2 ml-24"
                                @click="() => actionClick('add')"
                            >
                                <AtlanIcon
                                    icon="AddAssetName"
                                    class="w-4 h-4 my-auto"
                                    :class="
                                        item?.selected
                                            ? 'tree-light-color'
                                            : 'bg-gray-light'
                                    "
                                ></AtlanIcon>
                            </div>
                            <div
                                class="pl-2 pr-2"
                                :class="
                                    item?.selected
                                        ? 'tree-light-color'
                                        : 'bg-gray-light'
                                "
                                @click.stop="() => actionClick('info')"
                            >
                                <AtlanIcon
                                    icon="Info"
                                    :class="
                                        item?.selected ? 'tree-light-color' : ''
                                    "
                                    class="w-4 h-4 my-auto"
                                ></AtlanIcon>
                            </div>
                            <div
                                class="pr-2"
                                @click.stop="() => actionClick('play')"
                            >
                                <AtlanIcon
                                    icon="Play"
                                    :class="
                                        item?.selected ? 'tree-light-color' : ''
                                    "
                                    class="w-4 h-4 my-auto"
                                ></AtlanIcon>
                            </div>
                            <div
                                class="bg-gray-light"
                                @click.stop="() => actionClick('bookmark')"
                            >
                                <AtlanIcon
                                    icon="BookmarkOutlined"
                                    :class="
                                        item?.selected ? 'tree-light-color' : ''
                                    "
                                    class="w-4 h-4 my-auto"
                                ></AtlanIcon>
                            </div>
                        </div>
                    </div>
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

    export default defineComponent({
        components: {},
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
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
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )

            const { item } = toRefs(props)
            const actionClick = (action: string) => {
                switch (action) {
                    case 'add': {
                        editorInstance.trigger('keyboard', 'type', {
                            text: `${item.value.title}`,
                        })
                        break
                    }
                    case 'play': {
                        break
                    }
                    case 'info': {
                        if (!activeInlineTab.value.assetSidebar.isVisible) {
                            const activeInlineTabCopy: activeInlineTabInterface =
                                Object.assign({}, activeInlineTab.value)
                            activeInlineTabCopy.assetSidebar.assetInfo = item
                            activeInlineTabCopy.assetSidebar.isVisible = true
                            openAssetSidebar(activeInlineTabCopy)
                        } else {
                            /* Close it if it is already opened */
                            closeAssetSidebar(activeInlineTab.value)
                        }
                        break
                    }
                    case 'bookmark': {
                        break
                    }
                }
            }

            return {
                activeInlineTab,
                isPrimary,
                title,
                assetType,
                dataType,
                dataTypeImage,
                actionClick,
                dataTypeImageForColumn,

                item,
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
        min-width: 85%;
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

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
