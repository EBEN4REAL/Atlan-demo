<template>
    <div class="relative w-full h-full">
        <div
            v-if="isLoading"
            class="absolute flex items-center justify-center w-full h-full"
        >
            <a-spin />
        </div>

        <EmptyView
            v-else-if="!tasks?.length"
            :EmptyScreen="EmptyScreen"
            class="-mt-20"
        />

        <div v-else class="absolute w-full h-full">
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
    import EmptyView from '@common/empty/index.vue'
    import EmptyScreen from '~/assets/images/workflows/empty_tab.png'

    // Composables
    import { useWorkflowTemplateByName } from '~/composables/workflow/useWorkFlowList'

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: { SetupGraph, EmptyView },
        emits: ['change'],
        setup(_, { emit }) {
            const route = useRoute()
            const tasks = ref([])

            /** DATA */
            const id = computed(() => route?.params?.id || '')

            const { data, isLoading } = useWorkflowTemplateByName(id.value)

            watch(data, (newVal) => {
                tasks.value =
                    newVal?.workflowtemplate?.spec?.templates[0]?.dag?.tasks
            })

            return {
                isLoading,
                EmptyScreen,
                id,
                data,
                tasks,
                emit,
            }
        },
    })
</script>
