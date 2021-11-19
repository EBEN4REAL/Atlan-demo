<template>
    <RowInfoHoverCard
        :image="getConnectorImage(asset)"
        :row-count="rowCount(asset)"
        :size-bytes="sizeBytes(asset)"
        :source-updated-at="sourceUpdatedAt(asset)"
        :source-updated-at-raw="sourceUpdatedAt(asset, true)"
        :source-created-at="sourceCreatedAt(asset)"
        :source-created-at-raw="sourceCreatedAt(asset, true)"
    >
        <div class="flex flex-col text-sm cursor-pointer">
            <span class="mb-1 text-sm text-gray-500">Rows</span>
            <span class="text-gray-700">{{ rowCount(asset) }}</span>
        </div>
    </RowInfoHoverCard>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    // Components
    import RowInfoHoverCard from '@/common/popover/rowInfo.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            RowInfoHoverCard,
        },

        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const {
                rowCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
                getConnectorImage,
            } = useAssetInfo()

            return {
                rowCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
                getConnectorImage,
            }
        },
    })
</script>
