<template>
    <div class="p-8">
        <!-- Table Summary -->
        <div class="mb-10">
            <tableSummary />
        </div>

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
                    !showTablePreview && 'No sample data dound for this asset'
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

        <!-- Column and Table Preview-->
        <div class="w-full mb-10">
            <template v-if="activePreviewTabKey === 'column-preview'">
                <overviewColumns />
            </template>
            <template v-if="activePreviewTabKey === 'table-preview'">
                <overviewTable />
            </template>
        </div>

        <!-- Readme widget -->
        <div class="mb-10">
            <Readme
                class="w-full"
                :show-borders="false"
                :show-padding-x="false"
                :parent-asset-id="assetData"
            />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        inject,
        computed,
        ref,
        defineAsyncComponent,
        Ref,
    } from 'vue'

    // Components
    import Readme from '@/common/readme/index.vue'
    import tableSummary from '~/components/asset/assetProfile/tabs/overview/nonBiAsset/tableSummary.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: {
            Readme,
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
        setup() {
            const activePreviewTabKey: Ref<'column-preview' | 'table-preview'> =
                ref('column-preview')

            function setActiveTab(tabName: 'column-preview' | 'table-preview') {
                activePreviewTabKey.value = tabName
            }

            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            /** METHODS */
            // useAssetInfo
            const { assetType } = useAssetInfo()

            const showTablePreview = computed(
                () =>
                    !['TablePartition', 'MaterialisedView'].includes(
                        assetType(assetData.value)
                    )
            )

            return {
                assetData,
                showTablePreview,
                assetType,
                setActiveTab,
                activePreviewTabKey,
            }
        },
    })
</script>
