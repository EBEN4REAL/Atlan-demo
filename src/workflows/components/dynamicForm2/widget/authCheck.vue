<template>
    <div class="mr-16">
        <a-steps :current="currentStep" :initial="1" size="small">
            <a-step
                v-for="(step, idx) in steps"
                :key="step.name"
                :title="step.title"
            >
                <template #icon>
                    <AtlanIcon
                        class="h-5 mb-0.5"
                        :class="{
                            'animate-spin':
                                currentStepStatus === 'process' &&
                                currentStep === idx + 1,
                        }"
                        :icon="getIconByStep(idx + 1)"
                    />
                </template>
            </a-step>
        </a-steps>
        <div class="flex items-center mt-4 text-sm">
            <AtlanIcon
                :icon="currentStepIcon"
                class="mb-1 mr-1"
                :class="{
                    'animate-spin': currentStepIcon === 'CircleLoader',
                }"
            />
            <span>{{ currentStepMessage }}</span>
            <AtlanButton2
                :label="isCheckRunning ? 'Abort' : 'Check'"
                :class="
                    isCheckRunning
                        ? 'text-new-red-500 border-new-red-500'
                        : 'text-new-green-500 border-new-green-500'
                "
                bold
                color="secondary"
                class="ml-auto"
                @click="handleCheckButton"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs, computed, inject, ref } from 'vue'
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
            const isCheckRunning = ref(false)

            const currentStep = ref(0)
            const currentStepMessage = ref(
                'Do a preflight check of your workflow before running it'
            )

            const currentStepStatus = ref('')
            const currentStepIcon = computed(() => {
                switch (currentStepStatus.value) {
                    case 'process':
                        return 'CircleLoader'
                    case 'finish':
                        return 'RunSuccess'
                    case 'error':
                        return 'RunFailed'
                    default:
                        return 'Info'
                }
            })

            const getIconByStep = (step: Number) => {
                if (step < currentStep.value) return 'RunSuccess'
                if (step > currentStep.value) return 'Clock'
                return currentStepIcon.value
            }

            const componentProps = computed(() => property.value.ui)
            const steps = computed(() => property.value.ui.config)
            // const steps = [
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
            // ]

            const authStateData = ref({})

            const stopCheck = () => {
                isCheckRunning.value = false
                currentStep.value = 0
                currentStepMessage.value =
                    'Do a preflight check of your workflow before running it'
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
                for (const step of steps.value) {
                    currentStep.value += 1
                    currentStepStatus.value = 'process'
                    currentStepMessage.value = step.loaderText

                    try {
                        const response = await new useAPIPromise(
                            '/service/sage',
                            'POST',
                            {
                                params: { sageType: step.name },
                                body: sageBody.value,
                            }
                        )

                        if (response.failureMessage) {
                            currentStepStatus.value = 'error'
                            currentStepMessage.value = response.failureMessage
                            break
                        } else {
                            currentStepStatus.value = 'finish'
                            currentStepMessage.value = response.successMessage
                            authStateData.value[step.name] = response.data
                        }
                    } catch (error) {
                        currentStepStatus.value = 'error'
                        currentStepMessage.value = error.response.data.error
                        break
                    }
                }
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
                currentStepIcon,
                getIconByStep,
                isCheckRunning,
                handleCheckButton,
                credentialBody,
            }
        },
    })
</script>
