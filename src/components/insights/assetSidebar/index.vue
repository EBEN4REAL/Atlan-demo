<template>
    <div
        v-if="
            activeInlineTab?.assetSidebar?.isVisible &&
            selectedAsset?.assetInfo?.guid
        "
        class="relative z-20 flex flex-col h-full bg-white asset-preview-container"
    >
        <div class="absolute close-btn-add-policy" @click="handleClose">
            <AtlanIcon icon="Add" class="w-5 h-5 text-gray-500" />
        </div>

        <AssetPreview
            v-if="!assetLoading && tabs[selectedIndex].assetSidebar.assetInfo"
            :selected-asset="tabs[selectedIndex].assetSidebar.assetInfo"
            page="insights"
        ></AssetPreview>
        <Loader v-else />
    </div>
    <div
        v-else
        class="relative flex flex-col items-center justify-center h-full -mt-12"
    >
        <div
            v-if="activeInlineTab?.assetSidebar?.isVisible"
            class="close-btn-add-policy"
            @click="handleClose"
        >
            <AtlanIcon icon="Add" class="text-white" />
        </div>
        <AtlanIcon icon="NoSelectedAsset" class="w-36 h-28" />
        <div class="px-8 mt-6 text-base text-center text-gray-700">
            This is where you will find information about your data assets
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        inject,
        ComputedRef,
        computed,
        ref,
        watch,
        provide,
        toRaw,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import AssetPreview from '~/components/common/assets/preview/index.vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { QueryCollection } from '~/types/insights/savedQuery.interface'
    import Loader from '@common/loaders/page.vue'

    export default defineComponent({
        components: { AssetPreview, AtlanIcon, Loader },
        props: {},
        setup(props, { emit }) {
            // const storeDiscovery = useAssetStore()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const { modifyActiveInlineTab } = useInlineTab()

            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            const selectedIndex = computed(() => {
                return tabs.value.findIndex(
                    (tab) => tab.key === activeInlineTabKey.value
                )
            })

            const { closeAssetSidebar, fetchAssetData } = useAssetSidebar(
                tabs,
                activeInlineTab
            )

            const assetLoading = ref(false)
            const assetInfo = ref({})

            const selectedAsset: Ref<any> = computed(() => {
                return activeInlineTab.value?.assetSidebar
            })

            const queryCollections = inject('queryCollections') as ComputedRef<
                QueryCollection[] | undefined
            >

            const updateAssetCheck = inject('updateAssetCheck') as Ref<Boolean>

            const collectionName = computed(() => {
                let col = queryCollections.value?.find(
                    (col) =>
                        col.attributes.qualifiedName ===
                        selectedAsset.value?.assetInfo?.attributes
                            ?.collectionQualifiedName
                )
                if (col) {
                    return col?.displayText
                }
                return null
            })

            const fetchAsset = () => {
                const { data, isLoading, error } = fetchAssetData(
                    activeInlineTab.value?.assetSidebar?.assetInfo
                )
                assetLoading.value = true
                watch([data, error, isLoading], () => {
                    assetLoading.value = true
                    if (isLoading.value === false) {
                        assetLoading.value = false
                        if (error.value === undefined) {
                            if (
                                data.value?.entities &&
                                data.value?.entities?.length > 0
                            ) {
                                // console.log('updated asset data: ', data.value)
                                activeInlineTab.value.assetSidebar.assetInfo =
                                    data.value.entities[0]
                            } else {
                                assetInfo.value = {}
                            }
                        } else {
                            assetLoading.value = false
                        }
                    }
                })
            }

            watch(
                updateAssetCheck,
                () => {
                    // console.log('asset update')
                    assetInfo.value = {}
                    if (updateAssetCheck.value) {
                        // console.log('asset update2')
                        fetchAsset()
                        updateAssetCheck.value = false
                    }
                },
                { immediate: true }
            )

            const assetSidebarUpdatedData = inject(
                'assetSidebarUpdatedData'
            ) as Ref<Object>

            const updateList = (asset) => {
                let activeInlineTabCopy: activeInlineTabInterface = JSON.parse(
                    JSON.stringify(toRaw(activeInlineTab.value))
                )

                // console.log('updated asset: ', asset)
                assetSidebarUpdatedData.value = asset

                if (asset?.typeName === 'Query') {
                    const activeTabIndex = tabs.value.findIndex(
                        (tab) => tab.queryId === asset?.guid
                    )
                    if (activeTabIndex > -1) {
                        activeInlineTabCopy = JSON.parse(
                            JSON.stringify(toRaw(tabs.value[activeTabIndex]))
                        )
                        activeInlineTabCopy = {
                            ...activeInlineTabCopy,
                            updateTime:
                                asset?.updateTime ??
                                asset?.attributes.__modificationTimestamp,
                            updatedBy:
                                asset?.updatedBy ??
                                asset?.attributes.__modifiedBy,
                            description: asset?.attributes.description,
                            status: asset?.attributes.certificateStatus,
                            attributes: { ...asset?.attributes },
                            label: asset?.attributes?.name,
                        }
                        activeInlineTabCopy.assetSidebar.assetInfo = asset
                    }
                    // assetInfo.value = asset
                    modifyActiveInlineTab(activeInlineTabCopy, tabs, true, true)
                } else {
                    activeInlineTabCopy.assetSidebar.assetInfo = asset
                    // assetInfo.value = asset
                    modifyActiveInlineTab(activeInlineTabCopy, tabs, true, true)
                }
                // console.log('old data update: ', asset)
            }

            provide('updateList', updateList)

            const handleClose = () => {
                activeInlineTab.value.assetSidebar.isVisible = false
            }

            return {
                selectedIndex,
                tabs,
                assetLoading,
                handleClose,
                selectedAsset,
                activeInlineTab,
                closeAssetSidebar,
                assetInfo,
                collectionName,
            }
        },
    })
</script>
<style lang="less" scoped>
    .asset-preview-container {
        min-width: 420px !important;
        max-width: 420px !important;
    }
    .placeholder {
        background-color: #f4f4f4;
    }
    .show-sidebar {
        width: 420px;
        min-width: 420px;
    }
    .hide-sidebar {
        width: 0px;
        min-width: 0px;
    }
    .sidebar {
        // transition: all 0.22s;
    }
    .close-btn-add-policy {
        // padding: 10px;
        right: 16px;
        top: 11px;
        transform: rotate(45deg);
        z-index: 20;
        cursor: pointer;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
