<template>
    <div
        v-if="!isReady"
        class="absolute flex items-center justify-center w-full h-full"
    >
        <AtlanIcon icon="Loader" class="h-5 animate-spin" />
    </div>
    <template v-else>
        <div v-if="list.length === 0 && !isLoading" class="flex-grow">
            <EmptyView
                :desc="
                    !error
                        ? 'There are no runs for this workflow. '
                        : 'Sorry, we couldn’t find the workflow you were looking for.'
                "
                empty-screen="NoWf"
                desc-class="w-56 text-center"
                button-icon="ArrowRight"
            />
        </div>
        <VirtualList
            v-else
            v-auth="access.LIST_RUNS"
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
                        <AtlanIcon
                            v-else
                            icon="Loader"
                            class="h-5 animate-spin"
                        />
                    </button>
                </div>
            </template>
        </VirtualList>
    </template>
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
    import { useRoute, useRouter } from 'vue-router'
    import RunCard from '@/workflows/shared/runCard.vue'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'
    // import RunSort from './runSort.vue'

    // Types
    import access from '~/constant/accessControl/map'
    import useRunList from '~/composables/workflow/useRunList'

    export default defineComponent({
        components: {
            RunCard,
            EmptyView,
            VirtualList,
            // RunSort,
        },
        props: {
            selectedWorkflow: {
                type: Object,
                required: true,
            },
            isLoaded: {
                type: Boolean,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const route = useRoute()
            const router = useRouter()
            const { selectedWorkflow: item } = toRefs(props)
            const isLoadingRunGraph = ref(false)
            const selectedRunName = ref('')
            const searchText = ref('')

            const {
                list,
                liveList,
                archivedList,
                error,
                isLoading,
                isLoadMore,
                loadMore,
                isReady,
            } = useRunList(item.value.metadata.name)

            // loadRunGraph
            const loadRunGraph = (runName) => {
                if (selectedRunName.value === runName) return
                router.replace(route.path)
                selectedRunName.value = runName
                isLoadingRunGraph.value = true
                emit('change', runName)
                setTimeout(() => {
                    isLoadingRunGraph.value = false
                }, 2500)
            }

            watch([liveList, archivedList], ([newX, newY]) => {
                if (!selectedRunName.value) {
                    const idMonitoring = route.query.idmonitoring
                    const defaultRunName =
                        list.value.find((el) => el.uid === idMonitoring) ||
                        list.value[0]
                    selectedRunName.value = defaultRunName?.name
                }
            })
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
                isLoadMore,
                emit,
                loadRunGraph,
                loadMore,
                isReady,
                access,
                // handleSortChange,
            }
        },
    })
</script>
