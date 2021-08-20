<template>
    <!-- nonBiAssets -->
    <nonBiAsset v-if="assetType === 'nonBiAsset'" />

    <!-- tableauAsset -->
    <tableauAsset v-else />
</template>

<script lang="ts">
    // Vue
    import { defineComponent } from 'vue'

    // Components
    import nonBiAsset from '~/components/asset/assetProfile/tabs/overview/nonBiAsset/index.vue'
    import tableauAsset from '~/components/asset/assetProfile/tabs/overview/tableauAsset/index.vue'

    export default defineComponent({
        components: { nonBiAsset, tableauAsset },
        setup() {
            return {
                assetType: 'nonBiAsset',
            }
        },
    })
</script>
