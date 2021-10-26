<template>
    <div class="relative w-full h-full">
        <div
            v-if="isLoading"
            class="absolute flex items-center justify-center w-full h-full"
        >
            <a-spin />
        </div>

        <EmptyView
            v-else-if="!isLoading && !tasks?.length"
            :EmptyScreen="EmptyScreen"
            class="-mt-20"
        />

        <div v-else-if="tasks" class="absolute w-full h-full">
            <SetupGraph
                :graph-data="tasks"
                @change="emit('change', $event, 'dag')"
            />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, ref, watch, toRefs } from 'vue'

    // Components
    import SetupGraph from './setupGraph.vue'
    import EmptyView from '@common/empty/index.vue'
    import EmptyScreen from '~/assets/images/workflows/empty_tab.png'

    // Composables
    import { useWorkflowTemplateByName } from '~/composables/workflow/useWorkFlowList'

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: { SetupGraph, EmptyView },
        props: {
            workflowTemplate: {
                type: String,
                required: true,
            },
        },
        emits: ['change'],
        setup(props, { emit }) {
            const tasks = ref([])
            const { workflowTemplate } = toRefs(props)

            /** DATA */
            const { data, isLoading } = useWorkflowTemplateByName(
                workflowTemplate.value
            )

            watch(data, (newVal) => {
                tasks.value =
                    newVal.records[0].workflowtemplate.spec.templates[0].dag.tasks
            })

            return {
                isLoading,
                EmptyScreen,
                data,
                tasks,
                emit,
            }
        },
    })
</script>
