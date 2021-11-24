<template>
    <GlossaryOverview
        v-if="isGTC(selectedAsset)"
        :selected-asset="selectedAsset"
    />
    <BiOverview
        v-else-if="isBiAsset(selectedAsset)"
        :selected-asset="selectedAsset"
    />
    <NonBiOverview v-else :selected-asset="selectedAsset" />
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import NonBiOverview from './nonBi/index.vue'
    import BiOverview from './bi/index.vue'
    import GlossaryOverview from './glossary/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'OverviewTab',
        components: { NonBiOverview, BiOverview, GlossaryOverview },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const { isBiAsset, isGTC } = useAssetInfo()

            return { isBiAsset, isGTC }
        },
    })
</script>
