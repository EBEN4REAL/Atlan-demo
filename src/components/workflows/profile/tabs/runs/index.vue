<template>
    <div class="flex flex-col flex-grow h-full overflow-hidden">
        <div class="relative flex-grow overflow-hidden bg-primary-light">
            <MonitorGraph
                :graph-data="selectedRun"
                class=""
                @refresh="handleRefresh"
                @select="handleSelectPod"
            />
            <div class="absolute rounded right-10 top-10">
                <div class="flex flex-col">
                    <RunsSelect
                        v-model="selectedRunName"
                        :workflowName="workflowName"
                        style="min-width: 150px"
                    ></RunsSelect>
                    <Sidebar
                        :selected-run="selectedRun"
                        :selected-pod="selectedPod"
                        class="mt-3"
                        style="width: 300px"
                    ></Sidebar>
                </div>
            </div>
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
            const { workflowName } = toRefs(props)
            const selectedRunName = ref('')

            const path = ref({
                name: selectedRunName.value,
            })

            const { item: selectedRun, mutate } = useRunItem(path)

            const { phase, startedAt, finishedAt, duration } = useWorkflowInfo()

            watch(selectedRunName, (newVal) => {
                if (newVal) {
                    path.value = {
                        name: selectedRunName.value,
                    }
                    mutate()
                }
            })

            const selectedPod = ref({})
            const handleSelectPod = (pod) => {
                console.log(pod)
                selectedPod.value = pod
            }

            const handleRefresh = () => {
                mutate()
            }

            return {
                selectedRunName,
                workflowName,
                selectedRun,
                handleRefresh,
                handleSelectPod,
                selectedPod,
                phase,
                startedAt,
                finishedAt,
                duration,
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
