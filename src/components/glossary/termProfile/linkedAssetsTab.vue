<template>
    <div class="w-full pb-6">
        <!-- <div class="mb-4">
            <a-input-search
                v-model:value="searchQuery"
                :placeholder="`Search ${assets?.length} assets...`"
                class="w-80"
                @change="onSearch"
            ></a-input-search>
        </div> -->
        <!-- <a-tabs
            v-if="assets?.length"
            default-active-key="1"
            class="border-0"
        >
            <a-tab-pane key="1" :tab="`All (${assets?.length})`">
                <div class="flex w-full h-full">
                    <div class="w-full item-stretch">
                        <div class="h-full">
                            <div
                                v-if="
                                    assets &&
                                    assets.length <= 0 &&
                                    !isLoading 
                                "
                                class="flex-grow"
                            >
                                <EmptyView></EmptyView>
                            </div>
                            <AssetList
                                v-else
                                :list="assets"
                                :projection="[
                                    'heirarchy',
                                    'description',
                                    'owners',
                                ]"
                                :is-loading="isLoading"
                                @preview="(asset) => $emit('preview', asset)"
                            ></AssetList>
                        </div>
                    </div>
                </div>
            </a-tab-pane>
        </a-tabs>
        <div v-else class="mt-24">
            <EmptyView :showClearFiltersCTA="false" />
        </div> -->
        <GlossaryAssetDiscovery
            :show-filters="false"
            :initial-filters="initialFilters"
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
                    :showCrossIcon="true"
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

    import useTermLinkedAssets from '~/composables/glossary/useTermLinkedAssets'
    import { getDecodedOptionsFromString } from '~/utils/helper/routerQuery'

    interface PropsType {
        termQualifiedName: string
        termCount: number
        showPreviewPanel: Boolean
    }

    export default defineComponent({
        components: {
            AssetList,
            EmptyView,
            GlossaryAssetDiscovery,
            AssetPreview,
        },
        props: ['termQualifiedName', 'termCount'],
        emits: ['preview'],
        setup(props: PropsType, { emit }) {
            const router = useRouter()
            const initialFilters = getDecodedOptionsFromString(router)
            const showPreviewPanel = ref(false)

            const termName = computed(() => props.termQualifiedName)

            // const { linkedAssets, isLoading, error, fetchLinkedAssets } =
            //     useTermLinkedAssets()

            // const assets = computed(() => linkedAssets.value?.entities ?? [])
            // const assetCount = computed(() => assets.value?.length ?? 0)
            // const numberOfTerms = computed(() => props.termCount ?? 5)

            const searchQuery = ref<string>()

            const selectedAsset = ref()

            // onMounted(() => {
            //     if (termName.value) fetchLinkedAssets(termName.value)
            // })

            // watch(termName, (newTermName) => {
            //     if (newTermName) fetchLinkedAssets(newTermName)
            // })

            // const onSearch = useDebounceFn(() => {
            //     fetchLinkedAssets(termName.value, `*${searchQuery.value}*`)
            // }, 0)

            const handlePreview = (asset) => {
                selectedAsset.value = asset
                showPreviewPanel.value = true
                emit('preview', asset)
            }
            const handleClosePreviewPanel = () => {
                selectedAsset.value = undefined
                showPreviewPanel.value = false
            }
            return {
                termName,
                initialFilters,
                selectedAsset,
                handlePreview,
                handleClosePreviewPanel,
                showPreviewPanel,
            }
        },
    })
</script>
