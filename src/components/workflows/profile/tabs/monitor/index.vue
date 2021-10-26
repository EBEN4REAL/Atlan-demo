<template>
    <div class="relative w-full h-full">
        <div
            v-if="isLoading"
            class="absolute flex items-center justify-center w-full h-full"
        >
            <a-spin />
        </div>
        <EmptyView
            v-else-if="!isLoading && !graphData?.name"
            :empty-screen="EmptyScreen"
            class="-mt-20"
        />
        <div v-else-if="graphData.name" class="absolute w-full h-full">
            <MonitorGraph :graph-data="graphData" />
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
    import MonitorGraph from './monitorGraph.vue'
    import EmptyView from '@common/empty/index.vue'

    // Composables
    import {
        getRunList,
        getArchivedRunList,
    } from '~/composables/workflow/useWorkFlowList'
    import EmptyScreen from '~/assets/images/workflows/empty_tab.png'

    export default defineComponent({
        name: 'WorkflowMonitorTab',
        components: { MonitorGraph, EmptyView },
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
            const id = computed(() => route?.params?.id || '')
            const list = ref([])

            /** METHODS */

            // getRunList
            const labelSelector = `workflows.argoproj.io/workflow-template=${id.value},workflows.argoproj.io/phase=Running`
            const { liveList } = getRunList(labelSelector, true)

            // getArchivedRunList
            const filter = {
                labels: {
                    $elemMatch: {
                        'workflows.argoproj.io/workflow-template': `${id.value}`,
                    },
                },
            }
            const { archivedList, isLoading } = getArchivedRunList(
                JSON.stringify(filter),
                true
            )

            // watcher
            watch([liveList, archivedList], ([newX, newY]) => {
                if (newX && newY) {
                    let liveRunItems = []
                    let archivedRunItems = []
                    if (newX?.items?.length)
                        liveRunItems = newX.items.map((x) => {
                            const { status, metadata, spec } = x
                            const { name, uid } = metadata
                            const {
                                startedAt: started_at,
                                finishedAt: finished_at,
                                phase,
                            } = status
                            const obj = {
                                name,
                                uid,
                                started_at,
                                finished_at,
                                phase,
                            }
                            obj.workflow = { status, metadata, spec }
                            return obj
                        })

                    if (newY?.records?.length) archivedRunItems = newY.records

                    list.value = [...liveRunItems, ...archivedRunItems]
                    records.value = list.value
                    graphData.value = list.value[0]
                }
            })

            /** Watchers */
            watch(selectedRunName, (newVal) => {
                graphData.value = records.value.find((x) => x.name === newVal)
            })

            return {
                graphData,
                EmptyScreen,
                isLoading,
                list,
            }
        },
    })
</script>
