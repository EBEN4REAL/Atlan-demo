<template>
    <div class="pb-8">
        <div class="sticky top-0 z-20 flex p-4 bg-white">
            <a-input-search
                v-model:value="searchText"
                placeholder="Search runs"
                class="mr-1"
                size="default"
                :allow-clear="true"
            ></a-input-search>
            <RunSort @change="handleSortChange" />
        </div>
        <!-- <div
        v-if="isLoading"
        class="flex items-center justify-center h-full text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting Runs</span>
    </div> -->
        <!-- <template v-else-if="list.length">
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
    </template> -->

        <VirtualList
            :class="{ 'animate-pulse': isLoading }"
            :data="list"
            data-key="metadata"
            variable-height
        >
            <template #default="{ item }">
                <RunCard
                    :r="item"
                    :curr-run-name="currRunName"
                    :is-loading="isLoadingRunGraph"
                    :select-enabled="true"
                    @select="loadRunGraph"
                />
            </template>
            <template #footer>
                <div
                    v-if="isLoadMore || isLoading"
                    class="flex items-center justify-center"
                >
                    <button
                        :disabled="isLoading"
                        class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full  text-primary"
                        :class="isLoading ? 'px-2 w-9' : 'px-5 w-32'"
                        @click="loadMore"
                    >
                        <template v-if="!isLoading">
                            <p
                                class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300  overflow-ellipsis whitespace-nowrap"
                            >
                                Load more
                            </p>
                            <AtlanIcon icon="ArrowDown" />
                        </template>
                        <svg
                            v-else
                            class="w-5 h-5 text-primary animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    </button>
                </div>
            </template>
        </VirtualList>

        <EmptyView
            v-if="list.length === 0 && !isLoading"
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
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        watch,
        defineComponent,
        PropType,
        toRefs,
        ref,
        computed,
    } from 'vue'

    // Components
    import EmptyView from '@common/empty/index.vue'
    import RunCard from '@/workflows/shared/runCard.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    import RunSort from './runSort.vue'

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
        components: { RunCard, EmptyView, VirtualList, RunSort },
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
            const { selectedWorkflow: item } = toRefs(props)
            const isLoadingRunGraph = ref(false)
            const currRunName = ref('')
            const searchText = ref('')
            const list = ref([])
            const sort = ref('')

            // getRunList
            const labelSelector = `workflows.argoproj.io/workflow-template=${item.value.name},workflows.argoproj.io/phase=Running`
            const { liveList } = getRunList(labelSelector, true)

            // getArchivedRunList
            const filter = ref({
                labels: {
                    $elemMatch: {
                        'workflows.argoproj.io/workflow-template': `${item.value.name}`,
                    },
                },
            })

            const {
                archivedList,
                error,
                isLoading,
                loadMore,
                totalCount,
                filter_record,
            } = getArchivedRunList(JSON.stringify(filter.value), true)

            // loadRunGraph
            const loadRunGraph = () => {
                if (currRunName.value === item.value.name) return
                currRunName.value = item.value.name
                isLoadingRunGraph.value = true
                emit('change', item.value.name)
                setTimeout(() => {
                    isLoadingRunGraph.value = false
                }, 2500)
            }

            const isLoadMore = computed(
                () => filter_record.value > list.value.length
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
                    currRunName.value = list.value[0]?.name
                }
            })

            const handleSortChange = () => {}

            return {
                item,
                searchText,
                list,
                liveList,
                archivedList,
                error,
                isLoading,
                emit,
                loadRunGraph,
                isLoadingRunGraph,
                currRunName,
                EmptyScreen,
                isLoadMore,
                loadMore,
                totalCount,
                filter_record,
                handleSortChange,
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
