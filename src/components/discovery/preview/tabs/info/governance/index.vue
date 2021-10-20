<template>
    <div class="flex flex-col w-full px-5 gap-y-4">
        <!-- <Terms :selectedAsset="selectedAsset" /> -->
        <Classification
            :selected-asset="selectedAsset"
            :edit-permission="userHasEditPermission"
        />

        <LinkTerms
            :selected-asset="selectedAsset"
            :edit-permission="userHasEditPermission"
            @update:selected-asset="mutateSelectedAsset"
        />
        <!-- <BusinessMetaData :selectedAsset="selectedAsset" /> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, watch, inject } from 'vue'
    // import Terms from './terms.vue'
    import Classification from '@common/sidebar/classifications.vue'
    import LinkTerms from '@common/sidebar/linkTerms.vue'
    // import BusinessMetaData from './businessMetadataContainer.vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { Classification, LinkTerms },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            userHasEditPermission: {
                type: Boolean,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const mutateSelectedAsset: (updatedAsset: assetInterface) => void =
                inject('mutateSelectedAsset', () => {})
            watch(
                selectedAsset,
                () => {
                    console.log('asset changed governance', selectedAsset)
                },
                {
                    immediate: true,
                }
            )
            return { selectedAsset, mutateSelectedAsset }
        },
    })
</script>

<style lang="less" scoped></style>
