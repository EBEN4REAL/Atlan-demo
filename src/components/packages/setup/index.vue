<template>
    <div class="flex w-full h-full">
        <div class="flex flex-1 border-r border-gray-200">
            <div class="flex flex-col w-full h-full">
                <a-steps
                    v-if="steps.length > 0"
                    v-model:current="currentStep"
                    class="px-6 py-3 border-b border-gray-200"
                >
                    <template v-for="step in steps" :key="step.id">
                        <a-step>
                            <!-- <span slot="title">Finished</span> -->
                            <template #title>{{ step.title }}</template>
                        </a-step>
                    </template>
                </a-steps>

                <div
                    class="flex-1 p-8 overflow-y-auto bg-white"
                    v-if="workflowTemplate"
                >
                    <DynamicForm
                        :key="`form_${currentStep}`"
                        ref="stepForm"
                        :config="configMapDerived"
                        :currentStep="currentStepConfig"
                        :workflowTemplate="workflowTemplate"
                        v-model="modelValue"
                        labelAlign="left"
                    ></DynamicForm>
                </div>
                <div class="flex justify-end p-3 border-t">
                    <a-button type="primary" @click="handleNext">Next</a-button>
                </div>
            </div>
        </div>
        <div class="flex flex-col w-1/3">
            <div
                class="flex flex-col w-full px-6 py-3 mb-3"
                v-if="workflowTemplate"
            >
                <div
                    class="flex items-center mb-1"
                    v-if="
                        workflowTemplate?.workflowtemplate.metadata.annotations
                    "
                >
                    <img
                        v-if="
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations['com.atlan.orchestration/icon']
                        "
                        class="self-center w-5 h-auto mr-2"
                        :src="
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations['com.atlan.orchestration/icon']
                        "
                    />
                    <div class="text-base font-bold truncate overflow-ellipsis">
                        {{
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations['workflows.argoproj.io/name']
                        }}
                    </div>
                </div>

                <div class="text-sm line-clamp-4">
                    <span
                        v-if="
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations
                        "
                    >
                        {{
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations[
                                'workflows.argoproj.io/description'
                            ]
                        }}</span
                    >
                </div>
                <div
                    class="flex mt-1 text-gray-500"
                    v-if="
                        workflowTemplate?.workflowtemplate.metadata.annotations
                    "
                >
                    <div class="text-sm truncate overflow-ellipsis">
                        {{
                            workflowTemplate?.workflowtemplate.metadata
                                .annotations[
                                'com.atlan.orchestration/packageName'
                            ]
                        }}
                    </div>
                    <div class="text-sm truncate overflow-ellipsis">
                        (v{{
                            workflowTemplate?.labels[
                                'org.argopm.package.version'
                            ]
                        }})
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        inject,
        ref,
        watch,
        toRefs,
        computed,
        onBeforeMount,
        provide,
    } from 'vue'
    import { message } from 'ant-design-vue'
    // Components
    import EmptyView from '@common/empty/index.vue'
    import SetupGraph from './setupGraph.vue'
    import DynamicForm from '@/common/dynamicForm2/index.vue'
    // Composables

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: { SetupGraph, EmptyView, DynamicForm },
        props: {
            workflowTemplate: {
                type: Object,
                required: false,
            },
            configMap: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['change', 'openLog', 'handleSetLogo'],
        setup(props, { emit }) {
            // const graphRef = inject('graphRef')

            const stepForm = ref()

            const currentStep = ref(0)
            const { workflowTemplate, configMap } = toRefs(props)

            provide('workflowTemplate', workflowTemplate)

            const tasks = computed(() => {
                if (workflowTemplate.value?.workflowtemplate) {
                    const { entrypoint } =
                        workflowTemplate.value?.workflowtemplate.spec
                    return workflowTemplate.value?.workflowtemplate.spec.templates.find(
                        (t) => t.name === entrypoint
                    ).dag.tasks
                }
                return []
            })

            const modelValue = ref({})

            const steps = computed(() => configMapDerived?.value?.steps || [])

            const configMapDerived = computed(() => configMap.value)

            const currentStepConfig = computed(() => {
                if (steps.value) {
                    return steps.value[currentStep.value]
                }
                return {}
            })

            /** DATA */
            // const { data, isLoading } = useWorkflowTemplateByName(
            //     workflowTemplate.value
            // )

            // watch(isLoading, (newVal) => {
            //     emit('setLoadingFetchPod', newVal)
            // })

            const isAllowtoRun = computed(() => {
                let allow = true
                // const data = formConfig.value
                // for (const prop in data) {
                //     const pod = data[prop]
                //     pod.forEach((el) => {
                //         if (el.type !== 'template') {
                //             el.rules?.forEach((elc) => {
                //                 if (elc.type === 'required') {
                //                     const defaultValue =
                //                         dataProp.value?.asset?.workflowtemplate
                //                             ?.spec?.templates[0]?.dag?.tasks[0]
                //                             ?.arguments?.parameters
                //                     const finded = defaultValue.find(
                //                         (d) => d.name === el.id
                //                     )
                //                     if (!finded?.value) {
                //                         allow = false
                //                     }
                //                 }
                //             })
                //         }
                //     })
                // }
                return allow
            })

            const selectedStep = ref('')
            const handleChange = (event) => {
                console.log(event)
                selectedStep.value = event
            }

            const handleNext = async () => {
                if (stepForm.value) {
                    const err = await stepForm.value.validateForm()
                    if (err) {
                        message.error('Please review the entered details')
                    } else {
                        currentStep.value += 1
                    }
                }
            }
            // watch(data, (newVal) => {
            //     const meta =
            //         newVal?.workflowtemplate?.metadata?.annotations || {}
            //     const urlLogo = meta['com.atlan.orchestration/logo'] || ''
            //     emit('handleSetLogo', urlLogo)
            //     const { entrypoint } = newVal.workflowtemplate.spec
            //     tasks.value = newVal.workflowtemplate.spec.templates.find(
            //         (t) => t.name === entrypoint
            //     ).dag.tasks
            // })

            return {
                tasks,
                emit,

                isAllowtoRun,
                workflowTemplate,
                handleChange,
                configMapDerived,
                modelValue,
                selectedStep,
                currentStep,
                steps,
                configMap,
                currentStepConfig,
                handleNext,
                stepForm,
            }
        },
    })
</script>
