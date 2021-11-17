<template>
    <BiOverview
        v-if="isBiAsset(selectedAsset)"
        :selectedAsset="selectedAsset"
    />
    <NonBiOverview v-else :selectedAsset="selectedAsset" />
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import NonBiOverview from './nonBi/index.vue'
    import BiOverview from './bi/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'OverviewTab',
        components: { NonBiOverview, BiOverview },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const { isBiAsset } = useAssetInfo()

            return { isBiAsset }
        },
    })
</script>
