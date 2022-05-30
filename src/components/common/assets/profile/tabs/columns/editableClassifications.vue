<template>
    <Classification
        v-model="localClassifications"
        :guid="asset.guid"
        :selected-asset="asset"
        :edit-permission="
            columnUpdatePermission(asset, 'ENTITY_ADD_CLASSIFICATION')
        "
        :allow-delete="
            columnUpdatePermission(asset, 'ENTITY_REMOVE_CLASSIFICATION')
        "
        @change="handleClassificationChange"
    >
    </Classification>
</template>

<script lang="ts">
    import { defineComponent, toRefs, watch, PropType } from 'vue'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Classification from '@/common/input/classification/index.vue'

    export default defineComponent({
        name: 'EditableClassifications',
        components: { Classification },
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

            const { columnUpdatePermission, classifications } = useAssetInfo()
            const { localClassifications, handleClassificationChange } =
                updateAssetAttributes(asset, false, true)

            watch(asset, () => {
                localClassifications.value = classifications(asset.value)
            })

            return {
                localClassifications,
                handleClassificationChange,
                columnUpdatePermission,
            }
        },
    })
</script>
