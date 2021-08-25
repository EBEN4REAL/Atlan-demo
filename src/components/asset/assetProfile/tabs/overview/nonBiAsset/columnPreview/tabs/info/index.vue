<template>
    <div v-if="isLoaded" class="">
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
                v-for="item in panels"
                :key="item.id"
                class="bg-transparent"
            >
                <template #header>
                    <div :key="item.id" class="flex text-sm select-none header">
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
                    :selected-row="selectedRow"
                    :tab-data="componentData"
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
    import { PanelsMapToAsset, CollapsiblePanels } from './List'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'

    export default defineComponent({
        name: 'InfoTab',
        components: {
            columnDetails: defineAsyncComponent(
                () => import('./columnDetails/index.vue')
            ),

            /* linkedAsset: defineAsyncComponent(
                () => import('./governance/index.vue')
            ), */
            usage: defineAsyncComponent(() => import('./usage/index.vue')),

            businessMetadata1: defineAsyncComponent(
                () => import('./businessMetadata1/index.vue')
            ),
            businessMetadata2: defineAsyncComponent(
                () => import('./businessMetadata2/index.vue')
            ),
            columnProfile: defineAsyncComponent(
                () => import('./columnProfile/index.vue')
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
            selectedRow: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            isLoaded: {
                type: Boolean,
            },
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
                if (localStorage.getItem('column_preview_info_tab')) {
                    activeKeyOrder = JSON.parse(
                        localStorage.getItem('column_preview_info_tab') as any
                    )
                }
                if (activeKeyOrder && activeKeyOrder?.length > 0)
                    return JSON.parse(
                        localStorage.getItem('column_preview_info_tab') as any
                    ) as string[]

                return ['columnDetails', 'linkedAsset']
            }
            function setUserDefaultCollapseOrderInInfoTab(
                activeKeyOrder: string[]
            ) {
                localStorage.setItem(
                    'column_preview_info_tab',
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

            const panels = CollapsiblePanels

            return {
                handleCollapseChange,
                panels,
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
<!-- <template>
    <div>Info</div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'InfoTab',
    })
</script>
<style scoped></style> -->
