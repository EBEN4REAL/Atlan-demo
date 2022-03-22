<template>
    <div class="flex w-full h-full overflow-hidden">
        <div class="w-64 bg-white"></div>
        <WorkflowList
            :workflows="list"
            :lastRunsMap="runByWorkflowMap"
            class="flex-grow"
        />
        <div style="width: 420px" class="bg-white"></div>
    </div>
</template>

<script lang="ts">
    import { whenever } from '@vueuse/core'
    import { computed, defineComponent, ref } from 'vue'
    import WorkflowList from '~/workflowsv2/components/manage/workflowList.vue'
    import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'
    import { useWorkflowDiscoverList } from '~/workflowsv2/composables/useWorkflowDiscoverList'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    export default defineComponent({
        name: 'ManageWorkflows',
        components: { WorkflowList },
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

            const { list, quickChange, isLoading } = useWorkflowDiscoverList({
                facets,
                limit: ref(100),
                source: ref({
                    excludes: ['spec'],
                }),
                preference,
            })

            const runFacets = computed(() => ({
                workflowTemplates: list.value.map((wft) => name(wft)),
            }))

            const aggregationRun = ref(['status'])

            const { quickChange: quickChangeRun, runByWorkflowMap } =
                useRunDiscoverList({
                    facets: runFacets,
                    limit: ref(0),
                    aggregations: aggregationRun,
                    queryText: ref(''),
                    source: ref({
                        excludes: ['spec'],
                    }),
                    preference,
                    immediate: false,
                })

            whenever(runFacets, () => {
                quickChangeRun()
            })

            return { list, quickChange, isLoading, runByWorkflowMap }
        },
    })
</script>
