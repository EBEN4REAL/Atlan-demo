<template>
    <div class="flex w-full h-full overflow-hidden" v-if="!status">
        <div class="flex flex-col flex-grow h-full">
            <div class="p-6">
                <a-steps v-if="steps.length > 0" :current="currentStep">
                    <template v-for="(step, index) in steps" :key="step.id">
                        <a-step @click="handleStepClick(index)">
                            <template #title>{{ step.title }}</template>
                        </a-step>
                    </template>
                </a-steps>
            </div>
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
                    :isEdit="isEdit"
                ></DynamicForm>
            </div>

            <div
                class="flex justify-between px-6 py-3 bg-gray-100 border-t"
                v-if="currentStep < steps.length"
            >
                <AtlanButton
                    v-if="currentStep !== 0"
                    padding="compact"
                    color="secondary"
                    size="sm"
                    @click="handlePrevious"
                >
                    <template #prefix>
                        <AtlanIcon icon="ChevronLeft" />
                    </template>
                    Back
                </AtlanButton>

                <AtlanButton
                    v-else-if="currentStep === 0 && !isEdit"
                    padding="compact"
                    color="secondary"
                    size="sm"
                    @click="handleExit"
                >
                    <template #prefix>
                        <AtlanIcon icon="ChevronLeft" />
                    </template>
                    Back to Marketplace
                </AtlanButton>

                <AtlanButton
                    v-if="currentStep < steps.length - 1"
                    padding="compact"
                    size="sm"
                    class="ml-auto"
                    @click="handleNext"
                >
                    Next
                    <template #suffix>
                        <AtlanIcon icon="ChevronRight" />
                    </template>
                </AtlanButton>

                <a-popconfirm
                    v-else-if="currentStep === steps.length - 1 && isEdit"
                    ok-text="Yes"
                    :overlay-class-name="$style.popConfirm"
                    cancel-text="Cancel"
                    placement="topRight"
                    :ok-button-props="{ size: 'default' }"
                    :cancel-button-props="{ size: 'default' }"
                    @confirm="handleSubmit(false)"
                >
                    <template #icon> </template>
                    <template #title>
                        <p class="font-bold">
                            Are you sure you want to update the configuration
                            for this workflow?
                        </p>
                        <p class="text-gray-500">
                            All future runs will use this new configuration
                        </p>
                        <a-checkbox v-model:checked="runOnUpdate" class="mt-3"
                            >Start a new run</a-checkbox
                        >
                    </template>
                    <AtlanButton padding="compact" size="sm">
                        Update
                    </AtlanButton>
                </a-popconfirm>

                <div
                    v-else-if="currentStep === steps.length - 1 && !isEdit"
                    class="flex gap-x-2"
                >
                    <AtlanButton
                        :color="allowSchedule ? 'secondary' : 'primary'"
                        size="sm"
                        @click="handleSubmit(false)"
                    >
                        Run
                    </AtlanButton>

                    <a-popconfirm
                        v-if="allowSchedule"
                        ok-text="Confirm"
                        :overlay-class-name="$style.popConfirm"
                        cancel-text="Cancel"
                        placement="topRight"
                        :ok-button-props="{ size: 'default' }"
                        :cancel-button-props="{ size: 'default' }"
                        @confirm="handleSubmit(true)"
                    >
                        <template #icon> </template>
                        <template #title>
                            <Schedule class="mb-3" v-model="cron"></Schedule>
                        </template>

                        <AtlanButton
                            v-if="allowSchedule"
                            padding="compact"
                            size="sm"
                        >
                            Schedule & Run
                            <template #suffix>
                                <AtlanIcon icon="ChevronRight" />
                            </template>
                        </AtlanButton>
                    </a-popconfirm>
                </div>
            </div>
        </div>
    </div>

    <!-- Finish Page -->
    <div v-else class="flex flex-col items-center justify-center w-full h-full">
        <div
            v-if="isLoading || (!run?.status && runLoading)"
            class="flex flex-col justify-center"
        >
            <AtlanLoader class="h-10 mb-2" />
            <div>Setting up your workflow</div>
        </div>

        <!-- Update details, but don't run now -->
        <template v-else-if="isEdit && !runOnUpdate">
            <a-result :status="updateStatus.status" :title="updateStatus.title">
                <template v-if="updateStatus.status === 'loading'" #icon>
                    <AtlanLoader class="h-14" />
                </template>
                <template #extra>
                    <div class="flex items-center justify-center">
                        <a-button v-if="updateStatus.status === 'success'">
                            <router-link to="/workflows">
                                Back to Workflows</router-link
                            >
                        </a-button>
                    </div>

                    <div
                        v-if="isUpdateError"
                        class="flex flex-col items-center justify-center p-2 bg-gray-100 rounded gap-y-2"
                    >
                        <span>{{ isUpdateError }}</span>
                        <a-button
                            v-if="updateStatus.status === 'error'"
                            @click="handleBackToSetup"
                        >
                            <AtlanIcon icon="ChevronLeft"></AtlanIcon>
                            Back to setup
                        </a-button>
                    </div>
                </template>
            </a-result>
        </template>

        <a-result
            v-else-if="run"
            :status="status"
            :title="title"
            :sub-title="subTitle"
        >
            <template #extra>
                <div>
                    <Run
                        v-if="run && !errorMesssage"
                        :run="run"
                        :is-loading="runLoading || !run?.status?.progress"
                        class="mb-3"
                    ></Run>

                    <div calss="flex">
                        <a-button v-if="status === 'success'">
                            <router-link to="/assets">
                                Back to Assets</router-link
                            >
                        </a-button>
                        <a-button
                            v-if="run?.metadata"
                            class="ml-3"
                            @click="handleTrackLink"
                        >
                            Monitor Run
                        </a-button>
                    </div>
                </div>

                <div
                    v-if="errorMesssage"
                    class="flex flex-col items-center justify-center p-2 bg-gray-100 rounded gap-y-2"
                >
                    <span class="text-error">{{ errorMesssage }}</span>
                    <AtlanButton
                        v-if="status === 'error'"
                        color="secondary"
                        padding="compact"
                        size="sm"
                        @click="handleBackToSetup"
                    >
                        <template #prefix
                            ><AtlanIcon icon="ChevronLeft"
                        /></template>
                        <span class="text-sm">Back to setup</span>
                    </AtlanButton>
                </div>
            </template>
        </a-result>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        ref,
        watch,
        toRefs,
        computed,
        provide,
        Ref,
    } from 'vue'

    import { message } from 'ant-design-vue'
    import { useIntervalFn, watchOnce, useThrottleFn } from '@vueuse/core'
    import { useRoute, useRouter } from 'vue-router'

    // Components
    import DynamicForm from '@/common/dynamicForm2/index.vue'
    import Schedule from './schedule.vue'
    import Run from './run.vue'

    import { createWorkflow } from '~/composables/package/useWorkflow'
    import { useWorkflowHelper } from '~/composables/package/useWorkflowHelper'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import useWorkflowSubmit from '~/composables/package/useWorkflowSubmit'
    import useWorkflowUpdate from '~/composables/package/useWorkflowUpdate'

    import { useRunDiscoverList } from '~/composables/package/useRunDiscoverList'

    import { getEnv } from '~/modules/__env'

    // Composables

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: {
            Run,
            DynamicForm,
            Schedule,
        },
        props: {
            workflowTemplate: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            workflowObject: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            configMap: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            isEdit: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            defaultValue: {
                type: Object,
                required: false,
                default: () => ({}),
            },
        },
        emits: ['change', 'openLog', 'handleSetLogo'],
        setup(props, { emit }) {
            // const graphRef = inject('graphRef')

            const stepForm = ref()
            const currentStep = ref(0)
            const runOnUpdate = ref(false)
            const {
                workflowTemplate,
                configMap,
                isEdit,
                defaultValue,
                workflowObject,
            } = toRefs(props)
            const localTemplate = ref(workflowTemplate.value)
            const localConfigMap = ref(configMap.value)
            const route = useRoute()
            const modelValue = ref(defaultValue.value)
            const selectedStep = ref('')

            const cron = ref({
                cron: workflowTemplate.value?.metadata?.annotations[
                    'orchestration.atlan.com/schedule'
                ],
                timezone:
                    workflowTemplate.value?.metadata?.annotations[
                        'orchestration.atlan.com/timezone'
                    ],
            })

            provide('workflowTemplate', localTemplate)
            provide('configMap', localConfigMap)

            const { name } = useWorkflowInfo()

            const isSandbox = computed(() => route?.query?.sandbox || '')

            const allowSchedule = computed(() => {
                if (
                    localTemplate.value?.metadata?.annotations[
                        'orchestration.atlan.com/allowSchedule'
                    ] === 'false'
                ) {
                    return false
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

            const handleNext = useThrottleFn(
                async () => {
                    if (stepForm.value) {
                        const err = await stepForm.value.validateForm()
                        if (err) {
                            message.error('Please review the entered details')
                        } else {
                            currentStep.value += 1
                        }
                    }
                },
                isEdit.value ? 250 : 600,
                false
            )

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

            const path = ref({})
            const {
                mutate: updateWorkflow,
                isLoading: isUpdateLoading,
                error: isUpdateError,
            } = useWorkflowUpdate(path, body, false)

            const updateStatus = computed(() => {
                if (isUpdateLoading.value)
                    return { status: 'loading', title: 'Saving your changes' }
                if (isUpdateError.value)
                    return {
                        status: 'error',
                        title: 'Failed to update workflow',
                    }
                return {
                    status: 'success',
                    title: 'Your workflow has been updated',
                }
            })

            const limit = ref(1)
            const offset = ref(0)
            const facets = ref({
                workflowTemplate: '',
            })

            const {
                list: runList,
                fetch: fetchRun,
                isLoading: runLoading,
            } = useRunDiscoverList({
                isCache: false,
                facets,
                limit,
                offset,
                source: ref({}),
                refreshInterval: 5000,
            })

            const { pause, resume } = useIntervalFn(fetchRun, 5000, {
                immediate: false,
                immediateCallback: true,
            })

            const run = ref({})

            watch(runList, () => {
                if (runList.value?.length > 0) {
                    run.value = runList.value[0]

                    if (run.value.status?.phase !== 'Running') {
                        pause()
                    }

                    if (run?.value.status?.phase === 'Succeeded')
                        setRunState('success', 'Workflow completed 🎉')

                    if (run?.value.status?.phase === 'Failed')
                        setRunState(
                            'error',
                            'Worflow run has failed',
                            'Go to Monitor Run > Failed Node > Logs for more details'
                        )
                }
            })

            const handleTrackLink = () => {
                if (run.value?.metadata?.name) {
                    router.push(
                        `/workflows/${
                            data.value?.metadata?.name ||
                            run.value?.metadata?.labels[
                                'workflows.argoproj.io/workflow-template'
                            ]
                        }/runs?name=${run.value?.metadata?.name}`
                    )
                }

                // if (import.meta.env.DEV) {
                //     window.open(
                //         `${
                //             getEnv().DEV_API_BASE_URL
                //         }/api/orchestration/workflows/default/${
                //             run.value?.metadata.name
                //         }`,
                //         '_blank'
                //     )
                // } else {
                //     window.open(
                //         `${window.location.origin}/api/orchestration/workflows/default/${run.value.metadata.name}`,
                //         '_blank'
                //     )
                // }
            }

            const status: Ref<undefined | string> = ref(undefined)
            const title = ref('Setting up a workflow')
            const subTitle = ref(
                'Saving & validating your inputs and credentials'
            )
            const errorMesssage = ref('')

            const setRunState = (st: string, tl = '', sbtl = '', err = '') => {
                status.value = st
                title.value = tl
                subTitle.value = sbtl
                errorMesssage.value = err
            }

            watch(data, () => {
                setRunState(
                    'success',
                    'Workflow is in progress',
                    'You can also track the progress of workflows in the Workflow Center'
                )
                facets.value = {
                    workflowTemplate: data.value?.metadata.name,
                }
                fetchRun()
                resume()
            })

            watch(error, () => {
                if (error.value) {
                    setRunState(
                        'error',
                        'Workflow setup has failed',
                        'Something went wrong during setup process. Reach out to support@atlan.com for any help.',
                        error.value?.response?.data?.message
                    )
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
                if (isEdit.value) {
                    body.value.metadata = workflowTemplate.value.metadata
                } else {
                    // Copy labels and annotations of the worfklow template
                    body.value.metadata.labels =
                        workflowTemplate.value.metadata.labels
                    body.value.metadata.annotations =
                        workflowTemplate.value.metadata.annotations

                    // Schedule Changes
                    if (cron.value && isCron) {
                        body.value.metadata.annotations[
                            'orchestration.atlan.com/schedule'
                        ] = cron.value.cron
                        body.value.metadata.annotations[
                            'orchestration.atlan.com/timezone'
                        ] = cron.value.timezone
                    }

                    // New Connection Body
                    const connectionBody = getConnectionBody(
                        configMap.value,
                        modelValue.value
                    )
                    let connectionQualifiedName = ''
                    const credentialParam = 'credentialGuid'

                    connectionBody.forEach((i) => {
                        const temp = i.body
                        temp.attributes.defaultCredentialGuid = `{{${credentialParam}}}`

                        modelValue.value[i.parameter] = i.body
                        connectionQualifiedName =
                            i.body.attributes.qualifiedName?.replaceAll(
                                '/',
                                '-'
                            )
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

                    body.value.metadata.name = workflowName.replaceAll('/', '-')
                    body.value.metadata.namespace = 'default'
                    const credentialBody = getCredentialBody(
                        configMap.value,
                        modelValue.value,
                        connectionQualifiedName || workflowName,
                        credentialParam
                    )
                    body.value.payload = [...credentialBody]
                }

                const parameters = []

                if (workflowTemplate.value.spec.templates.length > 0) {
                    workflowTemplate.value.spec.templates[0].inputs.parameters.forEach(
                        (p) => {
                            if (typeof modelValue.value[p.name] === 'boolean') {
                                parameters.push({
                                    name: p.name,
                                    value: modelValue.value[p.name],
                                })
                            } else if (modelValue.value[p.name]) {
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

                if (workflowTemplate.value?.spec.volumeClaimTemplates) {
                    body.value.spec.volumeClaimTemplates =
                        workflowTemplate.value.spec.volumeClaimTemplates
                }

                status.value = 'loading'
                errorMesssage.value = ''

                if (isEdit.value) {
                    path.value = {
                        name: workflowObject.value.metadata.name,
                    }
                    updateWorkflow()

                    if (runOnUpdate.value) {
                        const { data: nrd, error: nre } = useWorkflowSubmit(
                            {
                                namespace: 'default',
                                resourceKind: 'WorkflowTemplate',
                                resourceName: name(workflowObject.value),
                            },
                            true
                        )

                        watchOnce(nrd, () => {
                            setRunState(
                                'success',
                                'Workflow is in progress',
                                'Workflow is running with the updated configuration'
                            )
                            facets.value = {
                                runName: nrd.value.metadata.name,
                            }
                            resume()
                        })

                        watchOnce(nre, () => {
                            setRunState(
                                'error',
                                'Workflow run has failed',
                                '',
                                nre.value
                            )
                        })
                    }
                } else {
                    execute(true)
                }
            }

            const handleBackToSetup = () => {
                status.value = undefined
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

            return {
                emit,
                handleChange,
                modelValue,
                selectedStep,
                currentStep,
                steps,
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
                localTemplate,
                localConfigMap,
                allowSchedule,
                fetchRun,
                runList,
                runLoading,
                run,
                pause,
                resume,
                handleTrackLink,
                updateWorkflow,
                isUpdateLoading,
                isUpdateError,
                updateStatus,
                path,
                runOnUpdate,
                router,
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
