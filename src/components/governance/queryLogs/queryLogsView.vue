<template>
    <div class="h-full">
        <DefaultLayout title="Query Logs">
            <template #header>
                <div class="flex items-center justify-between pb-3">
                    <div class="flex items-stretch w-full">
                        <div class="flex items-center">
                            <a-button
                                type="default"
                                class="px-2 border border-r-0 border-gray-300 rounded-tl rounded-tr-none rounded-bl rounded-br-none "
                            >
                                <AtlanIcon
                                    :icon="false ? 'FilterDot' : 'Filter'"
                                    class="w-4 h-4"
                                />
                            </a-button>
                        </div>
                        <a-input-search
                            v-model:value="searchText"
                            :placeholder="`Search through ${totalCount} logs`"
                            class="w-1/3 mr-1 border border-gray-300 rounded-none rounded-tr rounded-br shadow-sm "
                            size="default"
                            :allow-clear="true"
                            @change="handleSearch"
                        ></a-input-search>
                    </div>
                    <div class="flex-grow w-0"></div>

                    <TimeFrameSelector
                        v-model:modelValue="timeFrame"
                        :time-frame="timeFrame"
                        @change="handleRangePickerChange"
                    />
                </div>
            </template>

            <QueryLogTable
                :api-keys-list="queryList"
                :is-loading="isLoading"
                :selected-query="selectedQuery"
                :selected-row-keys="selectedRowKeys"
                @selectQuery="handleSelectQuery"
            />
            <!-- <div class="flex justify-end max-w-full mt-4">
                <a-pagination
                    :total="pagination.total"
                    :current="pagination.current"
                    :page-size="pagination.pageSize"
                    @change="handlePagination"
                />
            </div> -->
        </DefaultLayout>
        <a-drawer
            :visible="isQueryPreviewDrawerVisible"
            :mask="false"
            :width="420"
            class="api-key"
            :closable="false"
        >
            <QueryPreviewDrawer
                :query="selectedQuery"
                @closeDrawer="toggleQueryPreviewDrawer"
                @selectQuery="handleSelectQuery"
            />
        </a-drawer>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, Ref, watch, computed } from 'vue'
    import { message } from 'ant-design-vue'
    import dayjs from 'dayjs'
    import map from '~/constant/accessControl/map'
    import DefaultLayout from '~/components/admin/layout.vue'
    import AtlanBtn from '@/UI/button.vue'
    import QueryLogTable from '@/governance/queryLogs/queryTable.vue'
    import QueryPreviewDrawer from '~/components/governance/queryLogs/queryDrawer.vue'
    import NewAPIKeyIllustration from '~/assets/images/illustrations/new_apikey.svg'
    import TimeFrameSelector from '~/components/admin/common/timeFrameSelector.vue'
    import { useQueryLogs } from './composables/useQueryLogs'

    export default defineComponent({
        name: 'ApiKeysView',
        components: {
            DefaultLayout,
            AtlanBtn,
            QueryLogTable,
            TimeFrameSelector,
            QueryPreviewDrawer,
        },
        setup() {
            /** LOCAL STATE */
            const searchText: Ref<string> = ref('')
            const isAPIKeyDrawerVisible: Ref<boolean> = ref(false)
            const timeFrame = ref('30 days')
            const selectedQuery = ref({})
            const isQueryPreviewDrawerVisible = ref(false)
            const gte = ref(
                dayjs(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).format()
            )
            const lt = ref(dayjs().format())

            const {
                list: queryList,
                mutateBody,
                refetchList,
                isLoading,
                totalCount,
            } = useQueryLogs(gte, lt)

            const handleRangePickerChange = (e) => {
                console.log(e)
                const gte = e[0]
                const lt = e[1]
                mutateBody({ gte, lt })
                refetchList()
            }
            watch(
                [queryList, isLoading],
                () => {
                    console.log(queryList.value, isLoading.value, 'logs')
                },
                { immediate: true }
            )

            const toggleQueryPreviewDrawer = (
                val: boolean | undefined = undefined
            ) => {
                if (val === undefined)
                    isQueryPreviewDrawerVisible.value =
                        !isQueryPreviewDrawerVisible.value
                else isQueryPreviewDrawerVisible.value = val
            }

            const handleSearch = () => {}
            const setSelectedQuery = (query: Object) => {
                selectedQuery.value = query
            }
            const handleSelectQuery = (query: Object) => {
                if (!isQueryPreviewDrawerVisible.value)
                    isQueryPreviewDrawerVisible.value = true
                setSelectedQuery(query)
            }
            const selectedRowKeys = computed(() =>
                selectedQuery.value?._id !== undefined
                    ? [selectedQuery.value?._id]
                    : []
            )

            return {
                selectedRowKeys,
                isQueryPreviewDrawerVisible,
                selectedQuery,
                queryList,
                totalCount,
                isLoading,
                handleSearch,
                handleSelectQuery,
                toggleQueryPreviewDrawer,
                handleRangePickerChange,
                timeFrame,
                searchText,
                isAPIKeyDrawerVisible,
                NewAPIKeyIllustration,
                map,
            }
        },
    })
</script>
