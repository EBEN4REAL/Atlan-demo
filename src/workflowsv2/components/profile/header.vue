<template>
    <div class="flex items-start w-full px-6 pt-3 gap-x-3">
        <IconButton
            icon="CaretLeft"
            class="mt-1.5 text-gray-500"
            @click="handleBack"
        />

        <div
            class="flex flex-grow border-gray-200 gap-x-2"
            v-if="packageObject?.metadata?.annotations"
        >
            <div class="relative flex-none mt-0.5">
                <PackageIcon :package="packageObject" rounded />

                <div
                    v-if="
                        packageObject?.metadata?.labels[
                            'orchestration.atlan.com/certified'
                        ] === 'true'
                    "
                    class="absolute -top-1 -right-1"
                >
                    <a-tooltip title="Certified" placement="left">
                        <AtlanIcon icon="Verified"></AtlanIcon>
                    </a-tooltip>
                </div>
            </div>
            <div class="flex flex-col">
                <span class="text-base font-bold font-gray">
                    {{ displayName(packageObject, name(workflowObject)) }}
                </span>

                <div class="flex flex-wrap items-center text-gray-500 gap-x-2">
                    <div class="text-sm text-gray-500">
                        <span
                            >Created
                            {{ creationTimestamp(workflowObject, true) }}
                            ago
                            <template
                                v-if="
                                    creatorUsername(workflowObject)?.startsWith(
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
                                <UserWrapper
                                    :username="creatorUsername(workflowObject)"
                                />
                            </template>
                        </span>
                    </div>
                    <div v-if="isCronWorkflow(workflowObject)">
                        •
                        <AtlanIcon icon="Schedule" class="text-success" />
                        <span
                            class="text-sm cursor-pointer hover:underline"
                            @click="toggleSchedule"
                        >
                            Scheduled
                            <a-tooltip
                                color="#2A2F45"
                                placement="bottom"
                                overlayClassName="max-w-md"
                            >
                                <template #title>
                                    <p class="text-sm font-semibold">
                                        Next runs:
                                    </p>
                                    <p
                                        class="text-xs mt-0.5 whitespace-pre-line leading-5"
                                    >
                                        {{ nextRunsPopoverText }}
                                    </p>
                                </template>
                                {{ cronString(workflowObject) }}
                                ({{ nextRunRelativeTime(workflowObject) }})
                            </a-tooltip>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex ml-auto gap-x-1 mt-1.5">
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
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import useWorkflowUpdate from '~/workflows/composables/package/useWorkflowUpdate'

    import Schedule from '@/common/input/schedule.vue'
    import UserWrapper from '~/workflowsv2/components/common/user.vue'
    import PackageIcon from '~/workflowsv2/components/common/packageIcon.vue'

    export default defineComponent({
        name: 'WorkflowHeader',
        components: { Schedule, PackageIcon, UserWrapper },
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
                isCronWorkflow,
                nextRunRelativeTime,
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

            const nextRunsPopoverText = computed(() => {
                if (nextRuns(workflowObject.value)?.length === 0) {
                    return ''
                }
                return nextRuns(workflowObject.value).join('\n')
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
                isCronWorkflow,
                cronString,
                cron,
                allowSchedule,
                scheduleVisible,
                toggleSchedule,
                scheduleCTAMessage,
                cronObject,
                cronModel,
                nextRuns,
                nextRunsPopoverText,
                handleScheduleUpdate,
                updateWorkflow,
                path,
                body,
                isLoading,
                error,
                data,
                nextRunRelativeTime,
            }
        },
    })
</script>
