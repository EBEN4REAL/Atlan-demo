<template>
    <div class="flex flex-col flex-grow h-full overflow-hidden">
        <div class="relative flex-grow overflow-hidden">
            <div
                class="absolute z-10 flex flex-col h-full pt-5 bg-white border-r border-gray-300 rounded gap-y-2"
            >
                <span class="mx-5 font-bold text-new-gray-600">Select Run</span>
                <RunsSelect
                    ref="runSelector"
                    style="min-width: 150px; max-width: 300px"
                    class="mx-5"
                    :model-value="path.name"
                    :workflow-name="workflowName"
                    @update:model-value="handleRunSelect"
                />

                <Sidebar
                    :key="path.name"
                    :selectedRun="selectedRun"
                    :isLoading="isSidebarLoading"
                    :error="error"
                    style="width: 340px"
                />

                <div
                    v-if="!isSidebarLoading && isLoading"
                    class="flex items-center p-2 bg-white border rounded gap-x-1"
                >
                    <AtlanLoader class="h-5" />
                    <span class="text-gray-500 test-sm"
                        >Fetching latest data</span
                    >
                </div>
            </div>

            <MonitorGraph
                :key="path.name"
                :graph-data="selectedRun"
                @refresh="handleRefresh"
            />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, watch, ref, toRefs, computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useIntervalFn, whenever } from '@vueuse/core'

    import RunsSelect from '@/common/select/runs.vue'
    import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'
    import useRunItem from '~/workflows/composables/package/useRunItem'

    import Sidebar from './sidebar.vue'
    import MonitorGraph from './monitorGraph.vue'

    export default defineComponent({
        name: 'WorkflowMonitorTab',
        components: { RunsSelect, MonitorGraph, Sidebar },
        props: {
            workflowName: {
                type: String,
                required: false,
                default: '',
            },
        },
        setup(props) {
            const router = useRouter()
            const route = useRoute()
            const dependentKey = ref()
            const isValidating = ref(false)
            const firstLoad = ref(true)
            const runSelector = ref(undefined)

            const path = computed(() => ({
                name: route.query.name,
            }))

            const { phase, startedAt, finishedAt, duration } = useWorkflowInfo()
            const {
                data: selectedRun,
                mutate,
                isLoading,
                error,
            } = useRunItem(path, false)

            watch(isLoading, () => {
                if (!isLoading.value) firstLoad.value = false
            })

            const handleRunSelect = (newRunId) => {
                firstLoad.value = true
                if (newRunId && route.query.name !== newRunId) {
                    router.replace({
                        query: {
                            name: newRunId,
                        },
                    })
                }
            }
            const isSidebarLoading = computed(
                () =>
                    firstLoad.value ||
                    (phase(selectedRun.value) !== 'Running' && isLoading.value)
            )
            watch(
                path,
                () => {
                    if (path.value.name) mutate()
                },
                { immediate: true }
            )

            const { pause, resume } = useIntervalFn(
                async () => {
                    if (phase(selectedRun.value) === 'Running') mutate()
                    else pause()
                },
                5000,
                { immediate: false }
            )

            watch(
                () => phase(selectedRun.value),
                () => {
                    if (phase(selectedRun.value) === 'Running') resume()
                    else {
                        pause()
                        runSelector.value?.quickChange()
                    }
                },
                {
                    flush: 'post',
                }
            )

            const handleRefresh = () => {
                mutate()
            }

            return {
                handleRunSelect,
                phase,
                startedAt,
                finishedAt,
                duration,
                runSelector,
                selectedRun,
                router,
                isLoading,
                firstLoad,
                error,
                pause,
                resume,
                mutate,
                dependentKey,
                isValidating,
                route,
                handleRefresh,
                path,
                isSidebarLoading,
            }
        },
    })
</script>

<style lang="less" scoped>
    .toolbar-workflow {
        background: white;
        padding: 8px 20px;
        box-shadow: 0px 2px 8px 0px #0000001a;
        border-radius: 4px;
        margin-top: 16px;
        margin-left: 20px;
        z-index: 1;
        // top: 170px;
        // max-width: 500px;
    }
    .dot {
        background: #c4c4c4;
        height: 4px;
        width: 4px;
        border-radius: 50%;
    }
    .wrapper-monitoring {
        height: calc(100% - 400px);
        margin-top: 200px;
    }
</style>
