<template>
    <div class="w-full px-5">
        <!-- <Terms :selectedAsset="selectedAsset" /> -->
        <Classification :selected-asset="selectedAsset" />
        <div class="mt-2">
            <LinkTerms
                :selected-asset="selectedAsset"
                @update:selected-asset="mutateSelectedAsset"
            />
            <!-- <BusinessMetaData :selectedAsset="selectedAsset" /> -->
        </div>
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
