<template>
    <div class="sampleData">
        <!-- Table -->
        <!-- <div class="flex justify-center w-full h-full overflow-x-auto rounded">
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
            <a-table
                :data-source="results"
                :loading="isLoading"
                :pagination="false"
                :scroll="{ y: 300 }"
                class="w-full overflow-x-auto"
                size="small"
            >
                <a-table-column
                    v-for="col in tableColumns"
                    :key="col.dataIndex"
                    :data-index="col.dataIndex"
                    :style="{ width: col.width }"
                >
                    <template #title>
                        
                        <div class="flex">
                            <component
                                :is="images[col.columnType]"
                                class="w-4 h-4 mr-3"
                            ></component>
                            <span class="truncate">{{ col.columnTitle }}</span>
                        </div>
                    </template>

                    <template #customRender="{ text }">
                        {{ text }}
                    </template>
                </a-table-column>
            </a-table>
        </div> -->
        <table>
            <thead>
                <tr>
                    <th v-for="(col, index) in tableColumns" :key="index">
                        <div class="flex">
                            <component
                                :is="images[col.data_type]"
                                class="w-4 h-4 mr-3"
                            ></component>
                            {{ col.title }}
                        </div>
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, index) in results" :key="index">
                    <td v-for="(rowData, index) in row" :key="index">
                        {{ rowData }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, watch, ref, inject, computed } from 'vue'

    import { images, dataTypeList } from '~/constant/datatype'
    import Tooltip from '@/common/ellipsis/index.vue'

    // API
    import HEKA_SERVICE_API from '~/services/heka/index'
    import { useAPI } from '~/api/useAPI'

    export default defineComponent({
        coponents: { Tooltip },
        setup() {
            /** DATA */
            const tableColumns = ref<any>([])
            const results = ref<any>([])

            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            const { connectionQualifiedName, databaseName, schemaName, name } =
                { ...assetData.value.attributes }

            const body = {
                sql: `select * from ${name}`,
                defaultSchema: `${databaseName}.${schemaName}`,
                dataSourceName: connectionQualifiedName,
                limit: 100,
            }

            /** METHODS */
            const getTableData = () => useAPI('PREVIEW_TABLE', 'POST', { body })

            const { data, isLoading } = getTableData()

            const getDataType = (type: string) => {
                let label = ''
                dataTypeList.forEach((i) => {
                    if (i.type.includes(type)) label = i.label
                })
                return label
            }

            /** WATCHERS */
            watch([data], () => {
                if (data.value) {
                    tableColumns.value.push({
                        width: '50px',
                        fixed: 'left',
                        title: '#',
                        dataIndex: 'hash_index',
                        ellipsis: true,
                    })
                    // convert data from API in Antd-table format
                    data.value.columns.forEach((col) => {
                        const obj = {
                            dataIndex: col.label,
                            title: col.columnName,
                            data_type: getDataType(col.type.rep),
                            width: '150px',
                        }
                        console.log(obj.data_type)
                        tableColumns.value.push(obj)
                    })
                    data.value.rows.forEach((val, index) => {
                        let obj = { hash_index: index + 1 }
                        data.value.columns.forEach((col, i) => {
                            obj[col.columnName] = val[i] || '---'
                        })
                        // add key to object
                        obj = { ...obj }
                        results.value.push(obj)
                    })
                }
            })

            return {
                tableColumns,
                results,
                isLoading,
                data,
                getDataType,
                images,
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

<style lang="less" scoped>
    .sampleData {
        @apply w-full overflow-x-auto border border-gray-light rounded;
    }

    th,
    td {
        @apply border border-gray-light;
    }
    table {
        @apply w-full border-collapse;
        max-height: 280px;
    }
    thead {
        @apply bg-gray-100;
    }
    tbody {
        @apply overflow-y-auto;
        max-height: 240px;
    }
    th {
        @apply font-normal text-gray-700 px-4 py-2 text-sm;
    }
    td {
        @apply text-gray-700 px-4 py-2 text-xs;
        width: 150px;
        min-width: 150px;
    }
</style>
