<template>
    <div class="flex flex-col text-sm">
        <span class="mb-1 text-sm text-gray-500">Connection</span>
        <div class="flex items-center">
            <AtlanIcon :icon="getConnectorImage(asset)" class="h-4 mr-1" />

            <span
                class="font-bold cursor-pointer text-primary hover:underline"
                @click="handleOpenDrawer"
                >{{ `${connectorName(asset)}/${connectionName(asset)}` }}</span
            >
        </div>
    </div>
    <AssetDrawer
        :show-drawer="drawerVisible"
        :guid="connectionGuid(asset)"
        @closeDrawer="handleCloseDrawer"
    />
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { AssetDrawer },
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

            const drawerVisible = ref(false)

            const handleOpenDrawer = () => {
                drawerVisible.value = true
            }

            const handleCloseDrawer = () => {
                drawerVisible.value = false
            }

            return {
                getConnectorImage,
                connectorName,
                connectionName,
                connectionGuid,
                drawerVisible,
                handleCloseDrawer,
                handleOpenDrawer,
            }
        },
    })
</script>
