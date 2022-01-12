<template>
    <div class="h-full p-0 bg-white">
        <div class="flex flex-col pt-1 bg-white">
            <div
                class="flex flex-col items-center justify-center pt-12 pb-20"
                :class="localAssignedEntities.length ? 'hidden' : ''"
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
            <div :class="localAssignedEntities.length ? '' : 'hidden'">
                <AssetList
                    ref="linkedAssetsWrapperRef"
                    :filters="tabFilter"
                    initialCacheKey="LINK_ASSETS_DEFAULT"
                    class="pb-6 mt-2 asset-list-height"
                    :enableSidebarDrawer="true"
                    customPlaceholder="Search linked assets"
                    assetListClass="px-8"
                    aggregationTabClass="px-8"
                    searchBarClass="px-8"
                >
                    <template #searchAction>
                        <AtlanBtn
                            class="mt-2 ml-4 mr-8"
                            size="sm"
                            padding="compact"
                            data-test-id="save"
                            @click="openLinkDrawer"
                            >Link assets</AtlanBtn
                        >
                    </template>
                </AssetList>
            </div>
        </div>
    </div>
    <LinkAssetsDrawer
        :isVisible="isVisible"
        :preference="preference"
        :selectedAssetCount="selectedAssetCount"
        @closeDrawer="closeDrawer"
        @saveAssets="saveAssets"
        :selected-asset="selectedAsset"
        v-model:selected-items="selectedItems"
    />
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
    import AssetItem from '@/common/assets/list/assetItem.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import AssetList from '@/common/assetList/assetList.vue'

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
            LinkAssetsDrawer,
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
            const linkedAssets = ref<assetInterface[]>([]) // assets which need to be linked in current api call
            const unlinkedAssets = ref<assetInterface[]>([]) // assets which need to be unlinked in the current api call
            const selectedItems = ref([]) // assets which have been checked in the drawer
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
                selectedItems.value = []
            }

            const { localAssignedEntities, handleAssignedEntitiesUpdate } =
                updateAssetAttributes(selectedAsset)

            const selectedAssetCount = computed(
                () => selectedItems.value.length
            )

            const handleCancel = () => {
                linkedAssets.value = []
                unlinkedAssets.value = []
                selectedItems.value = []
            }
            const openLinkDrawer = () => {
                selectedItems.value = [...localAssignedEntities.value]
                isVisible.value = true
            }
            const saveAssets = () => {
                const assetSet = new Set([...selectedItems.value])
                const currentCheckedAssets = [...assetSet]

                linkedAssets.value = [...assetSet].filter(
                    (linkedAsset) =>
                        !localAssignedEntities?.value?.find(
                            (current) => linkedAsset.guid === current.guid
                        )
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

                closeDrawer()
            }

            watch(localAssignedEntities, () => {
                if (linkedAssetsWrapperRef?.value?.quickChange) {
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
                linkedAssetsWrapperRef,
                selectedItems,
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
