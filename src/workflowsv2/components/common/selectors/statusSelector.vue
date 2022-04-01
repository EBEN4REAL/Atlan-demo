<template>
    <BaseSelector
        :type="type"
        :value="value"
        :list="runStatuses"
        :show-search="false"
        style="max-width: 130px"
        placeholder="Run status"
        @update:value="$emit('update:value', $event)"
    />
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import { runStatuses } from '~/workflowsv2/constants/filters'
    import BaseSelector from './baseSelector.vue'

    export default defineComponent({
        name: 'WorkflowSelector',
        components: { BaseSelector },
        props: {
            value: { type: String, required: false, default: () => undefined },
            type: {
                type: String as PropType<'default' | 'minimal'>,
                default: () => 'default',
            },
        },
        emits: ['update:value'],
        setup(props, { emit }) {
            return {
                runStatuses,
            }
        },
    })
</script>
