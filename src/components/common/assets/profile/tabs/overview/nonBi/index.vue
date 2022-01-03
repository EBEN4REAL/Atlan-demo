<template>
    <div class="flex flex-col px-8 py-8 gap-y-4">
        <Summary :asset="selectedAsset">
            <template #announcement>
                <AnnouncementWidget
                    :selected-asset="selectedAsset"
                    class="mb-3"
                ></AnnouncementWidget>
            </template>

            <div class="flex flex-col w-full mt-4">
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
                    :asset="selectedAsset"
                />
            </div>
        </Summary>
        <Readme
            v-if="readmeContent(selectedAsset) || readmeEditPermission"
            :asset="selectedAsset"
            :isEdit="readmeEditPermission"
        />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        defineAsyncComponent,
        computed,
        ref,
        Ref,
        toRefs,
    } from 'vue'

    import Summary from '@common/widgets/summary/index.vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Readme from '@/common/widgets/readme/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import RaisedTab from '@/UI/raisedTab.vue'

    export default defineComponent({
        name: 'NonBiOverview',
        components: {
            AnnouncementWidget,
            Readme,
            Summary,
            RaisedTab,
            OverviewColumns: defineAsyncComponent(
                () => import('../../columns/columnWidget.vue')
            ),
            SampleDataTable: defineAsyncComponent(
                () => import('./sampleData.vue')
            ),
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            readmeEditPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const activePreviewTabKey: Ref<'column' | 'table'> = ref('column')
            const tabConfig = [
                { key: 'column', label: 'Column Preview' },
                { key: 'table', label: 'Sample Data' },
            ]

            const { assetType, readmeContent } = useAssetInfo()

            const showTablePreview = computed(
                () =>
                    !['TablePartition', 'MaterialisedView'].includes(
                        assetType(selectedAsset.value)
                    )
            )

            return {
                activePreviewTabKey,
                tabConfig,
                showTablePreview,
                readmeContent,
            }
        },
    })
</script>

<style lang="less" scoped></style>
