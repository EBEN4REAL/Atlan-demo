<template>
    <div class="flex items-center w-full px-6 pt-3 gap-x-3">
        <IconButton
            icon="CaretLeft"
            class="text-gray-500"
            @click="handleBack"
        />

        <div class="flex flex-col">
            <div class="flex items-center" style="padding-bottom: 1px">
                <div class="flex items-center justify-between">
                    <div
                        class="flex items-center flex-grow border-gray-200"
                        v-if="packageObject?.metadata?.annotations"
                    >
                        <div
                            class="relative w-10 h-10 p-2 mr-2 bg-white border border-gray-200 rounded-full"
                        >
                            <img
                                v-if="
                                    packageObject?.metadata?.annotations[
                                        'orchestration.atlan.com/icon'
                                    ]
                                "
                                class="self-center w-6 h-6"
                                :src="
                                    packageObject?.metadata?.annotations[
                                        'orchestration.atlan.com/icon'
                                    ]
                                "
                            />
                            <span
                                v-else-if="
                                    packageObject?.metadata?.annotations[
                                        'orchestration.atlan.com/emoji'
                                    ]
                                "
                                class="self-center w-6 h-6"
                            >
                                {{
                                    packageObject?.metadata?.annotations[
                                        'orchestration.atlan.com/emoji'
                                    ]
                                }}</span
                            >
                            <span v-else class="self-center w-6 h-6">
                                {{ '\ud83d\udce6' }}</span
                            >

                            <div
                                v-if="
                                    packageObject?.metadata?.labels[
                                        'orchestration.atlan.com/certified'
                                    ] === 'true'
                                "
                                class="absolute -right-1 -top-2"
                            >
                                <a-tooltip title="Certified" placement="left">
                                    <AtlanIcon
                                        icon="Verified"
                                        class="ml-1"
                                    ></AtlanIcon>
                                </a-tooltip>
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div
                                class="flex font-semibold leading-none truncate workflowObjects-center overflow-ellipsis"
                            >
                                {{ name(workflowObject) }}

                                <span
                                    v-if="
                                        displayName(
                                            packageObject,
                                            name(workflowObject)
                                        )
                                    "
                                    class="text-gray-500"
                                    >({{
                                        displayName(
                                            packageObject,
                                            name(workflowObject)
                                        )
                                    }})</span
                                >
                            </div>

                            <div class="flex mt-1 text-gray-500 gap-x-2">
                                <div class="text-gray-500">
                                    <span
                                        >created
                                        {{
                                            creationTimestamp(
                                                workflowObject,
                                                true
                                            )
                                        }}
                                        ago
                                        <template
                                            v-if="
                                                creatorUsername(
                                                    workflowObject
                                                )?.startsWith(
                                                    'service-account-apikey-'
                                                )
                                            "
                                        >
                                            using
                                            <AtlanIcon icon="Key" class="h-3" />
                                            API key
                                        </template>
                                        <template v-else>
                                            by
                                            {{
                                                creatorUsername(workflowObject)
                                            }}
                                        </template>
                                    </span>
                                </div>
                                <div
                                    class="flex items-center text-gray-500"
                                    v-if="cronString(workflowObject)"
                                >
                                    <span>Scheduled</span>
                                    <span
                                        class="ml-1 text-gray-500 cursor-pointer"
                                        style="
                                            text-decoration: underline;
                                            text-decoration-style: dashed;
                                        "
                                        @click="toggleSchedule"
                                    >
                                        <a-tooltip
                                            :title="nextRunsText"
                                            placement="bottom"
                                        >
                                            {{
                                                cronString(workflowObject)
                                            }}</a-tooltip
                                        ></span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex ml-auto gap-x-1">
            <AtlanButton2
                label="Run Now"
                color="secondary"
                @click="handleRunNow"
            />

            <AtlanButton2
                v-if="allowSchedule(workflowObject)"
                :label="scheduleCTAMessage"
                color="secondary"
                @click="toggleSchedule"
            />

            <a-modal
                v-model:visible="scheduleVisible"
                title="Schedule"
                okText="Update"
                :confirm-loading="isLoading"
                okType="primary"
                @ok="handleScheduleUpdate"
            >
                <div class="px-4 py-2">
                    <Schedule v-model="cronModel"></Schedule>
                </div>
            </a-modal>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'

    import { useRouter } from 'vue-router'
    import { Modal, message } from 'ant-design-vue'
    import { watchOnce } from '@vueuse/core'
    import useWorkflowSubmit from '~/workflows/composables/package/useWorkflowSubmit'
    import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'

    import Schedule from '@/common/input/schedule.vue'
    import useWorkflowUpdate from '~/workflows/composables/package/useWorkflowUpdate'

    export default defineComponent({
        name: 'PackageDiscovery',
        components: { Schedule },

        props: {
            packageObject: {
                type: Object,
                required: false,
                default: () => {},
            },
            workflowObject: {
                type: Object,
                required: false,
                default: () => {},
            },
        },
        emits: ['newrun'],
        setup(props, { emit }) {
            const { packageObject, workflowObject } = toRefs(props)

            const router = useRouter()

            const handleBack = router.back

            const scheduleVisible = ref(false)

            const {
                name,
                creationTimestamp,
                creatorUsername,
                displayName,
                cronString,
                cron,
                allowSchedule,
                cronObject,
                nextRuns,
            } = useWorkflowInfo()

            const cronModel = ref(cronObject(workflowObject.value))

            const messageKey = ref('messageKey')

            const toggleSchedule = () => {
                scheduleVisible.value = !scheduleVisible.value
            }

            const scheduleCTAMessage = computed(() => {
                if (cron(workflowObject.value)) {
                    return 'Edit Schedule'
                }
                return 'Add Schedule'
            })

            const nextRunsText = computed(() => {
                if (nextRuns(workflowObject.value)?.length === 0) {
                    return ''
                }
                return `Next runs: ${nextRuns(workflowObject.value).join(', ')}`
            })

            const handleRunNow = () => {
                Modal.confirm({
                    title: 'Are you sure you want to run this workflow?',

                    content: '',
                    okText: 'Yes',
                    onOk() {
                        const body = {
                            namespace: 'default',
                            resourceKind: 'WorkflowTemplate',
                            resourceName: name(workflowObject.value),
                        }
                        const { data, error, mutate, isLoading } =
                            useWorkflowSubmit(body, true)

                        message.loading({
                            content: 'Starting a new run',
                            key: messageKey.value,
                        })

                        watchOnce(data, () => {
                            emit('newrun', name(data.value))
                            message.success({
                                content: 'Run started',
                                key: messageKey.value,
                            })
                        })
                    },
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onCancel() {},
                })

                // emit('runNow', workflowObject)
            }

            const path = ref({})
            const body = ref({})

            const {
                mutate: updateWorkflow,
                isLoading,
                error,
                data,
            } = useWorkflowUpdate(path, body, false)

            watch(data, () => {
                if (data.value) {
                    message.success('Workflow schedule updated')
                    toggleSchedule()
                }
            })

            watch(error, () => {
                if (error.value) {
                    message.error('Workflow schedule failed. Please try again')
                    toggleSchedule()
                }
            })

            const handleScheduleUpdate = () => {
                console.log('update schedule', cronModel.value)
                path.value = {
                    name: workflowObject.value.metadata.name,
                }

                body.value = workflowObject.value
                if (cronModel.value) {
                    body.value.metadata.annotations[
                        'orchestration.atlan.com/schedule'
                    ] = cronModel.value.cron
                    body.value.metadata.annotations[
                        'orchestration.atlan.com/timezone'
                    ] = cronModel.value.timezone
                }
                updateWorkflow()
            }

            return {
                handleBack,
                name,
                creationTimestamp,
                creatorUsername,
                displayName,
                router,
                handleRunNow,
                cronString,
                cron,
                allowSchedule,
                scheduleVisible,
                toggleSchedule,
                scheduleCTAMessage,
                cronObject,
                cronModel,
                nextRuns,
                nextRunsText,
                handleScheduleUpdate,
                updateWorkflow,
                path,
                body,
                isLoading,
                error,
                data,
            }
        },
    })
</script>
