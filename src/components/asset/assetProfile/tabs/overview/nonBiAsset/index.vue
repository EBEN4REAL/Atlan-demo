<template>
    <div
        class="flex flex-col gap-y-10"
        style="padding: 2rem 1.25rem 2rem 3.75rem"
    >
        <!-- Announcements -->
        <Announcements
            :asset="selectedAsset"
            :edit-permission="editPermission"
        />

        <!-- Table Summary -->
        <tableSummary :edit-permission="editPermission" />

        <!-- Column and Table Preview-->
        <div class="flex flex-col w-full">
            <!-- Preview Selector-->
            <a-tooltip
                placement="right"
                :title="
                    !showTablePreview && 'No sample data found for this asset'
                "
            >
                <RaisedTab
                    v-model:active="activePreviewTabKey"
                    class="flex-none flex-grow-0 mb-4 mr-auto"
                    :data="tabConfig"
                    :disabled="!showTablePreview"
                />
            </a-tooltip>

            <keep-alive>
                <overviewColumns v-if="activePreviewTabKey === 'column'" />
                <overviewTable v-else-if="activePreviewTabKey === 'table'" />
            </keep-alive>
        </div>

        <!-- Readme widget -->
        <Readme
            class="w-full"
            :show-borders="false"
            :show-padding-x="false"
            :entity="selectedAsset"
            :parent-asset-id="selectedAsset"
            :edit-permission="editPermission"
        />
        <Resources :asset="selectedAsset" />
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
        // ComputedRef,
    } from 'vue'
    import { storeToRefs } from 'pinia'

    // Components
    import Readme from '@/common/readme/index.vue'
    import Resources from '@/asset/assetProfile/widgets/resources/resources.vue'
    import tableSummary from '@/asset/assetProfile/tabs/overview/nonBiAsset/tableSummary.vue'
    import Announcements from '@/asset/assetProfile/widgets/announcements/announcements.vue'
    import RaisedTab from '@/UI/raisedTab.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    // import { assetInterface } from '~/types/assets/asset.interface'
    // store
    import useDiscoveryStore from '~/store/discovery'

    export default defineComponent({
        components: {
            Readme,
            Resources,
            Announcements,
            tableSummary,
            RaisedTab,
            overviewColumns: defineAsyncComponent(
                () =>
                    import(
                        '~/components/asset/assetProfile/tabs/overview/nonBiAsset/overviewColumns.vue'
                    )
            ),
            overviewTable: defineAsyncComponent(
                () =>
                    import(
                        '~/components/asset/assetProfile/tabs/overview/nonBiAsset/overviewTable.vue'
                    )
            ),
        },
        props: {
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup() {
            const activePreviewTabKey: Ref<'column' | 'table'> = ref('column')
            const tabConfig = [
                { key: 'column', label: 'Column Preview' },
                { key: 'table', label: 'Sample Data' },
            ]

            /** INJECTIONS */
            // const assetDataInjection = inject('assetData')

            /** COMPUTED */
            // const assetData: ComputedRef<assetInterface> = computed(
            //     () => assetDataInjection?.asset
            // )

            /** METHODS */
            // useAssetInfo
            const { assetType } = useAssetInfo()
            // store
            const storeDiscovery = useDiscoveryStore()
            const { selectedAsset } = storeToRefs(storeDiscovery)

            const showTablePreview = computed(
                () =>
                    !['TablePartition', 'MaterialisedView'].includes(
                        assetType(selectedAsset.value)
                    )
            )

            return {
                // assetData,
                showTablePreview,
                assetType,
                activePreviewTabKey,
                selectedAsset,
                tabConfig,
            }
        },
    })
</script>
