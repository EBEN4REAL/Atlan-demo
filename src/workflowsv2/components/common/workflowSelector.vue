<template>
    <BaseSelector
        v-model:value="workflowName"
        :list="workflowList"
        placeholder="Select workflow"
        not-found-content="No workflow found"
    />
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import BaseSelector from './baseSelector.vue'

    export default defineComponent({
        name: 'WorkflowSelector',
        components: { BaseSelector },
        props: {},
        emits: [],
        setup() {
            const workflowName = ref(undefined)
            const workflowList = [
                {
                    id: '8434328049',
                    label: 'Workflow 1',
                },
                {
                    id: '340394790',
                    label: 'Workflow 2',
                },
                {
                    id: '342959390',
                    label: 'Workflow 3',
                },
            ]
            return { workflowName, workflowList }
        },
    })
</script>
