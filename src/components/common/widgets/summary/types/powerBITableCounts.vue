<template>
    <div class="flex text-sm gap-x-16">
        <div class="flex flex-col">
            <span class="mb-1 text-gray-500">Columns</span>
            <span class="text-gray-700">{{
                powerBITableColumnCount(asset)
            }}</span>
        </div>
        <div class="flex flex-col">
            <span class="mb-1 text-gray-500">Measures</span>
            <span class="text-gray-700">{{
                powerBITableMeasureCount(asset)
            }}</span>
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
            const { powerBITableColumnCount, powerBITableMeasureCount } =
                useAssetInfo()

            return {
                powerBITableColumnCount,
                powerBITableMeasureCount,
            }
        },
    })
</script>
