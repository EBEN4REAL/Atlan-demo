<template>
    <div class="flex items-start w-full px-6 pt-3 gap-x-3">
        <IconButton
            icon="CaretLeft"
            class="mt-1.5 text-gray-500"
            @click="handleBack"
        />

        <div
            v-if="packageObject?.metadata?.annotations"
            class="flex flex-1 mb-2 border-gray-200 gap-x-2"
        >
            <div class="relative flex-none mt-0.5">
                <PackageIcon :package="packageObject" />

                <div
                    v-if="
                        packageObject?.metadata?.labels[
                            'orchestration.atlan.com/certified'
                        ] === 'true'
                    "
                    class="absolute -top-1 -right-1"
                >
                    <a-tooltip title="Certified" placement="left">
                        <AtlanIcon icon="Verified" />
                    </a-tooltip>
                </div>
            </div>

            <div class="truncate">
                <!-- <div class="flex items-center gap-x-1">
                    <span class="truncate text-new-gray-700">{{
                        pkgName(workflowObject)
                    }}</span>
                    <div v-if="type(workflowObject)" class="badge">
                        <span style="margin-top: 1px">{{
                            type(workflowObject)
                        }}</span>
                    </div>
                </div> -->

                <div class="flex items-center text-base gap-x-1">
                    <span
                        class="font-bold tracking-wide truncate cursor-pointer text-new-gray-800"
                        >{{
                            displayName(
                                packageObject,
                                name(workflowObject),
                                workflowObject.spec
                            )
                        }}</span
                    >
                    <span class="italic truncate text-grey-500">
                        ({{ name(workflowObject) }})
                    </span>
                </div>

                <div
                    class="flex flex-wrap items-center mt-0.5 text-gray-500 gap-x-2"
                >
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

        <div class="flex ml-auto gap-2 mt-1.5">
            <a-modal
                v-model:visible="scheduleVisible"
                title="Schedule"
                destroyOnClose
            >
                <div class="px-4 py-2">
                    <Schedule v-model="cronModel" />
                </div>
                <template #footer>
                    <div class="flex items-center mt-3 gap-x-2">
                        <AtlanButton2
                            v-if="isCronWorkflow(workflowObject)"
                            color="secondary"
                            label="Remove schedule"
                            prefixIcon="Unscheduled"
                            @click="removeWorkflowSchedule"
                        />
                        <AtlanButton2
                            class="ml-auto"
                            color="secondary"
                            label="Cancel"
                            @click="scheduleVisible = false"
                        />
                        <AtlanButton2
                            label="Save"
                            :loading="isLoading"
                            :disabled="!isScheduleUpdated"
                            @click="handleScheduleUpdate"
                        />
                    </div>
                </template>
            </a-modal>

            <AtlanButton2
                v-if="allowSchedule(workflowObject)"
                class="font-medium"
                color="secondary"
                prefix-icon="Schedule"
                :label="scheduleCTAMessage"
                @click="toggleSchedule"
            />

            <AtlanButton2
                label="Run Workflow"
                color="secondary"
                prefix-icon="WorkflowsActive"
                class="font-medium"
                @click="handleRunNow"
            />

            <Dropdown :options="dropdownOptions">
                <template #menuTrigger>
                    <IconButton icon="KebabMenu" />
                </template>
            </Dropdown>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch, h } from 'vue'
    import { useRouter } from 'vue-router'
    import { Modal, message } from 'ant-design-vue'
    import { watchOnce, until } from '@vueuse/core'
    import useWorkflowSubmit from '~/workflows/composables/package/useWorkflowSubmit'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'
    import useWorkflowUpdate from '~/workflows/composables/package/useWorkflowUpdate'
    import { deleteWorkflowByName } from '~/workflowsv2/composables/useWorkflowList'

    import Dropdown from '~/workflowsv2/components/common/dropdown.vue'
    import Schedule from '@/common/input/schedule.vue'
    import UserWrapper from '~/workflowsv2/components/common/user.vue'
    import PackageIcon from '~/workflowsv2/components/common/packageIcon.vue'
    import { useHead } from '@vueuse/head'

    export default defineComponent({
        name: 'WorkflowHeader',
        components: { Schedule, PackageIcon, UserWrapper, Dropdown },
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

            const handleBack = () => {
                if (window.history.state.back) router.back()
                else router.push('/workflows')
            }

            const scheduleVisible = ref(false)

            const {
                name,
                refName,
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

            const { type, name: pkgName } = usePackageInfo()

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

            const isScheduleUpdated = computed(() => {
                const current = cronObject(workflowObject.value)
                return (
                    current.cron !== cronModel.value.cron ||
                    current.timezone !== cronModel.value.timezone
                )
            })

            const handleRunNow = () => {
                Modal.confirm({
                    title: 'Are you sure you want to run this workflow?',

                    content: '',
                    okText: 'Yes',
                    onOk: async () => {
                        const body = {
                            namespace: 'default',
                            resourceKind: 'WorkflowTemplate',
                            resourceName: refName(workflowObject.value),
                        }
                        const { data, error, mutate, isLoading } =
                            useWorkflowSubmit(body, true)

                        message.loading({
                            content: 'Starting a new workflow run',
                            key: messageKey.value,
                        })

                        await until(isLoading).toBe(false)
                        if (error) {
                            message.error({
                                content: 'Failed to run workflow',
                                key: messageKey.value,
                            })
                        }
                        if (data) {
                            emit('newrun', refName(data.value))
                            message.success({
                                content: 'Workflow run started',
                                key: messageKey.value,
                            })
                        }
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
                if (Object.keys(data.value || {}).length) {
                    message.success(
                        cronModel.value?.cron
                            ? 'Workflow schedule updated'
                            : 'Workflow schedule removed'
                    )
                    scheduleVisible.value = false
                }
            })

            watch(error, () => {
                if (error.value) {
                    message.error('Workflow schedule failed. Please try again')
                    scheduleVisible.value = false
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

            const removeWorkflowSchedule = () => {
                Modal.confirm({
                    title: 'Remove Schedule',
                    content: 'Are you sure you want to remove the schedule?',
                    okType: 'danger',
                    autoFocusButton: null,
                    okButtonProps: {
                        type: 'primary',
                    },
                    okText: 'Confirm',
                    cancelText: 'Cancel',
                    async onOk() {
                        cronModel.value.cron = undefined
                        handleScheduleUpdate()
                    },
                })
            }

            const archiveWorkflow = (workflowName: string) => {
                Modal.confirm({
                    title: 'Delete Workflow',
                    content: () =>
                        h('span', [
                            'Are you sure you want to delete ',
                            h('b', [workflowName]),
                            ' workflow?',
                        ]),
                    okType: 'danger',
                    autoFocusButton: null,
                    okButtonProps: {
                        type: 'primary',
                    },
                    okText: 'Delete',
                    cancelText: 'Cancel',
                    async onOk() {
                        const { error: err, isLoading: isDeleteLoading } =
                            deleteWorkflowByName(workflowName, true)
                        await until(isDeleteLoading).toBe(false)
                        if (err.value)
                            message.error('Failed to delete workflow')
                        else {
                            message.success('Workflow deleted')
                            handleBack()
                        }
                    },
                })
            }

            const dropdownOptions = computed(() => [
                {
                    title: 'Remove Schedule',
                    icon: 'Unscheduled',
                    hide: !cron(workflowObject.value),
                    class: 'border-b',
                    wrapperClass: 'text-new-gray-800',
                    handleClick: removeWorkflowSchedule,
                },
                {
                    title: 'Delete Workflow',
                    icon: 'Delete',
                    wrapperClass: 'text-red-500',
                    handleClick: () =>
                        archiveWorkflow(workflowObject.value?.metadata?.name),
                },
            ])

            useHead({
                title: displayName(
                    packageObject.value,
                    name(workflowObject.value)
                ),
            })
            return {
                handleBack,
                name,
                creationTimestamp,
                creatorUsername,
                displayName,
                type,
                pkgName,
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
                archiveWorkflow,
                dropdownOptions,
                removeWorkflowSchedule,
                isScheduleUpdated,
            }
        },
    })
</script>

<style scoped>
    .badge {
        @apply flex items-center justify-center;
        @apply h-5 rounded uppercase px-2 mx-1;
        @apply text-xs tracking-wider bg-gray-200 text-gray;
    }
</style>
