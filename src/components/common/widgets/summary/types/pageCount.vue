<template>
    <div class="flex flex-col text-sm">
        <span class="mb-1 text-sm text-gray-500">Pages</span>
        <span class="text-gray-700">{{ pageCount(asset) }}</span>
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
            const { pageCount } = useAssetInfo()

            return {
                pageCount,
            }
        },
    })
</script>
