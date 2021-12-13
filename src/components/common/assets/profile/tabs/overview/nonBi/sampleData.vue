<template>
    <div
        class="flex items-center justify-center w-full border rounded h-96 border-gray-light"
    >
        <div v-if="isLoading" class="flex items-center text-lg leading-none">
            <AtlanIcon
                icon="Loader"
                class="w-auto h-8 mr-2 animate-spin"
            ></AtlanIcon>
            <span>Getting sample data</span>
        </div>
        <div v-else-if="error && !isLoading" class="flex flex-col items-center">
            <AtlanIcon
                icon="ErrorSampleData"
                class="w-auto"
                style="height: 146px"
            ></AtlanIcon>
            <div class="flex flex-col items-center justify-center mt-0">
                <p class="mb-0 text-base font-bold text-gray-700">
                    {{ error?.response?.data?.errorMessage }}
                </p>
                <p class="mt-2 mb-0 text-base text-gray-500">
                    <span v-if="error?.response?.data?.errorName"
                        >{{ error?.response?.data?.errorName }} :
                    </span>
                    <span v-if="error?.response?.data?.errorCode">
                        {&nbsp;{{ error?.response?.data?.errorCode }}&nbsp;}
                    </span>
                </p>
            </div>
        </div>
        <div v-else-if="results.length < 1 && !isLoading"></div>
        <div v-else class="w-full h-full">
            <AtlanTable :dataList="results">
                <template #header>
                    <thead>
                        <tr>
                            <th
                                class="truncate bg-gray-100 border border-gray-light"
                            >
                                #
                                <!-- <span class="resize-handle"></span> -->
                            </th>
                            <th
                                v-for="(col, index) in tableColumns"
                                :key="index"
                                class="bg-gray-100 border border-gray-light"
                            >
                                <div class="flex items-center">
                                    <a-tooltip>
                                        <template #title>{{
                                            col.data_type
                                        }}</template>
                                        <component
                                            :is="images[col.data_type]"
                                            class="w-4 h-4 mr-1 cursor-pointer -mt-0.5"
                                        ></component>
                                    </a-tooltip>

                                    <Tooltip :tooltip-text="`${col.title}`" />
                                </div>
                                <!-- <span class="resize-handle"></span> -->
                            </th>
                        </tr>
                    </thead>
                </template>
            </AtlanTable>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        watch,
        ref,
        PropType,
        toRefs,
        // inject,
        // computed
    } from 'vue'
    import { images, dataTypeCategoryList } from '~/constant/dataType'
    import Tooltip from '@/common/ellipsis/index.vue'
    import AtlanTable from '@/UI/table.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // API
    import { Insights } from '~/services/sql/query'

    export default defineComponent({
        components: { Tooltip, AtlanTable },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            /** DATA */
            const tableColumns = ref<any>([])
            const results = ref<any>([])

            const { asset } = toRefs(props)

            const { connectionQualifiedName, databaseName, schemaName, title } =
                useAssetInfo()

            const body = {
                tableName: title(asset.value),
                defaultSchema: `${databaseName(asset.value)}.${schemaName(
                    asset.value
                )}`,
                dataSourceName: connectionQualifiedName(asset.value),
                limit: 100,
            }

            /** METHODS */
            const { data, isLoading, error } = Insights.GetSampleData(body)
            const getDataType = (type: string) => {
                let label = ''
                dataTypeCategoryList.forEach((i) => {
                    if (i.type.includes(type.toUpperCase())) label = i.label
                })
                return label
            }

            /** WATCHERS */
            watch([data], () => {
                if (data.value) {
                    // convert data from API in table format
                    data.value.columns.forEach((col) => {
                        const obj = {
                            dataIndex: col.label,
                            title: col.columnName,
                            data_type: getDataType(col.type.name),
                        }
                        tableColumns.value.push(obj)
                    })
                    data.value.rows.forEach((val, index) => {
                        let obj = {}
                        data.value.columns.forEach((col, i) => {
                            obj[col.columnName] = val[i] || '---'
                        })
                        // add key to object
                        obj = { ...obj }
                        results.value.push(obj)
                    })
                }
            })
            watch([error], () => {
                if (error.value) {
                    console.log(error.value.errorMessage)
                }
            })
            return {
                tableColumns,
                results,
                isLoading,
                images,
                error,
            }
        },
    })
</script>
