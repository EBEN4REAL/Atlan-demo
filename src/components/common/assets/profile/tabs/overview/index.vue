<template>
    <GlossaryOverview
        v-if="isGTC(selectedAsset)"
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <Readme
                :asset="selectedAsset"
                :is-edit="readmeEditPermission"
                @editing="$emit('editing')"
                @saved-changes="$emit('savedChanges')"
            />
        </template>
    </GlossaryOverview>
    <BiOverview
        v-else-if="isBiAsset(selectedAsset)"
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <Readme
                :asset="selectedAsset"
                :is-edit="readmeEditPermission"
                @editing="$emit('editing')"
                @saved-changes="$emit('savedChanges')"
            />
        </template>
    </BiOverview>
    <SaasOverview
        v-else-if="isSaasAsset(selectedAsset)"
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <Readme
                :asset="selectedAsset"
                :is-edit="readmeEditPermission"
                @editing="$emit('editing')"
                @saved-changes="$emit('savedChanges')"
            />
        </template>
    </SaasOverview>
    <SQLOverview
        v-else-if="isSQLAsset(selectedAsset)"
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <Readme
                :asset="selectedAsset"
                :is-edit="readmeEditPermission"
                @editing="$emit('editing')"
                @saved-changes="$emit('savedChanges')"
            />
        </template>
    </SQLOverview>
    <GeneralOverview
        v-else
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <Readme
                :asset="selectedAsset"
                :is-edit="readmeEditPermission"
                @editing="$emit('editing')"
                @saved-changes="$emit('savedChanges')"
            />
        </template>
    </GeneralOverview>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs } from 'vue'

    import Readme from '@common/widgets/readme/index.vue'
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
            Readme,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['editing', 'savedChanges'],
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
