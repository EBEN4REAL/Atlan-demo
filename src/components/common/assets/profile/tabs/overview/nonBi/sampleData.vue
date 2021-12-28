<template>
    <div
        class="flex items-center justify-center w-full border rounded max-profile-width h-96 border-gray-light"
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
            <div class="flex flex-col items-center justify-center">
                <p class="mb-0 text-base font-bold text-gray-700">
                    Sample data unavailable!
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
        <div
            v-else-if="results.length < 1 && !isLoading"
            class="flex flex-col items-center"
        >
            <AtlanIcon
                icon="EmptySampleData"
                class="w-auto"
                style="height: 118px"
            ></AtlanIcon>
            <div class="flex flex-col items-center justify-center">
                <p class="mb-0 text-base font-bold text-gray-700">
                    Sample data unavailable!
                </p>
            </div>
        </div>
        <div v-else class="w-full h-full">
            <AtlanTable :dataList="results" :columns="tableColumns" />
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
    import Tooltip from '@/common/ellipsis/index.vue'
    import AtlanTable from '@/common/table/previewTable/index.vue'
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

            /** WATCHERS */
            watch([data], () => {
                if (data.value) {
                    // convert data from API in table format
                    data.value.columns.forEach((col) => {
                        const obj = {
                            dataIndex: col.label,
                            title: col.columnName,
                            data_type: col.type.name,
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

            return {
                tableColumns,
                results,
                isLoading,
                error,
            }
        },
    })
</script>

<style lang="less" scoped>
    .max-profile-width {
        max-width: calc(100vw - 476px);
    }
</style>
