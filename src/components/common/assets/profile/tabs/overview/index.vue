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
    <SaasOverview
        v-else-if="isSaasAsset(selectedAsset)"
        :selected-asset="selectedAsset"
        :readmeEditPermission="readmeEditPermission"
    />
    <SQLOverview
        v-else-if="isSQLAsset(selectedAsset)"
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
    import { defineComponent, PropType, computed, toRefs } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import SQLOverview from './sql/index.vue'
    import BiOverview from './bi/index.vue'
    import GlossaryOverview from './glossary/index.vue'
    import SaasOverview from './saas/index.vue'
    import GeneralOverview from './general/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'OverviewTab',
        components: {
            SQLOverview,
            BiOverview,
            GlossaryOverview,
            GeneralOverview,
            SaasOverview,
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
                isSQLAsset,
                isSaasAsset,
                selectedAssetUpdatePermission,
                assetPermission,
            } = useAssetInfo()

            const { selectedAsset } = toRefs(props)

            const readmeEditPermission = computed(
                () =>
                    selectedAssetUpdatePermission(
                        selectedAsset.value,
                        false,
                        'RELATIONSHIP_ADD',
                        'Readme'
                    ) && assetPermission('CREATE_README')
            )

            return {
                isBiAsset,
                isGTC,
                isSQLAsset,
                isSaasAsset,
                readmeEditPermission,
            }
        },
    })
</script>
