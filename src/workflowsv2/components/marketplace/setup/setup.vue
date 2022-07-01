<template>
    <div
        class="flex flex-col w-full h-full overflow-hidden bg-white border rounded-lg"
        style="box-shadow: 0px 9px 32px 0px hsla(0, 0%, 0%, 0.12)"
    >
        <!-- Header -->
        <div class="flex items-center px-5 py-4 border-b">
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
            <!-- Stepper -->
            <div
                v-if="steps.length > 0"
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

            <div class="flex flex-col flex-grow h-full border-r">
                <!-- Form -->
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
                    ></DynamicForm>
                </div>

                <!-- Footer -->
                <div
                    class="flex justify-between px-6 py-3 border-t"
                    v-if="currentStep < steps.length"
                >
                    <AtlanButton2
                        v-if="currentStep !== 0"
                        label="Back"
                        color="secondary"
                        prefix-icon="CaretLeft"
                        :disabled="isLoading"
                        @click="handlePrevious"
                    />

                    <AtlanButton2
                        v-if="currentStep < steps.length - 1"
                        label="Next"
                        class="ml-auto"
                        suffix-icon="ChevronRight"
                        :disabled="isLoading"
                        @click="handleNext"
                    />

                    <div
                        v-else-if="currentStep === steps.length - 1"
                        class="flex ml-auto gap-x-2"
                    >
                        <AtlanButton2
                            :color="allowSchedule ? 'secondary' : 'primary'"
                            :loading="isLoading"
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
                                <Schedule v-model="cron" class="mb-3" />
                            </template>

                            <AtlanButton2
                                v-if="allowSchedule"
                                suffix-icon="ChevronRight"
                                label="Schedule & Run"
                                :loading="isLoading"
                                :disabled="isLoading"
                            />
                        </a-popconfirm>
                    </div>
                </div>
            </div>

            <WorkflowPreview
                v-if="workflowTemplate"
                :item="workflowTemplate"
                mode="package"
                style="width: 360px"
                class="flex-none hidden md:block"
            />
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
        Ref,
    } from 'vue'

    import { message, Modal } from 'ant-design-vue'
    import { useThrottleFn } from '@vueuse/core'
    import { useRouter } from 'vue-router'

    // Components
    import DynamicForm from '~/workflowsv2/components/dynamicForm2/index.vue'
    import WorkflowPreview from '~/workflowsv2/migrated/packageSidebar.vue'
    import Schedule from './schedule.vue'
    import Run from './run.vue'

    // Composables
    import { createWorkflow } from '~/workflowsv2/composables/useWorkflow'
    import { useWorkflowHelper } from '~/workflowsv2/composables/useWorkflowHelper'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'

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
            configMap: {
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
            const { workflowTemplate, configMap } = toRefs(props)

            const localTemplate = ref(workflowTemplate.value)
            const localConfigMap = ref(configMap.value)
            const modelValue = ref({})
            const selectedStep = ref('')
            const messageKey = 'mk'

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

            const { name: packageName, icon, emoji } = usePackageInfo()

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
                            // message.error('Please review the entered details')
                        } else {
                            currentStep.value += 1
                        }
                    }
                },
                600,
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

            watch(data, () => {
                message.success({
                    key: messageKey,
                    content: 'Workflow is in progress',
                })
                let timeRemaining = 5
                const modal = Modal.success({
                    content: `Redirecting to workflow profile in ${timeRemaining} seconds`,
                })

                const interval = setInterval(() => {
                    modal.update({
                        content: `Redirecting to workflow profile in ${timeRemaining} seconds`,
                    })
                    timeRemaining -= 1
                }, 1000)

                setTimeout(() => {
                    clearInterval(interval)
                    modal.destroy()
                    router.push(
                        data.value?.metadata?.name
                            ? `/workflows/profile/${data.value?.metadata?.name}`
                            : '/workflows/monitor'
                    )
                }, 5000)
            })

            watch(error, () => {
                if (error.value) {
                    message.error({
                        key: messageKey,
                        content: 'Workflow setup has failed',
                    })
                    // error.value?.response?.data?.message
                }
            })

            const {
                getCredentialPropertyList,
                getCredentialBody,
                getConnectionBody,
            } = useWorkflowHelper()

            const handleSubmit = async () => {
                if (stepForm.value) {
                    const err = await stepForm.value.validateForm()
                    if (err) return
                }

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
                        i.body.attributes.qualifiedName?.replaceAll('/', '-')
                    // add qualifiedname to label
                    if (connectionQualifiedName) {
                        body.value.metadata.labels[
                            `orchestration.atlan.com/${connectionQualifiedName}`
                        ] = 'true'
                    }
                })

                const seconds = Math.round(new Date().getTime() / 1000)
                const pkgName = workflowTemplate.value.metadata.name
                let workflowName: string
                let workflowRef: string

                if (connectionQualifiedName) {
                    workflowName = `${pkgName}-${connectionQualifiedName}`
                    workflowRef = `${pkgName}-${connectionQualifiedName
                        .split('-')
                        .pop()}`
                } else {
                    workflowName = `${pkgName}-${seconds.toString()}`
                    workflowRef = workflowName
                }

                body.value.metadata.annotations[
                    'orchestration.atlan.com/atlanName'
                ] = workflowName // Old Format
                body.value.metadata.name = workflowRef //New Format

                body.value.metadata.namespace = 'default'
                const credentialBody = getCredentialBody(
                    configMap.value,
                    modelValue.value,
                    connectionQualifiedName || workflowName,
                    credentialParam
                )
                body.value.payload = [...credentialBody]

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
                    message.error({
                        key: messageKey,
                        content: 'Invalid Package',
                    })
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

                message.loading({
                    key: messageKey,
                    content: 'Setting up your workflow',
                })
                execute(true)
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
                error,
                isLoading,
                data,
                workflow,
                handleExit,
                handleStepClick,
                cron,
                localTemplate,
                localConfigMap,
                allowSchedule,
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
