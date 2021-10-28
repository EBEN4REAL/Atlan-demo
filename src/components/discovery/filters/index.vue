<template>
    <div>
        <div
            class="flex items-center justify-between px-4 py-3 mb-3 text-sm bg-gray-100 "
        >
            <div class="font-medium text-gray-500">
                {{ totalAppliedFiltersCount }}
                {{ totalAppliedFiltersCount > 1 ? 'filters' : 'filter' }}
            </div>
        </div>
        <div class="h-full overflow-y-auto">
            <div class="px-3 mb-3">
                <Connector
                    v-model:connector="localFacetMap['connector']"
                    v-model:connection="localFacetMap['connection']"
                    @change="handleChange"
                ></Connector>
            </div>

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
                                    <!-- <span
                                    v-if="isFilterApplied(item.id)"
                                    class="ml-auto text-xs text-gray-500 opacity-0 hover:text-primary group-hover:opacity-100"
                                    @click.stop.prevent="handleClear(item.id)"
                                >
                                    Clear
                                </span> -->
                                </div>
                                <!-- <div
                                v-if="!activeKey.includes(item.id)"
                                class="text-primary"
                            >
                                {{ getFiltersAppliedString(item.id) }}
                            </div> -->
                            </div>
                        </div>
                    </template>

                    <component
                        v-if="item.component === 'businessMetadata'"
                        :is="item.component"
                    ></component>

                    <component
                        v-else
                        :is="item.component"
                        v-model:facetMap="localFacetMap[item.id]"
                        @change="handleChange"
                    ></component>
                </a-collapse-panel>
            </a-collapse>
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import {
        computed,
        defineAsyncComponent,
        defineComponent,
        ref,
        Ref,
        watch,
    } from 'vue'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'

    import { discoveryFilters } from '~/constant/filters/discoveryFilters'
    // import RaisedTabSmall from '@/UI/raisedTabSmall.vue'
    // import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'
    // import { List as StatusList } from '~/constant/status'
    // import { List } from './filters'
    // import useFilterUtils from './useFilterUtils'
    // import { useClassificationStore } from '~/components/admin/classifications/_store'
    // import useFilterPayload from './useFilterPayload'

    export default defineComponent({
        name: 'DiscoveryFacets',
        components: {
            // RaisedTabSmall,
            Certificate: defineAsyncComponent(
                () => import('@common/facet/certificate/index.vue')
            ),
            Connector: defineAsyncComponent(
                () => import('@common/treeselect/connector/index.vue')
            ),
            Owners: defineAsyncComponent(
                () => import('@common/facet/owners/index.vue')
            ),
            // Owners: defineAsyncComponent(
            //     () => import('@common/facets/owners.vue')
            // ),
            // Classifications: defineAsyncComponent(
            //     () => import('@common/facets/classifications.vue')
            // ),
            // Governance: defineAsyncComponent(
            //     () => import('@common/facets/governance.vue')
            // ),
            // Advanced: defineAsyncComponent(
            //     () => import('@common/facets/advanced/index.vue')
            // ),
            // businessMetadata: defineAsyncComponent(
            //     () => import('@common/facets/businessMetadata/index.vue')
            // ),
            // SavedFilter: defineAsyncComponent(
            //     () => import('./savedFilters/viewSavedFilters.vue')
            // ),
            // SaveFilterModal: defineAsyncComponent(
            //     () => import('./savedFilters/modal/saveFilterModal.vue')
            // ),
        },
        props: {
            filtersList: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            facetMap: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['change', 'update:facetMap'],
        setup(props, { emit }) {
            const { facetMap } = useVModels(props, emit)

            const localFacetMap = ref(facetMap.value)

            const totalAppliedFiltersCount = ref(0)
            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref('dirty_')

            const { list: cmList } = useCustomMetadataFacet()

            const dynamicList = computed(() => {
                if (props.filtersList?.length > 0) {
                    const arr = discoveryFilters.filter((el) =>
                        props.filtersList?.includes(el.id)
                    )
                    return [...arr]
                }
                return [...discoveryFilters, ...cmList.value]
            })

            const dataMap = ref({})

            // // Mapping of Data to child components
            // const dataMap: Ref<{ [key: string]: any }> = ref({
            //     connector: props.facets?.connector || {},
            //     saved: props.facets?.saved || {
            //         checked: undefined,
            //     },
            //     status: props.facets?.status || {
            //         checked: undefined,
            //     },
            //     classifications: {
            //         noClassificationsAssigned: false,
            //         checked: props.facets?.classifications?.checked || [],
            //         operator: props.facets?.classifications?.condition || 'OR',
            //         addedBy: props.facets?.classifications?.addedBy || 'all',
            //     },
            //     owners: {
            //         userValue: props.facets?.owners?.userValue || [],
            //         groupValue: props.facets?.owners?.groupValue || [],
            //         noOwnerAssigned:
            //             props.facets?.owners?.noOwnerAssigned || false,
            //     },
            //     advanced: {
            //         applied: props.facets?.advanced?.applied,
            //     },
            //     terms: {
            //         checked: props.facets?.terms?.checked || [],
            //         operator: props.facets?.terms?.operator || 'OR',
            //     },
            // })
            // const { payload: filterMap } = useFilterPayload(dataMap)
            // const { isFilterApplied, totalAppliedFiltersCount } =
            //     useFilterUtils(dataMap)
            // // ? watching for bmDataList to be computed
            // watch(
            //     bmDataList,
            //     () => {
            //         // ? add initial applied filters to dataMap
            //         Object.keys(bmDataList.value).forEach((b) => {
            //             dataMap.value[b] = {
            //                 applied: {
            //                     ...dataMap.value[b]?.applied,
            //                     ...props.facets?.[b]?.applied,
            //                 },
            //             }
            //         })
            //     },
            //     {
            //         deep: true,
            //         immediate: true,
            //     }
            // )
            // const refresh = () => {
            //     console.log(dataMap.value)
            //     emit('refresh', dataMap.value)
            // }
            const handleChange = () => {
                console.log(localFacetMap.value)
                facetMap.value = localFacetMap.value
                emit('change')

                // dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                // console.log(dirtyTimestamp.value)
                // refresh()
            }
            // const handleSavedFilterChange = (payload) => {
            //     dataMap.value['saved'].checked = payload
            //     dirtyTimestamp.value = `dirty_${Date.now().toString()}`
            //     refresh()
            // }
            // const setConnector = (payload: any) => {
            //     dataMap.value.connector = payload
            // }
            // const handleSavedFilterAdded = () => {
            //     updateSavedFilters.value = true
            // }
            // const handleClear = (filterId: string) => {
            //     switch (filterId) {
            //         case 'connector': {
            //             dataMap.value[filterId] = {
            //                 attributeName: undefined,
            //                 attributeValue: undefined,
            //             }
            //             break
            //         }
            //         case 'saved': {
            //             dataMap.value[filterId].checked = []
            //             break
            //         }
            //         case 'status': {
            //             dataMap.value[filterId].checked = []
            //             break
            //         }
            //         case 'classifications': {
            //             dataMap.value[filterId].checked = []
            //             dataMap.value[filterId].noClassificationsAssigned =
            //                 false
            //             dataMap.value[filterId].operator = 'OR'
            //             dataMap.value[filterId].addedBy = 'all'
            //             break
            //         }
            //         case 'term': {
            //             dataMap.value[filterId].applied = {}
            //             break
            //         }
            //         case 'owners': {
            //             dataMap.value[filterId].userValue = []
            //             dataMap.value[filterId].groupValue = []
            //             dataMap.value[filterId].noOwnerAssigned = false
            //             break
            //         }
            //         case 'advanced': {
            //             dataMap.value[filterId].applied = {}
            //             break
            //         }
            //         default: {
            //             dataMap.value[filterId].applied = {}
            //         }
            //     }
            //     refresh()
            // }
            // function getFiltersAppliedString(filterId: string) {
            //     switch (filterId) {
            //         case 'saved': {
            //             let facetFiltersData =
            //                 dataMap.value[filterId]?.checked || []
            //             facetFiltersData = facetFiltersData?.name
            //             return facetFiltersData
            //         }
            //         case 'status': {
            //             let facetFiltersData =
            //                 dataMap.value[filterId]?.checked || []
            //             facetFiltersData = facetFiltersData.map(
            //                 (statusId: string) =>
            //                     StatusList?.find(
            //                         (status: any) => status.id === statusId
            //                     ).label
            //             )
            //             if (facetFiltersData.length > 3) {
            //                 return `${facetFiltersData
            //                     .slice(0, 3)
            //                     .join(', ')} +${
            //                     facetFiltersData.length - 3
            //                 } others`
            //             }
            //             return facetFiltersData.slice(0, 3).join(', ')
            //         }
            //         case 'classifications': {
            //             const facetFiltersData =
            //                 dataMap.value[filterId]?.checked?.map(
            //                     (clsf: string) =>
            //                         useClassificationStore().getClasificationByName(
            //                             clsf
            //                         )?.displayName
            //                 ) ?? []
            //             if (facetFiltersData.length || 0 > 3) {
            //                 return `${facetFiltersData
            //                     .slice(0, 3)
            //                     .join(', ')} +${
            //                     facetFiltersData.length - 3
            //                 } others`
            //             }
            //             let noClassificationsAssigned = dataMap.value[filterId]
            //                 .noClassificationsAssigned
            //                 ? 'No Classifications'
            //                 : ''
            //             return (
            //                 noClassificationsAssigned +
            //                 facetFiltersData.slice(0, 3).join(', ')
            //             )
            //         }
            //         case 'owners': {
            //             const users = dataMap.value[filterId]?.userValue || []
            //             const groups = dataMap.value[filterId]?.groupValue || []
            //             const noOwnerAssigned =
            //                 dataMap.value[filterId]?.noOwnerAssigned || false
            //             let appliedOwnersString = ''
            //             if (users && users?.length > 0) {
            //                 if (users?.length === 1)
            //                     appliedOwnersString += `${users.length} user`
            //                 else appliedOwnersString += `${users.length} users`
            //             }
            //             if (groups && groups?.length > 0) {
            //                 if (appliedOwnersString.length > 0) {
            //                     if (groups.length === 1)
            //                         appliedOwnersString += ` & ${groups.length} group`
            //                     else
            //                         appliedOwnersString += ` & ${groups.length} groups`
            //                 } else if (groups.length === 1)
            //                     appliedOwnersString += `${groups.length} group`
            //                 else
            //                     appliedOwnersString += `${groups.length} groups`
            //             }
            //             if (noOwnerAssigned) appliedOwnersString += 'No Owners'
            //             return appliedOwnersString
            //         }
            //         case 'advanced': {
            //             // ? default fall back to bm filter
            //             const totalCount = Object.values(
            //                 dataMap.value[filterId]?.applied || {}
            //             ).length
            //             return totalCount
            //                 ? `${totalCount} condition(s) applied`
            //                 : ''
            //         }
            //         default: {
            //             // ? default fall back to bm filter
            //             const totalCount = Object.values(
            //                 dataMap.value[filterId]?.applied || {}
            //             ).length
            //             return totalCount
            //                 ? `${totalCount} condition(s) applied`
            //                 : ''
            //         }
            //     }
            // }
            // function resetAllFilters() {
            //     dataMap.value.connector = {
            //         attributeName: undefined,
            //         attributeValue: undefined,
            //     }
            //     dataMap.value.saved.checked = []
            //     dataMap.value.status.checked = []
            //     dataMap.value.classifications.checked = []
            //     dataMap.value.classifications.noClassificationsAssigned = false
            //     dataMap.value.owners.userValue = []
            //     dataMap.value.owners.groupValue = []
            //     dataMap.value.owners.noOwnerAssigned = false
            //     dataMap.value.advanced.applied = {}
            //     // ? remove bm applied data
            //     bmFiltersList.value
            //         .map((b) => b.id)
            //         .forEach((n) => {
            //             dataMap.value[n].applied = {}
            //         })
            //     refresh()
            // }
            // return {
            //     resetAllFilters,
            //     totalAppliedFiltersCount,
            //     getFiltersAppliedString,
            //     filterMap,
            //     activeKey,
            //     dataMap,
            //     handleChange,
            //     isFilterApplied,
            //     dirtyTimestamp,
            //     handleClear,
            //     dynamicList,
            //     bmFiltersList,
            //     bmDataList,
            //     activeTab,
            //     setActiveTab,
            //     setConnector,
            //     handleSavedFilterChange,
            //     handleSavedFilterAdded,
            //     updateSavedFilters,
            //     tabConfig,
            // }

            return {
                totalAppliedFiltersCount,
                activeKey,
                dirtyTimestamp,
                dynamicList,
                facetMap,
                localFacetMap,
                handleChange,
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
