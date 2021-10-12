<template>
    <div class="px-4 pb-6 mt-1">
        <div class="flex items-center justify-between mb-3">
            <SearchAndFilter
                v-model:value="queryText"
                placeholder="Search"
                :autofocus="true"
                @change="handleSearch"
                size="minimal"
            >
            </SearchAndFilter>
            <!--  <a-button-group class="mb-2 text-xs rounded shadow">
                <a-button
                    :class="
                        activeTab === 'personal'
                            ? 'text-primary font-bold'
                            : 'text-gray-500'
                    "
                    @click="setActiveTab('personal')"
                >
                    Personal
                </a-button>

                <a-button
                    :class="
                        activeTab === 'all'
                            ? 'text-primary font-bold'
                            : 'text-gray-500'
                    "
                    @click="setActiveTab('all')"
                    >All</a-button
                >
            </a-button-group> -->
        </div>
        <div class="relative w-full">
            <template v-if="activeTab === 'personal'">
                <div class="w-full overflow-y-auto h-44">
                    <div
                        v-if="isLoading"
                        class="flex items-center justify-center mt-3"
                    >
                        <a-spin size="small" class="mr-2 leading-none"></a-spin
                        ><span>Fetching Saved Filters</span>
                    </div>
                    <div
                        v-else-if="list.length < 1 && !isLoading"
                        class="flex flex-col items-center justify-center h-full"
                    >
                        <div class="flex flex-col items-center">
                            <img
                                :src="emptyScreen"
                                alt="No logs"
                                class="w-2/5 m-auto mb-4"
                            />
                            <span class="text-gray-500"
                                >No Saved Filters Found</span
                            >
                        </div>
                    </div>

                    <div v-else class="flex flex-col w-full">
                        <!-- <a-radio-group
                            v-model:value="data.checked"
                            v-for="(filter, index) in filteredList"
                            :key="index"
                            @change="handleChange"
                        >
                            <a-radio :value="filter">{{ filter.name }}</a-radio>
                        </a-radio-group> -->

                        <div
                            v-for="(filter, index) in filteredList"
                            :key="index"
                        >
                            <a-popover placement="rightTop">
                                <template #content>
                                    <div></div>
                                </template>
                                <div
                                    class="flex items-center justify-between px-2 py-1 my-1 border rounded cursor-pointer hover:text-primary hover:bg-primary-light"
                                    :class="
                                        selected === filter.name
                                            ? '  border-primary bg-primary-light  text-primary'
                                            : '  border-transparent'
                                    "
                                    @click.stop="() => handleLoadFilter(filter)"
                                >
                                    <Tooltip :tooltip-text="filter.name" />
                                    <div>
                                        <a-tooltip placement="top">
                                            <template #title
                                                >Load filter</template
                                            >

                                            <AtlanIcon
                                                icon="Play"
                                                class="w-4 h-4 my-auto"
                                            ></AtlanIcon>
                                        </a-tooltip>
                                    </div></div
                            ></a-popover>
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
                            <img
                                :src="emptyScreen"
                                alt="No logs"
                                class="w-2/5 m-auto mb-4"
                            />
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
    import { defineComponent, PropType, ref, Ref, toRefs, computed } from 'vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import { Collapse } from '~/types'
    import whoami from '~/composables/user/whoami'
    import emptyScreen from '~/assets/images/empty_search.png'
    import { getSavedFilters } from './useSavedFilters'

    export default defineComponent({
        name: 'SavedFilter',
        components: {
            SearchAndFilter,
            Tooltip,
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
        },
        emits: ['change'],
        setup(props, { emit }) {
            const { data } = toRefs(props)
            const activeTab: Ref<'personal' | 'all'> = ref('personal')
            const queryText = ref('')
            const selected = ref('')

            // own info
            const { username: myUsername } = whoami()

            const { data: list, isLoading } = getSavedFilters()

            const filteredList = computed(() =>
                list.value.filter(
                    (item) =>
                        item.name
                            .toLowerCase()
                            .includes(queryText.value.toLowerCase()) || []
                )
            )

            const handleSearch = (e: { target: { value: string } }) => {
                queryText.value = e.target.value
            }

            const handleLoadFilter = (item) => {
                emit('change', item)
                selected.value = item.name
            }

            function setActiveTab(tabName: 'personal' | 'all') {
                activeTab.value = tabName
            }

            return {
                emptyScreen,
                queryText,
                myUsername,
                handleSearch,
                activeTab,
                setActiveTab,
                isLoading,
                filteredList,
                handleLoadFilter,
                list,
                selected,
            }
        },
    })
</script>
