<template>
    <div>
        <!-- Table -->
        <div class="relative h-96">
            <a-table
                :columns="tableColumns"
                :data-source="results"
                :pagination="false"
                :scroll="{ x: 'calc(700px + 50%)', y: 300 }"
                :loading="isLoading"
                class="absolute left-0 w-full"
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
    :global(.ant-table th) {
        @apply whitespace-nowrap font-bold !important;
    }
    :global(.ant-table) {
        @apply border border-gray-light !important;
    }
    :global(.ant-table td) {
        @apply max-w-xs !important;
    }
    :global(.ant-progress-status-success .ant-progress-bg) {
        background-color: #1890ff !important;
    }
</style>
