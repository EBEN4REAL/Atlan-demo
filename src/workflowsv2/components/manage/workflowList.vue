<template>
    <div
        :class="{ 'animate-pulse': loading }"
        class="flex flex-col h-full px-4 pb-4 overflow-y-scroll gap-y-2"
    >
        <WorkflowListItem
            v-for="(workflow, idx) in workflows"
            :key="workflow?.metadata?.uid"
            :selected="selectedId === workflow?.metadata?.uid"
            :workflow="workflow"
            :runs="runs(workflow)"
            :isRunLoading="idx >= runMapLength ? isRunLoading : false"
            minimal
            @click="$emit('update:selectedId', workflow?.metadata?.uid)"
        />
        <div
            v-if="(isLoadMore || loading) && workflows.length > 0"
            class="flex items-center justify-center"
        >
            <button
                :disabled="loading"
                class="flex items-center justify-between px-3 py-2 transition-all duration-300 bg-white rounded-full text-primary"
                :class="loading ? 'px-3 py-2' : ''"
                @click="$emit('loadMore')"
            >
                <template v-if="!loading">
                    <p
                        class="m-0 mr-1 overflow-hidden text-sm transition-all duration-300 overflow-ellipsis whitespace-nowrap"
                    >
                        Load more
                    </p>
                    <AtlanIcon icon="ArrowDown" />
                </template>
                <AtlanLoader v-else class="w-6 h-6" />
            </button>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject, toRefs, ref, Ref, computed } from 'vue'
    import WorkflowListItem from '~/workflowsv2/components/manage/workflowListItem.vue'

    import { useWorkflowStore } from '~/workflowsv2/store'

    export default defineComponent({
        name: 'WorkflowList',
        components: { WorkflowListItem },
        props: {
            workflows: {
                type: Array,
                default: () => [],
            },
            lastRunsMap: {
                type: Object,
                default: () => {},
            },
            selectedId: {
                type: String,
                default: () => '',
            },
            loading: {
                type: Boolean,
                default: () => false,
            },
            isLoadMore: {
                type: Boolean,
                default: () => false,
            },
        },
        emits: ['loadMore', 'update:selectedId'],
        setup(props) {
            const { lastRunsMap } = toRefs(props)
            const workflowStore = useWorkflowStore()
            const isRunLoading = inject<Ref<boolean>>(
                'isRunLoading',
                ref(false)
            )

            const init = async () => {
                await workflowStore.fetchActivePackages()
                workflowStore.fetchActivePackageMeta()
            }

            init()

            const runs = (workflow) =>
                lastRunsMap.value?.[workflow?.metadata?.name]

            const runMapLength = computed(
                () => Object.keys(lastRunsMap.value).length
            )

            return { runs, isRunLoading, runMapLength }
        },
    })
</script>
