<template>
    <a-popover trigger="click" placement="leftTop">
        <template #content>
            <!-- filters -->
            <p class="mb-3 text-gray-500">FILTERS</p>
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
                                    v-if="
                                        filterMap[item.id] &&
                                        filterMap[item.id].criterion?.length > 0
                                    "
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
        </template>
        <a-button class="p-1 ml-2 rounded">
            <AtlanIcon icon="FilterDot" class="h-6" />
        </a-button>
    </a-popover>
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
            projectionOptions: {
                type: Object,
                required: true,
                default: () => {},
            },
        },
        emits: [
            'projectionChange',
            'filterUpdated',
            'sortChange',
            'includeDeletedAssetsChange',
        ],
        setup(props, { emit }) {
            // data
            const activeKey = ref()
            const filterMap = ref({})
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
                    userValue: [],
                    groupValue: [],
                    noOwnerAssigned: false,
                },
                status: {
                    checked: [],
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
            const handleChange = (value) => {
                filterMap.value[value.id] = value.payload
                const filters = [] // build a filter array to apply
                Object.keys(filterMap.value).forEach((key) => {
                    filters.push(filterMap.value[key])
                })
                emit('filterUpdated', filters)
            }

            // on clear a particular filter
            const handleClear = (item) => {
                Object.keys(dataMap.value[item]).forEach((key) => {
                    dataMap.value[item][key] = defaultDataMap[item][key] // set back to default or empty state
                })

                if (filterMap.value[item]) filterMap.value[item].criterion = [] // update filter to empty
                const filters = []
                Object.keys(filterMap.value).forEach((key) => {
                    filters.push(filterMap.value[key])
                })
                emit('filterUpdated', filters)
            }
            watch(includeDeletedAssets, () => {
                emit('includeDeletedAssetsChange', includeDeletedAssets.value)
            })
            return {
                activeKey,
                handleChange,
                getFiltersAppliedString,
                handleClear,
                filtersList,
                dataMap,
                filterMap,
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
            @apply px-0 !important;
            @apply pb-3 pt-0 !important;
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
