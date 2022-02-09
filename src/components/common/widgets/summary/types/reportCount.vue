<template>
    <div class="flex flex-col">
        <span class="mb-1 text-gray-500">Reports</span>
        <span class="text-gray-700">{{ reportCount(asset) }}</span>
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
            const { reportCount } = useAssetInfo()

            return {
                reportCount,
            }
        },
    })
</script>
