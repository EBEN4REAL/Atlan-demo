<template>
    <AssetList
        v-if="fetchAssets"
        :key="selectedAsset?.guid"
        class="bg-white"
        :filters="tabFilter"
        :static-use="true"
        custom-placeholder="Search all related assets"
        empty-view-text="No related assets found"
        :enable-sidebar-drawer="true"
        aggregation-tab-class="px-6"
        search-bar-class="px-6 my-1"
        asset-list-class="mx-6 mt-1"
    />
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs, ref } from 'vue'

    import { whenever } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AssetList from '@/common/assetList/assetList.vue'
    import { useRelations } from '~/composables/discovery/useRelations'

    export default defineComponent({
        name: 'RelatedAssetsTab',
        components: { AssetList },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const fetchAssets = ref(false)

            const { guidList, isReady: isGuidArrayReady } =
                useRelations(selectedAsset)

            const tabFilter = computed(() => ({ guidList: guidList.value }))

            whenever(isGuidArrayReady, () => (fetchAssets.value = true))

            return { tabFilter, fetchAssets }
        },
    })
</script>
