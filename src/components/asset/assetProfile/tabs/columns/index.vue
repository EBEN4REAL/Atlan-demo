<template>
    <div
        class="flex flex-col gap-y-10"
        style="padding: 2rem 1.25rem 2rem 3.75rem"
    >
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
            <KeepAlive>
                <overviewColumns
                    v-if="activePreviewTabKey === 'column-preview'"
                />
                <overviewTable
                    v-else-if="activePreviewTabKey === 'table-preview'"
                />
            </KeepAlive>
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
        ComputedRef,
    } from 'vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
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
            const assetData: ComputedRef<assetInterface> = computed(
                () => assetDataInjection?.asset
            )

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
