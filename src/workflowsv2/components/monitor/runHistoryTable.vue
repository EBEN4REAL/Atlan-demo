<template>
    <div class="px-5 bg-white border rounded-lg border-new-gray-300">
        <div class="flex items-center h-16 gap-x-3">
            <span class="text-sm font-bold leading-6 tracking-widest"
                >WORKFLOW RUN HISTORY</span
            >

            <TabbedStatusSelector v-model:value="status" class="ml-auto" />
            <CreatorSelector v-model:value="creators" />
            <IconButton icon="Retry" @click="fetchRuns(false)" />
        </div>
        <div
            class="flex flex-col overflow-hidden border divide-y divide-gray-300 rounded-lg border-new-gray-300"
        >
            <div
                class="grid items-center h-10 grid-cols-8 px-4 bg-new-gray-100 gap-x-4"
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
            <div
                class="flex overflow-y-scroll"
                style="height: calc(100vh - 500px)"
            >
                <AtlanLoader
                    v-if="isLoading"
                    class="h-10 mx-auto place-self-center"
                />
                <div v-else-if="runs?.length" class="w-full">
                    <RunListItem
                        v-for="run in runs"
                        :key="run.metadata.uid"
                        :run="run"
                        :workflow="workflowMap[workflowTemplateName(run)]"
                    />
                </div>
                <div
                    v-else
                    class="flex flex-col items-center mx-auto text-center gap-y-1 w-96 place-self-center"
                >
                    <component :is="EmptyLogsIllustration" />
                    <span class="text-sm text-gray">
                        Oops... No workflow runs found matching your filters
                    </span>
                    <span class="text-sm text-gray-500">
                        Try modifying your filters or resetting them.
                    </span>
                    <AtlanButton2
                        label="Reset Filters"
                        class="mt-3"
                        color="secondary"
                        @click="resetFilter"
                    />
                </div>
            </div>
        </div>
        <div class="flex items-center justify-end py-3 h-14">
            <span class="mr-auto text-new-gray-600">{{
                isLoading
                    ? 'Loading'
                    : totalRuns
                    ? `Showing ${offset + 1} - ${
                          offset + runs?.length || 0
                      } out of ${totalRuns} runs`
                    : 'No runs found'
            }}</span>
            <Pagination
                v-model:offset="offset"
                :total="totalRuns"
                :loading="isLoading"
                :limit="limit"
                @update:offset="fetchRuns(false)"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'

    import Pagination from '~/workflowsv2/components/common/pagination.vue'
    import RunListItem from './runListItem.vue'

    import TabbedStatusSelector from '~/workflowsv2/components/common/selectors/tabbedStatusSelector.vue'
    import CreatorSelector from '~/workflowsv2/components/common/selectors/creatorSelector.vue'

    import EmptyLogsIllustration from '~/assets/images/illustrations/empty_logs.svg'
    import { useWorkflowStore } from '~/workflowsv2/store'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    export default defineComponent({
        name: 'RunHistoryTable',
        components: {
            RunListItem,
            Pagination,
            TabbedStatusSelector,
            CreatorSelector,
        },
        props: {
            filters: {
                type: Object,
                default: () => ({}),
            },
        },
        emits: ['update:filters'],
        setup(props, { emit }) {
            const { filters } = toRefs(props)

            const resetFilter = () => {
                emit('update:filters', {})
            }

            const setFilter = (key: string, value: any) => {
                const tmpFilter = filters.value
                tmpFilter[key] = value
                emit('update:filters', tmpFilter)
            }

            const computedFactory = (key: string) => ({
                get: () => filters.value?.[key],
                set: (val: any) => setFilter(key, val),
            })

            const status = computed(computedFactory('status'))
            const creators = computed(computedFactory('creators'))

            const limit = ref(30)
            const offset = ref(0)
            const queryText = ref('')

            const workflowStore = useWorkflowStore()
            const { workflowTemplateName, refName } = useWorkflowInfo()

            const facets = computed(() => ({
                workflowTemplate: filters.value?.workflowId,
                workflowTemplates: filters.value?.packageId
                    ? //If Package is selected, filter wf templates by that package
                      Object.values(workflowStore.verifiedWorkflows)
                          .filter(
                              (wf) =>
                                  wf.metadata.annotations[
                                      'package.argoproj.io/name'
                                  ] === filters.value?.packageId
                          )
                          .map((wf) => wf.metadata.name)
                    : //Else filter by all wf templates in pinia
                      Object.keys(workflowStore.verifiedWorkflows),

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
                immediate: false,
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
                // { title: 'Run Type', style: 'grid-column: span 1 / span 1' },
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

            const fetchRuns = (reset = false) => {
                if (reset) offset.value = 0
                resetState()
                quickChange()
            }

            watch(filters, () => fetchRuns(true), { deep: true })

            const workflowMap = computed(() => workflowStore.verifiedWorkflows)

            const init = async () => {
                await workflowStore.fetchVerifiedWorkflows()
                quickChange()
            }

            init()

            return {
                filters,
                facets,
                runs,
                status,
                creators,
                tableHeaders,
                isLoading,
                EmptyLogsIllustration,
                fetchRuns,
                limit,
                offset,
                totalRuns,
                workflowMap,
                workflowTemplateName,
                resetFilter,
            }
        },
    })
</script>
