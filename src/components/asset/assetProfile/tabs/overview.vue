/* eslint-disable vue/no-v-model-argument */
<template>
    <div
        v-if="asset.attributes.integrationName !== 'tableau'"
        class="w-full px-10 py-4 overflow-y-auto"
        style="height: 600px"
    >
        <!--Asset Summary -->
        <div class="flex justify-between w-full mb-8">
            <div class="w-full max-w-xl mr-8 bg-white border rounded-t">
                <div
                    class="flex items-center w-full py-2 text-base bg-white border-b  px-7"
                >
                    Summary
                </div>
                <div class="w-full py-6 px-7">
                    <!-- Description Component -->
                    <div class="mb-8">
                        <DescriptionWidget :asset="asset" />
                    </div>
                    <!-- Table Component -->
                    <div>
                        <a-table
                            bordered
                            :columns="tableColumns"
                            :data-source="results"
                            :pagination="false"
                            :scroll="{ y: 170, x: 170 }"
                            size="middle"
                        >
                        </a-table>
                    </div>
                </div>
            </div>
            <!-- Column widget -->
            <div>
                <TableColumn :asset="asset" />
            </div>
        </div>
        <!-- Asset ReadMe -->
        <div class="min-h-full">
            <Readme class="w-full h-32" />
        </div>
    </div>
    <div v-else class="w-full overflow-y-auto bg-white" style="height: 600px">
        <BiWidgetWrapper :asset="asset" />
    </div>
</template>
<script lang="ts">
    // Vue
    import { defineComponent, ref, watch } from 'vue'

    // Components
    import Readme from '@/common/readme/index.vue'
    import TableColumn from '@/asset/assetProfile/overview/tableColumn.vue'
    import DescriptionWidget from '@/asset/assetProfile/overview/descriptionWidget.vue'
    import BiWidgetWrapper from '@/asset/assetProfile/overview/biWidget/biWidgetWrapper.vue'

    // api
    import { useAPI } from '~/api/useAPI'

    export default defineComponent({
        components: { Readme, TableColumn, DescriptionWidget, BiWidgetWrapper },
        setup(props, context) {
            const asset = ref(context.attrs.asset)

            // for table widget
            const tableColumns = ref([])
            const results = ref([])
            const getTableData = () => {
                const {
                    connectionQualifiedName,
                    databaseName,
                    schemaName,
                    name,
                } = { ...asset.value.attributes }

                const body = {
                    tableName: name,
                    defaultSchema: `${databaseName}.${schemaName}`,
                    dataSourceName: connectionQualifiedName,
                }

                return useAPI('PREVIEW_TABLE', 'POST', { body })
            }
            const { data, error } = getTableData()

            // filter required data
            watch([data, error], () => {
                if (data.value && error.value == undefined) {
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
                } else {
                    // if data not found
                    console.log(
                        error.value,
                        '------ failed to fetch table data------ '
                    )
                }
            })

            return {
                asset,
                tableColumns,
                results,
            }
        },
    })
</script>
