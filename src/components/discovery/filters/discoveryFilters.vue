<template>
    <div
        class="flex items-center justify-between px-4 py-2 text-sm bg-gray-100 border-b border-gray-300 "
    >
        <div class="font-medium text-gray-500">
            {{ totalAppliedFiltersCount || 'No' }}
            {{ totalAppliedFiltersCount > 1 ? 'filters' : 'filter' }}
            applied
        </div>
        <div class="flex items-center">
            <div v-if="totalAppliedFiltersCount">
                <SaveFilterModal
                    :applied-filters="filterMap"
                    @savedFilterAdded="handleSavedFilterAdded"
                >
                    <template #trigger>
                        <div
                            class="mr-3 text-sm font-medium rounded cursor-pointer  text-primary hover:text-primary-focus"
                        >
                            Save
                        </div>
                    </template>
                </SaveFilterModal>
            </div>
            <div
                v-if="totalAppliedFiltersCount"
                class="text-sm font-medium text-gray-500 rounded cursor-pointer  hover:text-gray-700"
                @click="resetAllFilters"
            >
                Reset
            </div>
        </div>
    </div>
    <div class="h-full overflow-y-auto bg-gray-100">
        <Connector
            class="px-4 py-3"
            :data="dataMap.connector"
            @change="handleChange"
            @update:data="setConnector"
        ></Connector>
        <a-collapse
            v-model:activeKey="activeKey"
            expand-icon-position="right"
            :bordered="false"
            class="relative bg-transparent"
            :class="$style.filter"
        >
            <a-collapse-panel
                v-for="item in dynamicList"
                :key="item.id"
                class="relative group"
                :show-arrow="false"
            >
                <template #header>
                    <div :key="dirtyTimestamp" class="select-none">
                        <div class="flex flex-col flex-1">
                            <div class="flex items-center">
                                <span
                                    class="text-xs uppercase text-gray"
                                    style="letter-spacing: 0.07em"
                                >
                                    <img
                                        v-if="item.image"
                                        :src="item.image"
                                        class="float-left w-auto h-4 mr-2"
                                    />
                                    {{ item.label }}</span
                                >
                                <AtlanIcon
                                    icon="ChevronDown"
                                    class="ml-3 text-gray-500 transition-transform duration-300 transform "
                                    :class="
                                        activeKey.includes(item.id)
                                            ? '-rotate-180'
                                            : 'rotate-0'
                                    "
                                />
                                <span
                                    v-if="isFilterApplied(item.id)"
                                    class="ml-auto text-xs text-gray-500 opacity-0  hover:text-primary group-hover:opacity-100"
                                    @click.stop.prevent="handleClear(item.id)"
                                >
                                    Clear
                                </span>
                            </div>
                            <div
                                v-if="!activeKey.includes(item.id)"
                                class="text-primary"
                            >
                                {{ getFiltersAppliedString(item.id) }}
                            </div>
                        </div>
                    </div>
                </template>

                <component
                    v-if="item.component === 'businessMetadata'"
                    is="businessMetadata"
                    v-model:data="dataMap[item.id]"
                    :item="item"
                    :list="bmDataList[item.id]"
                    @change="handleChange"
                ></component>
                <component
                    v-else-if="item.component === 'governance'"
                    is="governance"
                    v-model:data="dataMap[item.id]"
                    :item="item"
                    :list="bmDataList[item.id]"
                    @change="handleTermChange"
                ></component>
                <component
                    is="savedFilter"
                    v-else-if="item.component === 'savedFilter'"
                    :updateSavedFilters="updateSavedFilters"
                    v-model:data="dataMap[item.id]"
                    :item="item"
                    @change="handleSavedFilterChange"
                ></component>
                <component
                    v-else
                    :is="item.component"
                    v-model:data="dataMap[item.id]"
                    :item="item"
                    @change="handleChange"
                ></component>
            </a-collapse-panel>
        </a-collapse>
    </div>
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
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'
    import { List as StatusList } from '~/constant/status'
    import { List as AssetCategoryList } from '~/constant/assetCategory'
    import { List } from './filters'
    import useFilterPayload from './useFilterPayload'
    import useFilterUtils from './useFilterUtils'
    import { useClassificationStore } from '~/components/admin/classifications/_store'

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
            Governance: defineAsyncComponent(
                () => import('@common/facets/governance.vue')
            ),
            Advanced: defineAsyncComponent(
                () => import('@common/facets/advanced/index.vue')
            ),
            businessMetadata: defineAsyncComponent(
                () => import('@common/facets/businessMetadata/index.vue')
            ),
            SavedFilter: defineAsyncComponent(
                () => import('./savedFilters/viewSavedFilters.vue')
            ),
            SaveFilterModal: defineAsyncComponent(
                () => import('./savedFilters/saveFilterModal.vue')
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
            filtersList: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['refresh', 'initialize', 'termNameChange'],
        setup(props, { emit }) {
            const { bmFiltersList, bmDataList } = useBusinessMetadataHelper()
            // console.log(props.initialFilters.facetsFilters, 'facetFilters')
            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref('dirty_')
            const updateSavedFilters: Ref<boolean> = ref(false)

            /**
             * @desc combines static List with mapped BM object that has filter support
             * */
            const dynamicList = computed(() => {
                if (props.filtersList?.length > 0) {
                    const arr = List.filter((el) =>
                        props.filtersList?.includes(el.id)
                    )
                    return [...arr]
                }
                return [...List, ...bmFiltersList.value]
            })
            // Mapping of Data to child components
            const dataMap: Ref<{ [key: string]: any }> = ref({
                connector: props.initialFilters?.facetsFilters?.connector || {},
                saved: props.initialFilters?.facetsFilters?.saved || {
                    checked: undefined,
                },
                assetCategory: props.initialFilters?.facetsFilters
                    ?.assetCategory || { checked: undefined },
                status: props.initialFilters?.facetsFilters?.status || {
                    checked: undefined,
                },
                classifications: {
                    noClassificationsAssigned: false,
                    checked:
                        props.initialFilters?.facetsFilters?.classifications
                            ?.checked,
                    operator:
                        props.initialFilters?.facetsFilters?.classifications
                            ?.condition || 'OR',
                    addedBy:
                        props.initialFilters?.facetsFilters?.classifications
                            ?.addedBy || 'all',
                },
                owners: {
                    userValue:
                        props.initialFilters?.facetsFilters?.owners
                            ?.userValue || [],
                    groupValue:
                        props.initialFilters?.facetsFilters?.owners
                            ?.groupValue || [],
                    noOwnerAssigned:
                        props.initialFilters?.facetsFilters?.owners
                            ?.noOwnerAssigned || false,
                },
                advanced: {
                    applied:
                        props.initialFilters?.facetsFilters?.advanced?.applied,
                },
            })

            const { payload: filterMap } = useFilterPayload(dataMap)
            const { isFilterApplied, totalAppliedFiltersCount } =
                useFilterUtils(dataMap)

            // function setAppliedFiltersCount() {
            //     let count = 0
            //     const filterMapKeys = Object.keys(filterMap.value)
            //     filterMapKeys?.forEach((id) => {
            //         if (filterMap[id]?.criterion?.length > 0) {
            //             return (count += 1)
            //         }
            //     })
            //     totalAppliedFiltersCount.value = count
            // }

            // ? watching for bmDataList to be computed
            watch(
                bmDataList,
                () => {
                    // ? add initial applied filters to dataMap
                    Object.keys(bmDataList.value).forEach((b) => {
                        dataMap.value[b] = {
                            applied: {
                                ...dataMap.value[b]?.applied,
                                ...props.initialFilters?.facetsFilters?.[b]
                                    ?.applied,
                            },
                        }
                    })
                },
                {
                    deep: true,
                    immediate: true,
                }
            )

            const refresh = () => {
                emit('refresh', filterMap.value, dataMap.value)
            }
            const handleChange = () => {
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                console.log(dirtyTimestamp.value)
                refresh()
                // updateChangesInStore(value);
            }

            const handleSavedFilterChange = (payload) => {
                dataMap.value['saved'].checked = payload
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                refresh()
            }

            const handleTermChange = (termName: string) => {
                emit('termNameChange', termName)
            }

            const setConnector = (payload: any) => {
                dataMap.value.connector = payload
            }
            const handleSavedFilterAdded = () => {
                updateSavedFilters.value = true
            }

            const handleClear = (filterId: string) => {
                switch (filterId) {
                    case 'connector': {
                        dataMap.value[filterId] = {
                            attributeName: undefined,
                            attributeValue: undefined,
                        }
                        break
                    }
                    case 'saved': {
                        dataMap.value[filterId].checked = []
                        break
                    }
                    case 'assetCategory': {
                        dataMap.value[filterId].checked = []
                        break
                    }
                    case 'status': {
                        dataMap.value[filterId].checked = []
                        break
                    }
                    case 'classifications': {
                        dataMap.value[filterId].checked = []
                        dataMap.value[filterId].noClassificationsAssigned =
                            false
                        dataMap.value[filterId].operator = 'OR'
                        dataMap.value[filterId].addedBy = 'all'
                        break
                    }
                    case 'owners': {
                        dataMap.value[filterId].userValue = []
                        dataMap.value[filterId].groupValue = []
                        dataMap.value[filterId].noOwnerAssigned = false
                        break
                    }
                    case 'advanced': {
                        dataMap.value[filterId].applied = {}
                        break
                    }
                    default: {
                        dataMap.value[filterId].applied = {}
                    }
                }
                refresh()
            }
            function getFiltersAppliedString(filterId: string) {
                switch (filterId) {
                    case 'assetCategory': {
                        let facetFiltersData =
                            dataMap.value[filterId]?.checked || []
                        facetFiltersData = facetFiltersData?.map(
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
                    case 'saved': {
                        let facetFiltersData =
                            dataMap.value[filterId]?.checked || []
                        facetFiltersData = facetFiltersData?.name

                        return facetFiltersData
                    }
                    case 'status': {
                        let facetFiltersData =
                            dataMap.value[filterId]?.checked || []
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
                        const facetFiltersData = dataMap.value[
                            filterId
                        ]?.checked?.map(
                            (clsf: string) =>
                                useClassificationStore().getClasificationByName(
                                    clsf
                                )?.displayName
                        )
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
                        const users = dataMap.value[filterId]?.userValue || []
                        const groups = dataMap.value[filterId]?.groupValue || []
                        const noOwnerAssigned =
                            dataMap.value[filterId]?.noOwnerAssigned || false
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
                            dataMap.value[filterId]?.applied || {}
                        ).length

                        return totalCount
                            ? `${totalCount} condition(s) applied`
                            : ''
                    }
                    default: {
                        // ? default fall back to bm filter
                        const totalCount = Object.values(
                            dataMap.value[filterId]?.applied || {}
                        ).length

                        return totalCount
                            ? `${totalCount} condition(s) applied`
                            : ''
                    }
                }
            }

            function resetAllFilters() {
                dataMap.value.connector = {
                    attributeName: undefined,
                    attributeValue: undefined,
                }
                dataMap.value.saved.checked = []

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
                refresh()
            }

            emit('initialize', dataMap.value)

            console.log(dynamicList, 'list')
            return {
                resetAllFilters,
                totalAppliedFiltersCount,
                getFiltersAppliedString,
                activeKey,
                dataMap,
                handleChange,
                isFilterApplied,
                dirtyTimestamp,
                filterMap,
                handleClear,
                dynamicList,
                bmFiltersList,
                bmDataList,
                setConnector,
                handleTermChange,
                handleSavedFilterChange,
                handleSavedFilterAdded,
                updateSavedFilters,
            }
        },
    })
</script>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-none !important;
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
