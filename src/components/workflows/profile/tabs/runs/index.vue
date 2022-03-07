<template>
    <div class="flex flex-col flex-grow h-full overflow-hidden">
        <div class="relative flex-grow overflow-hidden bg-primary-light">
            <div class="absolute z-10 rounded left-10 top-10">
                <div class="flex flex-col gap-y-3">
                    <RunsSelect
                        ref="runSelector"
                        class="shadow"
                        style="min-width: 150px"
                        :model-value="path.name"
                        :workflow-name="workflowName"
                        @update:model-value="handleRunSelect"
                    />

                    <Sidebar
                        :key="path.name"
                        :selectedRun="selectedRun"
                        :isLoading="firstLoad"
                        :error="error"
                        style="width: 300px"
                    />

                    <div
                        v-if="!firstLoad && isLoading"
                        class="flex items-center p-2 bg-white border rounded gap-x-1"
                    >
                        <AtlanLoader class="h-5" />
                        <span class="text-gray-500 test-sm"
                            >Fetching latest data</span
                        >
                    </div>
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
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import useRunItem from '~/composables/package/useRunItem'

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

            const unWatchLoad = watch(isLoading, () => {
                if (!isLoading.value) {
                    firstLoad.value = false
                    unWatchLoad()
                }
            })

            const handleRunSelect = (newRunId) => {
                if (newRunId && route.query.name !== newRunId) {
                    router.replace({
                        query: {
                            name: newRunId,
                        },
                    })
                }
            }

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
