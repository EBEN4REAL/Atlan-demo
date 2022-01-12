<template>
    <div class="flex text-sm gap-x-16">
        <div class="flex flex-col">
            <span class="mb-1 text-gray-500">Datasets</span>
            <span class="text-gray-700">{{ datasetCount(asset) }}</span>
        </div>
        <div class="flex flex-col">
            <span class="mb-1 text-gray-500">Reports</span>
            <span class="text-gray-700">{{ reportCount(asset) }}</span>
        </div>
        <div class="flex flex-col">
            <span class="mb-1 text-gray-500">Dashboards</span>
            <span class="text-gray-700">{{ dashboardCount(asset) }}</span>
        </div>
        <div class="flex flex-col">
            <span class="mb-1 text-gray-500">Dataflows</span>
            <span class="text-gray-700">{{ dataflowCount(asset) }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const { reportCount, dashboardCount, datasetCount, dataflowCount } =
                useAssetInfo()

            return {
                reportCount,
                dashboardCount,
                datasetCount,
                dataflowCount,
            }
        },
    })
</script>
