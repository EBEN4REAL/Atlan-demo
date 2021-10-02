<template>
    <div v-if="!isLoaded" class="">
        <a-collapse
            v-model:activeKey="activeKey"
            :bordered="false"
            class="bg-transparent"
            expand-icon-position="right"
            :class="$style.filter"
            @change="handleCollapseChange"
        >
            <template #expandIcon="{ isActive }">
                <div class="">
                    <AtlanIcon
                        icon="ChevronDown"
                        class="ml-1 transition-transform duration-300 transform"
                        :class="isActive ? '-rotate-180' : 'rotate-0'"
                    />
                </div>
            </template>
            <a-collapse-panel
                v-for="item in dynamicList"
                :key="item.id"
                class="bg-transparent"
            >
                <template #header>
                    <div
                        :key="item.id"
                        class="flex text-sm text-gray-700 select-none header"
                    >
                        <img
                            v-if="item.image"
                            :src="item.image"
                            class="w-auto h-5 mr-2"
                        />
                        {{ item.label }}
                    </div>
                </template>

                <component
                    :is="item.component"
                    :item="item"
                    :page="page"
                    :selected-asset="infoTabData"
                    :tab-data="componentData"
                    :tableauProperties="tableauProperties ?? []"
                    @change="handleChange"
                ></component>
            </a-collapse-panel>
        </a-collapse>
    </div>
    <div
        v-else
        class="flex items-center justify-center mt-4 text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting info</span>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        defineAsyncComponent,
        Ref,
        PropType,
        toRefs,
        watch,
    } from 'vue'
    import { useInfoPanels } from './List'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'InfoTab',
        components: {
            assetDetails: defineAsyncComponent(
                () => import('./assetDetails/index.vue')
            ),
            properties: defineAsyncComponent(
                () => import('./properties/index.vue')
            ),
            heirarchy: defineAsyncComponent(
                () => import('./heirarchy/index.vue')
            ),
        },
        props: {
            id: String,
            componentData: {
                type: Object as PropType<any>,
            },
            infoTabData: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            isLoaded: {
                type: Boolean,
            },
            page: {
                type: String,
                required: true,
            },
        },

        setup(props) {
            const refMap: Ref<{
                [key: string]: any
            }> = ref({})
            const { selectedAsset, page } = toRefs(props)

            // Mapping of Data to child compoentns
            const dataMap: { [key: string]: any } = ref({})
            const { localStorage } = window
            function getUserDefaultCollapseOrderInInfoTab(): string[] {
                let activeKeyOrder: string[] | undefined
                if (localStorage.getItem('asset_preview_info_tab')) {
                    activeKeyOrder = JSON.parse(
                        localStorage.getItem('asset_preview_info_tab') as any
                    )
                }
                if (activeKeyOrder && activeKeyOrder?.length > 0)
                    return JSON.parse(
                        localStorage.getItem('asset_preview_info_tab') as any
                    ) as string[]

                return ['assetDetails', 'linkedAsset']
            }
            function setUserDefaultCollapseOrderInInfoTab(
                activeKeyOrder: string[]
            ) {
                localStorage.setItem(
                    'asset_preview_info_tab',
                    JSON.stringify(activeKeyOrder)
                )
            }
            const activeKey: Ref<string[]> = ref(
                getUserDefaultCollapseOrderInInfoTab()
            )

            const handleChange = () => {}
            const handleCollapseChange = () => {
                setUserDefaultCollapseOrderInInfoTab(activeKey.value)
            }

            const dynamicList = ref<any>([])
            const tableauProperties = ref<any>([])

            watch(
                [selectedAsset, page],
                () => {
                    const infoTab = useInfoPanels(page, selectedAsset)

                    if (infoTab) {
                        const panels = [...infoTab?.panels]
                        const properties = infoTab?.properties
                        const propertiesPanel = panels.pop()
                        tableauProperties.value = properties ?? []
                        dynamicList.value = [...panels, propertiesPanel]
                    }
                },
                { immediate: true }
            )

            return {
                tableauProperties,
                handleCollapseChange,
                dynamicList,
                activeKey,
                refMap,
                dataMap,
                handleChange,
            }
        },
    })
</script>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-none;
        }

        :global(.ant-collapse-header) {
            @apply px-5 !important;
            @apply py-4 !important;
        }

        :global(.ant-collapse-arrow) {
            font-size: 0.85rem !important;
            right: 20px !important;
        }

        :global(.ant-collapse-content-box) {
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px !important;
            @apply pb-0 !important;
        }
    }
</style>
