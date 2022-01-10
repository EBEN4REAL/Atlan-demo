<template>
    <div class="container">
        <div class="pb-8 filters">
            <AssetFilters
                :key="dirtyTimestamp"
                v-model="facets"
                v-model:activeKey="activeKey"
                :filter-list="insightsFilters"
                :type-name="typeName"
                @change="handleFilterChange"
                @change-active-key="handleActiveKeyChange"
                @reset="handleResetEvent"
                :allow-custom-filters="false"
                noFilterTitle="Filter queries"
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

    import { insightsFilters } from './insightsFilters'
    import AssetFilters from '@/common/assets/filters/index.vue'

    export default defineComponent({
        components: { AssetFilters },
        props: {},
        emits: ['change'],
        setup(props, { emit }) {
            const facets = ref({})

            // let sortListColumn = computed(() => {
            //     const arr = insightsSorting.filter((el) => {
            //         if (el.includes) {
            //             if (el.includes.includes('Column')) {
            //                 return true
            //             }
            //             return false
            //         }
            //         return true
            //     })
            //     return [...arr]
            // })
            // let sortListTable = computed(() => {
            //     const arr = insightsSorting.filter((el) => {
            //         if (el.includes) {
            //             if (el.includes.includes('Table')) {
            //                 return true
            //             }
            //             return false
            //         }
            //         return true
            //     })
            //     return [...arr]
            // })
            // const sortOrderTable = ref('name.keyword-asc')
            // const sortOrderColumn = ref('order-asc')
            // emit('change', 'sortOrderTable', sortOrderTable.value)
            // emit('change', 'sortOrderColumn', sortOrderColumn.value)

            // const handleSortOrderChange = () => {
            //     emit('change', 'sortOrderTable', sortOrderTable.value)
            //     emit('change', 'sortOrderColumn', sortOrderColumn.value)
            //     // console.log('sortOrderTable: ', sortOrderTable.value)
            //     // console.log('sortOrderColumn: ', sortOrderColumn.value)
            // }

            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const activeKey: Ref<string[]> = ref([])
            const handleActiveKeyChange = () => {}

            const handleResetEvent = () => {
                facets.value = {}

                handleFilterChange()
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
            }

            const handleFilterChange = () => {
                // offset.value = 0
                // quickChange()
                emit('change', 'facets', facets.value)
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

            return {
                typeName,
                handleResetEvent,
                typeList,
                handleTypeChange,
                // sortOrderColumn,
                // sortOrderTable,
                // handleSortOrderChange,
                dirtyTimestamp,
                activeKey,
                handleFilterChange,
                handleActiveKeyChange,
                insightsFilters,
                facets,
                // sortListTable,
                // sortListColumn,
            }
        },
    })
</script>
<style lang="less" scoped>
    .container {
        width: 240px;
        max-height: 440px;
        border-radius: 8px;
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
        border-radius: 8px !important;
        max-height: 447px !important;
    }
</style>

<!-- 
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route> -->
