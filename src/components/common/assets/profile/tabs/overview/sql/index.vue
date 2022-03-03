<template>
    <div class="flex flex-col p-6 gap-y-4">
        <Summary :asset="selectedAsset">
            <template #announcement>
                <AnnouncementWidget
                    :selected-asset="selectedAsset"
                    class="mb-4"
                ></AnnouncementWidget>
            </template>

            <div class="flex flex-col w-full mt-4">
                <!-- Preview Selector-->

                <RaisedTab
                    v-model:active="activePreviewTabKey"
                    class="flex-none flex-grow-0 mb-4 mr-auto"
                    :data="
                        connectorName(selectedAsset) === 'glue'
                            ? [{ key: 'column', label: 'Column Preview' }]
                            : tabConfig
                    "
                />

                <OverviewColumns v-if="activePreviewTabKey === 'column'" />
                <SampleDataTable
                    v-else-if="activePreviewTabKey === 'table'"
                    :asset="selectedAsset"
                />
            </div>
        </Summary>
        <slot name="readme"></slot>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        defineAsyncComponent,
        ref,
        Ref,
        toRefs,
    } from 'vue'

    import Summary from '@common/widgets/summary/index.vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import RaisedTab from '@/UI/raisedTab.vue'

    export default defineComponent({
        name: 'NonBiOverview',
        components: {
            AnnouncementWidget,
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

            const { connectorName } = useAssetInfo()

            const activePreviewTabKey: Ref<'column' | 'table'> = ref('column')
            const tabConfig = [
                { key: 'column', label: 'Column Preview' },
                { key: 'table', label: 'Sample Data' },
            ]

            return {
                activePreviewTabKey,
                tabConfig,
                connectorName,
            }
        },
    })
</script>

<style lang="less" scoped></style>
