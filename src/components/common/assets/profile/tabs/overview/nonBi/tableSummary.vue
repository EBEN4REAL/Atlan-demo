<template>
    <div class="p-4 bg-white rounded">
        <div class="flex items-center mb-4">
            <AtlanIcon icon="TableSummary" class="w-auto h-8 mr-3" /><span
                class="text-base font-bold text-gray"
                >Table Summary</span
            >
        </div>
        <div class="flex flex-col gap-y-10">
            <!-- Profile Widgets -->
            <ProfileWidgets :asset="asset" />

            <!-- Column and Table Preview-->
            <div class="flex flex-col w-full">
                <!-- Preview Selector-->
                <a-tooltip
                    placement="right"
                    :title="
                        !showTablePreview &&
                        'No sample data found for this asset'
                    "
                >
                    <RaisedTab
                        v-model:active="activePreviewTabKey"
                        class="flex-none flex-grow-0 mb-4 mr-auto"
                        :data="tabConfig"
                        :disabled="!showTablePreview"
                    />
                </a-tooltip>

                <OverviewColumns v-if="activePreviewTabKey === 'column'" />
                <SampleDataTable
                    v-else-if="activePreviewTabKey === 'table'"
                    :asset="asset"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        // inject,
        computed,
        ref,
        defineAsyncComponent,
        Ref,
        PropType,
        toRefs,
        // ComputedRef,
    } from 'vue'

    // Components
    import ProfileWidgets from './profileWidgets.vue'
    import RaisedTab from '@/UI/raisedTab.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            ProfileWidgets,
            RaisedTab,
            OverviewColumns: defineAsyncComponent(
                () => import('../../columns/columnWidget.vue')
            ),
            SampleDataTable: defineAsyncComponent(
                () => import('./sampleData.vue')
            ),
        },
        props: {
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)

            const activePreviewTabKey: Ref<'column' | 'table'> = ref('column')
            const tabConfig = [
                { key: 'column', label: 'Column Preview' },
                { key: 'table', label: 'Sample Data' },
            ]

            const { assetType } = useAssetInfo()

            const showTablePreview = computed(
                () =>
                    !['TablePartition', 'MaterialisedView'].includes(
                        assetType(asset.value)
                    )
            )
            return {
                // assetData,
                showTablePreview,
                assetType,
                activePreviewTabKey,
                tabConfig,
            }
        },
    })
</script>
