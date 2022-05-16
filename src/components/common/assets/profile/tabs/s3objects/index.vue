<template>
    <AssetList
        :key="selectedAsset?.guid"
        class="bg-white"
        :filters="tabFilter"
        :static-use="true"
        initial-cache-key="DEFAULT_S3OBJECTS_TAB"
        custom-placeholder="Search all objects"
        empty-view-text="No objects found"
        :enable-sidebar-drawer="true"
        :show-aggregations="false"
        search-bar-class="px-5 my-1"
        asset-item-class="px-2"
    />
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import AssetList from '@/common/assetList/assetList.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'S3ObjectsTab',
        components: { AssetList },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const { qualifiedName } = useAssetInfo()

            const tabFilter = computed(() => ({
                s3BucketQualifiedName: qualifiedName(selectedAsset.value),
                typeName: 'S3Object',
            }))

            return { tabFilter }
        },
    })
</script>
