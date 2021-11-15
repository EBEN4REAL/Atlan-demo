<template>
    <VirtualList :data="list" data-key="guid" variable-height>
        <template #default="{ item }">
            <div
                class="mx-3 my-1 transition-all duration-300  hover:bg-primary-light"
                :class="
                    item.guid === selectedAssetId
                        ? 'outline-primary bg-primary-light shadow-sm'
                        : ''
                "
            >
                <AssetItem
                    :item="item"
                    :preference="preference"
                    @click="handlePreview(item)"
                ></AssetItem>
            </div>
        </template>
        <template #footer>
            <div
                v-if="isLoadMore || isLoading"
                class="flex items-center justify-center"
            >
                <button
                    :disabled="isLoading"
                    class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full  text-primary"
                    :class="isLoading ? 'px-2 w-9' : ''"
                    @click="$emit('loadMore')"
                >
                    <template v-if="!isLoading">
                        <p
                            class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300  overflow-ellipsis whitespace-nowrap"
                        >
                            Load more
                        </p>
                        <AtlanIcon icon="ArrowDown" />
                    </template>
                    <AtlanIcon
                        icon="Loader"
                        v-else
                        class="w-auto h-10 animate-spin"
                    ></AtlanIcon>
                </button>
            </div>
        </template>
    </VirtualList>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
    import AssetItem from '@/assets/list/assetItem.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    // import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'AssetList',
        components: {
            AssetItem,
            VirtualList,
        },
        props: {
            preference: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },

            assetType: {
                type: String,
                requred: true,
                default: () => '',
            },
            assetId: {
                type: String,
                requred: true,
                default: () => '',
            },
            page: {
                type: String,
                required: false,
                default: () => '',
            },
        },
        emits: ['preview', 'loadMore', 'update:autoSelect'],
        setup(props, { emit }) {
            const selectedAssetId = ref('')
            // const shouldReSelect = false

            const handlePreview = (item: any) => {
                if (item.guid === '-1') {
                    selectedAssetId.value = item.displayText
                } else {
                    selectedAssetId.value = item.guid
                }
                emit('preview', item)
            }

            // function handlePreview(item: any) {
            //     if (item.guid === '-1') {
            //         selectedAssetId.value = item.displayText
            //         // emit('preview', item)
            //     } else {
            //         selectedAssetId.value = item.guid
            //         storeDiscovery.setSelectedAsset(item)

            //         // emit('preview', item) // change emit to pinia action (store)
            //     }
            // }

            // const handleCardClicked = (item: any) => {
            //     // add event
            //     const idx = props.list.findIndex((el) => el.guid === item.guid)
            //     useAddEvent('discovery', 'asset_card', 'clicked', {
            //         click_index: idx,
            //     })
            //     handlePreview(item)
            // }
            // const store = useBulkUpdateStore()
            // const bulkSelectedAssets: Ref<assetInterface[]> = ref([])
            // const updateBulkSelectedAssets = (listItem) => {
            //     const itemIndex = bulkSelectedAssets?.value?.findIndex(
            //         (item) => item?.guid === listItem?.guid
            //     )
            //     if (itemIndex >= 0)
            //         bulkSelectedAssets.value.splice(itemIndex, 1)
            //     else bulkSelectedAssets.value.push(listItem)
            //     store.setBulkMode(!!bulkSelectedAssets.value.length)
            //     store.setBulkSelectedAssets(bulkSelectedAssets.value)
            // }
            // watch(store, () => {
            //     if (!store.bulkSelectedAssets?.length || !store.isBulkMode)
            //         bulkSelectedAssets.value = []
            // })

            // // select first asset automatically conditionally acc to  autoSelect prop
            // watch(
            //     list,
            //     () => {
            //         if (autoSelect.value) {
            //             if (list.value.length) handlePreview(list.value[0])
            //         } else emit('update:autoSelect', true)
            //     },
            //     { immediate: true }
            // )

            // if (autoSelect.value) {
            //     watch(typename, () => {
            //         shouldReSelect = true
            //     })

            //     watch(
            //         () => list.value?.length || 0,
            //         (len, lastLen) => {
            //             if (len > 0 && (lastLen === 0 || lastLen > len))
            //                 shouldReSelect = true

            //             if (shouldReSelect) {
            //                 handlePreview(list.value[0])
            //                 shouldReSelect = false
            //             }
            //         },
            //         { immediate: true }
            //     )
            // }

            return {
                // handlePreview,
                selectedAssetId,
                list,
                handlePreview,
                preference,
                // bulkSelectedAssets,
                // updateBulkSelectedAssets,
                // handleCardClicked,
                // selectedAsset,
            }
        },
    })
</script>

<style lang="less" scoped></style>
