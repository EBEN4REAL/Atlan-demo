<template>
    <div class="relative w-full h-full">
        <div class="absolute flex items-center justify-center w-full h-full">
            <a-spin />
        </div>
        <div class="absolute w-full h-full">
            <WorkflowGraph v-if="graphData.metadata" :graph-data="graphData" />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, watch, ref, toRefs } from 'vue'
    import { useRoute } from 'vue-router'

    // Components
    import WorkflowGraph from './workflowGraph.vue'

    // Composables
    import {
        useArchivedWorkflowRun,
        useArchivedWorkflowList,
    } from '../../../useWorkFlowList'

    export default defineComponent({
        name: 'WorkflowMonitor',
        components: { WorkflowGraph },
        props: {
            selectedRunId: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const route = useRoute()

            /** DATA */
            const { selectedRunId } = toRefs(props)
            const graphData = ref({})
            const currRunId = ref('')
            const isLoading = ref(false)
            const id = computed(() => route?.params?.id || '')

            /** METHODS */
            // useArchivedWorkflowList
            const labelSelector = computed(
                () => `workflows.argoproj.io/workflow-template=${id.value}`
            )
            const { workflowList } = useArchivedWorkflowList(labelSelector)

            // useArchivedWorkflowRun
            const fetchRunData = () => {
                const { runDeets } = useArchivedWorkflowRun(currRunId.value)

                watch(runDeets, (newVal) => {
                    graphData.value = newVal
                })
            }

            /** Watchers */
            watch(workflowList, (newVal) => {
                currRunId.value = newVal[0].metadata.uid
                fetchRunData()
            })

            watch(selectedRunId, (newVal) => {
                currRunId.value = newVal
                fetchRunData()
            })

            return {
                graphData,
                isLoading,
            }
        },
    })
</script>
