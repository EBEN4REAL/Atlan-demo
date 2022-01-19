<template>
    <div class="flex flex-col text-sm">
        <span class="mb-1 text-sm text-gray-500">Connection</span>
        <div class="flex items-center">
            <img :src="getConnectorImage(asset)" class="h-4 mr-1" />

            <router-link
                :to="`/assets/${connectionGuid(asset)}`"
                class="font-bold text-primary hover:underline"
                >{{
                    `${connectorName(asset)}/${connectionName(asset)}`
                }}</router-link
            >
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
            const {
                getConnectorImage,
                connectorName,
                connectionName,
                connectionGuid,
            } = useAssetInfo()

            return {
                getConnectorImage,
                connectorName,
                connectionName,
                connectionGuid,
            }
        },
    })
</script>
