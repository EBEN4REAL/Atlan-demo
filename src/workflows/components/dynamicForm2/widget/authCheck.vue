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
            <AtlanIcon :icon="currentStepIcon" class="mb-1 mr-1" />
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

    export default defineComponent({
        name: 'AuthCheckWidget',
        props: {
            property: {
                required: false,
                type: Object,
                default: () => ({}),
            },
            isEdit: {
                required: false,
            },
        },
        setup(props) {
            const { property } = toRefs(props)
            const formState = inject('formState')
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
            const steps = [
                {
                    name: 'projects',
                    title: 'Projects',
                    extraUrlParam: '', // simple template support for form values
                    optional: true,
                    loaderText: 'Checking for authorization to Projects',
                },
                {
                    name: 'looks',
                    title: 'Looks',
                    extraUrlParam: 'project_id={{projects.data.project_id}}', //access to response from older checks
                    optional: false,
                    loaderText: 'Checking for access to Looks',
                },
                {
                    name: 'git',
                    title: 'Git',
                    extraUrlParam: '',
                    optional: false,
                    loaderText: 'Checking Git access',
                },
            ]

            const authStateData = ref({})

            const stopCheck = () => {
                isCheckRunning.value = false
                currentStep.value = 0
                currentStepMessage.value =
                    'Do a preflight check of your workflow before running it'
                currentStepStatus.value = ''
            }

            const startCheck = async () => {
                stopCheck()

                isCheckRunning.value = true
                for (const step of steps) {
                    currentStep.value += 1
                    currentStepStatus.value = 'process'
                    currentStepMessage.value = step.loaderText

                    await new Promise((resolve) => {
                        setTimeout(resolve, 1500)
                    })
                    currentStepStatus.value = 'finish'
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
            }
        },
    })
</script>
