<template>
    <div class="relative w-full h-full">
        <div class="absolute flex items-center justify-center w-full h-full">
            <a-spin />
        </div>
        <div class="absolute w-full h-full">
            <SetupGraph
                v-if="tasks"
                :graph-data="tasks"
                @change="emit('change', $event, 'dag')"
            />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, ref, watch } from 'vue'
    import { useRoute } from 'vue-router'

    // Components
    import SetupGraph from './setupGraph.vue'

    // Composables
    import { useWorkflowTemplateByName } from '~/composables/workflow/useWorkFlowList'

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: { SetupGraph },
        emits: ['change'],
        setup(_, { emit }) {
            const route = useRoute()
            const tasks = ref([])

            /** DATA */
            const id = computed(() => route?.params?.id || '')

            const { data } = useWorkflowTemplateByName(id.value)

            watch(data, (newVal) => {
                tasks.value =
                    newVal.workflowtemplate.spec.templates[0].dag.tasks
            })

            return {
                id,
                data,
                tasks,
                emit,
            }
        },
    })
</script>
