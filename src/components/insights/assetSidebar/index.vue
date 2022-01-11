<template>
    <div
        v-if="selectedAsset?.guid"
        class="z-20 flex flex-col bg-white asset-preview-container"
    >
        <AssetPreview
            :selected-asset="
                Object.keys(assetInfo)?.length
                    ? { ...assetInfo, collectionName: collectionName }
                    : { ...selectedAsset, collectionName: collectionName }
            "
            class="w-full"
            page="insights"
        ></AssetPreview>
    </div>
    <div v-else class="flex flex-col items-center justify-center h-full -mt-12">
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
    import useAssetStore from '~/store/asset'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
    import { QueryCollection } from '~/types/insights/savedQuery.interface'

    export default defineComponent({
        components: { AssetPreview, AtlanIcon },
        props: {},
        setup(props, { emit }) {
            // const storeDiscovery = useAssetStore()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const { modifyActiveInlineTab } = useInlineTab()

            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const { closeAssetSidebar, fetchAssetData } = useAssetSidebar(
                tabs,
                activeInlineTab
            )

            const assetLoading = ref(false)
            const assetInfo = ref({})

            const selectedAsset: Ref<any> = computed(() => {
                return activeInlineTab.value?.assetSidebar?.assetInfo
            })

            const queryCollections = inject('queryCollections') as ComputedRef<
                QueryCollection[] | undefined
            >

            const collectionName = computed(() => {
                let col = queryCollections.value?.find(
                    (col) =>
                        col.attributes.qualifiedName ===
                        selectedAsset.value?.attributes?.collectionQualifiedName
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
                                assetInfo.value = data.value.entities[0]
                            } else {
                                assetInfo.value = {}
                            }
                        } else {
                            assetLoading.value = false
                        }
                    }
                })
            }

            watch(selectedAsset, () => {
                assetInfo.value = {}
                // console.log('selected asset: ', selectedAsset.value)
                fetchAsset()
            })

            const assetSidebarUpdatedData = inject(
                'assetSidebarUpdatedData'
            ) as Ref<Object>

            const updateList = (asset) => {
                // let activeInlineTabCopy: activeInlineTabInterface = JSON.parse(
                //     JSON.stringify(toRaw(activeInlineTab.value))
                // )
                console.log('updated asset: ', asset)

                let activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)

                // console.log('updated asset: ', asset)
                assetSidebarUpdatedData.value = asset

                if (asset?.typeName === 'Query') {
                    if (activeInlineTabCopy.queryId === asset?.guid) {
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
                            attributes: asset?.attribute,
                        }
                    }
                    modifyActiveInlineTab(activeInlineTabCopy, tabs, true, true)
                }
                // console.log('old data update: ', asset)
            }

            provide('updateList', updateList)

            return {
                selectedAsset,
                tabs,
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
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
