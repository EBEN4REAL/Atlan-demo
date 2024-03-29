<template>
    <div class="container">
        <div class="p-4 order_by">
            <div class="flex flex-col order_table_by">
                <div class="title">Order tables by</div>
                <div>
                    <a-select
                        placeholder="Sort by"
                        class="w-full"
                        v-model:value="
                            activeInlineTab.explorer.schema.sortOrderTable
                        "
                        :allowClear="false"
                        :showSearch="false"
                        @change="handleSortOrderChange"
                        :get-popup-container="(target) => target.parentNode"
                    >
                        <a-select-option
                            :value="item.id"
                            v-for="item in sortListTable"
                            :key="item.id"
                            class="py-1.5 px-3 text-gray-700 text-sm"
                        >
                            {{ item.label }}
                        </a-select-option>
                        <template #suffixIcon>
                            <AtlanIcon icon="CaretDown" class="-mt-0.5" />
                        </template>
                    </a-select>
                </div>
            </div>

            <div class="order_column_by mt-3.5">
                <div class="title">Order columns by</div>
                <div>
                    <a-select
                        placeholder="Sort by"
                        class="w-full"
                        v-model:value="
                            activeInlineTab.explorer.schema.sortOrderColumn
                        "
                        :allowClear="false"
                        :showSearch="false"
                        @change="handleSortOrderChange"
                        :get-popup-container="(target) => target.parentNode"
                    >
                        <a-select-option
                            :value="item.id"
                            v-for="item in sortListColumn"
                            :key="item.id"
                            class="py-1.5 px-3 text-gray-700 text-sm"
                        >
                            {{ item.label }}
                        </a-select-option>
                        <template #suffixIcon>
                            <AtlanIcon icon="CaretDown" class="-mt-0.5" />
                        </template>
                    </a-select>
                </div>
            </div>
        </div>
        <div class="filters">
            <AssetFilters
                :key="dirtyTimestamp"
                v-model="facets"
                v-model:activeKey="activeInlineTab.explorer.schema.activeKey"
                :filter-list="insightsFilters"
                :type-name="typeName"
                @change="handleFilterChange"
                @change-active-key="handleActiveKeyChange"
                @reset="handleResetEvent"
                :allow-custom-filters="false"
                noFilterTitle="Filter tables"
            ></AssetFilters>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        PropType,
        watch,
        toRefs,
        computed,
        inject,
        Ref,
        toRaw,
        ComputedRef,
    } from 'vue'

    import { insightsSorting } from './insightsSorting'
    import { insightsFilters } from './insightsFilters'
    import AssetFilters from '@/common/assets/filters/index.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: { AssetFilters },
        props: {},
        emits: ['change'],
        setup(props, { emit }) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const facets = ref(
                activeInlineTab.value.explorer.schema.facetsFilters
            )

            let sortListColumn = computed(() => {
                const arr = insightsSorting.filter((el) => {
                    if (el.includes) {
                        if (el.includes.includes('Column')) {
                            return true
                        }
                        return false
                    }
                    return true
                })
                return [...arr]
            })
            let sortListTable = computed(() => {
                const arr = insightsSorting.filter((el) => {
                    if (el.includes) {
                        if (el.includes.includes('Table')) {
                            return true
                        }
                        return false
                    }
                    return true
                })
                return [...arr]
            })
            // emit('change', 'sortOrderTable', sortOrderTable.value)
            // emit('change', 'sortOrderColumn', sortOrderColumn.value)

            const handleSortOrderChange = () => {
                emit(
                    'change',
                    'sortOrderTable',
                    activeInlineTab.value.explorer.schema.sortOrderTable
                )
                emit(
                    'change',
                    'sortOrderColumn',
                    activeInlineTab.value.explorer.schema.sortOrderColumn
                )
                // console.log('sortOrderTable: ', sortOrderTable.value)
                // console.log('sortOrderColumn: ', sortOrderColumn.value)
            }

            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const handleActiveKeyChange = () => {}

            const handleResetEvent = () => {
                facets.value = {}
                activeInlineTab.value.explorer.schema.facetsFilters = {}

                handleFilterChange()
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
            }

            const handleFilterChange = () => {
                // offset.value = 0
                // quickChange()
                emit('change', 'facets', facets.value)
                activeInlineTab.value.explorer.schema.facetsFilters =
                    facets.value
                // console.log('filters: ', facets.value)
            }

            let typeName = ref('Table')
            let typeList = [
                {
                    label: 'Table',
                    value: 'Table',
                },
                {
                    label: 'Column',
                    value: 'Column',
                },
            ]
            const handleTypeChange = (value) => {
                typeName.value = value
                handleResetEvent()
            }

            watch(activeInlineTabKey, (newActiveInlineTabKey) => {
                const _index = tabs.value.findIndex(
                    (tab) => tab.key === newActiveInlineTabKey
                )
                facets.value = tabs.value[_index].explorer.schema.facetsFilters

                handleFilterChange()
            })
            handleFilterChange()

            return {
                typeName,
                handleResetEvent,
                typeList,
                handleTypeChange,
                handleSortOrderChange,
                dirtyTimestamp,
                handleFilterChange,
                handleActiveKeyChange,
                insightsFilters,
                facets,
                sortListTable,
                sortListColumn,
                activeInlineTab,
            }
        },
    })
</script>
<style lang="less" scoped>
    .container {
        width: 240px;
        min-height: 440px;
        border-radius: 8px !important;
        background: #ffffff;

        box-shadow: 0px 9px 32px rgba(0, 0, 0, 0.12);
    }
    .order_by {
        border-bottom: 1px solid #e6e6eb;
    }
    .title {
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 20px;
        @apply text-gray-700;
    }
    .filters_title {
        color: rgba(144, 156, 167, 1);
        font-weight: 700;
    }
    .filters {
        overflow-y: scroll;
        height: 280px !important;
        border-radius: 8px !important;
    }
</style>

<!-- 
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route> -->
