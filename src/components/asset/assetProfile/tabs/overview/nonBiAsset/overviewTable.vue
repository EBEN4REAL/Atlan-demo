<template>
    <div>
        <!-- Table -->
        <div
            class="overflow-scroll border-t border-gray-light"
            style="max-width: calc(100vw - 28rem); max-height: 20rem"
        >
            <a-table
                :columns="tableColumns"
                :data-source="results"
                :pagination="false"
                :scroll="{ x: true }"
                :loading="results.length === 0"
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
            const { data, error } = getTableData()

            /** WATCHERS */
            watch([data, error], () => {
                if (data.value && error.value === undefined) {
                    console.log('data.value:', data.value)
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
                        let obj = {}
                        data.value.columns.forEach((col, i) => {
                            obj[col.columnName] = val[i]
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
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.ant-table th) {
        @apply whitespace-nowrap font-bold !important;
    }
    :global(.ant-table td) {
        @apply max-w-xs !important;
    }
    :global(.ant-progress-status-success .ant-progress-bg) {
        background-color: #1890ff !important;
    }
</style>
