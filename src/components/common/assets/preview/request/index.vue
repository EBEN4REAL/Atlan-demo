<template>
    <div>
        <div class="p-4">
            <p class="text-lg font-semibold">Requests</p>
        </div>
        <div
            v-if="isLoading && pagination.offset === 0"
            class="flex items-center justify-center container-loading"
        >
            <AtlanLoader class="h-10" />
        </div>
        <div
            v-else-if="!list.length && !isLoading"
            class="flex items-center justify-center container-loading"
        >
            <div class="text-gray-500">No Data</div>
        </div>
        <VirtualList
            v-else
            :data="list"
            data-key="id"
            class="container-scroll-request"
        >
            <template #default="{ item }">
                <RequestItem
                    :item="item"
                    @handleUpdateData="handleUpdateData"
                />
            </template>
            <template #footer>
                <div
                    v-if="resPagination.filterRecord > list.length"
                    class="flex justify-center mt-3"
                >
                    <button
                        class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full text-primary"
                        @click="handleLoadMore"
                    >
                        <template v-if="!isLoading">
                            <p
                                class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                            >
                                Load more
                            </p>
                            <AtlanIcon icon="ArrowDown" />
                        </template>
                    </button>
                </div>
                <div v-if="isLoading" class="flex justify-center w-full mt-3">
                    <AtlanLoader class="h-6" />
                </div>
            </template>
        </VirtualList>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRefs, ref, watch } from 'vue'
    import { useRequest } from '~/composables/discovery/useRequest'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import RequestItem from './requestItem.vue'

    export default defineComponent({
        name: 'RequestTab',
        components: { VirtualList, RequestItem },
        props: {
            selectedAsset: {
                type: Object,
                default: () => ({}),
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const list = ref([])
            const resPagination = ref({
                filterRecord: 0,
            })
            const pagination = ref({
                limit: 40,
                offset: 0,
            })
            const { data, isLoading } = useRequest(
                selectedAsset.value.guid,
                pagination
            )
            const handleLoadMore = () => {
                pagination.value.offset =
                    pagination.value.offset + pagination.value.limit
            }
            watch(data, () => {
                resPagination.value.filterRecord = data.value.filterRecord
                if (data?.value?.records) {
                    list.value = [...list.value, ...data?.value?.records]
                }
            })
            const handleUpdateData = (item) => {
                list.value = list.value.filter((el) => el.id !== item.id)
            }
            return {
                data,
                isLoading,
                list,
                handleUpdateData,
                resPagination,
                handleLoadMore,
                pagination,
            }
        },
    })
</script>

<style lang="less">
    .container-scroll-request {
        max-height: 555px;
    }
</style>
<style lang="less" scoped>
    .container-loading {
        height: 500px;
    }
</style>
