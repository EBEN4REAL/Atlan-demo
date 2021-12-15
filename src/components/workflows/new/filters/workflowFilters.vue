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
            <div
                v-if="totalAppliedFiltersCount"
                class="text-sm font-medium text-gray-500 rounded cursor-pointer  hover:text-gray-700"
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
                                <span class="text-xs uppercase text-gray">
                                    <img
                                        v-if="item.image"
                                        :src="item.image"
                                        class="float-left w-auto h-5 mr-2"
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
                                class="text-gray-500"
                            >
                                {{ getFiltersAppliedString(item.id) }}
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
    import { List as StatusList } from '~/constant/status'
    import { List as AssetCategoryList } from '~/constant/assetCategory'
    import { List } from './filters'
    import useFilterPayload from './useFilterPayload'
    import useFilterUtils from './useFilterUtils'

    export default defineComponent({
        name: 'DiscoveryFacets',
        components: {
            Status: defineAsyncComponent(
                () => import('@common/facets/status.vue')
            ),
            Connector: defineAsyncComponent(
                () => import('@common/facets/connector.vue')
            )
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
        emits: ['refresh', 'initialize'],
        setup(props, { emit }) {
            // console.log(props.initialFilters.facetsFilters, 'facetFilters')
            const activeKey: Ref<string[]> = ref([])
            const dirtyTimestamp = ref('dirty_')


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
                return [...List]
            })

            // Mapping of Data to child components
            const dataMap: Ref<{ [key: string]: any }> = ref({
                connector: props.initialFilters?.facetsFilters?.connector || {},
                assetCategory: props.initialFilters?.facetsFilters
                    ?.assetCategory || { checked: undefined },
                status: props.initialFilters?.facetsFilters?.status || {
                    checked: undefined,
                },
            })

            const { payload: filterMap } = useFilterPayload(dataMap)
            const { isFilterApplied, totalAppliedFiltersCount } =
                useFilterUtils(dataMap)

            const refresh = () => {
                emit('refresh', filterMap.value, dataMap.value)
            }

            const handleChange = () => {
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                console.log(dirtyTimestamp.value)
                refresh()
                // updateChangesInStore(value);
            }

            const setConnector = (payload: any) => {
                dataMap.value.connector = payload
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
                    case 'status': {
                        dataMap.value[filterId].checked = []
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
                dataMap.value.status.checked = []
            }

            emit('initialize', filterMap.value)

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
                setConnector,
            }
        },
    })
</script>

<style lang="less">
    .carrot-top {
        top: 1.33rem;
    }
</style>
