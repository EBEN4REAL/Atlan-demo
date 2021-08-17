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
                    <fa
                        icon="fas chevron-down"
                        class="ml-1 transition-transform transform"
                        :class="isActive ? '-rotate-180' : 'rotate-0'"
                    />
                </div>
            </template>
            <a-collapse-panel
                v-for="item in List"
                :key="item.id"
                class="bg-transparent"
            >
                <template #header>
                    <div
                        :key="item.id"
                        class="flex justify-between text-sm font-bold select-none  header"
                    >
                        <Tooltip :tooltip-text="item.label" />
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
    } from 'vue'
    import { List } from './List'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Tooltip from '@common/ellipsis/index.vue'

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
            isLoaded: {
                type: Boolean,
            },
        },
        components: {
            Tooltip,
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
        },
        setup(props) {
            const refMap: Ref<{
                [key: string]: any
            }> = ref({})
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
            return {
                handleCollapseChange,
                List,
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
