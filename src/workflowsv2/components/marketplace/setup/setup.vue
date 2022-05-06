<template>
    <div
        class="flex flex-col w-full h-full overflow-hidden bg-white"
        :class="{ 'border rounded-lg': !isEdit }"
        :style="
            isEdit ? '' : 'box-shadow: 0px 9px 32px 0px hsla(0, 0%, 0%, 0.12);'
        "
    >
        <div v-if="!isEdit" class="flex items-center px-5 py-4 border-b">
            <a-tooltip
                :mouseEnterDelay="1"
                placement="bottomLeft"
                title="Back to marketplace"
            >
                <IconButton
                    icon="ChevronLeft"
                    class="mr-4"
                    @click="handleExit"
                />
            </a-tooltip>
            <img
                v-if="icon(workflowTemplate)"
                :src="icon(workflowTemplate)"
                class="w-6 h-6 mb-0.5"
            />
            <div v-else class="w-6 mb-0.5 text-xl leading-6 text-center">
                {{ emoji(workflowTemplate) }}
            </div>
            <span class="ml-1 text-xl font-bold">{{
                packageName(workflowTemplate)
            }}</span>
        </div>

        <div class="flex h-full overflow-hidden">
            <div
                v-if="!status && steps.length > 0"
                class="flex flex-col flex-none px-6 py-8 overflow-y-auto w-52 gap-y-7"
            >
                <div
                    v-for="(step, index) in steps"
                    :key="step.id"
                    :class="{
                        selected: currentStep === index,
                        disabled: index > currentStep,
                    }"
                    class="stepper"
                    @click="handleStepClick(index)"
                >
                    <span
                        v-if="index >= currentStep"
                        class="absolute -top-2.5 -left-2.5 dot"
                        >{{ index + 1 }}
                    </span>
                    <AtlanIcon
                        v-else
                        icon="RunSuccess"
                        class="absolute -top-2.5 -left-2.5 h-5"
                    />
                    <p class="text-sm font-bold">
                        {{ step.title }}
                    </p>
                    <p class="text-xs text-new-gray-700">
                        {{ step.description }}
                    </p>
                </div>
            </div>

            <div
                class="flex flex-col flex-grow h-full border-r"
                :class="{ 'items-center justify-center': status }"
            >
                <template v-if="!status">
                    <div
                        class="flex-1 px-6 py-8 overflow-y-auto"
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
                        class="flex justify-between px-6 py-3 border-t"
                        v-if="currentStep < steps.length"
                    >
                        <AtlanButton2
                            v-if="currentStep !== 0"
                            label="Back"
                            color="secondary"
                            prefixIcon="CaretLeft"
                            @click="handlePrevious"
                        />

                        <AtlanButton2
                            v-if="currentStep < steps.length - 1"
                            label="Next"
                            class="ml-auto"
                            suffixIcon="ChevronRight"
                            @click="handleNext"
                        />

                        <a-popconfirm
                            v-else-if="
                                currentStep === steps.length - 1 && isEdit
                            "
                            ok-text="Yes"
                            :overlay-class-name="$style.popConfirm"
                            cancel-text="Cancel"
                            placement="topRight"
                            :ok-button-props="{ size: 'default' }"
                            :cancel-button-props="{ size: 'default' }"
                            @confirm="handleSubmit"
                        >
                            <template #icon> </template>
                            <template #title>
                                <p class="font-bold">
                                    Are you sure you want to update the
                                    configuration for this workflow?
                                </p>
                                <p class="text-gray-500">
                                    All future runs will use this new
                                    configuration
                                </p>
                                <a-checkbox
                                    v-model:checked="runOnUpdate"
                                    class="mt-3"
                                    >Start a new run</a-checkbox
                                >
                            </template>
                            <AtlanButton2 class="ml-auto" label="Update" />
                        </a-popconfirm>

                        <div
                            v-else-if="
                                currentStep === steps.length - 1 && !isEdit
                            "
                            class="flex ml-auto gap-x-2"
                        >
                            <AtlanButton2
                                :color="allowSchedule ? 'secondary' : 'primary'"
                                label="Run"
                                @click="handleSubmit"
                            />

                            <a-popconfirm
                                v-if="allowSchedule"
                                ok-text="Confirm"
                                :overlay-class-name="$style.popConfirm"
                                cancel-text="Cancel"
                                placement="topRight"
                                :ok-button-props="{ size: 'default' }"
                                :cancel-button-props="{ size: 'default' }"
                                @confirm="handleSubmit"
                            >
                                <template #icon> </template>
                                <template #title>
                                    <Schedule
                                        class="mb-3"
                                        v-model="cron"
                                    ></Schedule>
                                </template>

                                <AtlanButton2
                                    v-if="allowSchedule"
                                    suffixIcon="ChevronRight"
                                    label="Schedule & Run"
                                />
                            </a-popconfirm>
                        </div></div
                ></template>

                <!-- Finish Page -->
                <template v-else>
                    <div
                        v-if="isLoading || (!run?.status && runLoading)"
                        class="flex flex-col justify-center"
                    >
                        <AtlanLoader class="h-10 mb-2" />
                        <div>Setting up your workflow</div>
                    </div>

                    <!-- Update details, but don't run now -->
                    <template v-else-if="isEdit && !runOnUpdate">
                        <a-result
                            :status="updateStatus.status"
                            :title="updateStatus.title"
                        >
                            <template
                                v-if="updateStatus.status === 'loading'"
                                #icon
                            >
                                <AtlanLoader class="h-14" />
                            </template>
                            <template #extra>
                                <div class="flex items-center justify-center">
                                    <router-link to="/workflows">
                                        <AtlanButton2
                                            v-if="
                                                updateStatus.status ===
                                                'success'
                                            "
                                            color="secondary"
                                        >
                                            Back to Workflows
                                        </AtlanButton2>
                                    </router-link>
                                </div>

                                <div
                                    v-if="isUpdateError"
                                    class="flex flex-col items-center justify-center p-2 bg-gray-100 rounded gap-y-2"
                                >
                                    <span>{{ isUpdateError }}</span>

                                    <AtlanButton2
                                        v-if="updateStatus.status === 'error'"
                                        prefixIcon="ChevronLeft"
                                        color="secondary"
                                        @click="handleBackToSetup"
                                        label="Back to setup"
                                    />
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
                                    :is-loading="
                                        runLoading || !run?.status?.progress
                                    "
                                ></Run>

                                <div class="flex justify-center mt-6 gap-x-6">
                                    <router-link
                                        v-if="status === 'success'"
                                        to="/assets"
                                    >
                                        <AtlanButton2
                                            color="secondary"
                                            label="Back to Assets"
                                        />
                                    </router-link>

                                    <AtlanButton2
                                        v-if="run?.metadata"
                                        label="Monitor Run"
                                        @click="handleTrackLink"
                                    />
                                </div>
                            </div>

                            <div
                                v-if="errorMesssage"
                                class="flex flex-col items-center justify-center p-2 bg-gray-100 rounded gap-y-2"
                            >
                                <span class="text-error">{{
                                    errorMesssage
                                }}</span>
                                <AtlanButton2
                                    v-if="status === 'error'"
                                    label="Back to setup"
                                    color="secondary"
                                    prefixIcon="ChevronLeft"
                                    @click="handleBackToSetup"
                                />
                            </div>
                        </template>
                    </a-result>
                </template>
            </div>

            <WorkflowPreview
                v-if="workflowTemplate"
                :item="workflowTemplate"
                mode="package"
                style="width: 360px"
                class="flex-none"
            ></WorkflowPreview>
        </div>
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
        inject,
        Ref,
    } from 'vue'

    import { message } from 'ant-design-vue'
    import {
        useIntervalFn,
        watchOnce,
        useThrottleFn,
        until,
    } from '@vueuse/core'
    import { useRoute, useRouter } from 'vue-router'

    // Components
    import DynamicForm from '~/workflows/components/dynamicForm2/index.vue'
    import WorkflowPreview from '~/workflows/components/workflows/preview/index.vue'
    import Schedule from './schedule.vue'
    import Run from './run.vue'

    import { createWorkflow } from '~/workflows/composables/package/useWorkflow'
    import { useWorkflowHelper } from '~/workflows/composables/package/useWorkflowHelper'
    import useWorkflowSubmit from '~/workflows/composables/package/useWorkflowSubmit'
    import useWorkflowUpdate from '~/workflows/composables/package/useWorkflowUpdate'

    import { useRunDiscoverList } from '~/workflows/composables/package/useRunDiscoverList'

    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'

    // Composables

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: {
            Run,
            DynamicForm,
            Schedule,
            WorkflowPreview,
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
            const router = useRouter()
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
            const isWorkflowDirty = inject('isWorkflowDirty')

            const { name } = useWorkflowInfo()
            const { name: packageName, icon, emoji } = usePackageInfo()

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
                if (runList.value?.length) {
                    run.value = runList.value[0]

                    if (
                        !run.value.status?.startedAt ||
                        !run.value.status?.phase
                    )
                        fetchRun()

                    if (run.value.status?.phase !== 'Running') pause()

                    if (run?.value.status?.phase === 'Succeeded')
                        setRunState('success', 'Workflow completed 🎉')

                    if (run?.value.status?.phase === 'Failed')
                        setRunState(
                            'error',
                            'Worflow run has failed',
                            'Go to Monitor Run > Failed Node > Logs for more details'
                        )
                } else fetchRun()
            })

            const handleTrackLink = () => {
                if (run.value?.metadata?.name) {
                    router.push(
                        `/workflows/profile/${
                            data.value?.metadata?.name ||
                            run.value?.metadata?.labels[
                                'workflows.argoproj.io/workflow-template'
                            ]
                        }/runs?name=${run.value?.metadata?.name}`
                    )
                }
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

            const handleSubmit = async () => {
                if (isEdit.value) {
                    body.value.metadata = workflowObject.value.metadata
                } else {
                    // Copy labels and annotations of the worfklow template
                    body.value.metadata.labels =
                        workflowTemplate.value.metadata.labels
                    body.value.metadata.annotations =
                        workflowTemplate.value.metadata.annotations

                    // Schedule Changes
                    if (cron.value.cron && cron.value.timezone) {
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
                    await until(isUpdateLoading).toBe(false)
                    isWorkflowDirty.value = true

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

            const handleExit = () => {
                router.replace(`/workflows/marketplace`)
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
                packageName,
                icon,
                emoji,
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
<style lang="less" scoped>
    .stepper {
        @apply relative;
        @apply px-3 py-2;
        @apply border rounded-lg border-new-gray-300 bg-white;
        @apply text-new-gray-700;
        @apply cursor-pointer;
        @apply transition-colors duration-200;

        &:hover:not(.disabled) {
            @apply border-primary;
        }

        &.disabled {
            @apply cursor-not-allowed bg-new-gray-100;
        }

        .dot {
            @apply w-5 h-5 text-center rounded-full bg-new-gray-300 text-xs;
            padding-top: 3px;
        }

        &.selected {
            @apply border-primary bg-primary-menu text-primary;

            .dot {
                @apply bg-primary text-white;
            }
        }
    }
</style>