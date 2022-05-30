<template>
    <TermsWidget
        v-model="localMeanings"
        :selected-asset="asset"
        :edit-permission="
            columnUpdatePermission(
                asset,
                'RELATIONSHIP_ADD',
                'AtlasGlossaryTerm'
            )
        "
        :allow-delete="
            columnUpdatePermission(
                asset,
                'RELATIONSHIP_REMOVE',
                'AtlasGlossaryTerm'
            )
        "
        @change="handleMeaningsUpdate"
    >
    </TermsWidget>
</template>

<script lang="ts">
    import { defineComponent, toRefs, watch, PropType } from 'vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import TermsWidget from '@/common/input/terms/index.vue'

    export default defineComponent({
        name: 'EditableTermsWidget',
        components: { TermsWidget },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
        },
        emits: ['update'],

        setup(props) {
            const { asset } = toRefs(props)

            const { columnUpdatePermission, meanings } = useAssetInfo()
            const { localMeanings, handleMeaningsUpdate } =
                updateAssetAttributes(asset, false, true)

            watch(asset, () => {
                localMeanings.value = meanings(asset.value)
            })

            return {
                localMeanings,
                handleMeaningsUpdate,
                columnUpdatePermission,
            }
        },
    })
</script>
