<template>
    <div class="flex w-full h-full overflow-hidden">
        <div class="flex flex-col flex-1 border-r bg-primary-light">
            <div
                class="flex flex-col flex-grow px-5 pt-5 pb-4 space-y-4 overflow-y-scroll border-b lg:px-10 xl:px-16"
            >
                <div
                    v-for="(step, index) in steps"
                    :key="`form_${index}`"
                    class="px-4 py-3 bg-white border rounded-lg shadow-sm"
                >
                    <div v-if="!['connection', 'credential'].includes(step.id)">
                        <p
                            class="text-base font-bold capitalize text-new-gray-800"
                        >
                            {{ step.title }}
                        </p>
                        <a-divider class="mt-3 mb-2" />
                    </div>
                    <DynamicForm
                        v-model="modelValue"
                        :key="`form_${index}`"
                        :config="localConfigMap"
                        :current-step="step"
                        :workflow-template="workflowTemplate"
                        label-align="left"
                        :is-edit="true"
                        class="mx-auto"
                    />
                </div>
                <!-- FIXME: Scheduling optiond -->
                <div
                    v-if="allowSchedule(workflowObject) && false"
                    class="px-4 py-3 border rounded-lg shadow-sm"
                >
                    <div class="flex items-center">
                        <span class="text-base font-bold text-new-gray-800">
                            Enable Schedule
                        </span>
                        <a-switch
                            v-model:checked="cronEnabled"
                            class="ml-auto"
                        />
                    </div>
                    <template v-if="cronEnabled">
                        <a-divider class="mt-3 mb-4" />
                        <Schedule v-model="cron" />
                    </template>
                </div>
            </div>
            <div class="bg-white">
                <a-popconfirm
                    ok-text="Yes"
                    :overlay-class-name="$style.popConfirm"
                    cancel-text="Cancel"
                    placement="topRight"
                    :ok-button-props="{ size: 'default' }"
                    :cancel-button-props="{ size: 'default' }"
                    @confirm="handleSubmit"
                >
                    <template #icon />
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
                    <AtlanButton2
                        class="my-4 ml-auto mr-5 lg:mr-10 xl:mr-16"
                        label="Update"
                    />
                </a-popconfirm>
            </div>
        </div>
        <WorkflowPreview
            v-if="workflowTemplate"
            :item="workflowTemplate"
            mode="package"
            style="width: 360px"
            class="flex-none"
        />
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        toRefs,
        provide,
        inject,
        Ref,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import { watchOnce, until } from '@vueuse/core'

    import WorkflowPreview from '~/workflowsv2/migrated/packageSidebar.vue'
    import DynamicForm from '~/workflowsv2/components/dynamicForm2/index.vue'
    import Schedule from '~/workflowsv2/components/marketplace/setup/schedule.vue'

    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import useWorkflowUpdate from '~/workflows/composables/package/useWorkflowUpdate'
    import useWorkflowSubmit from '~/workflows/composables/package/useWorkflowSubmit'

    export default defineComponent({
        name: 'WorkflowConfig',
        components: { WorkflowPreview, DynamicForm, Schedule },
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
            defaultValue: {
                type: Object,
                required: false,
                default: () => ({}),
            },
        },
        emits: ['newrun'],
        setup: (props) => {
            const {
                workflowTemplate,
                configMap,
                defaultValue,
                workflowObject,
            } = toRefs(props)

            const { allowSchedule, refName } = useWorkflowInfo()
            const isWorkflowDirty = inject<Ref<boolean>>(
                'isWorkflowDirty',
                ref(false)
            )

            const localTemplate = ref(workflowTemplate.value)
            const localConfigMap = ref(configMap.value)
            const modelValue = ref(defaultValue.value)

            const steps = computed(() => localConfigMap?.value?.steps || [])

            const cron = ref({
                cron: workflowObject.value?.metadata?.annotations[
                    'orchestration.atlan.com/schedule'
                ],
                timezone:
                    workflowObject.value?.metadata?.annotations[
                        'orchestration.atlan.com/timezone'
                    ],
            })

            const cronEnabled = ref(!!cron.value.cron)
            const runOnUpdate = ref(false)

            const path = ref({})
            const body = ref({
                metadata: {
                    labels: {},
                },
                spec: {},
                payload: [],
            })

            const msgKey = 'workflowUpdate'

            const {
                mutate: updateWorkflow,
                isLoading: isUpdateLoading,
                error: isUpdateError,
            } = useWorkflowUpdate(path, body, false)

            const handleSubmit = async () => {
                body.value.metadata = workflowObject.value.metadata

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
                    return
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
                                            name: refName(
                                                workflowTemplate.value
                                            ),
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
                    content: 'Updating workflow configuration',
                    key: msgKey,
                })

                path.value = {
                    name: refName(workflowObject.value),
                }

                updateWorkflow()

                await until(isUpdateLoading).toBe(false)

                if (isUpdateError.value) {
                    message.error({
                        content: 'Error updating workflow configuration',
                        key: msgKey,
                    })
                    return
                }
                message.success({
                    content: 'Workflow configuration updated',
                    key: msgKey,
                })

                isWorkflowDirty.value = true

                if (runOnUpdate.value) {
                    const { data: nrd, error: nre } = useWorkflowSubmit(
                        {
                            namespace: 'default',
                            resourceKind: 'WorkflowTemplate',
                            resourceName: refName(workflowObject.value),
                        },
                        true
                    )

                    watchOnce(nrd, () => {
                        // setRunState(
                        //     'success',
                        //     'Workflow is in progress',
                        //     'Workflow is running with the updated configuration'
                        // )
                        // facets.value = {
                        //     runName: nrd.value.metadata.name,
                        // }

                        // Emit won't work, use inject/provide
                        // emit('newrun', refName(nrd.value))

                        message.success({
                            content: 'Workflow is in progress',
                            key: msgKey,
                        })
                    })

                    watchOnce(nre, () => {
                        // setRunState(
                        //     'error',
                        //     'Workflow run has failed',
                        //     '',
                        //     nre.value
                        // )
                        message.error({
                            content: nre.value,
                            key: msgKey,
                        })
                    })
                }
            }

            provide('workflowTemplate', localTemplate)
            provide('configMap', localConfigMap)

            return {
                localTemplate,
                localConfigMap,
                modelValue,
                steps,
                cron,
                cronEnabled,
                allowSchedule,
                runOnUpdate,
                handleSubmit,
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
