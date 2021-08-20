<template>
    <div class="px-5 mt-8">
        <!-- Overview Columns -->
        <div class="mb-6">
            <h2 class="text-base text-gray">Columns preview</h2>
            <overview-columns />
        </div>

        <!-- Overview Table -->
        <div>
            <h2 class="text-base text-gray">Table preview</h2>
            <overview-table />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent } from 'vue'

    // Components
    import overviewColumns from '~/components/asset/assetProfile/tabs/overview/nonBiAsset/overviewColumns.vue'
    import overviewTable from '~/components/asset/assetProfile/tabs/overview/nonBiAsset/overviewTable.vue'

    export default defineComponent({
        components: { overviewColumns, overviewTable },
    })
</script>
