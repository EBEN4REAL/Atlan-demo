<template>
    <div>
        <div class="flex items-center justify-between p-4">
            <SearchAndFilter
                v-model:value="queryText"
                placeholder="Search saved"
                :autofocus="true"
                @change="handleSearch"
                size="minimal"
            >
                <template #tabSelector> </template>
            </SearchAndFilter>

            <a-button
                class="
                    px-1.5
                    text-xs
                    bg-transparent
                    border-t-0 border-l-0 border-r-0 border-gray-300
                    rounded-none
                    mt-1
                "
                :class="
                    activeTab === 'personal'
                        ? 'text-gray-700 font-bold border-b-2 border-primary'
                        : 'text-gray-500 border-b'
                "
                @click="setActiveTab('personal')"
            >
                Personal
            </a-button>

            <a-button
                class="
                    px-1.5
                    text-xs
                    bg-transparent
                    border-t-0 border-l-0 border-r-0 border-gray-300
                    rounded-none
                    mt-1
                "
                :class="
                    activeTab === 'all'
                        ? 'text-gray-700 font-bold border-b-2 border-primary'
                        : 'text-gray-500 border-b'
                "
                @click="setActiveTab('all')"
                >All</a-button
            >
        </div>
        <div class="w-full">
            <template v-if="activeTab === 'personal'">
                <div class="w-full px-4 overflow-y-auto">
                    <div
                        v-if="isLoading"
                        class="flex items-center justify-center mt-3"
                    >
                        <a-spin size="small" class="mr-2 leading-none"></a-spin
                        ><span>Fetching Saved Filters</span>
                    </div>
                    <div
                        v-else-if="savedList.length < 1 && !isLoading"
                        class="flex flex-col items-center justify-center h-full"
                    >
                        <div class="flex flex-col items-center">
                            <AtlanIcon
                                icon="EmptySavedFilter"
                                class="w-auto mb-4"
                                style="height: 115px"
                            ></AtlanIcon>
                            <span class="text-gray-500"
                                >No Saved Filters Found</span
                            >
                        </div>
                    </div>

                    <div v-else class="flex flex-col w-full">
                        <div v-for="(filter, index) in savedList" :key="index">
                            <a-popover placement="rightTop">
                                <template #content>
                                    <div class="popover-container">
                                        <div
                                            class="flex items-center justify-between mb-2 "
                                        >
                                            <div
                                                class="text-base font-bold text-gray-700 "
                                            >
                                                {{ filter.name }}
                                            </div>

                                            <a-button
                                                type="primary"
                                                @click.stop="
                                                    () =>
                                                        handleLoadFilter(filter)
                                                "
                                            >
                                                Load filter
                                                <AtlanIcon
                                                    icon="ArrowRight"
                                                    class="ml-1"
                                                ></AtlanIcon>
                                            </a-button>
                                        </div>
                                        <div class="flex items-end w-full">
                                            <div class="">
                                                <div class="mb-1 text-gray-500">
                                                    Created by
                                                </div>

                                                <Pill :label="filter.ownerName"
                                                    ><template #prefix>
                                                        <avatar
                                                            class="-ml-2.5"
                                                            :image-url="
                                                                KeyMaps.auth.avatar.GET_AVATAR(
                                                                    {
                                                                        username:
                                                                            filter.ownerName,
                                                                    }
                                                                )
                                                            "
                                                            :allow-upload="
                                                                false
                                                            "
                                                            :avatar-name="
                                                                filter.ownerName
                                                            "
                                                            avatar-size="small"
                                                            :avatar-shape="'circle'" /></template
                                                ></Pill>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <div
                                    class="p-2 my-1 text-gray-700 border rounded cursor-pointer  hover:bg-gray-200"
                                    :class="
                                        selected === filter.name
                                            ? '  border-primary bg-primary-light  text-primary'
                                            : '  border-transparent'
                                    "
                                    @click.stop="() => handleLoadFilter(filter)"
                                >
                                    <div
                                        class="flex items-center justify-between "
                                    >
                                        <Tooltip :tooltip-text="filter.name" />
                                        <div>
                                            <a-tooltip placement="top">
                                                <template #title
                                                    >Load filter</template
                                                >
                                                <AtlanIcon
                                                    icon="ArrowRight"
                                                    class="w-4 h-4 my-auto text-gray-500 "
                                                ></AtlanIcon>
                                            </a-tooltip>
                                        </div>
                                    </div>
                                    <div>
                                        <div
                                            class="flex items-center cursor-pointer "
                                        >
                                            <avatar
                                                class="mr-1.5"
                                                :image-url="
                                                    KeyMaps.auth.avatar.GET_AVATAR(
                                                        {
                                                            username:
                                                                filter.ownerName,
                                                        }
                                                    )
                                                "
                                                :allow-upload="false"
                                                :avatar-name="filter.ownerName"
                                                avatar-size="small"
                                                :avatar-shape="'circle'"
                                            />
                                            <span class="text-xs">{{
                                                filter.ownerName
                                            }}</span>
                                        </div>
                                    </div>
                                </div></a-popover
                            >
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="overflow-y-auto h-44">
                    <div
                        class="flex flex-col items-center justify-center h-full"
                    >
                        <div class="flex flex-col items-center">
                            <AtlanIcon
                                icon="EmptySavedFilter"
                                class="w-auto mb-4"
                                style="height: 115px"
                            ></AtlanIcon>
                            <span class="text-gray-500"
                                >No Saved Filters Found</span
                            >
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, Ref, watch, toRefs } from 'vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import { Collapse } from '~/types'
    import whoami from '~/composables/user/whoami'
    import emptyScreen from '~/assets/images/empty_search.png'
    import { getSavedFilters, useSavedFiltersSearch } from './useSavedFilters'
    import { KeyMaps } from '~/api/keyMap'
    import Avatar from '~/components/common/avatar.vue'
    import OwnerInfoCard from '~/components/discovery/preview/hovercards/ownerInfo.vue'
    import Pill from '~/components/UI/pill/pill.vue'

    export default defineComponent({
        name: 'SavedFilter',
        components: {
            SearchAndFilter,
            Tooltip,
            OwnerInfoCard,
            Pill,
            Avatar,
        },
        props: {
            item: {
                type: Object as PropType<Collapse>,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
            updateSavedFilters: {
                type: Boolean,
                required: true,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const activeTab: Ref<'personal' | 'all'> = ref('personal')
            const queryText = ref('')
            const selected = ref('')
            const savedList = ref<any>([])
            const { updateSavedFilters } = toRefs(props)
            // own info
            const { username: myUsername } = whoami()

            const { data: list, isLoading, refresh } = getSavedFilters()

            const getFilteredList = () => {
                const { filteredList } = useSavedFiltersSearch(
                    list.value,
                    queryText.value
                )
                savedList.value = filteredList.value
            }

            const handleSearch = () => {
                getFilteredList()
            }

            const handleLoadFilter = (item) => {
                emit('change', item)
                selected.value = item.name
            }

            function setActiveTab(tabName: 'personal' | 'all') {
                activeTab.value = tabName
            }

            /** WATCHERS */
            watch(list, () => {
                getFilteredList()
            })
            watch(updateSavedFilters, () => {
                refresh()
            })

            return {
                emptyScreen,
                queryText,
                myUsername,
                handleSearch,
                activeTab,
                setActiveTab,
                isLoading,
                savedList,
                handleLoadFilter,
                list,
                selected,
                KeyMaps,
            }
        },
    })
</script>

<style lang="less" scoped>
    .popover-container {
        min-width: 440px !important;
    }
</style>
