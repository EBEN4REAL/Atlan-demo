<template>
    <div class="flex flex-col text-sm">
        <span class="mb-1 text-sm text-gray-500">Columns</span>
        <span class="text-gray-700">{{ columnCount(asset) }}</span>
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
            const { columnCount } = useAssetInfo()

            return {
                columnCount,
            }
        },
    })
</script>
