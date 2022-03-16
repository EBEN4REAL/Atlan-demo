<template>
    <div>
        <div
            class="flex items-center justify-between px-5 py-2 border-b border-gray-200 bg-gray-50"
        >
            <span class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    height="h-4"
                />
                <span class="ml-1 font-semibold text-gray-500">Requests</span>
            </span>

            <a-dropdown trigger="click" placement="bottomRight">
                <template #overlay>
                    <a-menu class="p-1 request-preview">
                        <a-menu-item
                            v-for="stat in listStatus"
                            :key="stat.key"
                            :class="'hover:bg-primary-light'"
                            @click="selectedFilter = stat"
                        >
                            <div
                                class="flex items-center rounded hover:bg-primary-light menu-status"
                            >
                                <AtlanIcon
                                    :class="stat.class"
                                    class="mr-1"
                                    :icon="stat.icon"
                                />
                                <!-- <div
                                    class="mr-2 dot"
                                    :style="{
                                        background: stat.color,
                                    }"
                                /> -->
                                {{ stat.name }}
                                <AtlanIcon
                                    v-if="selectedFilter.key === stat.key"
                                    icon="Check"
                                    class="ml-auto text-primary"
                                />
                            </div>
                        </a-menu-item>
                    </a-menu>
                </template>

                <div
                    class="flex text-gray-700 text-xs items-center bg-white py-1.5 px-2 rounded border border-gray-300 cursor-pointer w-32"
                >
                    <AtlanIcon
                        :class="selectedFilter.class"
                        class="mr-2"
                        :icon="selectedFilter.icon"
                    />
                    {{ selectedFilter.name }}
                    <AtlanIcon class="ml-auto" icon="ChevronDown" />
                </div>
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
            <div class="flex flex-col items-center">
                <AtlanIcon icon="EmptyRequest" style="height: 165px" />
                <div class="px-10 mx-10 mt-2 text-center text-gray-500">
                    Requests for this asset will appear here
                </div>
            </div>
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
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    const listStatus = [
        // {
        //     name: 'All',
        //     key: 'all',
        //     color: '#6D6DDA',
        // },
        {
            name: 'Pending',
            key: 'active',
            color: '#FFB119',
            icon: 'Clock',
            class: 'icon-warning',
        },
        {
            name: 'Approved',
            key: 'approved',
            color: '#6D6DDA',
            icon: 'Check',
            class: 'text-success check-icon',
        },
        {
            name: 'Rejected',
            key: 'rejected',
            color: '#DC5252',
            icon: 'CrossCircle',
        },
    ]

    export default defineComponent({
        name: 'RequestTab',
        components: { VirtualList, RequestItem, AtlanButton, PreviewTabsIcon },
        props: {
            selectedAsset: {
                type: Object,
                default: () => ({}),
            },
            tab: {
                type: Object,
                required: false,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const selectedFilter = ref(listStatus[0])
            const list = ref([])
            const resPagination = ref({
                filterRecord: 0,
            })
            const pagination = ref({
                limit: 40,
                offset: 0,
            })
            const filterStatus = ref({
                status: selectedFilter.value.key,
            })
            const { data, isLoading, mutate } = useRequest(
                selectedAsset.value.guid,
                pagination,
                selectedAsset.value.typeName,
                filterStatus
            )
            watch(selectedFilter, () => {
                list.value = []
                if (selectedFilter.value.key === 'all') {
                    filterStatus.value = {}
                } else {
                    filterStatus.value = {
                        status: selectedFilter.value.key,
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
                selectedFilter,
            }
        },
    })
</script>

<style lang="less">
    .check-icon {
        transform: scale(1.2) !important;
    }
    .container-scroll-request {
        max-height: 655px;
        padding: 12px;
    }
    .menu-status {
        width: 150px;
    }
    .filter-status {
        width: 90px;
        height: 32px !important;
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
