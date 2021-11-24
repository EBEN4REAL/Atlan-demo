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
                <div class="flex-1 p-8 overflow-y-auto bg-white">
                    <DynamicForm
                        ref="stepForm"
                        :config="configMapDerived"
                        :currentStep="currentStepConfig"
                        v-model="modelValue"
                        labelAlign="left"
                        :labelCol="{ span: 6 }"
                        :wrapperCol="{ span: 18 }"
                    ></DynamicForm>
                    <!-- {{ configMap }} -->
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
    } from 'vue'

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
                    return {
                        title: 'Config Map',
                        description: 'Config Map for input parameters',
                        properties: {
                            'connection-name': {
                                type: 'string',
                                required: false,
                                ui: {
                                    label: 'Connection Name',
                                    placeholder: 'Connection Name',
                                },
                            },
                            'connection-qualifiedName': {
                                type: 'string',
                                required: false,
                                ui: {
                                    label: 'Connection Qualified Name',
                                    placeholder: 'Connection Name',
                                },
                            },
                            mode: {
                                type: 'string',
                                enum: ['production', 'test', 'dev'],
                                default: 'production',
                                enumNames: [
                                    'Production',
                                    'Test',
                                    'Development',
                                ],
                                ui: {
                                    widget: 'select',
                                    label: 'Mode',
                                    placeholder: 'Connection Mode',
                                },
                            },
                            'credentials-fetch-strategy': {
                                type: 'string',
                                enum: ['k8s_secret', 'credential_guid'],
                                default: 'credential_guid',
                                enumNames: [
                                    'k8s Secret Key',
                                    'Credential Guid',
                                ],
                                ui: {
                                    widget: 'select',
                                    label: 'Credential Type',
                                    placeholder: 'Credential Type',
                                },
                            },
                            'credential-guid': {
                                type: 'string',
                                ui: {
                                    widget: 'credential',
                                    label: '',
                                    placeholder: 'Credential Guid',
                                    hidden: false,
                                },
                            },
                            'credential-kube-secret-name': {
                                type: 'string',
                                ui: {
                                    label: 'Credential Secret Name',
                                    placeholder: 'Credential Secret Name',
                                    hidden: true,
                                },
                            },
                            host: {
                                type: 'string',
                                ui: {
                                    label: 'Host',
                                    placeholder: 'Host',
                                },
                            },
                            port: {
                                type: 'string',
                                ui: {
                                    label: 'Port',
                                    placeholder: 'Port',
                                },
                            },
                            crawler_name: {
                                type: 'string',
                                ui: {
                                    label: 'Workflow Name',
                                },
                            },
                            'atlas-auth-type': {
                                type: 'string',
                                enum: ['internal', 'apikey'],
                                default: 'internal',
                                enumNames: ['Internal', 'API Key'],
                                ui: {
                                    widget: 'select',
                                    label: 'Atlas Authentication Type',
                                    placeholder: 'Atlas Authentication  Type',
                                },
                            },
                            'allow-preview': {
                                type: 'boolean',
                                default: true,
                                ui: {
                                    label: 'Allow Preview',
                                },
                            },
                            'allow-query': {
                                type: 'boolean',
                                default: true,
                                ui: {
                                    label: 'Allow Query',
                                },
                            },
                            'auto-classification': {
                                type: 'boolean',
                                default: true,
                                ui: {
                                    label: 'Auto-Classification',
                                },
                            },
                            'row-limit': {
                                type: 'number',
                                default: 10000,
                                ui: {
                                    label: 'Row Limit',
                                },
                            },
                            'runtime-properties': {
                                type: 'object',
                                ui: {
                                    label: 'Run time properties',
                                },
                            },
                            'include-filter': {
                                type: 'object',
                                additionalProperties: {
                                    type: 'array',
                                },
                                ui: {
                                    widget: 'includesql',
                                    label: 'Include SQL',
                                },
                            },
                            'exclude-filter': {
                                type: 'object',
                                additionalProperties: {
                                    type: 'array',
                                },
                                ui: {
                                    widget: 'includesql',
                                    label: 'Exclude SQL',
                                },
                            },
                        },
                        anyOf: [
                            {
                                properties: {
                                    'credentials-fetch-strategy': {
                                        const: 'k8s_secret',
                                    },
                                },
                                required: ['credential-kube-secret-name'],
                            },
                            {
                                properties: {
                                    'credentials-fetch-strategy': {
                                        const: 'credential_guid',
                                    },
                                },
                                required: ['credential-guid'],
                            },
                        ],
                        steps: [
                            {
                                id: 'credential',
                                title: 'Credential',
                                description: 'Credential',
                                properties: ['credential-guid'],
                            },
                            {
                                id: 'metadata',
                                title: 'Metadata',
                                description: 'Metadata',
                                properties: [
                                    'include-filter',
                                    'exclude-filter',
                                ],
                            },
                            {
                                id: 'publish',
                                title: 'Publish',
                                description: 'Publish',
                                properties: ['mode', 'auto-classification'],
                            },
                            {
                                id: 'details',
                                title: 'Details',
                                description: 'Details',
                                properties: [
                                    'connection-name',
                                    'row-limit',
                                    'allow-preview',
                                    'allow-query',
                                ],
                            },
                        ],
                    }
                },
            },
        },
        emits: ['change', 'openLog', 'handleSetLogo'],
        setup(props, { emit }) {
            // const graphRef = inject('graphRef')

            const stepForm = ref()

            const currentStep = ref(0)
            const { workflowTemplate, configMap } = toRefs(props)
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

            const handleNext = () => {
                if (stepForm.value) {
                    stepForm.value.validateForm()
                }
                // currentStep.value += 1
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
