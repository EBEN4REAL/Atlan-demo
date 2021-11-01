<template>
    <div>
        <div class="px-4 py-2.5 text-sm border-b bg-gray-10">
            <div
                class="flex items-center justify-between"
                v-if="totalFilteredCount > 0"
            >
                <span>
                    {{ totalFilteredCount }}
                    {{ totalFilteredCount > 1 ? 'filters' : 'filter' }}</span
                >
                <div class="flex font-medium text-gray-500">
                    <span class="text-gray-500" @click="handleResetAll">
                        <span class="text-sm cursor-pointer hover:text-primary"
                            >Clear All</span
                        >
                    </span>
                </div>
            </div>
            <div class="flex items-center justify-between" v-else>
                <span> Filters</span>
            </div>
        </div>
        <div class="h-full overflow-y-auto">
            <!-- <div class="px-3 pb-3 border-b">
                <Connector
                    v-model:connector="localfacets['connector']"
                    v-model:connection="localFacetMap['connection']"
                    @change="handleChange"
                ></Connector>
            </div> -->

            <a-collapse
                v-model:activeKey="activeKey"
                expand-icon-position="right"
                @change="handleActivePanelChange"
                :bordered="false"
                class="relative bg-transparent"
                :class="$style.filter"
                :accordion="isAccordion"
            >
                <a-collapse-panel
                    v-for="item in dynamicList"
                    :key="item.id"
                    class="relative group"
                    :show-arrow="false"
                    :class="isFiltered(item.id) ? 'bg-white text-primary' : ''"
                >
                    <template #header>
                        <div :key="dirtyTimestamp[item.id]" class="select-none">
                            <div class="flex flex-col flex-1">
                                <div
                                    class="flex items-center justify-between  hover:text-primary"
                                >
                                    <span
                                        class="text-xs uppercase  text-gray hover:text-primary title"
                                        style="letter-spacing: 0.07em"
                                    >
                                        <img
                                            v-if="item.image"
                                            :src="item.image"
                                            class="float-left w-auto h-4 mr-2"
                                        />

                                        {{ item.label }}</span
                                    >
                                    <span
                                        v-if="isFiltered(item.id)"
                                        class="ml-auto text-xs text-gray-500 opacity-0  hover:text-primary group-hover:opacity-100"
                                        @click.stop.prevent="
                                            handleClear(item.id)
                                        "
                                    >
                                        Clear
                                    </span>
                                    <AtlanIcon
                                        icon="ChevronDown"
                                        class="ml-3 text-gray-500 transition-transform duration-300 transform  hover:text-primary title"
                                        :class="
                                            activeKey.includes(item.id)
                                                ? '-rotate-180'
                                                : 'rotate-0'
                                        "
                                    />
                                </div>
                                <!-- <div
                                v-if="!activeKey.includes(item.id)"
                                class="text-primary"
                            >
                                {{ getFiltersAppliedString(item.id) }}
                            </div> -->
                            </div>
                            <div
                                v-if="
                                    isFiltered(item.id) &&
                                    !activeKey.includes(item.id)
                                "
                                class="flex items-center"
                            >
                                {{
                                    getConnectorImageMap[
                                        getConnectorImageMap[
                                            getFilterValue(item.id)
                                        ]
                                    ]
                                }}
                                <img
                                    :src="
                                        getConnectorImageMap[
                                            getFilterValue(
                                                item.id
                                            ).toLocaleLowerCase()
                                        ]
                                    "
                                    v-if="item.id === 'hierarchy'"
                                    class="w-auto h-4 mr-1"
                                />
                                <span class="text-primary">
                                    {{ getFilterValue(item.id) }}</span
                                >
                            </div>
                        </div>
                    </template>
                    <!-- 
                    <component
                        v-if="item.component === 'businessMetadata'"
                        :is="item.component"
                    ></component> -->

                    <component
                        :key="dirtyTimestamp[item.id]"
                        :is="item.component"
                        v-model="localFacetMap[item.id]"
                        @change="handleChange(item.id)"
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
        toRefs,
        watch,
    } from 'vue'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useTypedefData from '~/composables/typedefs/useTypedefData'

    import { discoveryFilters } from '~/constant/filters/discoveryFilters'
    import useDiscoveryStore from '~/store/discovery'
    import { capitalizeFirstLetter } from '~/utils/string'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
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
            Connection: defineAsyncComponent(
                () => import('@/common/facet/connection/index.vue')
            ),
            Classifications: defineAsyncComponent(
                () => import('@/common/facet/classification/index.vue')
            ),
            AtlanIcon,
        },
        props: {
            filtersList: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            isAccordion: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const discoveryStore = useDiscoveryStore()
            const { getConnectorImageMap } = useAssetInfo()

            const { modelValue } = useVModels(props, emit)

            const localFacetMap = ref(modelValue.value)

            // if (localFacetMap.value) {
            //     if (discoveryStore.activeFacet) {
            //         localFacetMap.value = discoveryStore.activeFacet
            //         modelValue.value = localFacetMap.value
            //         emit('change')
            //     }
            // }
            if (localFacetMap.value && discoveryStore.activeFacet) {
                localFacetMap.value = discoveryStore.activeFacet
                modelValue.value = localFacetMap.value
                emit('change')
            }

            const totalAppliedFiltersCount = ref(0)
            const activeKey: Ref<string[]> = ref([])

            const dirtyTimestamp = ref({})

            if (discoveryStore.activeFacetTab?.length > 0) {
                activeKey.value = discoveryStore.activeFacetTab
            } else {
                activeKey.value = ['hierarchy']
            }

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

            const isFiltered = (id) => {
                if (localFacetMap?.value) {
                    if (localFacetMap?.value[id]) {
                        if (localFacetMap?.value[id].constructor === Object) {
                            if (
                                Object.keys(localFacetMap?.value[id]).length ===
                                0
                            ) {
                                return false
                            }
                        }
                        if (localFacetMap?.value[id].constructor === Array) {
                            if (localFacetMap?.value[id].length === 0) {
                                return false
                            }
                        }
                    }
                }
                return localFacetMap.value[id]
            }

            const totalFilteredCount = computed(
                () => discoveryFilters.filter((i) => isFiltered(i.id)).length
            )

            const handleChange = (id) => {
                modelValue.value = localFacetMap.value
                emit('change')
                dirtyTimestamp.value[id] = `dirty_${Date.now().toString()}`
                totalAppliedFiltersCount.value = Object.keys(
                    localFacetMap.value
                ).length
                discoveryStore.setActiveFacet(localFacetMap.value)
            }

            const handleClear = (id: string) => {
                delete localFacetMap.value[id]
                handleChange(id)
            }

            const handleResetAll = () => {
                localFacetMap.value = {}
                modelValue.value = localFacetMap.value

                discoveryFilters.forEach((i) => {
                    dirtyTimestamp.value[
                        i.id
                    ] = `dirty_${Date.now().toString()}`
                })
                activeKey.value = []
                emit('change')
                totalAppliedFiltersCount.value = Object.keys(
                    localFacetMap.value
                ).length
                discoveryStore.setActiveFacet(localFacetMap.value)
            }

            // Function to build filter applied string for owner facet
            const getOwnerFilterAppliedString = (
                usersLength,
                groupsLength
            ): String => {
                let str = ''
                if (usersLength)
                    str += `${usersLength} ${
                        usersLength > 1 ? 'users' : 'user'
                    }`
                if (usersLength && groupsLength) str += ' & '
                if (groupsLength)
                    str += `${groupsLength} ${
                        groupsLength > 1 ? 'groups' : 'group'
                    }`
                return str
            }
            const getFilterValue = (id: string) => {
                if (id === 'hierarchy') {
                    if (localFacetMap.value[id].connectorName) {
                        return capitalizeFirstLetter(
                            localFacetMap.value[id].connectorName
                        )
                    }
                }
                if (id === '__traitNames' && localFacetMap.value[id]) {
                    const { classificationList } = useTypedefData()

                    const list = classificationList.value
                        .filter((i) => localFacetMap.value[id].includes(i.name))
                        .map((i) => i.displayName)

                    return list.length < 3
                        ? list.join(',')
                        : `${list?.length} applied`
                }

                if (id === 'certificateStatus' && localFacetMap.value[id]) {
                    return localFacetMap.value[id]?.length < 3
                        ? localFacetMap.value[id].join(',')
                        : `${localFacetMap.value[id]?.length} applied`
                }

                if (id === 'owners') {
                    let usersLength = 0
                    let groupsLength = 0

                    if (localFacetMap.value[id]?.ownerUsers) {
                        usersLength = localFacetMap.value[id]?.ownerUsers.length
                    }
                    if (localFacetMap.value[id]?.ownerGroups) {
                        groupsLength =
                            localFacetMap.value[id]?.ownerGroups.length
                    }

                    if (usersLength === 0 && groupsLength < 3) {
                        return localFacetMap.value[id]?.ownerGroups.join(', ')
                    }
                    if (usersLength < 3 && groupsLength === 0) {
                        return localFacetMap.value[id]?.ownerUsers.join(', ')
                    }

                    if (usersLength === 1 && groupsLength === 1) {
                        return localFacetMap.value[id]?.ownerUsers
                            .concat(localFacetMap.value[id]?.ownerGroups)
                            .join(', ')
                    }

                    return `${getOwnerFilterAppliedString(
                        usersLength,
                        groupsLength
                    )}`
                }
                return ''
            }

            const handleActivePanelChange = () => {
                discoveryStore.setActivePanel(activeKey.value)
            }

            return {
                activeKey,
                dirtyTimestamp,
                dynamicList,
                localFacetMap,
                handleChange,
                handleClear,
                isFiltered,

                getFilterValue,
                handleActivePanelChange,
                getConnectorImageMap,
                totalFilteredCount,
                handleResetAll,
            }
        },
    })
</script>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-item) {
            @apply border-b border-gray-200 !important;
        }

        :global(.ant-collapse-item-active) {
            @apply bg-white;

            :global(.title) {
                @apply text-primary !important;
            }
        }

        :global(.ant-collapse-header) {
            @apply px-4 !important;
            @apply py-3 !important;

            &:hover {
                @apply bg-white;
                /* some rules */
            }
        }

        :global(.ant-collapse-item:last-child) {
            @apply border-gray-300;
        }

        :global(.ant-collapse-content-box) {
            @apply pb-3;
            padding-right: 0px;
            padding-left: 0px;
            padding-top: 0px !important;
        }
    }
</style>
