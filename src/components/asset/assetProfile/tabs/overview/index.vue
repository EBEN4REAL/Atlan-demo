<template>
    <!-- tableauAsset -->
    <tableauAsset v-if="assetType.includes('Tableau')" />

    <!-- nonBiAssets -->
    <nonBiAsset v-else />
</template>

<script lang="ts">
    // Vue
    import { defineComponent, ref, inject, computed } from 'vue'

    // Components
    import nonBiAsset from '~/components/asset/assetProfile/tabs/overview/nonBiAsset/index.vue'
    import tableauAsset from '~/components/asset/assetProfile/tabs/overview/tableauAsset/index.vue'

    export default defineComponent({
        components: { nonBiAsset, tableauAsset },
        setup() {
            /** DATA */
            const assetType = ref('')

            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)
            assetType.value = assetData.value.typeName

            return {
                assetType,
            }
        },
    })
</script>
