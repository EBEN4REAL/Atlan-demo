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
                <div class="flex items-center text-base gap-x-1">
                    <span
                        class="font-bold tracking-wide truncate cursor-pointer text-new-gray-800"
                        >{{ displayName }}</span
                    >
                    <span class="italic truncate text-grey-500">
                        ({{ refName(workflowObject) }})
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
            <!-- Delete Modal -->
            <a-modal
                v-model:visible="deleteModalVisible"
                destroyOnClose
                :maskClosable="false"
                :closable="false"
                class="text-new-gray-800"
            >
                <template #title>
                    <div class="flex items-center gap-x-3">
                        <AtlanIcon icon="Delete" class="h-6 text-red-500" />
                        <span class="text-base">Delete Workflow?</span>
                    </div>
                </template>
                <Transition>
                    <div
                        v-if="
                            !isConfirmDelete &&
                            type(workflowObject) === 'connector'
                        "
                        class="w-full px-5 py-3 space-y-2 text-sm bg-new-gray-100"
                    >
                        <p>
                            <b>Note:</b> In case you wish to delete the assets
                            fetched by this connection, Atlan recommends
                            deleting the connection, instead of the workflow.
                        </p>
                        <p
                            @click="navigateToConnectionDelete"
                            class="font-bold cursor-pointer text-new-blue-500 hover:text-new-blue-400"
                        >
                            Take me to Delete Connection instead
                            <AtlanIcon icon="External" />
                        </p>
                    </div>
                </Transition>

                <div class="px-5 py-4 text-sm border-t border-b">
                    <p>
                        Are you sure you want to delete the workflow
                        {{
                            type(workflowObject) === 'connector'
                                ? 'that updates the'
                                : ''
                        }}
                    </p>
                    <div class="flex items-center mt-1 truncate gap-x-2">
                        <img
                            v-if="icon(packageObject)"
                            :src="icon(packageObject)"
                            class="w-4 h-auto mb-0.5"
                        />
                        <span
                            v-else-if="emoji(packageObject)"
                            class="text-xs"
                            >{{ emoji(packageObject) }}</span
                        >
                        <b>
                            {{ pkgName(packageObject) }}
                            <AtlanIcon
                                icon="CaretRight"
                                class="-ml-1 -mr-0.5 mb-0.5"
                            />
                            {{ displayName }}
                        </b>
                        <template v-if="type(workflowObject) === 'connector'">
                            connection?
                            <a-tooltip
                                color="#2A2F45"
                                placement="top"
                                title="Workflows in Atlan run to update a connection (manually or at scheduled intervals)"
                            >
                                <AtlanIcon
                                    icon="QuestionRoundSmall"
                                    class="mb-0.5 cursor-help"
                                />
                            </a-tooltip>
                        </template>
                    </div>

                    <template v-if="type(workflowObject) === 'connector'">
                        <p class="mt-4">
                            <span class="font-bold text-red-500"
                                >Warning:
                            </span>
                            By deleting the workflow, Atlan will no longer be
                            able to update assets in this connection. Contact
                            <b>Atlan support</b> for any questions.
                        </p>
                        <div
                            class="flex items-center w-full p-2 mt-4 rounded-md bg-new-red-100 gap-x-1"
                        >
                            <a-checkbox
                                :class="$style.danger"
                                v-model:checked="isConfirmDelete"
                                >I understand the risks, delete the
                                workflow.</a-checkbox
                            >
                        </div>

                        <Transition>
                            <div v-if="isConfirmDelete" class="mt-3 border-t">
                                <div
                                    class="w-full p-4 mt-3 rounded-md bg-primary-light"
                                >
                                    To avoid stale metadata, Atlan recommends
                                    you also delete the connection and assets
                                    created by this workflow.
                                </div>
                                <a-checkbox
                                    class="mt-4"
                                    v-model:checked="isConnectionDelete"
                                >
                                    Proceed to
                                    <a-tooltip
                                        color="#2A2F45"
                                        placement="bottom"
                                        title="The delete connection package helps delete or archive the assets fetched by a connection."
                                    >
                                        <!-- prettier-ignore -->
                                        <span
                                        class="font-medium cursor-help"
                                        style="text-decoration: underline dotted #e0e4eb"
                                    >
                                        delete connection
                                    </span>
                                    </a-tooltip>
                                    after deleting workflow.
                                </a-checkbox>
                            </div>
                        </Transition>
                    </template>
                    <div
                        v-else
                        class="flex items-center w-full p-2 mt-4 bg-red-100 rounded-md gap-x-1"
                    >
                        <a-checkbox v-model:checked="isConfirmDelete"
                            >I understand the risks, delete the
                            workflow.</a-checkbox
                        >
                    </div>
                </div>
                <template #footer>
                    <div class="flex items-center my-1.5 gap-x-2">
                        <AtlanButton2
                            class="ml-auto"
                            color="secondary"
                            label="Cancel"
                            @click="deleteModalVisible = false"
                        />
                        <AtlanButton2
                            label="Delete"
                            color="danger"
                            :loading="isDeleteLoading"
                            :disabled="!isConfirmDelete"
                            @click="archiveWorkflow"
                        />
                    </div>
                </template>
            </a-modal>

            <!-- Schedule Modal -->
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
    import { useHead } from '@vueuse/head'

    import useWorkflowSubmit from '~/workflows/composables/package/useWorkflowSubmit'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'
    import useWorkflowUpdate from '~/workflows/composables/package/useWorkflowUpdate'
    import { deleteWorkflowByName } from '~/workflowsv2/composables/useWorkflowList'

    import Dropdown from '~/workflowsv2/components/common/dropdown.vue'
    import Schedule from '@/common/input/schedule.vue'
    import UserWrapper from '~/workflowsv2/components/common/user.vue'
    import PackageIcon from '~/workflowsv2/components/common/packageIcon.vue'

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
            const deleteModalVisible = ref(false)
            const isConfirmDelete = ref(false)
            const isConnectionDelete = ref(false)

            const {
                name,
                refName,
                creationTimestamp,
                creatorUsername,
                displayName: dName,
                cronString,
                cron,
                allowSchedule,
                cronObject,
                nextRuns,
                isCronWorkflow,
                nextRunRelativeTime,
            } = useWorkflowInfo()

            const { type, name: pkgName, icon, emoji } = usePackageInfo()

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

            const {
                error: err,
                isLoading: isDeleteLoading,
                mutate: deleteWorkflow,
            } = deleteWorkflowByName(name(workflowObject.value), false)

            const navigateToConnectionDelete = () => {
                const qfName = name(workflowObject.value)
                    ?.split(`${name(packageObject.value)}-`)
                    .pop()
                    ?.replaceAll('-', '/')

                router.push({
                    path: '/workflows/setup/atlan-connection-delete',
                    query: { 'connection-qualified-name': qfName },
                })
            }

            const archiveWorkflow = async () => {
                deleteWorkflow()
                await until(isDeleteLoading).toBe(false)

                if (err.value) message.error('Failed to delete workflow')
                else {
                    message.success('Workflow deleted')
                    if (isConnectionDelete.value) {
                        message.loading('Taking you to delete connection page')
                        setTimeout(navigateToConnectionDelete, 1500)
                    } else handleBack()
                }
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
                    handleClick: () => {
                        deleteModalVisible.value = true
                    },
                },
            ])

            const displayName = computed(() =>
                dName(
                    packageObject.value,
                    name(workflowObject.value),
                    workflowObject.value.spec
                )
            )
            useHead({
                title: displayName.value,
            })

            return {
                handleBack,
                refName,
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
                deleteModalVisible,
                isConfirmDelete,
                isConnectionDelete,
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
                isDeleteLoading,
                icon,
                emoji,
                navigateToConnectionDelete,
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

    .v-enter-active,
    .v-leave-active {
        transition: opacity 0.3s ease;
    }

    .v-enter-from,
    .v-leave-to {
        opacity: 0;
    }
</style>

<style lang="less" module>
    .danger {
        :global(.ant-checkbox-input:hover + .ant-checkbox-inner) {
            @apply border-new-red-400;
        }
        :global(.ant-checkbox-input:focus + .ant-checkbox-inner) {
            @apply border-new-red-400;
        }
        :global(.ant-checkbox-checked::after) {
            @apply border-new-red-400;
        }
        :global(.ant-checkbox-checked .ant-checkbox-inner) {
            @apply bg-new-red-400;
            @apply border-new-red-400;
        }
    }
</style>
