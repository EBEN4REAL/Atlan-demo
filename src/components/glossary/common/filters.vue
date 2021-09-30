<template>
    <!-- filters -->
    <div class="h-full mt-12">
        <div
            class="flex items-center justify-between px-4 py-2 mb-2 text-sm bg-gray-100 border-b border-gray-300 "
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
        <a-collapse
            v-model:activeKey="activeKey"
            expand-icon-position="right"
            :bordered="false"
            class="relative bg-transparent"
            :class="$style.filter"
            :accordion="true"
        >
            <template #expandIcon="{ isActive }">
                <div class="h-full">
                    <AtlanIcon
                        icon="ChevronDown"
                        class="mb-3 text-gray-500 transition-transform transform "
                        :class="isActive ? '-rotate-180' : 'rotate-0'"
                    />
                </div>
            </template>
            <a-collapse-panel
                class="relative group"
                v-for="item in filtersList"
                :key="item.id"
            >
                <template #header>
                    <div class="mr-10 select-none">
                        <div
                            class="flex justify-between align-middle  align-items"
                        >
                            <div class="flex flex-col flex-1">
                                <div class="tracking-wide">
                                    <span class="text-gray">
                                        {{ item.label }}</span
                                    >
                                </div>
                                <div
                                    class="text-gray-500"
                                    v-if="activeKey !== item.id"
                                >
                                    {{
                                        getFiltersAppliedString(
                                            item.id,
                                            dataMap
                                        )
                                    }}
                                </div>
                            </div>
                            <div
                                v-if="isFilterApplied(item.id)"
                                class="flex items-center text-xs text-gray-500  hover:text-primary"
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
                    :showPadding="false"
                    @change="handleChange"
                ></component>
            </a-collapse-panel>
        </a-collapse>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        defineAsyncComponent,
        computed,
        ref,
        watch,
        PropType,
        provide,
    } from 'vue'

    // static
    import { Category, Term } from '~/types/glossary/glossary.interface'
    import getFiltersAppliedString from '@/glossary/utils/getFiltersAppliedString'
    import useFilterPayload from '@/discovery/filters/useFilterPayload'
    import useFilterUtils from '@/discovery/filters/useFilterUtils'

    export default defineComponent({
        components: {
            Status: defineAsyncComponent(
                () => import('@common/facets/status.vue')
            ),
            Owners: defineAsyncComponent(
                () => import('@common/facets/owners.vue')
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
        emits: ['filterUpdated', 'initialize'],
        setup(props, context) {
            // data
            const activeKey = ref()
            const defaultDataMap = {
                owners: {
                    userValue: [],
                    groupValue: [],
                    noOwnerAssigned: false,
                },
                status: {
                    checked: [],
                },
            }
            const dataMap = ref({
                owners: {
                    userValue: props?.initialFilters.owners?.userValue || [],
                    groupValue: props?.initialFilters.owners?.groupValue || [],
                    noOwnerAssigned: false,
                },
                status: {
                    checked: props?.initialFilters?.status?.checked || [],
                },
            })
            const filtersList = [
                {
                    id: 'status',
                    label: 'Status',
                    component: 'status',
                    overallCondition: 'OR',
                    filters: [
                        {
                            attributeName: 'assetStatus',
                            condition: 'OR',
                            isMultiple: false,
                            operator: 'eq',
                        },
                    ],
                    isDeleted: false,
                    isDisabled: false,
                    exclude: false,
                },
                {
                    id: 'owners',
                    label: 'Owners',
                    component: 'owners',
                    overallCondition: 'OR',
                    filters: [
                        {
                            attributeName: 'ownerUsers',
                            condition: 'OR',
                            isMultiple: true,
                            operator: 'contains',
                        },
                        {
                            attributeName: 'ownerGroups',
                            condition: 'OR',
                            isMultiple: true,
                            operator: 'contains',
                        },
                    ],
                    isDeleted: false,
                    isDisabled: false,
                    exclude: false,
                },
            ]
            // methods
            // on a filter applied
            const { payload: filters } = useFilterPayload(dataMap)
            const handleChange = (value) => {
                context.emit('filterUpdated', filters.value)
                context.emit('initialize', dataMap.value)
            }
            const { isFilterApplied, totalAppliedFiltersCount } =
                useFilterUtils(dataMap)

            // on clear a particular filter
            const handleClear = (item) => {
                Object.keys(dataMap.value[item]).forEach((key) => {
                    dataMap.value[item][key] = defaultDataMap[item][key] // set back to default or empty state
                })
                context.emit('filterUpdated', filters.value)
                context.emit('initialize', dataMap.value)
            }
            const resetAllFilters = () => {
                dataMap.value.status.checked = []
                dataMap.value.owners.userValue = []
                dataMap.value.owners.groupValue = []
                dataMap.value.owners.noOwnerAssigned = false

                context.emit('filterUpdated', filters.value)
                context.emit('initialize', dataMap.value)
            }
            return {
                activeKey,
                handleChange,
                getFiltersAppliedString,
                handleClear,
                filtersList,
                dataMap,
                filters,
                isFilterApplied,
                totalAppliedFiltersCount,
                resetAllFilters,
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
            @apply pb-3 pt-0 !important;
            @apply border-none !important;
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
