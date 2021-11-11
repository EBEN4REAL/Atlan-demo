<template>
    <div
      v-if="!isReady"
      class="absolute flex items-center justify-center w-full h-full"
    >
        <a-spin />
    </div>
    <div v-else class="pb-8">
        <div class="sticky top-0 z-20 flex p-4 bg-white">
            <!-- <a-input-search
                v-model:value="searchText"
                placeholder="Search runs"
                class="mr-1"
                size="default"
                :allow-clear="true"
            ></a-input-search>
            <RunSort @change="handleSortChange" /> -->
        </div>

        <VirtualList
            :class="{ 'animate-pulse': isLoading }"
            :data="list"
            data-key="metadata"
            variable-height
        >
            <template #default="{ item }">
                <RunCard
                    :r="item"
                    :selected-run-name="selectedRunName"
                    :is-loading="isLoadingRunGraph"
                    :select-enabled="true"
                    @select="loadRunGraph($event)"
                />
            </template>
            <template #footer>
                <div
                    v-if="isLoadMore || isLoading"
                    class="flex items-center justify-center"
                >
                    <button
                        :disabled="isLoading"
                        class="flex items-center justify-between py-2 transition-all duration-300 bg-white rounded-full text-primary"
                        :class="isLoading ? 'px-2 w-9' : 'px-5 w-32'"
                        @click="loadMore"
                    >
                        <template v-if="!isLoading">
                            <p
                                class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
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
    // import RunSort from './runSort.vue'

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
        components: {
            RunCard,
            EmptyView,
            VirtualList,
            // RunSort,
        },
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
            const selectedRunName = ref('')
            const searchText = ref('')
            const list = ref([])
            const sort = ref('')
            const isReady = ref(false)

            // getRunList
            const { liveList } = getRunList(item.value.name, true)

            // getArchivedRunList
            const {
                archivedList,
                error,
                isLoading,
                totalCount,
                filter_record,
                loadMore,
            } = getArchivedRunList(item.value.name, true)

            // loadRunGraph
            const loadRunGraph = (runName) => {
                if (selectedRunName.value === runName) return
                selectedRunName.value = runName
                isLoadingRunGraph.value = true
                emit('change', runName)
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
                    if (newX?.items?.length) {
                        const mappedItems = newX.items.map((x) => {
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

                        const orderedItems = mappedItems.sort(
                            (a, b) =>
                                new Date(b.finished_at) -
                                new Date(a.finished_at)
                        )

                        liveRunItems = orderedItems
                    }

                    if (newY?.records?.length) {
                        const orderedRecords = newY.records.sort(
                            (a, b) =>
                                new Date(b.finished_at) -
                                new Date(a.finished_at)
                        )

                        archivedRunItems = orderedRecords
                    }

                    list.value = [...liveRunItems, ...archivedRunItems]

                    if (!selectedRunName.value) {
                        selectedRunName.value = list.value[0]?.name
                    }
                    setTimeout(() => {
                      isReady.value = true
                    }, 300);
                }
            })

            // const handleSortChange = () => {}

            return {
                item,
                searchText,
                list,
                liveList,
                archivedList,
                error,
                isLoading,
                isLoadingRunGraph,
                selectedRunName,
                EmptyScreen,
                isLoadMore,
                totalCount,
                filter_record,
                emit,
                loadRunGraph,
                loadMore,
                isReady
                // handleSortChange,
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
