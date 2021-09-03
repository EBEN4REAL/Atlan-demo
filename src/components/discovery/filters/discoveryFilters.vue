<template>
    <div
        class="flex items-center justify-between px-4 py-1 text-sm bg-gray-100 border-b border-gray-200 "
    >
        <div class="font-medium text-gray-500">
            {{ totalAppliedFiltersCount || 'No' }}
            {{ totalAppliedFiltersCount > 1 ? 'filters' : 'filter' }}
            applied
        </div>
        <div class="flex items-center text-gray-500">
            <div
                class="py-1 text-sm font-medium text-gray-500 rounded cursor-pointer  hover:font-bold"
                @click="resetAllFilters"
            >
                Reset
            </div>
            <!-- <a-button
                class="px-3 py-1 text-sm font-medium border-0 rounded bg-primary-light text-primary"
                >Save</a-button
            > -->
        </div>
    </div>
    <a-collapse
        v-model:activeKey="activeKey"
        expand-icon-position="right"
        :bordered="false"
        class="relative bg-transparent"
        :class="$style.filter"
        :accordion="true"
    >
        <template #expandIcon="{ isActive }">
            <div class="">
                <AtlanIcon
                    icon="ChevronDown"
                    class="ml-1 text-gray-500 transition-transform transform"
                    :class="isActive ? '-rotate-180' : 'rotate-0'"
                />
            </div>
        </template>
        <a-collapse-panel
            v-for="item in dynamicList"
            :key="item.id"
            :class="activeKey === item.id ? 'bg-gray-100' : ''"
            class="relative group"
        >
            <template #header>
                <div :key="dirtyTimestamp" class="mr-8 select-none">
                    <div class="flex items-center justify-between align-middle">
                        <div class="flex flex-col flex-1">
                            <div class="tracking-wide">
                                <span class="text-gray">
                                    <img
                                        v-if="item.image"
                                        :src="item.image"
                                        class="float-left w-auto h-5 mr-2"
                                    />
                                    {{ item.label }}</span
                                >
                            </div>
                            <div
                                v-if="activeKey !== item.id"
                                class="text-gray-500"
                            >
                                {{ getFiltersAppliedString(item.id) }}
                            </div>
                        </div>

                        <div
                            v-if="isFilter(item.id)"
                            class="text-xs text-gray-500 opacity-0  hover:text-primary group-hover:opacity-100"
                            @click.stop.prevent="handleClear(item.id)"
                        >
                            Clear
                        </div>
                    </div>
                </div>
            </template>

            <component
                :is="item.component"
                v-model:data="dataMap[item.id]"
                :item="item"
                @change="handleChange"
            ></component>
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import {
        computed,
        defineAsyncComponent,
        defineComponent,
        ref,
        Ref,
        watch,
    } from 'vue'
    import { Components } from '~/api/atlas/client'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'
    import { List as StatusList } from '~/constant/status'
    import { List as AssetCategoryList } from '~/constant/assetCategory'
    import { List } from './filters'
    import { AssetTypeList } from '~/constant/assetType'

    export default defineComponent({
        name: 'DiscoveryFacets',
        components: {
            Status: defineAsyncComponent(
                () => import('@common/facets/status.vue')
            ),
            Connector: defineAsyncComponent(
                () => import('@common/facets/connector.vue')
            ),
            AssetCategory: defineAsyncComponent(
                () => import('@common/facets/assetCategory.vue')
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
        emits: ['refresh', 'modifyTabs'],
        setup(props, { emit }) {
            const classificationsStore = useClassificationStore()
            const { bmFiltersList, bmDataMap } = useBusinessMetadataHelper()
            // console.log(props.initialFilters.facetsFilters, 'facetFilters')
            const activeKey: Ref<string> = ref('')
            const initialFilterMap = {
                connector: {
                    condition:
                        props.initialFilters.facetsFilters.connector.condition,
                    criterion:
                        props.initialFilters.facetsFilters.connector.criterion,
                },
                assetCategory: {
                    condition:
                        props.initialFilters.facetsFilters.assetCategory
                            .condition,
                    criterion:
                        props.initialFilters.facetsFilters.assetCategory
                            .criterion,
                },
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

            // ? add business metadata filters to filter map on load
            watch(
                () => bmFiltersList.value,
                () => {
                    bmFiltersList.value.forEach((bm) => {
                        if (props.initialFilters.facetsFilters[bm.id]) {
                            filterMap[bm.id] = {
                                condition: 'or',
                                criterion:
                                    props.initialFilters.facetsFilters[bm.id]
                                        .criterion,
                            }
                        }
                    })
                },
                {
                    deep: true,
                    immediate: true,
                }
            )

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
            dataMap.value.connector = {
                connectorsPayload:
                    props.initialFilters.facetsFilters.connector.checked,
                checked: props.initialFilters.facetsFilters.connector.checked,
            }
            dataMap.value.assetCategory = {
                checked:
                    props.initialFilters.facetsFilters.assetCategory.checked,
            }
            dataMap.value.status = {
                checked: props.initialFilters.facetsFilters.status.checked,
            }
            dataMap.value.classifications = {
                classifications: computed(
                    () => classificationsStore.classifications
                ),
                noClassificationsAssigned: false,
                checked:
                    props.initialFilters.facetsFilters.classifications.checked,
            }
            dataMap.value.owners = {
                userValue:
                    props.initialFilters.facetsFilters?.owners?.userValue || [],
                groupValue:
                    props.initialFilters.facetsFilters?.owners?.groupValue ||
                    [],
                noOwnerAssigned: false,
            }
            dataMap.value.advanced = {
                applied: props.initialFilters.facetsFilters.advanced.applied,
            }

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

            // ? watching for bmDataMap to be computed
            watch(
                () => bmDataMap.value,
                () => {
                    dataMap.value = {
                        ...dataMap.value,
                        ...bmDataMap.value,
                    }
                    // ? add initial applied filters to dataMap
                    Object.keys(bmDataMap.value).forEach((b) => {
                        if (props.initialFilters.facetsFilters[b]?.applied)
                            dataMap.value[b].applied = {
                                ...dataMap.value[b].applied,
                                ...props.initialFilters.facetsFilters[b]
                                    .applied,
                            }
                    })
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
            const modifyTabs = (tabsIds) => {
                emit('modifyTabs', tabsIds)
            }

            const handleChange = (value: any, tabsIds: string[]) => {
                filterMap[value.id] = value.payload
                if (value?.selectedIds)
                    filterMap[value.id] = {
                        ...filterMap[value.id],
                        selectedIds: value?.selectedIds,
                    }
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                console.log(dirtyTimestamp.value)
                setAppliedFiltersCount()
                refresh()
                modifyTabs(tabsIds)
                // updateChangesInStore(value);
            }

            const isFilter = (id: string) => {
                if (filterMap[id] && filterMap[id]?.criterion?.length > 0) {
                    return true
                }
                return false
            }

            const totalAppliedFiltersCount = ref(0)

            const resetTabs = () => {
                const tabsIds = AssetTypeList.filter(
                    (item) => item.isDiscoverable == true
                ).map((item) => {
                    return item.id
                })
                return tabsIds
            }

            const handleClear = (filterId: string) => {
                switch (filterId) {
                    case 'connector': {
                        dataMap.value[filterId].connectorsPayload = {
                            connection: undefined,
                            connector: undefined,
                        }
                        dataMap.value[filterId].checked = {
                            connection: undefined,
                            connector: undefined,
                        }
                        filterMap[filterId].criterion = []
                        emit('modifyTabs', resetTabs())
                        break
                    }
                    case 'assetCategory': {
                        dataMap.value[filterId].checked = []
                        filterMap[filterId].criterion = []
                        filterMap[filterId].selectedIds = []
                        emit('modifyTabs', resetTabs())
                        break
                    }
                    case 'status': {
                        dataMap.value[filterId].checked = []
                        filterMap[filterId].criterion = []
                        break
                    }
                    case 'classifications': {
                        dataMap.value[filterId].checked = []
                        dataMap.value[filterId].noClassificationsAssigned =
                            false
                        filterMap[filterId].criterion = []
                        break
                    }
                    case 'owners': {
                        dataMap.value[filterId].userValue = []
                        dataMap.value[filterId].groupValue = []
                        dataMap.value[filterId].noOwnerAssigned = false
                        filterMap[filterId].criterion = []
                        break
                    }
                    case 'advanced': {
                        dataMap.value[filterId].applied = {}
                        filterMap[filterId].criterion = []
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
                    case 'connector': {
                        let facetFiltersData =
                            dataMap.value[filterId].connectorsPayload
                        let str = ''
                        console.log(facetFiltersData, 'applied')
                        if (facetFiltersData?.connector) {
                            str += facetFiltersData?.connector
                        }
                        return str
                    }
                    case 'assetCategory': {
                        let facetFiltersData = dataMap.value[filterId].checked
                        facetFiltersData = facetFiltersData.map(
                            (assetCategoryId: string) =>
                                AssetCategoryList?.find(
                                    (assetCategory: any) =>
                                        assetCategory.id === assetCategoryId
                                ).label
                        )
                        if (facetFiltersData.length > 2) {
                            return `${facetFiltersData
                                .slice(0, 2)
                                .join(', ')} +${
                                facetFiltersData.length - 2
                            } others`
                        }

                        return facetFiltersData.slice(0, 2).join(', ')
                    }
                    case 'status': {
                        let facetFiltersData = dataMap.value[filterId].checked
                        facetFiltersData = facetFiltersData.map(
                            (statusId: string) =>
                                StatusList?.find(
                                    (status: any) => status.id === statusId
                                ).label
                        )
                        if (facetFiltersData.length > 3) {
                            return `${facetFiltersData
                                .slice(0, 3)
                                .join(', ')} +${
                                facetFiltersData.length - 3
                            } others`
                        }

                        return facetFiltersData.slice(0, 3).join(', ')
                    }
                    case 'classifications': {
                        const facetFiltersData = dataMap.value[filterId].checked
                        if (facetFiltersData.length > 3) {
                            return `${facetFiltersData
                                .slice(0, 3)
                                .join(', ')} +${
                                facetFiltersData.length - 3
                            } others`
                        }
                        let noClassificationsAssigned = dataMap.value[filterId]
                            .noClassificationsAssigned
                            ? 'No Classifications'
                            : ''

                        return (
                            noClassificationsAssigned +
                            facetFiltersData.slice(0, 3).join(', ')
                        )
                    }
                    case 'owners': {
                        const users = dataMap.value[filterId].userValue
                        const groups = dataMap.value[filterId].groupValue
                        const noOwnerAssigned =
                            dataMap.value[filterId].noOwnerAssigned
                        let appliedOwnersString = ''
                        if (users && users?.length > 0) {
                            if (users?.length === 1)
                                appliedOwnersString += `${users.length} user`
                            else appliedOwnersString += `${users.length} users`
                        }
                        if (groups && groups?.length > 0) {
                            if (appliedOwnersString.length > 0) {
                                if (groups.length === 1)
                                    appliedOwnersString += ` & ${groups.length} group`
                                else
                                    appliedOwnersString += ` & ${groups.length} groups`
                            } else if (groups.length === 1)
                                appliedOwnersString += `${groups.length} group`
                            else
                                appliedOwnersString += `${groups.length} groups`
                        }
                        if (noOwnerAssigned) appliedOwnersString += 'No Owners'

                        return appliedOwnersString
                    }
                    case 'advanced': {
                        // ? default fall back to bm filter
                        const totalCount = Object.values(
                            dataMap.value[filterId]?.applied
                        ).length

                        return totalCount
                            ? `${totalCount} condition(s) applied`
                            : ''
                    }
                    default: {
                        // ? default fall back to bm filter
                        const totalCount = Object.values(
                            dataMap.value[filterId]?.applied
                        ).length

                        return totalCount
                            ? `${totalCount} condition(s) applied`
                            : ''
                    }
                }
            }

            function resetAllFilters() {
                dataMap.value.connector.connectorsPayload = []
                dataMap.value.connector.connectorsPayload = {
                    connection: undefined,
                    connector: undefined,
                }
                dataMap.value.connector.checked = {
                    connection: undefined,
                    connector: undefined,
                }
                dataMap.value.assetCategory.checked = []
                dataMap.value.status.checked = []
                dataMap.value.classifications.checked = []
                dataMap.value.classifications.noClassificationsAssigned = false
                dataMap.value.owners.userValue = []
                dataMap.value.owners.groupValue = []
                dataMap.value.owners.noOwnerAssigned = false
                dataMap.value.advanced.applied = {}

                // ? remove bm applied data
                bmFiltersList.value
                    .map((b) => b.id)
                    .forEach((n) => {
                        dataMap.value[n].applied = {}
                    })

                const filterMapKeys = Object.keys(filterMap)
                filterMapKeys.forEach((id) => {
                    filterMap[id].criterion = []
                    if (filterMap[id]?.selectedIds)
                        filterMap[id].selectedIds = []
                })
                // reset tabs
                emit('modifyTabs', resetTabs())
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
                bmFiltersList,
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
            @apply px-4 !important;
            @apply py-3 !important;
            @apply border-none;
        }

        :global(.ant-collapse-item:last-child) {
            @apply border-gray-300;
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
