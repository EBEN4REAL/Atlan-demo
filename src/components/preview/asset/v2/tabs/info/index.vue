<template>
    <div v-if="!isLoaded" class="">
        <a-collapse
            v-model:activeKey="activeKey"
            :bordered="false"
            class="bg-transparent"
            expandIconPosition="right"
            :class="$style.filter"
            @change="handleCollapseChange"
        >
            <template #expandIcon="{ isActive }">
                <div class="">
                    <AtlanIcon
                        icon="ChevronDown"
                        class="ml-1 transition-transform transform"
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
                        class="flex justify-between text-sm font-bold select-none  header"
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
                    :ref="
                        (el) => {
                            refMap[item.id] = el
                        }
                    "
                    :item="item"
                    :data="dataMap[item.id]"
                    :selectedAsset="infoTabData"
                    :tabData="componentData"
                    :properties="
                        PanelsMapToAsset[selectedAsset.typeName]?.properties ??
                        []
                    "
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
        computed,
    } from 'vue'
    import { PanelsMapToAsset } from './List'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'

    export default defineComponent({
        name: 'InfoTab',
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
        },
        components: {
            assetDetails: defineAsyncComponent(
                () => import('./assetDetails/index.vue')
            ),
            properties: defineAsyncComponent(
                () => import('./properties/index.vue')
            ),
            linkedAsset: defineAsyncComponent(
                () => import('./governance/index.vue')
            ),
            heirarchy: defineAsyncComponent(
                () => import('./heirarchy/index.vue')
            ),
            businessMetadata: defineAsyncComponent(
                () => import('./businessMetadata/index.vue')
            tableauProperties: defineAsyncComponent(
                () => import('./tableau/properties/index.vue')
            ),
            tableauPreview: defineAsyncComponent(
                () => import('./tableau/preview/index.vue')
            ),
        },
        setup(props) {
            const refMap: Ref<{
                [key: string]: any
            }> = ref({})

            const { getApplicableBmGroups } = useBusinessMetadataHelper()
            // Mapping of Data to child compoentns
            const dataMap: { [key: string]: any } = ref({})
            const localStorage = window.localStorage
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

            const handleChange = (value: any) => {}
            const handleCollapseChange = () => {
                setUserDefaultCollapseOrderInInfoTab(activeKey.value)
            }

            const applicableBMList = (typeName: string) =>
                getApplicableBmGroups(typeName)?.map((b) => ({
                    component: 'businessMetadata',
                    id: b.name,
                    label: b.options.displayName,
                    image: b.options.image || '',
                }))
            // ? check if computed  not needed needed?
            const dynamicList = computed(() => [
                ...PanelsMapToAsset[selectedAsset.typeName].panels,
                ...applicableBMList(props.infoTabData.typeName),
            ])

            return {
                PanelsMapToAsset,
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
            @apply border-b;
            @apply border-gray-300;
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
            @apply pb-4 !important;
        }
    }
</style>
