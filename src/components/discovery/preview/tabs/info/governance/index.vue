<template>
    <div class="w-full px-5">
        <!-- <Terms :selectedAsset="selectedAsset" /> -->
        <!-- <Classifications :selected-asset="selectedAsset" /> -->
        <!-- <BusinessMetaData :selectedAsset="selectedAsset" /> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, watch } from 'vue'
    // import Terms from './terms.vue'
    import Classifications from './classifications.vue'
    // import BusinessMetaData from './businessMetadataContainer.vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { Classifications },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            watch(
                selectedAsset,
                () => {
                    console.log('asset changed governance', selectedAsset)
                },
                {
                    immediate: true,
                }
            )
            return { selectedAsset }
        },
    })
</script>

<style lang="less" scoped></style>
