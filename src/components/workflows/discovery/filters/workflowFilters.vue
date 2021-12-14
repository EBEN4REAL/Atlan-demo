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
                class="text-sm font-medium text-gray-500 rounded cursor-pointer hover:text-gray-700"
                @click="resetAllFilters"
            >
                Reset
            </div>
        </div>
    </div>
    <div class="h-full overflow-y-auto bg-gray-100">
        <a-collapse
            v-model:activeKey="activeKey"
            expand-icon-position="right"
            :bordered="false"
            class="relative bg-transparent"
        >
            <a-collapse-panel
                v-for="item in filtersList"
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
                                    class="ml-auto text-xs text-gray-500 opacity-0 hover:text-primary group-hover:opacity-100"
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
                    :is="item.component"
                    v-model:data="dataMap[item.id]"
                    :class="item.id === 'owners' ? 'px-4' : ''"
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
    import { List as WorkflowCategoryList } from '~/constant/workflowCategory'
    import { WorkflowTypeList } from '~/constant/workflowTypes'

    import useFilterPayload from './useFilterPayload'
    import useFilterUtils from './useFilterUtils'

    export default defineComponent({
        name: 'SetupFacets',
        components: {
            WorkflowCategory: defineAsyncComponent(
                () => import('./workflowCategory.vue')
            ),
            WorkflowType: defineAsyncComponent(
                () => import('./workflowType.vue')
            ),
            CreatedBy: defineAsyncComponent(() => import('./createdBy.vue')),
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
                default: () => ({}),
            },
        },
        emits: ['refresh', 'initialize'],
        setup(props, { emit }) {
            const activeKey: Ref<string[]> = ref(["owners"])
            const dirtyTimestamp = ref('dirty_')

            // Mapping of Data to child components
            const dataMap: Ref<{ [key: string]: any }> = ref({
                workflowCategory: props.initialFilters?.facetsFilters
                    ?.workflowCategory || { checked: undefined },
                workflowType: props.initialFilters?.facetsFilters
                    ?.workflowType || { checked: undefined },
                owners: {
                    userValue:
                        props.initialFilters?.facetsFilters?.owners
                            ?.userValue || [],
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
                refresh()
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
                    case 'workflowCategory': {
                        dataMap.value[filterId].checked = []
                        break
                    }
                    case 'workflowType': {
                        dataMap.value[filterId].checked = []
                        break
                    }
                    case 'owners': {
                        dataMap.value[filterId].userValue = []
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
                    case 'workflowCategory': {
                        let facetFiltersData =
                            dataMap.value[filterId]?.checked || []
                        facetFiltersData = facetFiltersData?.map(
                            (workflowCategoryId: string) =>
                                WorkflowCategoryList?.find(
                                    (workflowCategory: any) =>
                                        workflowCategory.id ===
                                        workflowCategoryId
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
                    case 'workflowType': {
                        let facetFiltersData =
                            dataMap.value[filterId]?.checked || []
                        facetFiltersData = facetFiltersData?.map(
                            (workflowTypeId: string) =>
                                WorkflowTypeList?.find(
                                    (workflowType: any) =>
                                        workflowType.id === workflowTypeId
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
                    case 'owners': {
                        const users = dataMap.value[filterId]?.userValue || []
                        let appliedOwnersString = ''
                        if (users && users?.length > 0) {
                            if (users?.length === 1)
                                appliedOwnersString += `${users.length} user`
                            else appliedOwnersString += `${users.length} users`
                        }
                        return appliedOwnersString
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
                dataMap.value.workflowCategory.checked = []
                dataMap.value.workflowType.checked = []
                dataMap.value.owners.userValue = []
                // ? remove bm applied data
                refresh()
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
            }
        },
    })
</script>

<style lang="less">
    .carrot-top {
        top: 1.33rem;
    }
</style>
