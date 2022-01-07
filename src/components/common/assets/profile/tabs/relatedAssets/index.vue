<template>
    <div class="h-full bg-white">
        <Assets
            v-if="fetchAssets"
            :show-filters="false"
            :initial-filters="tabFilter"
            :static-use="true"
            emptyViewText="No related assets found"
            page="profile"
            :class="$style.relatedAssetsTab"
            :enableSidebarDrawer="true"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, toRefs, ref } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import Assets from '@/assets/index.vue'
    import { useRelations } from '~/composables/discovery/useRelations'
    import { whenever } from '@vueuse/core'

    export default defineComponent({
        name: 'RelatedAssetsTab',
        components: { Assets },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const fetchAssets = ref(false)

            const {
                guidList,
                isLoading: isFetchingGuids,
                isReady: isGuidArrayReady,
            } = useRelations(selectedAsset)

            const tabFilter = computed(() => {
                return { guidList: guidList.value }
            })

            whenever(isGuidArrayReady, () => (fetchAssets.value = true))

            return { tabFilter, fetchAssets }
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
