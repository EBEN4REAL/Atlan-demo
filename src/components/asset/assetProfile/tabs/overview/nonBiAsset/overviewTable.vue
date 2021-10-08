<template>
    <div>
        <!-- Table -->
        <div class="flex justify-center w-full h-full overflow-x-auto rounded">
            <a-table
                :columns="tableColumns"
                :data-source="results"
                :pagination="false"
                :scroll="{ y: 300 }"
                :loading="isLoading"
                class="w-full overflow-x-auto"
                size="small"
            >
            </a-table>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, watch, ref, inject, computed } from 'vue'

    // API
    import { useAPI } from '~/api/useAPI'

    export default defineComponent({
        emits: ['preview'],
        setup() {
            /** DATA */
            const tableColumns = ref([])
            const results = ref([])

            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            /** METHODS */
            // getTableData
            const getTableData = () => {
                const {
                    connectionQualifiedName,
                    databaseName,
                    schemaName,
                    name,
                } = { ...assetData.value.attributes }

                const body = {
                    tableName: name,
                    defaultSchema: `${databaseName}.${schemaName}`,
                    dataSourceName: connectionQualifiedName,
                }

                return useAPI('PREVIEW_TABLE', 'POST', { body })
            }

            const { data, isLoading } = getTableData()

            /** WATCHERS */
            watch([data], () => {
                if (data.value) {
                    tableColumns.value.push({
                        width: 50,
                        fixed: 'left',
                        title: '#',
                        dataIndex: 'hash_index',
                        ellipsis: true,
                        align: 'center',
                    })
                    // convert data from API in Antd-table format
                    data.value.columns.forEach((col) => {
                        const obj = {
                            title: col.columnName,
                            dataIndex: col.label,
                            width: 150,
                            ellipsis: true,
                        }
                        tableColumns.value.push(obj)
                    })
                    data.value.results.forEach((val, index) => {
                        let obj = { hash_index: index + 1 }
                        data.value.columns.forEach((col, i) => {
                            obj[col.columnName] = val[i] || '---'
                        })
                        // add key to object
                        obj = { ...obj, key: index }
                        results.value.push(obj)
                    })
                }
            })

            return {
                tableColumns,
                results,
                isLoading,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.ant-table-thead tr th) {
        @apply font-normal text-gray-700 !important;
    }
    :global(.ant-table) {
        @apply border border-gray-light !important;
    }
    :global(.ant-table-tbody tr td) {
        @apply text-gray-500 !important;
    }
    :global(.ant-table-thead) {
        @apply bg-gray-100 !important;
    }
    :global(.ant-table-cell-fix-left) {
        @apply bg-gray-100 border-r border-gray-light !important;
    }
</style>
