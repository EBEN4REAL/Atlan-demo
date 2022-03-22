<template>
    <div class="flex flex-col h-full px-4 overflow-y-scroll gap-y-2">
        <WorkflowListItem
            v-for="workflow in workflows"
            :key="workflow?._id"
            :workflow="workflow"
            :runs="runs(workflow)"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
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
        },
        emits: [],
        setup(props) {
            const { lastRunsMap } = toRefs(props)
            const workflowStore = useWorkflowStore()

            const init = async () => {
                await workflowStore.fetchActivePackages()
                workflowStore.fetchActivePackageMeta()
            }
            init()

            const runs = (workflow) =>
                lastRunsMap.value?.[workflow?.metadata?.name]

            return { runs }
        },
    })
</script>
