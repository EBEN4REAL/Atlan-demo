<template>
    <div class="p-6">
        <div class="flex flex-col px-3 bg-white">
            <div
                v-if="!localAssignedEntities.length"
                class="flex flex-col items-center justify-center pt-12 pb-20"
            >
                <atlan-icon icon="NoLinkedAssets" class="h-40 my-8" />
                <span class="mb-2 text-xl font-bold"
                    >No linked assets to see!</span
                >
                <span class="mb-6 text-base"
                    >Assets linked to this term will appear here.</span
                >
                <AtlanBtn
                    size="sm"
                    padding="compact"
                    data-test-id="save"
                    @click="openLinkDrawer"
                    >+ Link Assets</AtlanBtn
                >
            </div>
            <div v-else>
                <AssetsWrapper
                    ref="linkedAssetsWrapperRef"
                    :show-filters="false"
                    :initial-filters="tabFilter"
                    :static-use="true"
                    :show-aggrs="true"
                    :showCheckBox="false"
                    :preference="preference"
                    :enableSidebarDrawer="true"
                    key="linked-assets"
                    class="asset-list-height"
                    page="glossary"
                >
                    <template #searchAction>
                        <AtlanBtn
                            class="ml-4 mt-2"
                            size="sm"
                            padding="compact"
                            data-test-id="save"
                            @click="openLinkDrawer"
                            >Link</AtlanBtn
                        >
                    </template>
                </AssetsWrapper>
            </div>
        </div>
    </div>
    <LinkAssetsDrawer 
        :isVisible="isVisible" 
        :preference="preference"
        :selectedAssetCount="selectedAssetCount"
        @closeDrawer="closeDrawer"
        @saveAssets="saveAssets"
    />
    <!-- <a-drawer
        placement="right"
        :destroy-on-close="true"
        :visible="isVisible"
        :get-container="false"
        :closable="false"
        :mask="false"
        :class="$style.drawerStyle"
        :width="460"
    >
        <div class="relative overflow-x-hidden overflow-y-hidden drawer_height">
            <div class="absolute w-full h-full py-6 bg-white">
                <span class="mx-4 mt-2 text-base font-bold text-gray-500"
                    >Search from your assets</span
                >
                    <AssetsWrapper
                        :show-filters="false"
                        :static-use="true"
                        :show-aggrs="true"
                        :showCheckBox="true"
                        :preference="preference"
                        :allCheckboxAreaClick="true"
                        :disableHandlePreview="true"
                        class="asset-list-height"
                        key="all-assets"
                        page="glossary"
                    />
            </div>
        </div>
        <div class="flex items-center justify-end m-2 mt-6 gap-x-2">
            <span class="text-base font-bold text-gray-500"
                >{{ selectedAssetCount || 'No' }} items selected</span
            >
            <AtlanBtn
                size="sm"
                padding="compact"
                color="secondary"
                @click="closeDrawer"
                data-test-id="cancel"
                >Cancel</AtlanBtn
            >
            <AtlanBtn
                size="sm"
                padding="compact"
                data-test-id="save"
                @click="saveAssets"
                >Save</AtlanBtn
            >
        </div>
    </a-drawer> -->
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        computed,
        toRefs,
        ref,
        Ref,
        watch,
    } from 'vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import AtlanBtn from '@/UI/button.vue'
    import AssetBrowserTree from '@/governance/personas/assets/assetBrowserTree.vue'
    import Hierarchy from '@/common/facet/hierarchy/index.vue'
    import AssetsWrapper from '@/assets/index.vue'
    import useBulkUpdateStore from '~/store/bulkUpdate'
    import AssetList from '~/components/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'

    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import LinkAssetsDrawer from './linkDrawer.vue'

    export default defineComponent({
        name: 'LinkedAssetsTab',
        components: {
            AssetBrowserTree,
            Hierarchy,
            AssetList,
            SearchAndFilter,
            AssetItem,
            AtlanBtn,
            AssetsWrapper,
            LinkAssetsDrawer
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props, { emit }) {
            // data
            const { qualifiedName } = useAssetInfo()
            const { selectedAsset } = toRefs(props)
            const linkedAssets = ref<assetInterface[]>([])
            const unlinkedAssets = ref<assetInterface[]>([])
            const bulkStore = useBulkUpdateStore()
            const preference = ref({
                sort: 'default',
                display: [],
            })
            const linkedAssetsWrapperRef = ref(null)
            const tabFilter = ref({
                terms: {
                    terms: [
                        {
                            qualifiedName: qualifiedName(selectedAsset.value),
                        },
                    ],
                },
            })

            const isVisible = ref(false)
            function closeDrawer() {
                isVisible.value = false
                linkedAssets.value = []
                unlinkedAssets.value = []
                bulkStore.setBulkSelectedAssets([])
            }
            const selectedAssetCount = computed(() => {
                const s = new Set([...bulkStore.bulkSelectedAssets])
                return s.size
            })

            const { localAssignedEntities, handleAssignedEntitiesUpdate } =
                updateAssetAttributes(selectedAsset)

            const handleCancel = () => {
                linkedAssets.value = []
                unlinkedAssets.value = []
                bulkStore.setBulkSelectedAssets([])
            }
            const openLinkDrawer = () => {
                bulkStore.setBulkSelectedAssets(localAssignedEntities.value)
                isVisible.value = true
            }
            const saveAssets = () => {
                const assetSet = new Set([...bulkStore.bulkSelectedAssets])
                const currentCheckedAssets = [...assetSet]

                linkedAssets.value = [...assetSet].filter((linkedAsset) =>
                    !(localAssignedEntities?.value?.find(
                        (current) => linkedAsset.guid === current.guid
                    ))
                )
                unlinkedAssets.value =
                    localAssignedEntities?.value?.filter(
                        (assignedEntity) =>
                            !currentCheckedAssets.find(
                                (current) =>
                                    current.guid === assignedEntity.guid
                            )
                    ) ?? []
                handleAssignedEntitiesUpdate({
                    linkedAssets: linkedAssets.value,
                    unlinkedAssets: unlinkedAssets.value,
                    term: selectedAsset.value,
                })
                
                bulkStore.setBulkSelectedAssets([])
                closeDrawer()
            }

            watch(localAssignedEntities, () => {
                if(linkedAssetsWrapperRef?.value?.quickChange) {
                    setTimeout(() => {
                        linkedAssetsWrapperRef.value.quickChange()
                    }, 1000)
                    
                }
            })
            return {
                handleCancel,
                openLinkDrawer,
                isVisible,
                preference,
                saveAssets,
                closeDrawer,
                linkedAssets,
                localAssignedEntities,
                selectedAssetCount,
                tabFilter,
                linkedAssetsWrapperRef
            }
        },
    })
</script>

<style lang="less" module>
    .drawerStyle {
        :global(.ant-drawer-body) {
            overflow-y: hidden;
            height: 100%;
        }
    }
</style>
<style lang="less" scoped>
    .drawer_height {
        height: calc(100vh - 6rem);
    }
</style>
