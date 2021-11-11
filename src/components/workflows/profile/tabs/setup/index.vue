<template>
    <div class="relative w-full h-full">
        <div
            v-if="isLoading"
            class="absolute flex items-center justify-center w-full h-full"
        >
            <AtlanIcon icon="CircleLoader" class="h-5 animate-spin" />
        </div>

        <EmptyView
            v-else-if="!isLoading && !tasks?.length"
            :empty-screen="EmptyScreen"
            class="-mt-20"
        />

        <div v-else-if="tasks" class="absolute w-full h-full">
            <SetupGraph
                ref="graphRef"
                :is-allowto-run="isAllowtoRun"
                :graph-data="tasks"
                :workflow="workflow"
                @change="emit('change', $event, 'dag')"
            />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, inject, ref, watch, toRefs, computed } from 'vue'

    // Components
    import EmptyView from '@common/empty/index.vue'
    import SetupGraph from './setupGraph.vue'
    import EmptyScreen from '~/assets/images/workflows/empty_tab.png'

    // Composables
    import { useWorkflowTemplateByName } from '~/composables/workflow/useWorkFlowList'

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: { SetupGraph, EmptyView },
        props: {
            workflow: {
                type: String,
                required: true,
            },
            workflowTemplate: {
                type: String,
                required: true,
            },
            formConfig: {
                type: Object,
                required: true,
            },
            data: {
                type: Object,
                required: true,
            },
        },
        emits: ['change', 'openLog'],
        setup(props, { emit }) {
            const graphRef = inject('graphRef')
            const tasks = ref([])
            const {
                workflowTemplate,
                formConfig,
                data: dataProp,
            } = toRefs(props)

            /** DATA */
            const { data, isLoading } = useWorkflowTemplateByName(
                workflowTemplate.value
            )
            watch(isLoading, (newVal) => {
                emit('setLoadingFetchPod', newVal)
            })

            const isAllowtoRun = computed(() => {
                let allow = true
                const data = formConfig.value
                for (const prop in data) {
                    const pod = data[prop]
                    pod.forEach((el) => {
                        if (el.type !== 'template') {
                            el.rules?.forEach((elc) => {
                                if (elc.type === 'required') {
                                    const defaultValue =
                                        dataProp.value?.asset?.workflowtemplate
                                            ?.spec?.templates[0]?.dag?.tasks[0]
                                            ?.arguments?.parameters
                                    const finded = defaultValue.find(
                                        (d) => d.name === el.id
                                    )
                                    if (!finded?.value) {
                                        allow = false
                                    }
                                }
                            })
                        }
                    })
                }
                return allow
            })

            watch(data, (newVal) => {
                tasks.value =
                    newVal.workflowtemplate.spec.templates[0].dag.tasks
            })

            return {
                isLoading,
                EmptyScreen,
                data,
                tasks,
                emit,
                graphRef,
                isAllowtoRun,
            }
        },
    })
</script>
