<template>
    <div
        v-if="isLoading"
        style="height: 150px; width: 100%"
        class="flex items-center justify-center p-3 mt-3 bg-white gap-x-2"
    >
        <AtlanLoader class="h-6" />
        <span>Loading Run</span>
    </div>
    <a-tabs v-else v-model:activeKey="activeKey" :class="$style.previewtab">
        <a-tab-pane key="summary" tab="Summary">
            <div
                class="pt-2 space-y-2 overflow-y-auto"
                style="background-color: #f9fafc"
            >
                <div class="flex px-5 py-3 mb-2 bg-white gap-x-3">
                    <div class="flex flex-col w-full gap-y-4">
                        <div class="flex items-center justify-between w-full">
                            <div>
                                <p class="mb-1 info-title">Status</p>

                                <AtlanIcon
                                    :icon="getRunIconByPhase(selectedRun)"
                                    class="mb-0.5 mr-1"
                                />

                                <span
                                    :class="getRunTextClass(selectedRun)"
                                    class="font-semibold"
                                >
                                    {{ phase(selectedRun) }}
                                </span>
                            </div>

                            <AtlanButton2
                                v-if="['Running'].includes(phase(selectedRun))"
                                class="text-red-500"
                                color="secondary"
                                label="Stop"
                                @click="handleStop"
                            />

                            <AtlanButton2
                                v-if="
                                    ['Failed', 'Error'].includes(
                                        phase(selectedRun)
                                    )
                                "
                                class="text-new-blue-400 border-new-blue-300"
                                label="Retry"
                                color="secondary"
                                prefix-icon="Retry"
                                @click="handleRetry"
                            />
                        </div>
                        <div
                            v-if="
                                ['Failed', 'Error'].includes(
                                    phase(selectedRun)
                                ) && statusMessage(selectedRun)
                            "
                        >
                            <p class="mb-1 info-title">Message</p>
                            <span class="">
                                {{ statusMessage(selectedRun) }}
                            </span>
                        </div>
                        <button
                            v-if="
                                ['Failed', 'Error'].includes(phase(selectedRun))
                            "
                            class="flex items-center justify-center py-2 font-bold transition-colors rounded gap-x-1 text-new-red-400 bg-new-red-200 bg-opacity-20 hover:bg-opacity-30"
                            @click="activeKey = 'failed'"
                        >
                            View Failed tasks
                            <AtlanIcon icon="ArrowRight" />
                        </button>
                    </div>
                </div>

                <!-- <p class="info-title">Started At</p>
                <p class="mb-2 text-gray-700">
                    {{ startedAt(selectedRun, false) }}
                </p> -->
                <div class="px-5 py-4 bg-white 2">
                    <p class="mb-1 info-title">Start Time</p>
                    <div class="flex items-center gap-x-2">
                        <AtlanIcon icon="ClockStart" />
                        <span class="text-sm text-new-gray-800">
                            {{
                                startedAt(
                                    selectedRun,
                                    false,
                                    "H:mm:ss A, MMM Do 'YY"
                                )
                            }}
                        </span>
                    </div>

                    <template v-if="finishedAt(selectedRun, false) !== 'N/A'">
                        <p class="mt-4 mb-1 info-title">Finish Time</p>
                        <div class="flex items-center gap-x-2">
                            <AtlanIcon icon="ClockStop" />
                            <span class="text-sm text-new-gray-800">
                                {{
                                    finishedAt(
                                        selectedRun,
                                        false,
                                        "H:mm:ss A, MMM Do 'YY"
                                    )
                                }}
                            </span>
                        </div>
                    </template>

                    <a-divider class="my-4" />

                    <div class="flex items-center justify-between">
                        <div class="flex items-center text-sm gap-x-2">
                            <AtlanIcon icon="Clock" />
                            <span class="text-new-gray-600">Duration:</span>
                            <span class="text-new-gray-800">
                                {{
                                    phase(selectedRun) === 'Running'
                                        ? runTime
                                        : duration(selectedRun)
                                }}
                            </span>
                        </div>

                        <!--   <a-button
                v-if="['Succeeded'].includes(phase(selectedRun))"
                @click="handleMetrics"
                >View Metrics</a-button
            >-->
                        <a-modal
                            v-model:visible="isMetricVisible"
                            width="100%"
                            :centered="true"
                            :body-style="{
                                height: 'calc(100vh - 100px)',
                            }"
                            :destroy-on-close="true"
                            :closable="false"
                        >
                            <div class="h-full px-6 py-3">
                                <WorkflowMetrics
                                    :selected-pod="selectedPod"
                                    :selected-run="selectedRun"
                                ></WorkflowMetrics>
                            </div>
                            <template #footer> </template>
                        </a-modal>
                    </div>
                </div>

                <div class="px-5 py-4 bg-white">
                    <div>
                        <p class="info-title">Run Mode</p>
                        <div
                            v-if="isCronRun(selectedRun)"
                            class="mb-2 text-gray-700"
                        >
                            Scheduled Run
                        </div>
                        <div
                            v-else-if="creatorUsername(selectedRun)"
                            class="mb-2 text-gray-700"
                        >
                            Manually Run by
                            <template
                                v-if="
                                    creatorUsername(selectedRun)?.startsWith(
                                        'service-account-apikey-'
                                    )
                                "
                            >
                                <AtlanIcon icon="Key" class="h-3" /> API token
                            </template>
                            <UserWrapper
                                v-else
                                :username="creatorUsername(selectedRun)"
                            />
                        </div>
                    </div>

                    <div>
                        <p class="info-title">Reference</p>
                        <a
                            :href="link"
                            target="_blank"
                            class="mb-2 font-medium text-primary hover:underline"
                        >
                            Open in Argo
                        </a>
                    </div>
                    <!-- <div
                        v-if="error"
                        class="flex items-center w-full bg-white gap-x-1"
                    >
                        <AtlanIcon class="h-5" icon="Error" />
                        <span>{{ error.message }}</span>
                    </div> -->
                </div>
            </div>
        </a-tab-pane>
        <a-tab-pane
            v-if="['Error', 'Failed'].includes(phase(selectedRun))"
            key="failed"
            class="shadow"
            tab="Failed Tasks"
        >
            <div
                class="flex flex-col px-3 pt-4 pb-2 overflow-y-auto bg-white shadow"
            >
                <div class="flex flex-col gap-y-2">
                    <div class="flex w-full mb-2 gap-x-2">
                        <div class="flex flex-grow gap-x-2">
                            <a-select
                                ref="select"
                                v-model:value="selectedPodName"
                                class="flex-grow"
                                :dropdown-match-select-width="false"
                                style="max-width: 240px"
                            >
                                <a-select-option
                                    v-for="pod in failedPods"
                                    :key="pod.name"
                                    >{{ pod.displayName }}</a-select-option
                                >
                                <template #suffixIcon>
                                    <AtlanIcon icon="CaretDown" class="" />
                                </template>
                            </a-select>
                            <AtlanButton2
                                label="Logs"
                                color="secondary"
                                @click="handleLogs"
                            />
                        </div>

                        <a-modal
                            v-model:visible="isLogVisible"
                            :destroy-on-close="true"
                            :closable="false"
                            width="80%"
                            :centered="true"
                            :body-style="{
                                height: 'calc(100vh - 100px)',
                            }"
                        >
                            <div class="h-full px-6 py-3">
                                <WorkflowLogs
                                    :selected-pod="selectedPod"
                                    :selected-run="selectedRun"
                                ></WorkflowLogs>
                            </div>
                            <template #footer> </template>
                        </a-modal>
                    </div>
                    <div class="flex flex-col">
                        <p class="info-title">Name</p>
                        <div class="mb-2 text-gray-700 break-all">
                            {{ selectedPod?.name }}
                        </div>
                    </div>
                    <div
                        v-if="
                            ['Failed', 'Error'].includes(selectedPod?.phase) &&
                            selectedPod?.message
                        "
                        class="flex flex-col"
                    >
                        <p class="info-title">Message</p>
                        <div class="mb-2 text-gray-700">
                            {{ selectedPod.message }}
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <p class="info-title">Started At</p>
                        <p class="mb-2 text-gray-700">
                            {{ formatDate(selectedPod?.startedAt) }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <p class="info-title">Finished At</p>
                        <p class="mb-2 text-gray-700">
                            {{ formatDate(selectedPod?.finishedAt) }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <p class="info-title">Duration</p>
                        <p class="mb-2 text-gray-700">
                            {{
                                difference(
                                    selectedPod?.startedAt,
                                    selectedPod?.finishedAt
                                )
                            }}
                        </p>
                    </div>
                    <div class="flex flex-col">
                        <p class="info-title">Reference</p>
                        <div class="mb-2 text-gray-700 break-all">
                            {{ selectedPod?.id }}
                        </div>
                    </div>
                </div>
            </div>
        </a-tab-pane>
    </a-tabs>
</template>

<script lang="ts">
    // Vue
    import { computed, defineComponent, inject, ref, toRefs, watch } from 'vue'
    import { Modal, message } from 'ant-design-vue'
    import { until, useIntervalFn } from '@vueuse/core'

    import useWorkflowRunRetry from '~/workflows/composables/package/useWorkflowRunRetry'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import useWorkflowRunStop from '~/workflows/composables/package/useWorkflowRunStop'
    import { getDurationStringFromMilliSec } from '~/utils/time'

    import WorkflowLogs from './logs.vue'
    import WorkflowMetrics from './metrics.vue'
    import UserWrapper from '~/workflowsv2/components/common/user.vue'

    export default defineComponent({
        components: {
            WorkflowLogs,
            WorkflowMetrics,
            UserWrapper,
        },
        props: {
            selectedRun: {
                type: Object,
                required: false,
            },
            isLoading: {
                type: Boolean,
                required: false,
            },
            error: {
                type: Object,
                required: false,
            },
        },
        emits: ['setSelectedGraph', 'openLog'],
        setup(props, { emit }) {
            const selectedPodName = ref('')
            const activeKey = ref('summary')
            const isLogVisible = ref(false)
            const isMetricVisible = ref(false)
            const { selectedRun } = toRefs(props)

            const {
                phase,
                message: statusMessage,
                startedAt,
                finishedAt,
                duration,
                name,
                isCronRun,
                creatorUsername,
                phaseMessage,
                getRunIconByPhase,
                getRunTextClass,
                podFinishedAt,
                difference,
                formatDate,
            } = useWorkflowInfo()

            const link = computed(
                () =>
                    `${
                        window.location.origin
                    }/api/orchestration/workflows/default/${name(
                        selectedRun.value
                    )}`
            )

            const failedPods = computed(() => {
                const temp = []
                if (selectedRun?.value?.metadata?.name) {
                    Object.keys(
                        selectedRun?.value?.status?.nodes || {}
                    ).forEach((key) => {
                        if (
                            ['Failed', 'Error'].includes(
                                selectedRun.value?.status?.nodes[key].phase
                            ) &&
                            selectedRun.value?.status?.nodes[key].type === 'Pod'
                        ) {
                            temp.push(selectedRun.value?.status?.nodes[key])
                        }
                    })
                }
                return temp
            })

            watch(failedPods, () => {
                if (failedPods.value.length > 0) {
                    selectedPodName.value = failedPods.value[0]?.name
                }
            })

            const selectedPod = computed(() => {
                if (selectedPodName.value) {
                    return failedPods.value.find(
                        (i) => i?.name === selectedPodName?.value
                    )
                }
                return {}
            })

            const handleNewRun = inject('newrun')
            const messageKey = ref('messageKey')
            const handleRetry = () => {
                Modal.confirm({
                    title: 'Are you sure you want to retry this run?',
                    content: 'This will retry all the failed tasks',
                    okText: 'Yes',
                    onOk: async () => {
                        const path = ref({
                            name: selectedRun.value?.metadata?.name,
                        })
                        const { data, isLoading, error } = useWorkflowRunRetry(
                            path,
                            true
                        )

                        message.loading({
                            content: 'Retrying the run',
                            key: messageKey.value,
                        })

                        await until(isLoading).toBe(false)
                        if (error)
                            message.error({
                                content: 'Failed to start new run',
                                key: messageKey.value,
                            })

                        if (data) {
                            handleNewRun(name(data.value))
                            message.success({
                                content: 'Run started',
                                key: messageKey.value,
                            })
                        }
                    },
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onCancel() {},
                })
            }

            const handleStop = () => {
                Modal.confirm({
                    title: 'Are you sure you want to stop this run?',
                    content:
                        'It might take 15-30 seconds for the workflow to kill all the tasks.',
                    okText: 'Yes',
                    onOk: async () => {
                        const path = ref({
                            name: selectedRun.value?.metadata?.name,
                        })
                        const { data, error, isLoading } = useWorkflowRunStop(
                            path,
                            true
                        )

                        message.loading({
                            content: 'Stopping the run',
                            key: messageKey.value,
                        })
                        await until(isLoading).toBe(false)
                        if (error)
                            message.error({
                                content: 'Failed to stop running workflow',
                                key: messageKey.value,
                            })
                        if (data)
                            message.success({
                                content:
                                    'Run will be stopped and all the tasks will be cancelled',
                                key: messageKey.value,
                            })
                    },
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onCancel() {},
                })
            }

            const handleLogs = () => {
                isLogVisible.value = true
            }

            const handleMetrics = () => {
                isMetricVisible.value = true
            }

            const runTime = ref('')

            const { pause, resume } = useIntervalFn(
                () => {
                    const scanStartTimeDiff =
                        Math.round(Date.now() / 1000) * 1000 -
                        new Date(selectedRun.value?.status?.startedAt).getTime()
                    runTime.value =
                        getDurationStringFromMilliSec(scanStartTimeDiff)
                },
                1000,
                { immediate: false, immediateCallback: false }
            )

            watch(
                () => phase(selectedRun.value),
                (currentPhase) => {
                    if (currentPhase === 'Running') resume()
                    else pause()
                },
                { immediate: true }
            )

            return {
                selectedPod,
                runTime,
                phase,
                startedAt,
                finishedAt,
                duration,
                statusMessage,
                selectedRun,
                activeKey,
                name,
                link,
                creatorUsername,
                isCronRun,
                phaseMessage,
                getRunIconByPhase,
                getRunTextClass,
                failedPods,
                podFinishedAt,
                formatDate,
                difference,
                selectedPodName,
                handleRetry,
                messageKey,
                handleNewRun,
                handleLogs,

                isLogVisible,
                isMetricVisible,
                handleStop,
                handleMetrics,
            }
        },
    })
</script>

<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-tabpane) {
            @apply flex flex-col overflow-hidden;
        }

        :global(.ant-tabs-tab:first-child) {
            @apply ml-6;
        }

        :global(.ant-tabs-tab-active) {
            -webkit-text-stroke: 0.65px;
            -moz-text-stroke: 0.65px;
        }

        :global(.ant-tabs-nav) {
            @apply mb-0 !important;
        }

        :global(.ant-tabs-content-holder) {
            @apply overflow-y-auto !important;
        }
        :global(.ant-tabs-content) {
            @apply min-h-full !important;
        }
    }
</style>

<style>
    .info-title {
        @apply text-sm text-new-gray-600 font-medium;
    }
</style>
