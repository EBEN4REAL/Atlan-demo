<template>
    <div class="flex flex-col p-6 gap-y-4 max-profile-width">
        <AnnouncementWidget
            :selected-asset="selectedAsset"
        ></AnnouncementWidget>
        <Summary :asset="selectedAsset">
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
                    :asset="selectedAsset"
                />
            </div>
        </Summary>
        <Readme :asset="selectedAsset" />
        <!-- <Resources :asset="selectedAsset" /> -->
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

import Resources from '@common/widgets/resources/index.vue'
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
        Resources,
        Summary,
        RaisedTab,
        OverviewColumns: defineAsyncComponent(
            () => import('../../columns/columnWidget.vue')
        ),
        SampleDataTable: defineAsyncComponent(() => import('./sampleData.vue')),
    },
    props: {
        selectedAsset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
    },
    setup(props) {
        const { selectedAsset } = toRefs(props)

        const activePreviewTabKey: Ref<'column' | 'table'> = ref('column')
        const tabConfig = [
            { key: 'column', label: 'Column Preview' },
            { key: 'table', label: 'Sample Data' },
        ]

        const { assetType } = useAssetInfo()

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
        }
    },
})
</script>

<style lang="less" scoped>
.max-profile-width {
    max-width: calc(100vw - 420px);
}
</style>
