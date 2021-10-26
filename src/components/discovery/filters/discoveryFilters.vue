<template>
    <div
        class="flex items-center justify-between px-4 py-3 text-sm bg-gray-100"
        v-if="totalAppliedFiltersCount"
    >
        <div class="font-medium text-gray-500">
            {{ totalAppliedFiltersCount }}
            {{ totalAppliedFiltersCount > 1 ? 'filters' : 'filter' }}
        </div>
        <div class="flex items-center">
            <div>
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
                class="mr-3 text-sm font-medium text-gray-500 rounded cursor-pointer  hover:text-gray-700"
                @click="resetAllFilters"
            >
                Reset
            </div>
            <div>
                <a-dropdown trigger="click" placement="bottomRight">
                    <div
                        class="text-gray-500 cursor-pointer hover:text-gray-700"
                    >
                        <AtlanIcon icon="KebabMenu" class="h-4 m-0" />
                    </div>

                    <template #overlay>
                        <a-menu mode="vertical">
                            <a-menu-item
                                key="moveToSaved"
                                @click="
                                    () => {
                                        resetAllFilters()
                                        setActiveTab('saved')
                                    }
                                "
                            >
                                <div
                                    class="flex items-center justify-between mb-2 "
                                >
                                    <div class="text-sm text-gray-700">
                                        View Saved Filters
                                    </div>
                                    <div class="text-sm text-gray-500">⌘ S</div>
                                </div>
                                <div class="text-xs text-gray-500">
                                    Loading saved filters will override applied
                                    filters.
                                </div>
                            </a-menu-item>
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </div>
    <div v-else class="flex items-center px-4 py-2 text-sm bg-white">
        <RaisedTabSmall
            v-model:active="activeTab"
            class="mr-auto"
            :data="tabConfig"
        />
    </div>
    <div v-if="activeTab === 'all'" class="h-full overflow-y-auto">
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
                    v-else
                    :is="item.component"
                    v-model:data="dataMap[item.id]"
                    :item="item"
                    @change="handleChange"
                ></component>
            </a-collapse-panel>
        </a-collapse>
    </div>
    <div
        v-if="activeTab === 'saved'"
        class="h-full overflow-y-auto bg-gray-100"
    >
        <SavedFilter
            :updateSavedFilters="updateSavedFilters"
            v-model:data="dataMap['saved']"
            @change="handleSavedFilterChange"
        />
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
    import RaisedTabSmall from '@/UI/raisedTabSmall.vue'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'
    import { List as StatusList } from '~/constant/status'
    import { List } from './filters'
    import useFilterUtils from './useFilterUtils'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import useFilterPayload from './useFilterPayload'

    export default defineComponent({
        name: 'DiscoveryFacets',
        components: {
            RaisedTabSmall,
            Status: defineAsyncComponent(
                () => import('@common/facets/status.vue')
            ),
            Connector: defineAsyncComponent(
                () => import('@common/facets/connector.vue')
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
                () => import('./savedFilters/modal/saveFilterModal.vue')
            ),
        },
        props: {
            filtersList: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            facets: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['refresh'],
        setup(props, { emit }) {
            const { bmFiltersList, bmDataList } = useBusinessMetadataHelper()
            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref('dirty_')
            const updateSavedFilters: Ref<boolean> = ref(false)

            const activeTab = ref('all')
            const tabConfig = [
                { key: 'all', label: 'Filters' },
                { key: 'saved', label: 'Saved Filters' },
            ]

            function setActiveTab(tabName: 'all' | 'saved') {
                activeTab.value = tabName
            }

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
                connector: props.facets?.connector || {},
                saved: props.facets?.saved || {
                    checked: undefined,
                },
                status: props.facets?.status || {
                    checked: undefined,
                },
                classifications: {
                    noClassificationsAssigned: false,
                    checked: props.facets?.classifications?.checked || [],
                    operator: props.facets?.classifications?.condition || 'OR',
                    addedBy: props.facets?.classifications?.addedBy || 'all',
                },
                owners: {
                    userValue: props.facets?.owners?.userValue || [],
                    groupValue: props.facets?.owners?.groupValue || [],
                    noOwnerAssigned:
                        props.facets?.owners?.noOwnerAssigned || false,
                },
                advanced: {
                    applied: props.facets?.advanced?.applied,
                },
                terms: {
                    checked: props.facets?.terms?.checked || [],
                    operator: props.facets?.terms?.operator || 'OR',
                },
            })

            const { payload: filterMap } = useFilterPayload(dataMap)

            const { isFilterApplied, totalAppliedFiltersCount } =
                useFilterUtils(dataMap)

            // ? watching for bmDataList to be computed
            watch(
                bmDataList,
                () => {
                    // ? add initial applied filters to dataMap
                    Object.keys(bmDataList.value).forEach((b) => {
                        dataMap.value[b] = {
                            applied: {
                                ...dataMap.value[b]?.applied,
                                ...props.facets?.[b]?.applied,
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
                console.log(dataMap.value)
                emit('refresh', dataMap.value)
            }
            const handleChange = () => {
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                console.log(dirtyTimestamp.value)
                refresh()
            }

            const handleSavedFilterChange = (payload) => {
                dataMap.value['saved'].checked = payload
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                refresh()
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
                    case 'term': {
                        dataMap.value[filterId].applied = {}
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
                        const facetFiltersData =
                            dataMap.value[filterId]?.checked?.map(
                                (clsf: string) =>
                                    useClassificationStore().getClasificationByName(
                                        clsf
                                    )?.displayName
                            ) ?? []
                        if (facetFiltersData.length || 0 > 3) {
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

            return {
                resetAllFilters,
                totalAppliedFiltersCount,
                getFiltersAppliedString,
                filterMap,
                activeKey,
                dataMap,
                handleChange,
                isFilterApplied,
                dirtyTimestamp,
                handleClear,
                dynamicList,
                bmFiltersList,
                bmDataList,
                activeTab,
                setActiveTab,
                setConnector,
                handleSavedFilterChange,
                handleSavedFilterAdded,
                updateSavedFilters,
                tabConfig,
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
