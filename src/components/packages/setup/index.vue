<template>
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
            const { isLoading, isReady, execute } = createWorkflow(body)

            const {
                getCredentialPropertyList,
                getCredentialBody,
                getConnectionBody,
                getConnectionPropertyList,
            } = useWorkflowHelper()

            const handleSubmit = () => {
                const parameters = []

                console.log(workflowTemplate.value)

                // const credentialBody = getCredentialBody(
                //     configMap.value,
                //     modelValue.value
                // )
                // const connectionBody = getConnectionBody(
                //     configMap.value,
                //     modelValue.value
                // )

                // console.log(connectionBody)
                // console.log(modelValue)

                // connectionBody.forEach((i) => {
                //     modelValue.value[i.parameter] = i.body
                // })

                // const seconds = Math.round(new Date().getTime() / 1000)
                // const connectionName = modelValue.value['connection.name']
                // let workflowName = ''
                // if (connectionName) {
                //     workflowName = `${
                //         workflowTemplate.value.metadata.name
                //     }-${connectionName}-${seconds.toString()}`
                // } else {
                //     workflowName = `${
                //         workflowTemplate.value.metadata.name
                //     }-${seconds.toString()}`
                // }
                // body.value.metadata.name = workflowName
                // body.value.metadata.labels =
                //     workflowTemplate.value.metadata.labels
                // body.value.metadata.annotations =
                //     workflowTemplate.value.metadata.annotations
                // body.value.metadata.labels['com.atlan.orchestration/ui'] =
                //     'true'
                // body.value.spec = {
                //     templates: [
                //         {
                //             name: 'main',
                //             dag: {
                //                 tasks: [
                //                     {
                //                         name: 'run',
                //                         arguments: {
                //                             parameters: [
                //                                 {
                //                                     name: 'connection',
                //                                     value: '',
                //                                 },
                //                                 {
                //                                     name: 'connection-name',
                //                                     value: '',
                //                                 },
                //                                 {
                //                                     name: 'host',
                //                                     value: '',
                //                                 },
                //                                 {
                //                                     name: 'crawler-name',
                //                                     value: '',
                //                                 },
                //                             ],
                //                         },
                //                         templateRef: {
                //                             name: workflowTemplate.value
                //                                 .metadata.name,
                //                             template: 'main',
                //                             clusterScope: true,
                //                         },
                //                     },
                //                 ],
                //             },
                //         },
                //     ],
                //     entrypoint: 'main',
                // }
                // body.value.payload = [...credentialBody, ...connectionBody]
                // execute()
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
