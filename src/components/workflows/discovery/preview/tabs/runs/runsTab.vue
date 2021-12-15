<template>
    <div
        v-if="isLoading"
        class="flex items-center justify-center text-sm leading-none"
    >
        <AtlanIcon icon="Loader" class="h-5 mr-2 animate-spin" />
        <span>Getting Runs</span>
    </div>
    <div v-else-if="list.length" v-auth="access.LIST_RUNS">
        <VirtualList
            :class="{ 'animate-pulse': isLoading }"
            :data="list"
            data-key="metadata"
            variable-height
        >
            <template #default="{ item }">
                <RunCard
                    :r="item"
                    :select-enabled="true"
                    @select="handleClickRunCard($event)"
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
    </div>
    <EmptyView
        v-else
        :desc="
            !error
                ? 'There are no runs for this workflow. '
                : 'Sorry, we couldn’t find the workflow you were looking for.'
        "
        empty-screen="WFEmptyTab"
        desc-class="w-56 text-center"
        button-icon="ArrowRight"
        :button-text="error ? '' : 'Open Profile'"
        @event="() => $router.push(`/workflows/${selectedWorkflow.name}/setup`)"
    />
</template>

<script lang="ts">
    // Vue
    import { watch, defineComponent, PropType, toRefs, ref } from 'vue'
    import { useRouter } from 'vue-router'

    // Components
    import EmptyView from '@common/empty/index.vue'
    import RunCard from '@/workflows/shared/runCard.vue'

    // Assets

    // Types

    // Composables
    import access from '~/constant/accessControl/map'
    import useRunList from '~/composables/workflow/useRunList'
    import VirtualList from '~/utils/library/virtualList/virtualList.vue'

    export default defineComponent({
        components: { RunCard, EmptyView, VirtualList },
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
            const router = useRouter()
            const { selectedWorkflow: item } = toRefs(props)
            const searchText = ref('')

            const { list, error, isLoading, isLoadMore, loadMore, execute } =
                useRunList(item.value.metadata.name)

            watch(
                () => item.value.metadata.name,
                (v) => {
                    execute(v)
                }
            )

            const handleClickRunCard = (n) => {
                const { name } = item.value.metadata
                router.push(`/workflows/${name}/monitor?idmonitoring=${n}`)
            }

            return {
                access,
                searchText,
                list,
                error,
                isLoading,
                emit,
                isLoadMore,
                loadMore,
                handleClickRunCard,
            }
        },
    })
</script>