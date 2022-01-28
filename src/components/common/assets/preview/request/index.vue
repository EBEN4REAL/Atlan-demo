<template>
    <div>
        <div class="flex justify-between p-4">
            <p class="font-semibold text-gray-500">Requests</p>
            <a-dropdown trigger="click" placement="bottomRight">
                <template #overlay>
                    <a-menu class="p-1">
                        <a-menu-item
                            v-for="stat in listStatus"
                            :key="stat.key"
                            @click="selctedFilter = stat"
                        >
                            <div
                                class="flex items-center rounded hover:bg-primary-light menu-status"
                            >
                                <!-- <div
                                    class="mr-2 dot"
                                    :style="{
                                        background: stat.color,
                                    }"
                                /> -->
                                {{ stat.name }}
                                <AtlanIcon
                                    v-if="selctedFilter.key === stat.key"
                                    icon="Check"
                                    class="ml-auto text-primary"
                                />
                            </div>
                        </a-menu-item>
                    </a-menu>
                </template>
                <AtlanButton
                    class="flex items-center justify-between filter-status"
                    color="secondary"
                    padding="compact"
                >
                    <div class="flex items-center">
                        <!-- <div
                            :style="{
                                background: selctedFilter.color,
                            }"
                            class="mr-2 dot"
                        /> -->
                        {{ selctedFilter.name }}
                    </div>
                    <AtlanIcon icon="ChevronDown" :class="'icon-drop'" />
                </AtlanButton>
            </a-dropdown>
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
                    :selected-asset="selectedAsset"
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
    import { defineComponent, toRefs, ref, watch } from 'vue'
    import { useRequest } from '~/composables/discovery/useRequest'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import RequestItem from './requestItem.vue'
    import AtlanButton from '@/UI/button.vue'

    const listStatus = [
        {
            name: 'All',
            key: 'all',
            color: '#6D6DDA',
        },
        {
            name: 'Pending',
            key: 'active',
            color: '#FFB119',
        },
        {
            name: 'Approved',
            key: 'approved',
            color: '#6D6DDA',
        },
        {
            name: 'Rejected',
            key: 'rejected',
            color: '#DC5252',
        },
    ]

    export default defineComponent({
        name: 'RequestTab',
        components: { VirtualList, RequestItem, AtlanButton },
        props: {
            selectedAsset: {
                type: Object,
                default: () => ({}),
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const selctedFilter = ref(listStatus[0])
            const list = ref([])
            const resPagination = ref({
                filterRecord: 0,
            })
            const pagination = ref({
                limit: 40,
                offset: 0,
            })
            const filterStatus = ref({})
            const { data, isLoading, mutate } = useRequest(
                selectedAsset.value.guid,
                pagination,
                selectedAsset.value.typeName,
                filterStatus
            )
            watch(selctedFilter, () => {
                list.value = []
                if (selctedFilter.value.key === 'all') {
                    filterStatus.value = {}
                } else {
                    filterStatus.value = {
                        status: selctedFilter.value.key,
                    }
                }
                pagination.value.offset = 0
                mutate()
            })
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
                listStatus,
                selctedFilter,
            }
        },
    })
</script>

<style lang="less">
    .container-scroll-request {
        max-height: 555px;
    }
    .menu-status {
        width: 100px;
    }
    .filter-status {
        width: 90px;
    }
</style>
<style lang="less" scoped>
    .container-loading {
        height: 500px;
    }
    .dot {
        height: 6px;
        width: 6px;
        border-radius: 50%;
    }
</style>
