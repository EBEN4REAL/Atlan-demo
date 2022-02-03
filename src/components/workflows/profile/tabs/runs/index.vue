<template>
    <div class="flex flex-col flex-grow h-full overflow-hidden">
        <div class="relative flex-grow overflow-hidden bg-primary-light">
            <div class="absolute z-10 rounded left-10 top-10">
                <div class="flex flex-col">
                    <div class="flex items-center">
                        <RunsSelect
                            v-model="selectedRunName"
                            :workflowName="workflowName"
                            style="min-width: 150px"
                            class="mb-3 shadow"
                        ></RunsSelect>
                        <a-spin
                            size="small"
                            v-if="isValidating"
                            class="ml-2"
                        ></a-spin>
                    </div>
                    <Sidebar
                        :selectedRun="selectedRun"
                        :isLoading="isLoading"
                        :error="error"
                        style="width: 300px"
                    ></Sidebar>
                </div>
            </div>

            <MonitorGraph
                ref="monitorGraphRef"
                :graph-data="selectedRun"
                class=""
                @select="handleSelectPod"
                :isLoading="isLoading"
                :error="error"
            />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, watch, ref, toRefs } from 'vue'

    // import { nodeViewProps } from '@tiptap/vue-3'

    // import WorkflowMixin from '~/mixins/workflow'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    import RunsSelect from '@/common/select/runs.vue'

    import useRunItem from '~/composables/package/useRunItem'
    import Sidebar from './sidebar.vue'

    import MonitorGraph from './monitorGraph.vue'
    import { useRouter } from 'vue-router'
    import { useIntervalFn } from '@vueuse/core'

    export default defineComponent({
        name: 'WorkflowMonitorTab',
        components: { RunsSelect, MonitorGraph, Sidebar },
        // mixins: [WorkflowMixin],
        props: {
            workflowName: {
                type: String,
                required: false,
                default: '',
            },
            workflowObject: {
                type: Object,
                required: false,
                default: () => {},
            },
            runId: {
                type: String,
                required: false,
                default: '',
            },
            // selectedPod: {
            //     type: Object,
            //     required: true,
            // },
            // activeKey: {
            //     type: Number,
            //     required: true,
            // },
        },
        setup(props, { emit }) {
            const { workflowName, runId } = toRefs(props)
            const selectedRunName = ref(runId.value)

            const router = useRouter()

            const monitorGraphRef = ref(null)

            const { phase, startedAt, finishedAt, duration } = useWorkflowInfo()

            const dependentKey = ref()
            const path = ref({
                name: selectedRunName.value,
            })

            const isValidating = ref(false)

            const {
                data: selectedRun,
                mutate,
                isLoading,

                error,
            } = useRunItem(path, false)

            watch(
                selectedRunName,
                async () => {
                    if (selectedRunName.value) {
                        path.value = {
                            name: selectedRunName.value,
                        }

                        // router.push({
                        //     query: {
                        //         name: selectedRunName.value,
                        //     },
                        // })
                        isValidating.value = true
                        await mutate()
                        monitorGraphRef.value?.initialize(false, selectedRun)
                        isValidating.value = false
                    }
                },
                { immediate: true }
            )

            const { pause, resume } = useIntervalFn(
                async () => {
                    if (phase(selectedRun.value) === 'Running') {
                        await mutate()
                        console.log(selectedRun.value)
                        monitorGraphRef.value?.initialize(false, selectedRun)
                    } else {
                        pause()
                    }
                },
                5000,
                { immediate: false }
            )

            watch(selectedRun, () => {
                if (selectedRun.value) {
                    if (phase(selectedRun.value) === 'Running') {
                        resume()
                    } else {
                        pause()
                    }
                }
            })

            const selectedPod = ref({})
            const handleSelectPod = (pod) => {
                selectedPod.value = pod
            }

            return {
                selectedRunName,
                workflowName,

                handleSelectPod,
                selectedPod,
                phase,
                startedAt,
                finishedAt,
                duration,
                selectedRun,
                router,
                isLoading,
                error,
                pause,
                resume,
                mutate,
                dependentKey,
                isValidating,

                monitorGraphRef,
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
