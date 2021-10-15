<template>
    <div class="sampleData">
        <!-- Table -->
        <!--  <div class="relative border rounded border-gray-light h-96">
            <a-table
                :columns="tableColumns"
                :data-source="results"
                :pagination="false"
                :scroll="{ x: true, y: 300 }"
                :loading="isLoading"
                class="absolute left-0 w-full"
                size="small"
            >
            </a-table>
             <a-table
                :data-source="results"
                :loading="isLoading"
                :pagination="false"
                :scroll="{ y: 300 }"
                class="absolute left-0 w-full"
                size="small"
            >
                <a-table-column
                    v-for="col in tableColumns"
                    :key="col.dataIndex"
                    :data-index="col.dataIndex"
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
        </div>-->
        <table>
            <thead>
                <tr>
                    <th v-for="(col, index) in tableColumns" :key="index">
                        <div class="flex">
                            <component
                                :is="images[col.data_type]"
                                class="w-4 h-4 mr-3"
                            ></component>
                            <Tooltip :tooltip-text="col.title" />
                        </div>
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, index) in results" :key="index">
                    <td v-for="(rowData, index) in row" :key="index">
                        <Tooltip :tooltip-text="rowData" />
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
        components: { Tooltip },
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
                    if (i.type.includes(type.toUpperCase())) label = i.label
                })
                return label
            }

            /** WATCHERS */
            watch([data], () => {
                if (data.value) {
                    tableColumns.value.push({
                        width: 50,
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
                            width: 150,
                            ellipsis: true,
                        }

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
        @apply w-full border border-gray-light rounded m-0 p-0;
    }
    table {
        @apply w-full block overflow-auto h-80 m-0 p-0;

        thead {
            @apply sticky top-0;
            th {
                @apply font-normal text-gray-700 px-4 py-2 text-sm bg-gray-100 border border-gray-light;
                width: 150px;
                min-width: 150px;
            }
        }
        tbody {
            td {
                @apply text-gray-700 px-4 py-2 text-xs bg-white border border-gray-light;
                width: 150px;
                min-width: 150px;
            }
        }
        td:first-child {
            @apply sticky left-0 border-r border-gray-light;
            width: 50px;
            min-width: 50px;
        }
        /*  th:first-child {
            
            width: 50px;
            min-width: 50px;
        } */
    }
</style>
