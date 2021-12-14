<template>
    <div class="flex flex-1 border-r border-gray-200">
        <div class="flex flex-col w-full h-full" v-if="!status">
            <a-steps
                v-if="steps.length > 0"
                :current="currentStep"
                class="px-6 py-3 border-b border-gray-200"
            >
                <template v-for="(step, index) in steps" :key="step.id">
                    <a-step @click="handleStepClick(index)">
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
                    :config="localConfigMap"
                    :currentStep="currentStepConfig"
                    :workflowTemplate="workflowTemplate"
                    v-model="modelValue"
                    labelAlign="left"
                ></DynamicForm>
            </div>

            <div
                class="flex justify-between px-6 py-3 border-t"
                v-if="currentStep < steps.length"
            >
                <a-button @click="handlePrevious" v-if="currentStep !== 0">
                    <AtlanIcon icon="ChevronLeft" class="mr-1"></AtlanIcon
                    >Back</a-button
                >
                <div v-if="currentStep == 0">
                    <a-button
                        @click="handleExit"
                        class="font-bold text-red-500"
                    >
                        Exit
                    </a-button>
                    <a-button
                        v-if="isSandbox"
                        @click="toggleSandbox"
                        class="ml-1"
                    >
                        View Template
                    </a-button>
                </div>
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
                    v-if="currentStep === steps.length - 1"
                >
                    <a-button class="px-6" @click="handleSubmit(false)"
                        >Run</a-button
                    >
                    <a-popconfirm
                        v-if="allowSchedule"
                        ok-text="Confirm"
                        :overlay-class-name="$style.popConfirm"
                        cancel-text="Cancel"
                        placement="topRight"
                        @confirm="handleSubmit(true)"
                        :ok-button-props="{
                            size: 'default',
                        }"
                        :cancel-button-props="{
                            size: 'default',
                        }"
                    >
                        <template #icon> </template>
                        <template #title>
                            <Schedule class="mb-3" v-model="cron"></Schedule>
                        </template>
                        <a-button type="primary" class="px-6"
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
            <div
                class="flex flex-col justify-center"
                v-if="isLoading || (!run.status && !errorMesssage)"
            >
                <a-spin size="large" />
                <div>Setting up Workflow</div>
            </div>
            <a-result
                :status="status"
                :title="title"
                :sub-title="subTitle"
                v-else
            >
                <template #extra>
                    <div v-if="run">
                        <Run
                            :run="run"
                            :isLoading="runLoading"
                            v-if="run"
                            class="mb-3"
                        ></Run>

                        <a-button v-if="status === 'success'">
                            <router-link to="/assets">
                                Back to Assets</router-link
                            >
                        </a-button>
                    </div>

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
        <a-drawer
            v-if="isSandbox"
            title="Sandbox Mode"
            placement="right"
            :closable="true"
            :visible="sandboxVisible"
            @close="toggleSandbox"
            :mask="false"
        >
            <Sandbox
                v-model:workflowTemplate="localTemplate"
                v-model:configMap="localConfigMap"
                @change="handleRefresh"
            ></Sandbox>
        </a-drawer>
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
    import Sandbox from '../preview/sandbox.vue'
    import Run from './run.vue'

    import { createWorkflow } from '~/composables/package/useWorkflow'
    import { useWorkflowHelper } from '~/composables/package/useWorkflowHelper'

    import { useRoute, useRouter } from 'vue-router'
    import { useRunDiscoverList } from '~/composables/package/useRunDiscoverList'
    import { useIntervalFn } from '@vueuse/core'

    // Composables

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: {
            Run,
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
            const localTemplate = ref(workflowTemplate.value)
            const localConfigMap = ref(configMap.value)
            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const route = useRoute()
            const sandboxVisible = ref(false)
            const modelValue = ref({})
            const selectedStep = ref('')

            const cron = ref({
                cron: workflowTemplate.value.metadata?.annotations[
                    'orchestration.atlan.com/schedule'
                ],
                timezone:
                    workflowTemplate?.metadata?.annotations[
                        'orchestration.atlan.com/timezone'
                    ],
            })

            provide('workflowTemplate', localTemplate)
            provide('configMap', localConfigMap)

            const toggleSandbox = () => {
                sandboxVisible.value = !sandboxVisible.value
            }
            const isSandbox = computed(() => route?.query?.sandbox || '')

            const allowSchedule = computed(() => {
                if (
                    workflowTemplate?.metadata?.annotations[
                        'orchestration.atlan.com/allowSchedule '
                    ]
                ) {
                    return (
                        workflowTemplate?.metadata?.annotations[
                            'orchestration.atlan.com/allowSchedule '
                        ] === 'true'
                    )
                }
                return true
            })

            const steps = computed(() => localConfigMap?.value?.steps || [])

            const currentStepConfig = computed(() => {
                if (steps.value) {
                    return steps.value[currentStep.value]
                }
                return {}
            })

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

            const { isLoading, execute, error, data, workflow } =
                createWorkflow(body)

            const limit = ref(1)
            const offset = ref(0)
            const facets = ref({
                templateName: '',
            })
            const {
                list: runList,
                fetch: fetchRun,
                isLoading: isRunLoading,
            } = useRunDiscoverList({
                isCache: false,
                facets,
                limit,
                offset,
                source: ref({}),
                refreshInterval: 5000,
            })

            const { pause, resume } = useIntervalFn(
                () => {
                    fetchRun()
                },
                5000,
                { immediate: false }
            )

            const run = ref({})

            const runLoading = computed(() => isRunLoading.value)

            watch(runList, () => {
                if (runList.value?.length > 0) {
                    run.value = runList.value[0]
                    if (run.value.status?.phase !== 'Running') {
                        pause()
                    }
                }
            })

            const status = ref('')
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
                facets.value = {
                    templateName: data.value.metadata.name,
                }
                fetchRun()
                resume()
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
            } = useWorkflowHelper()

            const handleRetry = () => {
                execute(true)
            }

            const handleSubmit = (isCron) => {
                // Copy labels and annotations of the worfklow template
                body.value.metadata.labels =
                    workflowTemplate.value.metadata.labels
                body.value.metadata.annotations =
                    workflowTemplate.value.metadata.annotations

                if (cron.value && isCron) {
                    body.value.metadata.annotations[
                        'orchestration.atlan.com/schedule'
                    ] = cron.value.cron
                    body.value.metadata.annotations[
                        'orchestration.atlan.com/timezone'
                    ] = cron.value.timezone
                }

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
                            `orchestration.atlan.com/${connectionQualifiedName}`
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

                body.value.metadata.labels['orchestration.atlan.com/atlan-ui'] =
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

                status.value = 'loading'
                errorMesssage.value = ''
                execute(true)
            }

            const handleBackToSetup = () => {
                status.value = null
            }
            const router = useRouter()
            const handleExit = (key) => {
                router.replace(`/workflows/setup`)
            }

            const handleStepClick = (step) => {
                if (step < currentStep.value) {
                    currentStep.value = step
                }
            }

            const handleRefresh = () => {
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
            }

            return {
                emit,

                workflowTemplate,
                handleChange,

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
                handleExit,
                handleStepClick,
                cron,
                isSandbox,
                sandboxVisible,
                toggleSandbox,
                handleRefresh,
                dirtyTimestamp,
                localTemplate,
                localConfigMap,
                allowSchedule,
                fetchRun,
                runList,
                isRunLoading,
                runLoading,
                run,
                pause,
                resume,
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
