<template>
    <div class="flex flex-col flex-grow h-full overflow-hidden">
        <div class="relative flex-grow overflow-hidden bg-primary-light">
            <div class="absolute z-10 rounded left-10 top-10">
                <div class="flex flex-col">
                    <RunsSelect
                        ref="runSelector"
                        class="mb-3 shadow"
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
                </div>
            </div>
            <AtlanLoader
                v-if="isValidating"
                class="absolute z-50 h-8 left-10 bottom-10"
            />

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
                async () => {
                    if (path.value.name) {
                        isValidating.value = true
                        await mutate()
                        isValidating.value = false
                    }
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

            whenever(selectedRun, () => {
                if (phase(selectedRun.value) === 'Running') resume()
                else {
                    pause()
                    runSelector.value?.quickChange()
                }
            })

            const handleRefresh = async () => {
                isValidating.value = true
                await mutate()
                isValidating.value = false
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
