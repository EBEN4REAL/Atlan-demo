<template>
    <div
        v-if="isLoading"
        class="flex items-center justify-center mt-4 text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting sample data</span>
    </div>
    <div v-else class="w-full p-0 m-0 border rounded border-gray-light">
        <table class="relative block w-full p-0 m-0 overflow-auto h-96">
            <thead>
                <tr>
                    <th
                        v-for="(col, index) in tableColumns"
                        :key="index"
                        class="sticky top-0 px-4 py-2 text-sm font-normal text-gray-700 bg-gray-100 border  border-gray-light"
                    >
                        <div class="flex">
                            <component
                                :is="images[col.data_type]"
                                class="w-4 h-4 mr-1"
                            ></component>
                            <Tooltip
                                :tooltip-text="col.title"
                                classes="cursor-pointer"
                            />
                        </div>
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="(row, index) in results" :key="index">
                    <td
                        v-for="(rowData, index) in row"
                        :key="index"
                        class="px-4 py-2 text-xs text-gray-700 bg-white border  border-gray-light"
                    >
                        <Tooltip
                            :tooltip-text="rowData"
                            classes="cursor-pointer"
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        watch,
        ref,
        // inject,
        // computed
    } from 'vue'
    import { storeToRefs } from 'pinia'

    import { images, dataTypeList } from '~/constant/datatype'
    import Tooltip from '@/common/ellipsis/index.vue'

    // API
    import { useAPI } from '~/services/api/useAPI'
    // import HEKA_SERVICE_API from '~/services/heka/index'
    // store
    import useDiscoveryStore from '~/store/discovery'

    export default defineComponent({
        components: { Tooltip },
        setup() {
            /** DATA */
            const tableColumns = ref<any>([])
            const results = ref<any>([])

            /** INJECTIONS */
            // const assetDataInjection = inject('assetData')

            /** COMPUTED */
            // const assetData = computed(() => assetDataInjection?.asset)
            // store
            const storeDiscovery = useDiscoveryStore()
            const { selectedAsset } = storeToRefs(storeDiscovery)

            const { connectionQualifiedName, databaseName, schemaName, name } =
                { ...selectedAsset.value.attributes }

            const body = {
                tableName: name,
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
                images,
            }
        },
    })
</script>

<style lang="less" scoped>
    table {
        td,
        th {
            max-width: 150px;
            min-width: 150px;
        }
        tbody {
            font-family: Hack;
            font-weight: 400;
            src: url('~/assets/fonts/hack/Hack-Regular.ttf') format('ttf');
        }

        td:first-child,
        th:first-child {
            @apply bg-gray-100 text-center !important;
            width: 35px;
            min-width: 35px;
        }
    }
</style>
