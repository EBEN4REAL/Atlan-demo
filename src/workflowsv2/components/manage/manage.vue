<template>
    <div class="flex w-full overflow-hidden">
        <div class="flex flex-none w-64 h-full bg-white"></div>
        <div class="flex flex-col flex-1 h-full gap-y-4">
            <div class="flex items-center mx-4 mt-4 gap-x-4">
                <SearchAndFilter
                    v-model:value="queryText"
                    autofocus
                    size="bordered"
                    class="bg-white"
                    placeholder="Search all Snowflake Assets workflows..."
                    @update:value="refetch()"
                />
                <AtlanButton2 label="New workflow" />
            </div>

            <WorkflowList
                v-if="list.length"
                :class="{ 'animate-pulse': isLoading }"
                :workflows="list"
                :lastRunsMap="runByWorkflowMap"
            />
            <div
                v-else-if="!isLoading"
                class="flex flex-col items-center justify-center h-full"
            >
                <AtlanIcon icon="NoAssetsFound" class="h-44" />
                <span>No workflows found</span>
            </div>

            <template v-if="isLoading && !list.length">
                <div
                    v-for="idx in 5"
                    :key="idx"
                    class="p-4 mx-4 bg-white rounded-lg"
                >
                    <a-skeleton active :paragraph="{ rows: 2 }" />
                </div>
            </template>
        </div>
        <div style="width: 420px" class="flex flex-none h-full bg-white"></div>
    </div>
</template>

<script lang="ts">
    import { useDebounceFn, whenever } from '@vueuse/core'
    import { computed, defineComponent, ref } from 'vue'
    import WorkflowList from '~/workflowsv2/components/manage/workflowList.vue'
    import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'
    import { useWorkflowDiscoverList } from '~/workflowsv2/composables/useWorkflowDiscoverList'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import SearchAndFilter from '~/components/common/input/searchAndFilter.vue'

    export default defineComponent({
        name: 'ManageWorkflows',
        components: { WorkflowList, SearchAndFilter },
        props: {},
        emits: [],
        setup() {
            const { name } = useWorkflowInfo()

            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
            })

            const facets = ref({
                ui: true,
            })

            const queryText = ref(null)

            const { list, quickChange, isLoading } = useWorkflowDiscoverList({
                facets,
                queryText,
                limit: ref(100),
                source: ref({
                    excludes: ['spec'],
                }),
                preference,
            })

            const runFacets = computed(() => ({
                workflowTemplates: list.value.map((wft) => name(wft)),
            }))

            const { quickChange: quickChangeRun, runByWorkflowMap } =
                useRunDiscoverList({
                    facets: runFacets,
                    limit: ref(0),
                    aggregations: ref(['status']),
                    source: ref({
                        excludes: ['spec'],
                    }),
                    preference,
                    immediate: false,
                })

            whenever(
                () => runFacets.value.workflowTemplates.length,
                () => {
                    quickChangeRun()
                }
            )

            const refetch = useDebounceFn(quickChange, 250, { maxWait: 1000 })

            return { list, refetch, isLoading, runByWorkflowMap, queryText }
        },
    })
</script>
