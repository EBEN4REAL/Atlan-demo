<template>
    <div class="h-full p-0 bg-white">
        <div class="flex flex-col bg-white">
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
                    v-if="
                        selectedAssetUpdatePermission(
                            selectedAsset,
                            false,
                            'RELATIONSHIP_ADD',
                            '*'
                        )
                    "
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
                    class="pb-6 asset-list-height"
                    :enableSidebarDrawer="true"
                    customPlaceholder="Search linked assets"
                    aggregation-tab-class="px-5 my-1"
                    :search-bar-class="`${
                        selectedAssetUpdatePermission(
                            selectedAsset,
                            false,
                            'RELATIONSHIP_ADD',
                            '*'
                        )
                            ? 'pl-5'
                            : 'px-5'
                    }
                    pl-5 my-1`"
                    asset-item-class="px-2"
                    :openAssetProfileInNewTab="true"
                >
                    <template #searchAction>
                        <AtlanBtn
                            v-if="
                                selectedAssetUpdatePermission(
                                    selectedAsset,
                                    false,
                                    'RELATIONSHIP_ADD',
                                    '*'
                                )
                            "
                            class="mt-2 ml-4 mr-6"
                            size="sm"
                            padding="compact"
                            data-test-id="save"
                            @click="openLinkDrawer"
                        >
                            Link assets
                        </AtlanBtn>
                    </template>

                    <template
                        v-if="
                            selectedAssetUpdatePermission(
                                selectedAsset,
                                false,
                                'RELATIONSHIP_ADD',
                                '*'
                            )
                        "
                        #assetItemCta="{ item }"
                    >
                        <a-dropdown>
                            <AtlanBtn
                                class="flex items-center justify-center w-8 h-8 p-0 rounded cursor-pointer hover:border-primary-focus"
                                size="sm"
                                color="secondary"
                                padding="compact"
                                @click="(e) => e.stopPropagation()"
                            >
                                <AtlanIcon
                                    icon="KebabMenu"
                                    class="text-gray-700"
                                ></AtlanIcon>
                            </AtlanBtn>

                            <template #overlay>
                                <a-menu>
                                    <a-menu-item
                                        @click="() => unlinkOneAsset(item)"
                                    >
                                        Unlink asset
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </template>
                </AssetList>
            </div>
        </div>
    </div>
    <a-modal
        v-model:visible="isModalVisible"
        width="25%"
        :closable="false"
        okText="Save"
        cancelText=""
        :footer="null"
    >
        <div class="p-3">
            <p class="mb-1 font-bold text-md">Discard linked asset changes?</p>
            <p class="text-md">
                Your changes haven’t been saved yet. Are you sure you want to
                discard?
            </p>
        </div>

        <div class="flex justify-end p-3 space-x-2 border-t border-gray-200">
            <a-button @click="handleModalCancel">Cancel</a-button>
            <a-button class="text-white bg-error" @click="handleConfirmCancel"
                >Confirm</a-button
            >
        </div>
    </a-modal>

    <LinkAssetsDrawer
        v-if="isVisible"
        :isVisible="isVisible"
        :preference="preference"
        :selectedAssetCount="selectedAssetCount"
        @closeDrawer="handleCancel"
        @saveAssets="saveAssets"
        @unCheck="handleItemUncheck"
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
            const { qualifiedName, selectedAssetUpdatePermission } =
                useAssetInfo()

            const { selectedAsset } = toRefs(props)
            const linkedAssets = ref<assetInterface[]>([]) // assets which need to be linked in current api call
            const unlinkedAssets = ref<assetInterface[]>([]) // assets which need to be unlinked in the current api call
            const selectedItems = ref([]) // assets which have been checked in the drawer
            const isModalVisible = ref(false)
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

            const openLinkDrawer = () => {
                selectedItems.value = [...localAssignedEntities.value]
                isVisible.value = true
            }
            const constructPayload = () => {
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
            }
            const handleItemUncheck = (item) => {
                if (
                    localAssignedEntities.value.find(
                        (entity: any) => entity.guid === item.guid
                    )
                ) {
                    localAssignedEntities.value =
                        localAssignedEntities.value.filter(
                            (entity) => entity.guid !== item.guid
                        )
                    localAssignedEntities.value.push(item)
                }
            }
            const handleCancel = () => {
                constructPayload()
                if (linkedAssets.value?.length || unlinkedAssets.value?.length)
                    isModalVisible.value = true
                else closeDrawer()
            }

            const saveAssets = () => {
                constructPayload()
                handleAssignedEntitiesUpdate({
                    linkedAssets: linkedAssets.value,
                    unlinkedAssets: unlinkedAssets.value,
                    term: selectedAsset.value,
                })

                closeDrawer()
            }

            const unlinkOneAsset = (asset: assetInterface) => {
                handleAssignedEntitiesUpdate({
                    unlinkedAssets: [asset],
                    term: selectedAsset.value,
                })
            }

            const handleModalCancel = () => {
                isModalVisible.value = false
            }

            const handleConfirmCancel = () => {
                isModalVisible.value = false
                linkedAssets.value = []
                unlinkedAssets.value = []
                selectedItems.value = []
                closeDrawer()
            }

            watch(localAssignedEntities, () => {
                console.log(linkedAssetsWrapperRef?.value?.filters)
                if (linkedAssetsWrapperRef?.value?.quickChange) {
                    setTimeout(() => {
                        linkedAssetsWrapperRef.value.quickChange()
                        if (
                            linkedAssetsWrapperRef?.value?.list?.length < 2 &&
                            linkedAssetsWrapperRef?.value?.postFilters
                        ) {
                            linkedAssetsWrapperRef.value.postFilters.typeName =
                                '__all'
                        }
                    }, 1000)
                }
            })
            return {
                selectedAssetUpdatePermission,
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
                isModalVisible,
                handleModalCancel,
                handleConfirmCancel,
                unlinkOneAsset,
                handleItemUncheck,
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
