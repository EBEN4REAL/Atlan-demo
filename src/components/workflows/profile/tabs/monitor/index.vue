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
            :EmptyScreen="EmptyScreen"
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
    import { useArchivedRunList } from '~/composables/workflow/useWorkFlowList'
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

            /** METHODS */
            const filter = {
                labels: {
                    $elemMatch: {
                        'workflows.argoproj.io/workflow-template': `${id.value}`,
                    },
                },
            }
            const { runList, isLoading } = useArchivedRunList({ filter }, true)

            watch(runList, (newVal) => {
                records.value = newVal.records
                graphData.value = {} // TODO Ebuka this was because the API was broken
            })

            /** Watchers */
            watch(selectedRunName, (newVal) => {
                graphData.value = records.value.find((x) => (x.name = newVal))
            })

            return {
                graphData,
                EmptyScreen,
                isLoading,
            }
        },
    })
</script>
