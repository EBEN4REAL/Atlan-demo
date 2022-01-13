<template>
    <a-drawer
        placement="right"
        :destroy-on-close="true"
        :visible="isVisible"
        :get-container="false"
        :closable="false"
        :keyboard="false"
        :maskClosable="true"
        :mask="true"
        :class="$style.drawerStyle"
        :width="460"
        :close="closeDrawer"
    >
        <div class="relative overflow-x-hidden overflow-y-hidden drawer_height">
            <div class="absolute w-full h-full pt-4 bg-white">
                <div class="flex items-center mx-5 mt-2 overflow-hidden">
                    <span
                        class="mr-1 overflow-hidden text-base font-bold text-gray-500 min-w-max"
                        >Select and link assets to
                    </span>
                    <span class="text-base font-bold text-gray-700 truncate">{{
                        selectedAsset?.displayText
                    }}</span>
                    <!-- <Tooltip
                        :tooltip-text="`${selectedAsset?.displayText}`"
                        classes="text-base font-bold ml-0.5 
                    text-gray-700 "
                    /> -->
                    <CertificateBadge
                        v-if="certificateStatus(selectedAsset)"
                        :status="certificateStatus(selectedAsset)"
                        :username="certificateUpdatedBy(selectedAsset)"
                        :timestamp="certificateUpdatedAt(selectedAsset)"
                        class="mb-1 ml-1"
                    ></CertificateBadge>
                </div>
                <AssetList
                    ref="AssetListRef"
                    initialCacheKey="LINK_ASSETS_DRAWER"
                    class="pb-6 mt-2 asset-list-height"
                    :enableSidebarDrawer="false"
                    :selectable="true"
                    :openAssetProfileInNewTab="true"
                    :selectedItems="checkedGuids"
                    assetListClass="px-0 mt-2"
                    aggregationTabClass="px-5"
                    searchBarClass="px-5"
                    @listItem:check="handleAssetItemCheck"
                    @handleAssetCardClick="handleAssetCardClick"
                />
            </div>
        </div>
        <a-divider />
        <div class="flex items-center justify-between mx-5 gap-x-2">
            <span class="text-base font-bold text-gray-500 justify-self-start"
                >{{ selectedAssetCount || 'No' }} items selected</span
            >
            <div class="flex items-center gap-x-2">
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
                    >Link asset(s)</AtlanBtn
                >
            </div>
        </div>

        <a-drawer
            :key="drawerAsset?.guid"
            v-model:visible="childrenDrawer"
            :closable="false"
        >
            <AssetPreview
                v-if="childrenDrawer"
                :selected-asset="drawerAsset"
                :is-drawer="true"
            ></AssetPreview>
        </a-drawer>
    </a-drawer>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        ref,
        computed,
        defineAsyncComponent,
        provide,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import AtlanBtn from '@/UI/button.vue'
    import AssetList from '@/common/assetList/assetList.vue'
    import Assets from '@/assets/index.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import AssetPreview from '@/common/assets/preview/index.vue'
    import { useMagicKeys, whenever } from '@vueuse/core'

    export default defineComponent({
        name: 'LinkedAssetsDrawer',
        components: {
            Assets,
            AtlanBtn,
            Tooltip,
            CertificateBadge,
            AssetList,
            AssetPreview,
            AssetDrawer: defineAsyncComponent(
                () => import('@/common/assets/preview/drawer.vue')
            ),
        },
        props: {
            isVisible: {
                type: Object as PropType<Boolean>,
                required: true,
                default: false,
            },
            preference: {
                type: Object,
                required: false,
            },
            selectedAssetCount: {
                type: Number,
                required: true,
            },
            selectedAsset: {
                type: Object,
                required: true,
            },
            selectedItems: {
                type: Object as PropType<Array<any>>,
                required: true,
                default: () => [],
            },
        },
        emits: ['closeDrawer', 'saveAssets'],
        setup(props, { emit }) {
            const { selectedItems } = useVModels(props, emit)

            const childrenDrawer = ref(false)
            const drawerAsset = ref()
            const AssetListRef = ref()
            // shortcut keys for save linked assets
            const keys = useMagicKeys()
            const { meta, Enter, Escape } = keys

            const closeDrawer = () => {
                emit('closeDrawer')
            }
            const saveAssets = () => {
                emit('saveAssets')
            }
            const {
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
            } = useAssetInfo()
            const checkedGuids = computed(() =>
                selectedItems.value.map((item: any) => item.guid)
            )
            const handleAssetItemCheck = (item) => {
                if (
                    selectedItems.value.find(
                        (selectedItem: any) => selectedItem.guid === item.guid
                    )
                ) {
                    selectedItems.value = selectedItems.value.filter(
                        (selectedItem) => selectedItem.guid !== item.guid
                    )
                } else {
                    selectedItems.value.push(item)
                }
            }
            const handleAssetCardClick = (item) => {
                childrenDrawer.value = true
                drawerAsset.value = item
            }

            const updateDrawerList = (item) => {
                drawerAsset.value = item
                AssetListRef.value?.updateList(item)
            }
            whenever(Enter, () => {
                if (meta.value && Enter.value) {
                    Enter.value = false
                    meta.value = false
                    saveAssets()
                }
            })
            whenever(Escape, () => {
                closeDrawer()
            })

            provide('updateDrawerList', updateDrawerList)
            return {
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                closeDrawer,
                saveAssets,
                checkedGuids,
                handleAssetItemCheck,
                childrenDrawer,
                handleAssetCardClick,
                drawerAsset,
                AssetListRef,
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
