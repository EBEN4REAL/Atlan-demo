<template>
    <GlossaryOverview
        v-if="isGTC(selectedAsset)"
        :selected-asset="selectedAsset"
        :readmeEditPermission="readmeEditPermission"
    />
    <BiOverview
        v-else-if="isBiAsset(selectedAsset)"
        :selected-asset="selectedAsset"
        :readmeEditPermission="readmeEditPermission"
    />
    <NonBiOverview
        v-else-if="isNonBiAsset(selectedAsset)"
        :selected-asset="selectedAsset"
        :readmeEditPermission="readmeEditPermission"
    />
    <GeneralOverview
        v-else
        :selected-asset="selectedAsset"
        :readmeEditPermission="readmeEditPermission"
    />
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, watch, toRefs } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import NonBiOverview from './nonBi/index.vue'
    import BiOverview from './bi/index.vue'
    import GlossaryOverview from './glossary/index.vue'
    import GeneralOverview from './general/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'OverviewTab',
        components: {
            NonBiOverview,
            BiOverview,
            GlossaryOverview,
            GeneralOverview,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const {
                isBiAsset,
                isGTC,
                isNonBiAsset,
                selectedAssetUpdatePermission,
                createPermission,
            } = useAssetInfo()

            const { selectedAsset } = toRefs(props)

            const readmeEditPermission = computed(() =>
                selectedAssetUpdatePermission(
                    selectedAsset.value,
                    'RELATIONSHIP_ADD',
                    'Readme'
                )
            )

            watch(readmeEditPermission, () => {
                console.log(readmeEditPermission.value)
                console.log('hello')
            })

            return { isBiAsset, isGTC, isNonBiAsset, readmeEditPermission }
        },
    })
</script>
