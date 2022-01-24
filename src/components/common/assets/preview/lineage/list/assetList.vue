<template>
    <VirtualList
        :data="list"
        data-key="guid"
        variable-height
        class="overflow-x-hidden"
    >
        <template #default="{ item }">
            <Popover :item="item">
                <slot :item="item"></slot>
            </Popover>
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
                    <AtlanLoader v-else class="h-10" />
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
    import { defineComponent, ref, toRefs, watch, Ref } from 'vue'
    import AssetItem from './assetItem.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    // import { assetInterface } from '~/types/assets/asset.interface'
    // import useBulkUpdateStore from '~/store/bulkUpdate'
    import Popover from '@/common/popover/assets/index.vue'
    // import useAddEvent from '~/composables/eventTracking/useAddEvent'
    // import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    // import useAssetStore from '~/store/asset'

    export default defineComponent({
        name: 'AssetList',
        components: {
            AssetItem,
            VirtualList,
            Popover,
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
        },
        emits: ['preview', 'loadMore', 'update:autoSelect'],
        setup(props, { emit }) {
            const { list, autoSelect } = toRefs(props)
            // const storeDiscovery = useAssetStore()
            // const { selectedAsset } = storeToRefs(storeDiscovery)
            const selectedAssetId = ref('')
            // const shouldReSelect = false

            const handlePreview = (item: any) => {
                if (item.guid === '-1') {
                    selectedAssetId.value = item.displayText
                    emit('preview', item)
                } else {
                    selectedAssetId.value = item.guid
                    emit('preview', item)
                }
            }

            return {
                list,
                handlePreview,
            }
        },
    })
</script>
