/* eslint-disable vue/no-v-model-argument */
<template>
    <div
        v-if="asset.attributes.integrationName !== 'tableau'"
        class="w-full px-5 overflow-y-auto"
        style="height: 600px"
    >
        <div class="mt-6">
            <p class="mb-3 text-base font-bold mt-7">Column preview</p>
            <!-- TODO: new column ui goes here -->
            <TableColumn :asset="asset" />
        </div>
        <div class="border-b">
            <div class="flex items-center justify-between mb-3 text-base">
                <p class="font-bold mt-7">Table preview</p>
                <div
                    class="flex items-center p-2 border border-gray-300 rounded cursor-pointer  text-gray hover:bg-gray-100"
                >
                    <span class="text-sm">Query on this asset</span>
                    <fa class="ml-2 text-sm" icon="fal share" />
                </div>
            </div>
            <a-table
                bordered
                :columns="tableColumns"
                :data-source="results"
                :scroll="{ x: 1500, y: 300 }"
                class="max-w-5xl m-auto"
                :pagination="false"
            >
            </a-table>
        </div>
        <!--Asset Summary -->
        <div class="min-h-full my-6">
            <Readme
                class="w-full border-0"
                :showBorders="false"
                :showPaddingX="false"
                :parent-asset-id="asset?.guid"
            />
        </div>
    </div>
    <div v-else class="w-full overflow-y-auto bg-white" style="height: 600px">
        <BiWidgetWrapper :asset="asset" />
    </div>
</template>
<script lang="ts">
    // Vue
    import { defineComponent, ref, watch, toRefs } from 'vue'

    // Components
    import Readme from '@/common/readme/index.vue'
    import TableColumn from '@/asset/assetProfile/overview/tableColumn.vue'
    import DescriptionWidget from '@/asset/assetProfile/overview/descriptionWidget.vue'
    import BiWidgetWrapper from '@/asset/assetProfile/overview/biWidget/biWidgetWrapper.vue'

    // api
    import { useAPI } from '~/api/useAPI'

    export default defineComponent({
        components: { Readme, TableColumn, DescriptionWidget, BiWidgetWrapper },
        props: ['asset'],
        setup(props, context) {
            // const asset = ref(context.attrs.asset)
            const { asset }: ToRefs = toRefs(props)

            console.log(asset)
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
