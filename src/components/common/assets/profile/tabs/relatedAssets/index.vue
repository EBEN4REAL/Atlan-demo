<template>
    <div class="h-full p-6 pt-6">
        <div class="bg-white rounded">
            <Assets
                :show-filters="false"
                :initial-filters="tabFilter"
                :static-use="true"
                emptyViewText="No related assets found"
                page="profile"
                :class="$style.relatedAssetsTab"
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
            const { qualifiedName, assetType } = useAssetInfo()
            const { selectedAsset } = toRefs(props)
            const tabFilter = computed(() => {})

            return { tabFilter }
        },
    })
</script>

<style lang="less" module>
    .relatedAssetsTab {
        :global(.ant-tabs-tab:first-child) {
            @apply ml-0 !important;
        }
    }
</style>
