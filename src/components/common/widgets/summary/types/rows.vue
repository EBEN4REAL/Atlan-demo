<template>
    <a-tooltip placement="bottomLeft">
        <div class="flex flex-col text-sm">
            <span class="mb-1 text-sm text-gray-500">Rows</span>
            <span class="text-gray-700">{{ rowCount(asset, false) }}</span>
        </div>
        <template #title>
            <span
                v-if="sizeBytes(asset, false) && rowCount(asset, false) !== '~'"
                class="font-semibold"
                >{{ rowCount(asset, true) }} rows ({{
                    sizeBytes(asset, false)
                }})</span
            >
            <span v-else class="font-semibold"
                >Row count is not available for {{ connectorName(asset) }}/{{
                    connectionName(asset)
                }}</span
            >
        </template>
    </a-tooltip>
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
            const { rowCount, sizeBytes, connectorName, connectionName } =
                useAssetInfo()

            return {
                rowCount,
                sizeBytes,
                connectorName,
                connectionName,
            }
        },
    })
</script>
