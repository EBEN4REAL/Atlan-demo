<template>
    <div
        v-if="selectedPod.id"
        class="absolute flex items-center gap-4 toolbar-workflow"
    >
        <AtlanIcon icon="Shield" class="text-pink-400" />
        <div class="w-80">
            <p class="text-base font-bold">
                {{ selectedPod?.displayName }}
            </p>
            <p class="text-sm truncate ...">
                {{ selectedPod.id }}
            </p>
            <div class="flex items-center gap-1 mt-1">
                <p>{{ selectedPod.timecalc }}</p>
                <div class="dot" />
                <p class="ml-2">
                    {{ podFinishedAt(selectedPod.finishedAt) }}
                </p>
            </div>
        </div>
        <a-button
            v-if="selectedPod.type == 'Pod'"
            class="flex items-center gap-2"
            type="link"
            @click="openLog"
        >
            View logs
            <AtlanIcon icon="ArrowRight" />
        </a-button>
    </div>
    <div class="relative w-full h-full">
        <div
            v-if="loadingGeneral"
            class="absolute flex items-center justify-center w-full h-full"
        >
            <AtlanIcon icon="Loader" class="h-5 animate-spin" />
        </div>
        <div
            v-else-if="!isLoading && !graphData?.name"
            class="wrapper-monitoring"
        >
            <EmptyView
                empty-screen="WFEmptyTab"
                class="-mt-20"
                headline="No Runs to Display"
                desc="There are no runs for this workflow."
                button-text="Back to Workflows"
                @event="$router.push('/workflows')"
            />
        </div>
        <div v-else-if="graphData?.name" class="absolute w-full h-full">
            <MonitorGraph
                :selected-pod="selectedPod"
                :graph-data="graphData"
                @change="handleClickNode"
                @refresh="handleRefresh"
            />
        </div>
        <EmptyView
            v-else
            empty-screen="WFEmptyTab"
            class="-mt-20"
            desc="Don't worry, something broke on our end, you can send this info to us."
        />
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, watch, ref, toRefs } from 'vue'
    import { useRoute } from 'vue-router'

    // Components
    import EmptyView from '@common/empty/index.vue'
    // import { nodeViewProps } from '@tiptap/vue-3'
    import MonitorGraph from './monitorGraph.vue'

    // Composables
    import {
        getRunList,
        getArchivedRunList,
    } from '~/composables/workflow/useWorkflowList'

    // import WorkflowMixin from '~/mixins/workflow'
    import useWorkFlowHelper from '~/composables/workflow/useWorkFlowHelper'
    import useRunList from '~/composables/workflow/useRunList'

    export default defineComponent({
        name: 'WorkflowMonitorTab',
        components: { MonitorGraph, EmptyView },
        // mixins: [WorkflowMixin],
        props: {
            selectedRunName: {
                type: String,
                required: false,
                default: '',
            },
            selectedPod: {
                type: Object,
                required: true,
            },
            activeKey: {
                type: Number,
                required: true,
            },
        },
        emits: ['setSelectedGraph', 'setSelectedPod', 'openLog'],
        setup(props, { emit }) {
            const route = useRoute()

            /** DATA */
            const { selectedRunName, selectedPod } = toRefs(props)
            const records = ref([])
            const graphData = ref({})
            const id = computed(() => route?.params?.id || '')
            const loadingGeneral = ref(true)

            /** METHODS */
            const {
                list,
                liveList,
                archivedList,
                error,
                isLoading,
                isLoadMore,
                loadMore,
                isReady,
                execute,
            } = useRunList(id.value)

            // watcher
            watch([liveList, archivedList], ([newX, newY]) => {
                if (newX && newY) {
                    if (!selectedRunName.value) {
                        const idMonitoring = route.query.idmonitoring
                        graphData.value =
                            list.value.find((el) => el.uid === idMonitoring) ||
                            list.value[0]
                        emit('setSelectedGraph', graphData.value)
                    }
                    loadingGeneral.value = false
                }
            })

            /** Watchers */
            watch(selectedRunName, (newVal) => {
                graphData.value = records.value.find((x) => x.name === newVal)
                emit('setSelectedGraph', graphData.value)
            })
            const openLog = () => {
                emit('openLog')
            }
            const handleClickNode = (node, type, clickedPod) => {
                emit('setSelectedPod', clickedPod)
            }
            const handleRefresh = () => {
                execute(id.value)
            }
            return {
                graphData,
                isLoading,
                list,
                openLog,
                handleClickNode,
                loadingGeneral,
                handleRefresh,
                ...useWorkFlowHelper(),
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
