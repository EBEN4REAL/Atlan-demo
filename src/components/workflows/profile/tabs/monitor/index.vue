<template>
    <div class="relative w-full h-full">
        <div class="absolute flex items-center justify-center w-full h-full">
            <a-spin />
        </div>
        <div class="absolute w-full h-full">
            <WorkflowGraph v-if="graphData.name" :graph-data="graphData" />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        computed,
        watch,
        ref,
        toRefs,
        onMounted,
    } from 'vue'
    import { useRoute } from 'vue-router'

    // Components
    import WorkflowGraph from './monitorGraph.vue'

    // Composables
    import { useArchivedRunList } from '~/composables/workflow/useWorkFlowList'

    export default defineComponent({
        name: 'WorkflowMonitorTab',
        components: { WorkflowGraph },
        props: {
            selectedRunName: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const route = useRoute()

            /** DATA */
            const { selectedRunName } = toRefs(props)
            const records = ref([])
            const graphData = ref({})
            const isLoading = ref(false)
            const id = computed(() => route?.params?.id || '')

            /** METHODS */
            // fetchRunsData
            const fetchRunsData = () => {
                const filter = {
                    labels: {
                        $elemMatch: {
                            'workflows.argoproj.io/workflow-template': `${id.value}`,
                        },
                    },
                }
                const { runList } = useArchivedRunList(
                    JSON.stringify(filter),
                    true
                )

                watch(runList, (newVal) => {
                    records.value = newVal.records
                    graphData.value = newVal.records[0]
                })
            }

            /** Watchers */
            watch(selectedRunName, (newVal) => {
                graphData.value = records.value.find((x) => (x.name = newVal))
            })

            onMounted(() => {
                fetchRunsData()
            })

            return {
                graphData,
                isLoading,
            }
        },
    })
</script>
