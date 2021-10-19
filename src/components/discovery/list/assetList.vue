<template>
    <VirtualList
        :class="{ 'animate-pulse': isLoading }"
        :data="list"
        data-key="guid"
        variable-height
    >
        <template #default="{ item }">
            <ListItem
                :item="item"
                :is-selected="
                    item.guid === '-1'
                        ? item.displayText === selectedAssetId
                        : item.guid === selectedAssetId
                "
                :score="score[item.guid]"
                :projection="projection"
                :show-check-box="projection?.includes('enableCheckbox')"
                :bulk-select-mode="
                    bulkSelectedAssets && bulkSelectedAssets.length
                        ? true
                        : false
                "
                :is-checked="
                    bulkSelectedAssets.findIndex(
                        (listItem) => listItem.guid === item.guid
                    ) > -1
                "
                @click="handleCardClicked(item)"
                @listItem:check="(e, item) => updateBulkSelectedAssets(item)"
            ></ListItem>
        </template>
        <template #footer>
            <div
                v-if="isLoadMore || isLoading"
                class="flex items-center justify-center"
            >
                <button
                    :disabled="isLoading"
                    class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full text-primary"
                    :class="isLoading ? 'px-2 w-9' : 'px-5 w-32'"
                    @click="$emit('loadMore')"
                >
                    <template v-if="!isLoading">
                        <p
                            class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                        >
                            Load more
                        </p>
                        <AtlanIcon icon="ArrowDown" />
                    </template>
                    <svg
                        v-else
                        class="w-5 h-5 text-primary animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        ></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </button>
            </div>
        </template>
    </VirtualList>
    <!-- <ListItem
        :v-for="item in list"
        :key="item[keyField]"
        :item="item"
        :score="score[item.guid]"
        :projection="projection"
        @click="handlePreview(item)"
    ></ListItem> -->
    <!-- TODO: Add loading state -->
</template>

<script lang="ts">
    import { defineComponent, SetupContext, ref, toRefs, watch, Ref } from 'vue'
    import ListItem from './listItem.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useBulkUpdateStore from '~/store/bulkUpdate'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useDiscoveryStore from '~/store/discovery'
    import { storeToRefs } from 'pinia'

    export default defineComponent({
        name: 'AssetList',
        components: {
            ListItem,
            VirtualList,
        },
        props: {
            list: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            score: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            projection: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            isLoading: {
                type: Boolean,
                required: true,
                default: () => false,
            },
            isLoadMore: {
                type: Boolean,
                required: true,
                default: () => false,
            },
            autoSelect: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            typename: {
                type: String,
            },
        },
        emits: ['preview', 'loadMore', 'update:autoSelect'],
        setup(props, { emit }) {
            const { list, autoSelect, typename } = toRefs(props)
            const storeDiscovery = useDiscoveryStore()
            const { selectedAsset } = storeToRefs(storeDiscovery)
            const selectedAssetId = ref('')
            const shouldReSelect = false
            function handlePreview(item: any) {
                if (item.guid === '-1') {
                    selectedAssetId.value = item.displayText
                    emit('preview', item)
                } else {
                    selectedAssetId.value = item.guid
                    storeDiscovery.setSelectedAsset(item)
                    emit('preview', item)
                }
            }

            const handleCardClicked = (item: any) => {
                // add event
                const idx = props.list.findIndex((el) => el.guid === item.guid)
                useAddEvent('discovery', 'asset_card', 'clicked', {
                    click_index: idx,
                })
                handlePreview(item)
            }
            const store = useBulkUpdateStore()
            const bulkSelectedAssets: Ref<assetInterface[]> = ref([])
            const updateBulkSelectedAssets = (listItem) => {
                const itemIndex = bulkSelectedAssets?.value?.findIndex(
                    (item) => item?.guid === listItem?.guid
                )
                if (itemIndex >= 0)
                    bulkSelectedAssets.value.splice(itemIndex, 1)
                else bulkSelectedAssets.value.push(listItem)
                store.setBulkMode(!!bulkSelectedAssets.value.length)
                store.setBulkSelectedAssets(bulkSelectedAssets.value)
            }
            watch(store, () => {
                if (!store.bulkSelectedAssets?.length || !store.isBulkMode)
                    bulkSelectedAssets.value = []
            })

            // select first asset automatically conditionally acc to  autoSelect prop
            watch(
                list,
                () => {
                    if (autoSelect.value) {
                        if (list.value.length) handlePreview(list.value[0])
                    } else emit('update:autoSelect', true)
                },
                { immediate: true }
            )

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
                handlePreview,
                selectedAssetId,
                list,
                bulkSelectedAssets,
                updateBulkSelectedAssets,
                handleCardClicked,
                selectedAsset
            }
        },
    })
</script>
