<template>
    <div
        class="flex flex-col gap-y-10"
        style="padding: 2rem 1.25rem 2rem 3.75rem"
    >
        <!-- Announcements -->
        <Announcements :asset="selectedAsset" :edit-permission="editPermission" />

        <!-- Table Summary -->
        <tableSummary :edit-permission="editPermission" />

        <!-- Column and Table Preview-->
        <div class="w-full">
            <!-- Preview Selector-->
            <a-button-group class="mb-4 rounded shadow">
                <a-button
                    :class="
                        activePreviewTabKey === 'column-preview'
                            ? 'text-primary font-bold'
                            : 'text-gray-500'
                    "
                    @click="setActiveTab('column-preview')"
                >
                    Column Preview
                </a-button>
                <a-tooltip
                    placement="right"
                    :title="
                        !showTablePreview &&
                        'No sample data found for this asset'
                    "
                >
                    <a-button
                        :class="
                            activePreviewTabKey === 'table-preview'
                                ? 'text-primary font-bold'
                                : 'text-gray-500'
                        "
                        :disabled="!showTablePreview"
                        @click="setActiveTab('table-preview')"
                        >Sample Data</a-button
                    ></a-tooltip
                >
            </a-button-group>

            <overviewColumns v-if="activePreviewTabKey === 'column-preview'" />

            <overviewTable v-if="activePreviewTabKey === 'table-preview'" />
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
            const activePreviewTabKey: Ref<'column-preview' | 'table-preview'> =
                ref('column-preview')

            function setActiveTab(tabName: 'column-preview' | 'table-preview') {
                activePreviewTabKey.value = tabName
            }

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
                setActiveTab,
                activePreviewTabKey,
                selectedAsset
            }
        },
    })
</script>
