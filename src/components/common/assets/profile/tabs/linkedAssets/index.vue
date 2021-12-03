<template>
    <div class="p-6">
        <div class="p-4 bg-white rounded">
            <Assets
                :show-filters="false"
                :initial-filters="termsFilter"
                :static-use="true"
                page="glossary"
                :enableSidebarDrawer="true"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import Assets from '@/assets/index.vue'

    export default defineComponent({
        name: 'LinkedAssetsTab',
        components: { Assets },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { qualifiedName } = useAssetInfo()
            const { selectedAsset } = toRefs(props)
            const termsFilter = computed(() => ({
                terms: qualifiedName(selectedAsset.value),
            }))

            return { termsFilter }
        },
    })
</script>
