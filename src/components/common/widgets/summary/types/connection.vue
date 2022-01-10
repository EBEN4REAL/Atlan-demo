<template>
    <div class="flex flex-col text-sm">
        <span class="mb-1 text-sm text-gray-500">Connection</span>
        <div class="flex items-center">
            <img :src="getConnectorImage(asset)" class="h-4 mr-1" />
            <span>{{
                `${connectorName(asset)}/${connectionName(asset)}`
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
            const { getConnectorImage, connectorName, connectionName } =
                useAssetInfo()

            return {
                getConnectorImage,
                connectorName,
                connectionName,
            }
        },
    })
</script>
