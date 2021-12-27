<template>
    <div v-if="selectedAsset?.guid" class="z-20 flex flex-col bg-white">
        <AssetPreview
            :selected-asset="
                Object.keys(assetInfo)?.length ? assetInfo : selectedAsset
            "
            page="insights"
            class="w-full"
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
                fetchAsset()
            })

            const updateList = (asset) => {
                const activeInlineTabCopy: activeInlineTabInterface =
                    JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))

                activeInlineTabCopy.assetSidebar.assetInfo = asset
                modifyActiveInlineTab(activeInlineTabCopy, tabs, false, true)
            }

            provide('updateList', updateList)

            return {
                selectedAsset,
                tabs,
                activeInlineTab,
                closeAssetSidebar,
                assetInfo,
            }
        },
    })
</script>
<style lang="less" scoped>
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
