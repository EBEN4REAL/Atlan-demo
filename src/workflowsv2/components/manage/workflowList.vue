<template>
    <div>
        <WorkflowListItem v-for="workflow in workflows" :key="workflow?._id" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import WorkflowListItem from '~/workflowsv2/components/manage/workflowListItem.vue'

    export default defineComponent({
        name: 'WorkflowList',
        components: { WorkflowListItem },
        props: {
            workflows: {
                type: Array,
                default: () => [],
            },
        },
        emits: [],
        setup() {
            return {}
        },
    })
</script>
