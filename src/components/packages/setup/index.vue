<template>
    <div class="flex flex-1 border-r border-gray-200">
        <div class="flex flex-col w-full h-full" v-if="!status">
            <a-steps
                v-if="steps.length > 0"
                v-model:current="currentStep"
                class="px-6 py-3 border-b border-gray-200"
            >
                <template v-for="step in steps" :key="step.id">
                    <a-step>
                        <template #title>{{ step.title }}</template>
                    </a-step>
                </template>
            </a-steps>

            <div
                class="flex-1 px-6 py-8 overflow-y-auto bg-white"
                v-if="workflowTemplate && currentStep < steps.length"
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

            <div
                class="flex px-6 py-3 border-t"
                :class="currentStep !== 0 ? 'justify-between' : 'justify-end'"
                v-if="currentStep < steps.length"
            >
                <a-button
                    type=""
                    @click="handlePrevious"
                    v-if="currentStep !== 0"
                >
                    <AtlanIcon icon="ChevronLeft" class="mr-1"></AtlanIcon
                    >Back</a-button
                >
                <a-button
                    @click="handleNext"
                    class="text-primary"
                    v-if="currentStep < steps.length - 1"
                >
                    Next
                    <AtlanIcon
                        icon="ChevronRight"
                        class="ml-1 text-primary"
                    ></AtlanIcon
                ></a-button>

                <div
                    class="flex gap-x-2"
                    v-if="currentStep == steps.length - 1"
                >
                    <a-button type="primary" class="px-6" @click="handleSubmit"
                        >Run</a-button
                    >
                    <a-popconfirm
                        ok-text="Confirm"
                        :overlay-class-name="$style.popConfirm"
                        cancel-text="Cancel"
                        placement="topRight"
                    >
                        <template #icon> </template>
                        <template #title>
                            <Schedule class="mb-3"></Schedule>
                        </template>
                        <a-button
                            type="primary"
                            class="px-6 bg-green-500 border-green-500"
                            >Schedule & Run
                            <AtlanIcon
                                icon="ChevronRight"
                                class="ml-1 text-white"
                            ></AtlanIcon
                        ></a-button>
                    </a-popconfirm>
                </div>
            </div>
        </div>
        <div
            class="flex flex-col items-center justify-center w-full h-full"
            v-if="status"
        >
            <div class="flex flex-col justify-center" v-if="isLoading">
                <a-spin size="large" />
                <div>Setting up Workflow</div>
            </div>
            <a-result
                :status="status"
                :title="title"
                :sub-title="subTitle"
                v-else
            >
                <template #extra v-if="status === 'success'">
                    <a-progress
                        :percent="100"
                        :showInfo="false"
                        status="active"
                        :stroke-color="{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }"
                        class="mb-3"
                    />
                    <a-button v-if="status === 'success'">
                        <router-link to="/workflows">
                            Track Progress</router-link
                        >
                    </a-button>
                    <a-button v-if="status === 'success'">
                        <router-link to="/assets"> Back to Assets</router-link>
                    </a-button>
                    <div
                        class="flex flex-col items-center justify-center p-2 bg-gray-100 rounded gap-y-2"
                        v-if="errorMesssage"
                    >
                        <span>{{ errorMesssage }}</span>
                        <a-button
                            v-if="status === 'error'"
                            @click="handleBackToSetup"
                        >
                            <AtlanIcon icon="ChevronLeft"></AtlanIcon>
                            Back to setup
                        </a-button>
                    </div>
                </template>
            </a-result>
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
    import Schedule from './schedule.vue'
    import Sandbox from './sandbox.vue'

    import { createWorkflow } from '~/composables/package/useWorkflow'
    import { useWorkflowHelper } from '~/composables/package/useWorkflowHelper'
    import { useRunList } from '~/composables/package/useRunList'

    // Composables

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: {
            SetupGraph,
            EmptyView,
            DynamicForm,
            Schedule,
            Sandbox,
        },
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
            provide('configMap', configMap)

            const modelValue = ref({})

            const steps = computed(() => configMapDerived?.value?.steps || [])

            const configMapDerived = computed(() => configMap.value)

            const currentStepConfig = computed(() => {
                if (steps.value) {
                    return steps.value[currentStep.value]
                }
                return {}
            })

            const selectedStep = ref('')
            const handleChange = (event) => {
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

            const handlePrevious = () => {
                currentStep.value -= 1
            }

            const body = ref({
                metadata: {
                    labels: {},
                },
                spec: {},
                payload: [],
            })

            const { isLoading, isReady, execute, error, data, workflow } =
                createWorkflow(body)

            const dependentKey = ref(workflow)
            const {} = useRunList({}, dependentKey)

            const status = ref(null)
            const title = ref('Setting up a workflow')
            const subTitle = ref(
                'Saving & validating your inputs and credentials'
            )
            const errorMesssage = ref('')

            watch(data, () => {
                title.value = 'Workflow is in progress'
                subTitle.value =
                    'You can also track the progress of workflows in the Workflow Center'
                status.value = 'success'
            })

            watch(error, () => {
                if (error.value) {
                    status.value = 'error'
                    title.value = 'Workflow setup has failed'
                    subTitle.value =
                        'Something went wrong during setup process. Reach out to support@atlan.com for any help.'

                    errorMesssage.value = error.value?.response?.data?.message
                }
            })

            const {
                getCredentialPropertyList,
                getCredentialBody,
                getConnectionBody,
                getConnectionPropertyList,
            } = useWorkflowHelper()

            const handleRetry = () => {
                execute(true)
            }

            const handleSubmit = () => {
                // Copy labels and annotations of the worfklow template
                body.value.metadata.labels =
                    workflowTemplate.value.metadata.labels
                body.value.metadata.annotations =
                    workflowTemplate.value.metadata.annotations

                // find if there is a connection in the form
                const connectionBody = getConnectionBody(
                    configMap.value,
                    modelValue.value
                )

                let connectionQualifiedName = ''
                const credentialParam = 'credentialGuid'
                // iterate and set the object
                connectionBody.forEach((i) => {
                    const temp = i.body
                    temp.attributes.defaultCredentialGuid = `{{${credentialParam}}}`

                    modelValue.value[i.parameter] = i.body
                    connectionQualifiedName =
                        i.body.attributes.qualifiedName?.replaceAll('/', '-')
                    // add qualifiedname to label
                    if (connectionQualifiedName) {
                        body.value.metadata.labels[
                            `com.atlan.orchestration/${connectionQualifiedName}`
                        ] = 'true'
                    }
                })
                const seconds = Math.round(new Date().getTime() / 1000)

                let workflowName = workflowTemplate.value.metadata.name
                if (connectionQualifiedName) {
                    workflowName = `${workflowName}-${connectionQualifiedName}`
                } else {
                    workflowName = `${workflowName}-${seconds.toString()}`
                }

                body.value.metadata.name = workflowName
                body.value.metadata.namespace = 'default'
                body.value.metadata.name = workflowName.replaceAll('/', '-')
                body.value.metadata.namespace = 'default' // FIXME: change this to tenant name

                const credentialBody = getCredentialBody(
                    configMap.value,
                    modelValue.value,
                    connectionQualifiedName || workflowName,
                    credentialParam
                )

                const parameters = []
                if (workflowTemplate.value.spec.templates.length > 0) {
                    workflowTemplate.value.spec.templates[0].inputs.parameters.forEach(
                        (p) => {
                            if (modelValue.value[p.name]) {
                                if (
                                    typeof modelValue.value[p.name] === 'object'
                                ) {
                                    parameters.push({
                                        name: p.name,
                                        value: JSON.stringify(
                                            modelValue.value[p.name]
                                        ),
                                    })
                                } else {
                                    parameters.push({
                                        name: p.name,
                                        value: modelValue.value[p.name],
                                    })
                                }
                            }
                        }
                    )
                } else {
                    message.error('Something went wrong. Package is not valid.')
                }

                body.value.metadata.labels['com.atlan.orchestration/atlan-ui'] =
                    'true'
                body.value.spec = {
                    templates: [
                        {
                            name: 'main',
                            dag: {
                                tasks: [
                                    {
                                        name: 'run',
                                        arguments: {
                                            parameters,
                                        },
                                        templateRef: {
                                            name: workflowTemplate.value
                                                .metadata.name,
                                            template: 'main',
                                            clusterScope: true,
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    entrypoint: 'main',
                }
                body.value.payload = [...credentialBody]

                // status.value = 'loading'
                // errorMesssage.value = ''

                console.log(body)

                // execute(true)
            }

            const handleBackToSetup = () => {
                status.value = null
            }

            return {
                emit,

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
                handlePrevious,
                handleSubmit,
                getCredentialPropertyList,
                status,
                error,
                isLoading,
                subTitle,
                title,
                data,
                workflow,
                handleRetry,
                errorMesssage,
                handleBackToSetup,
            }
        },
    })
</script>

<style lang="less" module>
    .popConfirm {
        :global(.ant-popover-inner-content) {
            @apply px-6 py-3 !important;
            width: 400px !important;

            :global(.ant-popover-message-title) {
                @apply px-0 !important;
            }
        }

        :global(.ant-popover-arrow) {
            @apply block !important;
        }
    }
</style>
