<template>
    <div class="pl-12 pr-5 mt-8">
        <!-- Overview Columns widget -->
        <div class="mb-16">
            <h2 class="mb-6 text-base text-gray">Columns preview</h2>
            <overview-columns />
        </div>

        <!-- Overview Table widget -->
        <div class="mb-16">
            <h2 class="mb-6 text-base text-gray">Table preview</h2>
            <overview-table />
        </div>

        <!-- Readme widget -->
        <div class="pb-6">
            <Readme
                class="w-full border-0"
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

    export default defineComponent({
        components: { overviewColumns, overviewTable, Readme },
        setup() {
            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            return { assetData }
        },
    })
</script>
