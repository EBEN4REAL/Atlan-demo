<template>
    <div class="w-full pb-6">
        <GlossaryAssetDiscovery
            :show-filters="false"
            :initial-filters="initialFilters"
            :is-selected="isSelected"
            :term-name="termQualifiedName"
            :term-guid="termGuid"
            :header-reached-top="headerReachedTop"
            @firstCardReachedTop="$emit('firstCardReachedTop')"
            @preview="handlePreview"
        ></GlossaryAssetDiscovery>
        <teleport to="#sidePanel">
            <a-drawer
                v-if="selectedAsset?.guid !== undefined && showPreviewPanel"
                :visible="selectedAsset?.guid !== undefined && showPreviewPanel"
                placement="right"
                :mask="false"
                :get-container="false"
                :wrap-style="{ position: 'absolute', width: '100%' }"
                :keyboard="false"
                :destroy-on-close="true"
                :closable="false"
                width="100%"
            >
                <AssetPreview
                    page="discovery"
                    :selected-asset="selectedAsset"
                    :show-cross-icon="true"
                    @closePreviewPanel="handleClosePreviewPanel"
                ></AssetPreview>
            </a-drawer>
        </teleport>
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed, onMounted, watch, ref } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { useRouter } from 'vue-router'

    import AssetList from '@/discovery/list/assetList.vue'
    import EmptyView from '@common/empty/discover.vue'
    import GlossaryAssetDiscovery from '@/glossary/termProfile/glossaryAssetDiscovery.vue'
    import AssetPreview from '~/components/discovery/preview/assetPreview.vue'

    import useTermLinkedAssets from '~/components/glossary/composables/useTermLinkedAssets'
    import { getDecodedOptionsFromString } from '~/utils/helper/routerQuery'

    interface PropsType {
        termQualifiedName: string
        termGuid: string
        termCount: number
        showPreviewPanel: Boolean
        headerReachedTop: Boolean
    }

    export default defineComponent({
        components: {
            AssetList,
            EmptyView,
            GlossaryAssetDiscovery,
            AssetPreview,
        },
        props: [
            'termQualifiedName',
            'termCount',
            'showPreviewPanel',
            'termGuid',
            'headerReachedTop',
        ],
        emits: ['preview', 'firstCardReachedTop'],
        setup(props: PropsType, { emit }) {
            const router = useRouter()
            const initialFilters = getDecodedOptionsFromString(router)
            const showPreviewPanel = ref(false)
            const isSelected = ref(false)
            const termName = computed(() => props.termQualifiedName)

            const searchQuery = ref<string>()

            const selectedAsset = ref()

            const handlePreview = (asset) => {
                selectedAsset.value = asset
                showPreviewPanel.value = true
                isSelected.value = true
                emit('preview', asset)
            }
            const handleClosePreviewPanel = () => {
                selectedAsset.value = undefined
                isSelected.value = false
                showPreviewPanel.value = false
            }
            console.log(props)
            return {
                termName,
                initialFilters,
                selectedAsset,
                handlePreview,
                handleClosePreviewPanel,
                showPreviewPanel,
                isSelected,
            }
        },
    })
</script>
