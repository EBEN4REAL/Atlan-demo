<template>
    <div class="flex flex-col">
        <template v-for="(queryInfo, index) in allQueryList" :key="index">
            <QueryItem
                :queryInfo="queryInfo"
                :savedQueryMetaMap="savedQueryMetaMap"
                :isHover="isHover"
                @mouseover="isHover = queryInfo?._id"
                @mouseleave="isHover = null"
            />
        </template>
    </div>
    <div>
        <LoadMoreQuery
            v-model:offset="from"
            :total-pages="pagination.total"
            :loading="isLoading"
            :page-size="size"
            @loadMore="refreshList"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, toRefs, watch } from 'vue'
    import { useQueryLogs } from '~/components/governance/queryLogs/composables/useQueryLogs'
    import dayjs from 'dayjs'
    import QueryItem from './queryItem.vue'
    import whoami from '~/composables/user/whoami'
    import LoadMoreQuery from './loadMoreQuery.vue'

    export default defineComponent({
        name: 'QueryHistoryList',
        components: { QueryItem, LoadMoreQuery },
        props: {
            lowerLimit: {
                type: String,
                required: true,
            },
            upperLimit: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const { lowerLimit, upperLimit } = toRefs(props)
            const gte = ref(upperLimit.value)
            const lt = ref(lowerLimit.value)
            const from = ref(0)
            const size = ref(15)
            const { username } = whoami()

            const usernames = ref([username.value])

            const {
                list: queryList,
                mutateBody,
                refetchList,
                isLoading,
                filteredLogsCount,
                savedQueryMetaMap,
            } = useQueryLogs(gte, lt, from, size, usernames, [
                'name',
                'certificateStatus',
            ])

            let allQueryList = ref([])

            const totalLogsCount = ref(0)

            watch(filteredLogsCount, () => {
                if (filteredLogsCount.value) {
                    totalLogsCount.value = filteredLogsCount.value
                }
            })

            watch(
                queryList,
                () => {
                    if (queryList.value && queryList.value.length > 0) {
                        queryList.value.forEach((el) =>
                            allQueryList.value.push(el)
                        )
                    }
                },
                { deep: true }
            )

            const pagination = computed(() => ({
                total: totalLogsCount.value / size.value,
                pageSize: size.value,
                current: from.value / size.value + 1,
            }))

            const facets = ref({})

            const refreshList = () => {
                mutateBody({
                    from,
                    size,
                    gte,
                    lt,
                    usernames,
                })
                refetchList()
            }

            let isHover = ref(null)

            return {
                queryList,
                allQueryList,
                savedQueryMetaMap,
                dayjs,
                pagination,
                refreshList,
                isLoading,
                from,
                size,
                filteredLogsCount,
                totalLogsCount,
                isHover,
            }
        },
    })
</script>

<style lang="less" scoped></style>
