<template>
    <div class="px-5 bg-white rounded-lg">
        <div class="flex items-center h-16">
            <span class="text-sm font-bold leading-6 tracking-widest"
                >WORKFLOW RUN HISTORY</span
            >
            <IconButton
                icon="Retry"
                class="ml-auto"
                @click="resetAndFetchRuns"
            />
        </div>
        <div
            class="flex flex-col overflow-hidden border divide-y divide-gray-300 rounded-lg border-new-gray-300"
        >
            <div
                class="grid items-center h-10 grid-cols-8 pl-3 pr-16 bg-new-gray-100 gap-x-4"
            >
                <div
                    v-for="head in tableHeaders"
                    :key="head.title"
                    class="text-xs tracking-wider uppercase"
                    :style="head.style"
                >
                    <span>{{ head.title }}</span>
                </div>
            </div>
            <div class="flex overflow-y-scroll" style="height: 45vh">
                <AtlanLoader
                    v-if="isLoading"
                    class="h-10 mx-auto place-self-center"
                />
                <div
                    v-else-if="runs?.length"
                    class="w-full divide-y divide-gray-300"
                >
                    <RunListItem
                        v-for="run in runs"
                        :key="run.metadata.uid"
                        :run="run"
                    />
                </div>
                <div
                    v-else
                    class="flex flex-col items-center mx-auto text-center gap-y-3 w-72 place-self-center"
                >
                    <component :is="EmptyLogsIllustration" />
                    <span class="text-sm text-gray">
                        Oops… we couldn't find any workflow runs matching your
                        filters.
                    </span>
                    <span class="text-sm text-gray-500">
                        Try modifying your filters or resetting them.
                    </span>
                </div>
            </div>
        </div>
        <div class="flex items-center justify-end py-3">
            <span class="mr-auto text-new-gray-600"
                >Showing {{ offset + 1 }} - {{ offset + runs?.length || 0 }} out
                of {{ totalRuns }} runs</span
            >
            <Pagination
                v-model:offset="offset"
                :total-pages="Math.ceil(totalRuns / limit)"
                :loading="isLoading"
                :page-size="limit"
                @mutate="resetAndFetchRuns"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'

    import Pagination from '@/common/list/pagination.vue'
    import RunListItem from '~/workflowsv2/components/monitor/runListItem.vue'

    import EmptyLogsIllustration from '~/assets/images/illustrations/empty_logs.svg'
    import { useWorkflowStore } from '~/workflowsv2/store'

    export default defineComponent({
        name: 'RunHistoryTable',
        components: { RunListItem, Pagination },
        props: {
            filters: {
                type: Object,
                default: () => ({}),
            },
        },
        emits: ['update:filters'],
        setup(props) {
            const { filters } = toRefs(props)
            const limit = ref(30)
            const offset = ref(0)
            const queryText = ref('')

            const workflowStore = useWorkflowStore()

            const facets = computed(() => ({
                workflowTemplate: filters.value?.workflowId,
                prefix: workflowStore.packageMeta?.[filters.value?.packageId]
                    ?.metadata?.name,
                dateRange: filters.value?.dateRange,
                status: filters.value?.status,
                creators: filters.value?.creators,
            }))

            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })

            const {
                list: runs,
                quickChange,
                resetState,
                isLoading,
                data,
            } = useRunDiscoverList({
                facets,
                limit,
                offset,
                queryText,
                preference,
                source: ref({ excludes: ['spec'] }),
            })

            const totalRuns = computed(
                () => data.value?.hits?.total?.value || 0
            )

            // If changed this should be manually synced with the flex-grow properties of <RunListItem/>
            const tableHeaders = [
                {
                    title: 'Workflow & Run',
                    style: 'grid-column: span 4 / span 4',
                },
                {
                    title: 'Status',
                    style: 'grid-column: span 1 / span 1; justify-content: center; display:flex',
                },
                { title: 'Run Type', style: 'grid-column: span 1 / span 1' },
                {
                    title: 'Started',
                    style: 'grid-column: span 1 / span 1; justify-content: flex-end; display:flex',
                },
                {
                    title: 'Duration',
                    style: 'grid-column: span 1 / span 1; justify-content: flex-end; display:flex',
                },
                // { title: 'Output', style: 'grid-column: span 2 / span 2' },
            ]

            const resetAndFetchRuns = () => {
                resetState()
                quickChange()
            }

            watch(filters, resetAndFetchRuns, { deep: true })

            return {
                runs,
                tableHeaders,
                isLoading,
                EmptyLogsIllustration,
                resetAndFetchRuns,
                limit,
                offset,
                totalRuns,
            }
        },
    })
</script>
