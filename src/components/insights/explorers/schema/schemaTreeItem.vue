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
                        <div class="mr-8 text-xs text-gray-500">
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
                            class="absolute flex items-center h-full text-gray-500 transition duration-300 opacity-0  margin-align-top right-6 group-hover:opacity-100 bg-gradient-to-l from-gray-light via-gray-light"
                        >
                            <div
                                class="ml-8 mr-2 bg-gray-light"
                                @click.stop="() => actionClick('play')"
                            >
                                <AtlanIcon
                                    icon="Play"
                                    class="w-4 h-4 my-auto hover:text-primary"
                                ></AtlanIcon>
                            </div>
                            <div
                                class="mr-2 bg-gray-light"
                                @click.stop="() => actionClick('info')"
                            >
                                <AtlanIcon
                                    icon="Info"
                                    class="w-4 h-4 my-auto hover:text-primary"
                                ></AtlanIcon>
                            </div>
                            <div
                                class="bg-gray-light"
                                @click.stop="() => actionClick('bookmark')"
                            >
                                <AtlanIcon
                                    icon="BookmarkOutlined"
                                    class="w-4 h-4 my-auto hover:text-primary"
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
    } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { tablesData } from './tablesDemoData'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
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
            const {
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                title,
            } = useAssetInfo()
            const { modifyActiveInlineTab } = useInlineTab()
            const { openAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )

            const { item } = toRefs(props)
            const actionClick = (action: string) => {
                switch (action) {
                    case 'play': {
                        break
                    }
                    case 'info': {
                        const activeInlineTabCopy: activeInlineTabInterface =
                            Object.assign({}, activeInlineTab.value)
                        activeInlineTabCopy.assetSidebar.assetInfo = item.value

                        console.log(activeInlineTabCopy, 'copy')
                        modifyActiveInlineTab(
                            activeInlineTabCopy,
                            inlineTabs,
                            true
                        )
                        const sampleTableData = tablesData[0]
                        sampleTableData.label = item.value?.title as string
                        openAssetSidebar(sampleTableData)
                        break
                    }
                    case 'bookmark': {
                        break
                    }
                }
            }
            return {
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
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
