<template>
    <div class="flex justify-between items-center px-4 pl-5 py-3.5 text-xs">
        <div class="text-sm font-medium text-gray-500">
            {{ totalAppliedFiltersCount || 'No' }} filters applied
        </div>
        <div class="flex items-center text-gray-500">
            <div
                class="px-3 py-1 text-sm font-medium text-gray-500 rounded cursor-pointer  hover:font-bold"
                @click="resetAllFilters"
            >
                Reset
            </div>
            <a-button
                class="px-3 py-1 text-sm font-medium border-0 rounded  bg-primary-light text-primary"
                >Save</a-button
            >
        </div>
    </div>
    <a-collapse
        v-model:activeKey="activeKey"
        expandIconPosition="right"
        :bordered="false"
        class="relative bg-transparent"
        :class="$style.filter"
        :accordion="true"
    >
        <template #expandIcon="{ isActive }">
            <div class="">
                <AtlanIcon
                    icon="ChevronDown"
                    class="ml-1 transition-transform transform"
                    :class="isActive ? '-rotate-180' : 'rotate-0'"
                />
            </div>
        </template>
        <a-collapse-panel
            v-for="item in dynamicList"
            :key="item.id"
            :class="activeKey === item.id ? 'bg-gray-100' : ''"
            class="relative bg-transparent hover:bg-gray-100 group"
        >
            <template #header>
                <div :key="dirtyTimestamp" class="select-none">
                    <div class="flex justify-between">
                        <span class="font-bold">
                            <img
                                v-if="item.image"
                                :src="item.image"
                                class="float-left w-auto h-5 mr-2"
                            />
                            {{ item.label }}</span
                        >

                        <div
                            v-if="isFilter(item.id) && !activeKey"
                            class="absolute text-gray-500 opacity-0  carrot-top right-12 hover:font-bold group-hover:opacity-100"
                            @click.stop.prevent="handleClear(item.id)"
                        >
                            Clear
                        </div>

                        <div
                            v-if="isFilter(item.id) && activeKey"
                            class="absolute text-gray-500 opacity-0  top-3 right-12 hover:font-bold group-hover:opacity-100"
                            @click.stop.prevent="handleClear(item.id)"
                        >
                            Clear
                        </div>
                    </div>
                    <div
                        class="absolute text-gray-500"
                        v-if="activeKey !== item.id"
                    >
                        {{ getFiltersAppliedString(item.id) }}
                    </div>
                    <div
                        class="py-2.5"
                        v-if="isFilter(item.id) && activeKey !== item.id"
                    ></div>
                </div>
            </template>

            <component
                :is="item.component"
                :item="item"
                v-model:data="dataMap[item.id]"
                @change="handleChange"
            ></component>
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        ref,
        computed,
        Ref,
        watch,
    } from 'vue'
    import { List } from './filters'
    import { Components } from '~/api/atlas/client'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import { List as StatusList } from '~/constant/status'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'

    export default defineComponent({
        name: 'DiscoveryFacets',
        components: {
            Status: defineAsyncComponent(
                () => import('@common/facets/status.vue')
            ),
            Owners: defineAsyncComponent(
                () => import('@common/facets/owners.vue')
            ),
            Classifications: defineAsyncComponent(
                () => import('@common/facets/classifications.vue')
            ),
            Advanced: defineAsyncComponent(
                () => import('@common/facets/advanced/index.vue')
            ),
            businessMetadata: defineAsyncComponent(
                () => import('@common/facets/businessMetadata/index.vue')
            ),
        },
        props: {
            initialFilters: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['refresh'],
        setup(props, { emit }) {
            const classificationsStore = useClassificationStore()
            const { bmFiltersList, bmDataMap } = useBusinessMetadataHelper()
            // console.log(props.initialFilters.facetsFilters, 'facetFilters')
            const activeKey: Ref<string> = ref('')
            const initialFilterMap = {
                status: {
                    condition:
                        props.initialFilters.facetsFilters.status.condition,
                    criterion:
                        props.initialFilters.facetsFilters.status.criterion,
                },
                classifications: {
                    condition:
                        props.initialFilters.facetsFilters.classifications
                            .condition,
                    criterion:
                        props.initialFilters.facetsFilters.classifications
                            .criterion,
                },
                owners: {
                    condition:
                        props.initialFilters.facetsFilters.owners.condition,
                    criterion:
                        props.initialFilters.facetsFilters.owners.criterion,
                },
                advanced: {
                    condition:
                        props.initialFilters.facetsFilters.advanced.condition,
                    criterion:
                        props.initialFilters.facetsFilters.advanced.criterion,
                },
            }
            const filterMap: {
                [key: string]: Components.Schemas.FilterCriteria
            } = {
                ...initialFilterMap,
            }
            let filters: Components.Schemas.FilterCriteria[] = []

            const dirtyTimestamp = ref('dirty_')

            /**
             * @desc combines static List with mapped BM object that has filter support
             * */
            const dynamicList = computed(() => [
                ...List,
                ...bmFiltersList.value,
            ])

            // Mapping of Data to child components
            const dataMap: { [key: string]: any } = ref({})
            dataMap.value.status = {
                checked: props.initialFilters.facetsFilters.status.checked,
            }
            dataMap.value.classifications = {
                classifications: computed(
                    () => classificationsStore.classifications
                ),
                checked:
                    props.initialFilters.facetsFilters.classifications.checked,
            }
            dataMap.value.owners = {
                userValue:
                    props.initialFilters.facetsFilters?.owners?.userValue || [],
                groupValue:
                    props.initialFilters.facetsFilters?.owners?.groupValue ||
                    [],
            }
            dataMap.value.advanced = {
                list: props.initialFilters.facetsFilters.advanced.list,
            }

            // ? watching for bmDataMap to be computed
            watch(
                () => bmDataMap.value,
                () => {
                    dataMap.value = { ...dataMap.value, ...bmDataMap.value }
                },
                {
                    deep: true,
                    immediate: true,
                }
            )

            const refresh = () => {
                filters = []
                Object.keys(filterMap).forEach((key) => {
                    filters.push(filterMap[key])
                })
                emit('refresh', filters, filterMap)
            }

            const handleChange = (value: any) => {
                filterMap[value.id] = value.payload
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                console.log(dirtyTimestamp.value)
                setAppliedFiltersCount()
                refresh()
                // updateChangesInStore(value);
            }

            const isFilter = (id) => {
                if (filterMap[id]) {
                    if (filterMap[id]?.criterion?.length > 0) {
                        return true
                    }
                }
                return false
            }

            const totalAppliedFiltersCount = ref(0)
            function setAppliedFiltersCount() {
                let count = 0
                const filterMapKeys = Object.keys(filterMap)
                filterMapKeys.forEach((id) => {
                    if (filterMap[id]?.criterion?.length > 0) {
                        return (count += 1)
                    }
                })
                totalAppliedFiltersCount.value = count
            }

            const handleClear = (filterId: string) => {
                switch (filterId) {
                    case 'status': {
                        dataMap.value[filterId].checked = []
                        filterMap[filterId].criterion = []
                        break
                    }
                    case 'classifications': {
                        dataMap.value[filterId].checked = []
                        filterMap[filterId].criterion = []
                        break
                    }
                    case 'owners': {
                        dataMap.value[filterId].userValue = []
                        dataMap.value[filterId].groupValue = []
                        filterMap[filterId].criterion = []
                        break
                    }
                    case 'advanced': {
                        break
                    }
                    default: {
                        dataMap.value[filterId].applied = {}
                        filterMap[filterId].criterion = []
                    }
                }
                setAppliedFiltersCount()
                refresh()
            }
            function getFiltersAppliedString(filterId: string) {
                switch (filterId) {
                    case 'status': {
                        let filters = dataMap.value[filterId].checked
                        filters = filters.map((statusId: string) => {
                            return StatusList?.find(
                                (status: any) => status.id === statusId
                            ).label
                        })
                        if (filters.length > 3) {
                            return `${filters.slice(0, 3).join(', ')} +${
                                filters.length - 3
                            } others`
                        }

                        return filters.slice(0, 3).join(', ')
                    }
                    case 'classifications': {
                        const filters = dataMap.value[filterId].checked
                        if (filters.length > 3) {
                            return `${filters.slice(0, 3).join(', ')} +${
                                filters.length - 3
                            } others`
                        }

                        return filters.slice(0, 3).join(', ')
                    }
                    case 'owners': {
                        const users = dataMap.value[filterId].userValue
                        const groups = dataMap.value[filterId].groupValue
                        let appliedOwnersString = ''
                        if (users && users?.length > 0) {
                            if (users?.length == 1)
                                appliedOwnersString += `${users.length} user`
                            else appliedOwnersString += `${users.length} users`
                        }
                        if (groups && groups?.length > 0) {
                            if (appliedOwnersString.length > 0) {
                                if (groups.length == 1)
                                    appliedOwnersString += ` & ${groups.length} group`
                                else
                                    appliedOwnersString += ` & ${groups.length} groups`
                            } else {
                                if (groups.length == 1)
                                    appliedOwnersString += `${groups.length} group`
                                else
                                    appliedOwnersString += `${groups.length} groups`
                            }
                        }

                        return appliedOwnersString
                    }
                    case 'advanced': {
                        return ''
                    }
                    default: {
                        // ? default fall back to bm filter

                        const totalCount = Object.values(
                            dataMap.value[filterId].applied
                        ).filter((a) => JSON.stringify(a) !== '{}').length

                        return totalCount
                            ? `${
                                  Object.keys(dataMap.value[filterId].applied)
                                      .length
                              } condition(s) applied`
                            : ''
                    }
                }
            }

            function resetAllFilters() {
                dataMap.value.status.checked = []
                dataMap.value.classifications.checked = []
                dataMap.value.owners.userValue = []
                dataMap.value.owners.groupValue = []
                const filterMapKeys = Object.keys(filterMap)
                filterMapKeys.forEach((id) => {
                    filterMap[id].criterion = []
                })
                setAppliedFiltersCount()

                refresh()
            }
            setAppliedFiltersCount()

            return {
                resetAllFilters,
                totalAppliedFiltersCount,
                getFiltersAppliedString,
                activeKey,
                dataMap,
                handleChange,
                isFilter,
                dirtyTimestamp,
                filterMap,
                handleClear,
                dynamicList,
            }
        },
        data() {
            return {
                searchParam: {
                    entityFilters: {},
                } as Components.Schemas.SearchParameters,
                filterMap: {} as { [key: string]: any },
                filters: {} as Components.Schemas.FilterCriteria,
            }
        },
    })
</script>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-none;
        }

        :global(.ant-collapse-header) {
            @apply px-4 pl-5 !important;
            @apply py-3 !important;
            @apply border-t;
        }

        :global(.ant-collapse-item:last-child) {
            @apply border-solid;
            @apply border-gray-300;
            @apply border-b !important;
        }

        :global(.ant-collapse-content-box) {
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px !important;
            padding-bottom: 0px;
        }
    }
</style>
<style lang="less">
    .carrot-top {
        top: 1.33rem;
    }
</style>
