<template>
    <div
        v-if="isLoading"
        class="flex items-center justify-center h-full text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting Runs</span>
    </div>
    <template v-else-if="list.length">
        <div class="flex px-4 mt-4 mb-4">
            <a-input-search
                v-model:value="searchText"
                placeholder="Search Members"
                class="mr-1"
                size="default"
                :allow-clear="true"
            ></a-input-search>
            <a-button class="p-2 ml-2 rounded">
                <AtlanIcon icon="FilterDot" class="h-4" />
            </a-button>
        </div>
        <RunCard
            v-for="(r, x) in searchText ? filterList(searchText) : list"
            :key="x"
            :r="r"
            :curr-run-name="currRunName"
            :is-loading="isLoadingRunGraph"
            :select-enabled="true"
            @select="loadRunGraph"
        />
    </template>
    <EmptyView
        v-else
        :desc="
            !error
                ? 'There are no runs for this workflow. '
                : 'Sorry, we couldn’t find the workflow you were looking for.'
        "
        :empty-screen="EmptyScreen"
        desc-class="w-56 text-center"
        button-icon="ArrowRight"
        :button-text="error ? '' : 'Run Workflow'"
    />
</template>

<script lang="ts">
    // Vue
    import { watch, defineComponent, PropType, toRefs, ref } from 'vue'

    // Components
    import EmptyView from '@common/empty/index.vue'
    import RunCard from '@/workflows/shared/runCard.vue'

    // Assets
    import EmptyScreen from '~/assets/images/workflows/empty_tab.png'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    // Composables
    import {
        getRunList,
        getArchivedRunList,
    } from '~/composables/workflow/useWorkFlowList'

    export default defineComponent({
        components: { RunCard, EmptyView },
        props: {
            selectedWorkflow: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            isLoaded: {
                type: Boolean,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const { selectedWorkflow } = toRefs(props)
            const isLoadingRunGraph = ref(false)
            const currRunName = ref('')
            const searchText = ref('')
            const list = ref([])

            // getRunList
            const labelSelector = `workflows.argoproj.io/workflow-template=${selectedWorkflow.value.name},workflows.argoproj.io/phase=Running`
            const { liveList } = getRunList(labelSelector, true)

            // getArchivedRunList
            const filter = {
                labels: {
                    $elemMatch: {
                        'workflows.argoproj.io/workflow-template': `${selectedWorkflow.value.name}`,
                    },
                },
            }
            const { archivedList, error, isLoading, reFetch, filterList } =
                getArchivedRunList(JSON.stringify(filter), true)

            // loadRunGraph
            const loadRunGraph = () => {
                if (currRunName.value === selectedWorkflow.value.name) return
                currRunName.value = selectedWorkflow.value.name
                isLoadingRunGraph.value = true
                emit('change', selectedWorkflow.value.name)
                setTimeout(() => {
                    isLoadingRunGraph.value = false
                }, 2500)
            }

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
                    currRunName.value = list.value[0]?.name
                }
            })

            return {
                searchText,
                list,
                filterList,
                liveList,
                archivedList,
                error,
                isLoading,
                emit,
                loadRunGraph,
                isLoadingRunGraph,
                currRunName,
                EmptyScreen,
            }
        },
    })
</script>

<style lang="less" scoped>
    .ant-timeline-item {
        margin-bottom: 0 !important;
        padding-bottom: 40px !important;
    }
    .ant-timeline-item-dot {
        width: 13px;
        height: 13px;
        border-radius: 50%;
    }

    .name-time-separator {
        height: 5px;
        width: 5px;
        background-color: #c4c4c4;
        border-radius: 50%;
    }

    :global(.ant-timeline-item-content) {
        margin-left: 22px;
    }
    :global(.ant-timeline-item-head-custom) {
        padding: 0 !important;
    }
</style>
