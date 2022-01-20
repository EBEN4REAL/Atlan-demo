<template>
    <div
        class="flex items-center justify-center w-full overflow-hidden border rounded max-profile-width h-96 max-h-96"
        :class="
            results.length > 0 && !isLoading
                ? 'border-gray-light'
                : 'border-transparent'
        "
    >
        <div v-if="isLoading" class="flex items-center text-lg leading-none">
            <AtlanLoader class="h-8 mr-2" />
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
                <p
                    v-if="error?.response?.data?.errorName"
                    class="mt-2 mb-0 text-base text-gray-500"
                >
                    {{ error?.response?.data?.errorName }}
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
            <AtlanPreviewTable :dataList="results" :columns="tableColumns" />
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
    import AtlanPreviewTable from '@/common/table/previewTable/tablePreview.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // API
    import { Insights } from '~/services/sql/query'

    export default defineComponent({
        components: { Tooltip, AtlanTable, AtlanPreviewTable },
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
                    data.value.columns.forEach((col, index) => {
                        const obj = {
                            dataIndex: col.columnName + index,
                            title: col.columnName,
                            data_type: col.type.name,
                            key: index + 1,
                        }
                        tableColumns.value.push(obj)
                    })
                    data.value.rows.forEach((val) => {
                        results.value.push(val)
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
        max-width: calc(100vw - 516px);
    }
</style>
