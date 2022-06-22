<template>
    <a-collapse
        v-model:activeKey="activeKey"
        class="px-1 rounded-lg custom-shadow"
        ghost
        accordion
    >
        <a-collapse-panel key="open" :show-arrow="false">
            <template #header>
                <div
                    class="flex items-center justify-between w-full border-new-gray-200"
                    :class="{ 'border-b pb-4': activeKey }"
                >
                    <div>
                        <span class="text-base font-bold text-new-gray-800"
                            >Permission checks</span
                        >
                        <div
                            class="flex items-center text-new-gray-600 gap-x-1"
                        >
                            <AtlanIcon
                                class="h-4 mb-0.5"
                                :icon="
                                    getIconByStatus(getStatusByStep(idx + 1))
                                "
                            />
                            <span class="text-sm font-medium"
                                >{{ currentStepMessage }}
                            </span>
                            •
                            <span
                                class="text-sm cursor-pointer hover:text-new-blue-500 hover:underline"
                            >
                                Show {{ activeKey ? 'less' : 'more' }}
                            </span>
                        </div>
                    </div>
                    <AtlanButton2
                        :label="isCheckRunning ? 'Abort' : 'Check'"
                        :class="
                            isCheckRunning
                                ? 'text-new-red-500'
                                : 'text-new-green-500'
                        "
                        bold
                        color="link"
                        class="ml-auto"
                        @click.stop="handleCheckButton"
                    />
                </div>
            </template>
            <div class="px-4 py-1 space-y-2">
                <div
                    v-for="(step, idx) in steps"
                    :key="step.name"
                    class="flex items-center gap-x-2"
                >
                    <AtlanIcon
                        class="h-5 mb-0.5"
                        :icon="getIconByStatus(getStatusByStep(idx + 1))"
                    />
                    <span> {{ step.title }} {{ getSuffixText(idx + 1) }} </span>
                </div>
            </div>
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import { defineComponent, toRefs, computed, inject, ref } from 'vue'
    import { promiseTimeout } from '@vueuse/core'
    import { moustacheInterpolator } from '~/workflowsv2/composables/utils'
    import { useAPIPromise } from '~/services/api/useAPIPromise'
    import { useWorkflowHelper } from '~/workflows/composables/package/useWorkflowHelper'

    export default defineComponent({
        name: 'AuthCheckWidget',
        props: {
            property: {
                type: Object,
                default: () => ({}),
            },
            isEdit: {
                type: Boolean,
                default: () => false,
            },
            configMap: {
                type: Object,
                required: true,
            },
        },
        setup(props) {
            const { property, configMap } = toRefs(props)
            const formState: Record<string, any> = inject('formState')
            const componentProps = computed(() => property.value.ui)
            const steps = computed(() => property.value.ui.config)

            const isCheckRunning = ref(false)
            const activeKey = ref()

            const currentStep = ref(0)
            const currentStepStatus = ref('')
            const currentStepMessage = ref(
                'Quick test for necessary permissions before workflow run'
            )

            const getStatusByStep = (step: number) => {
                if (step < currentStep.value) return 'success'
                if (step > currentStep.value) {
                    if (currentStepStatus.value === 'error') return 'skipped'
                    return 'pending'
                }
                return currentStepStatus.value
            }

            const getIconByStatus = (status: string) => {
                switch (status) {
                    case 'process':
                        return 'CheckProgress'
                    case 'success':
                        return 'RunSuccess'
                    case 'error':
                        return 'CheckFailed'
                    case 'skipped':
                        return 'Disable'
                    case 'pending':
                    default:
                        return 'CheckPending'
                }
            }

            const getSuffixText = (step: Number) => {
                // Previous steps will always pass
                if (step < currentStep.value) return 'check passed'
                // Next steps will either be pending or skipped
                if (step > currentStep.value) {
                    if (currentStepStatus.value === 'error')
                        return 'check skipped'
                    return ''
                }
                // For current step
                if (currentStepStatus.value === 'error') return 'check failed'
                if (currentStepStatus.value === 'success') return 'check passed'
                return 'check in progress...'
            }

            // const steps = ref([
            //     {
            //         name: 'projects',
            //         title: 'Projects',
            //         extraUrlParam: '', // simple template support for form values
            //         optional: true,
            //         loaderText: 'Checking for authorization to Projects',
            //     },
            //     {
            //         name: 'looks',
            //         title: 'Looks',
            //         extraUrlParam: 'project_id={{projects.data.project_id}}', //access to response from older checks
            //         optional: false,
            //         loaderText: 'Checking for access to Looks',
            //     },
            //     {
            //         name: 'git',
            //         title: 'Git',
            //         extraUrlParam: '',
            //         optional: false,
            //         loaderText: 'Checking Git access',
            //     },
            // ])

            const authStateData = ref({})

            const stopCheck = () => {
                isCheckRunning.value = false
                currentStep.value = 0
                currentStepMessage.value =
                    'Quick test for necessary permissions before workflow run'
                currentStepStatus.value = ''
            }

            const { buildCredentialBody } = useWorkflowHelper()

            const credName = configMap.value.steps.find(
                (step) => step.id === 'credential'
            )?.properties[0]

            const credentialBody = computed(() =>
                buildCredentialBody(
                    formState,
                    credName,
                    configMap.value.properties?.[credName]?.ui?.credentialType,
                    undefined
                )
            )

            const sageBody = computed(() => {
                if (formState[credName])
                    return { credentialId: formState[credName] }
                return { credential: credentialBody.value, formData: formState }
            })

            const startCheck = async () => {
                stopCheck()

                isCheckRunning.value = true
                // eslint-disable-next-line no-restricted-syntax
                for (const step of steps.value) {
                    currentStep.value += 1
                    currentStepStatus.value = 'process'
                    currentStepMessage.value = step.loaderText

                    try {
                        // eslint-disable-next-line no-await-in-loop
                        const response = await useAPIPromise(
                            '/service/sage',
                            'POST',
                            {
                                params: { sageType: step.name },
                                body: sageBody.value,
                            }
                        )

                        if (response.failureMessage) {
                            currentStepStatus.value = 'error'
                            currentStepMessage.value = `${step.title}: ${response.failureMessage}`
                            break
                        } else {
                            currentStepStatus.value = 'success'
                            currentStepMessage.value =
                                response?.successMessage ||
                                `${step.title} check passed`
                            authStateData.value[step.name] = response.data
                        }
                    } catch (error) {
                        currentStepStatus.value = 'error'
                        currentStepMessage.value =
                            `${step.title}: ` +
                            (error?.response?.data?.error || 'Check failed')
                        isCheckRunning.value = false
                        break
                    }
                }
                if (currentStepStatus.value === 'success')
                    currentStepMessage.value = 'All checks passed'

                isCheckRunning.value = false
            }

            const handleCheckButton = () => {
                if (isCheckRunning.value) stopCheck()
                else startCheck()
            }

            return {
                componentProps,
                formState,
                steps,
                currentStep,
                currentStepMessage,
                currentStepStatus,
                getStatusByStep,
                getIconByStatus,
                isCheckRunning,
                handleCheckButton,
                credentialBody,
                getSuffixText,
                activeKey,
            }
        },
    })
</script>
<style scoped>
    .custom-shadow {
        box-shadow: 0px 1px 4px 0px #0000001f;
    }
</style>
