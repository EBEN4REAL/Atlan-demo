<template>
    <div class="p-6">
        <!-- Overview Columns widget -->
        <div class="px-3 pt-5 pb-4 mb-10 bg-white border rounded-md">
            <h2 class="mb-3 text-xl text-gray">Columns preview</h2>
            <overview-columns />
        </div>

        <!-- Overview Table widget -->
        <div
            v-if="showTablePreview"
            class="px-3 pt-5 mb-10 bg-white border rounded-md"
        >
            <h2 class="mb-3 text-xl text-gray">Table preview</h2>
            <overview-table />
        </div>

        <!-- Readme widget -->
        <div class="px-3 py-4 mb-10 bg-white border rounded-md">
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
    import { defineComponent, inject, computed } from 'vue'

    // Components
    import Readme from '@/common/readme/index.vue'
    import overviewColumns from '~/components/asset/assetProfile/tabs/overview/nonBiAsset/overviewColumns.vue'
    import overviewTable from '~/components/asset/assetProfile/tabs/overview/nonBiAsset/overviewTable.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: { overviewColumns, overviewTable, Readme },
        setup() {
            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)
            const showTablePreview = computed(
                () =>
                    !['TablePartition', 'MaterialisedView'].includes(
                        assetType(assetData.value)
                    )
            )

            /** METHODS */
            // useAssetInfo
            const { assetType } = useAssetInfo()

            return { assetData, showTablePreview, assetType }
        },
    })
</script>
