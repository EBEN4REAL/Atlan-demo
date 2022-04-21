<template>
    <div class="flex flex-col h-full overflow-y-hidden text-sm bg-white">
        <div
            class="flex items-center justify-between px-5 py-2 border-b border-gray-200 bg-gray-50"
        >
            <span class="flex items-center">
                <PreviewTabsIcon :icon="tab.icon" height="h-4" class="mb-0.5" />
                <span class="ml-1 font-semibold text-gray-500">Overview</span>
            </span>
        </div>
        <div class="flex flex-col p-5 overflow-y-scroll gap-y-4">
            <div class="grid grid-cols-3">
                <div>
                    <p class="info-title">Run Count</p>
                    <p v-if="runCount" class="font-bold text-primary">
                        {{ runCount }}
                    </p>
                    <p
                        v-else-if="runCountLoading"
                        class="text-gray-500 animate-pulse"
                    >
                        Loading
                    </p>
                </div>
                <div v-if="estimatedRuntime" class="col-span-2">
                    <p class="info-title">Estimated Runtime</p>
                    <p class="italic text-gray">{{ estimatedRuntime }}</p>
                </div>
            </div>
            <div v-if="isCronWorkflow(workflow)">
                <p class="info-title">Schedule</p>

                <AtlanIcon icon="Schedule" class="text-success" />
                <span class="ml-1">{{ cronString(workflow, true) }}</span>
            </div>

            <div v-if="isCronWorkflow(workflow)">
                <p class="info-title">Next Run</p>
                <span class="text-sm">{{ nextRunRelativeTime(workflow) }}</span>
            </div>

            <div v-if="creatorUsername(workflow)">
                <p class="info-title">Created</p>
                <span>{{ creationTimestamp(workflow, true) }} by </span>
                <UserWrapper
                    :key="creatorUsername(workflow)"
                    :username="creatorUsername(workflow)"
                />
            </div>

            <div v-if="modifierUsername(workflow)">
                <p class="info-title">Modified</p>
                <span>By </span>
                <UserWrapper
                    :key="modifierUsername(workflow)"
                    :username="modifierUsername(workflow)"
                />
            </div>

            <div>
                <p class="info-title">Last 5 runs</p>
                <RunIndicators
                    :workflow="wfName(workflow)"
                    :runs="runs"
                    type="vertical"
                />
            </div>

            <div class="flex mt-2">
                <AtlanButton2
                    prefix-icon="WorkflowsActive"
                    label="Run Workflow"
                    color="secondary"
                    @click="handleRunNow"
                />
            </div>
            <a-divider class="mt-1 mb-0" />
            <div class="mb-1">
                <p class="info-title">Package and Type</p>

                <div class="flex mb-2 gap-x-2">
                    <span class="font-bold truncate text-new-gray-600">
                        {{ name(workflow) }}
                    </span>
                    <span class="italic text-gray-500"
                        >v{{ version(workflow) }}</span
                    >
                </div>

                <div v-if="packageType(workflow)" class="badge">
                    <span style="margin-top: 1px">{{
                        packageType(workflow)
                    }}</span>
                </div>
            </div>
            <div>
                <p class="info-title">Workflow ID</p>
                <p class="text-gray-700">{{ wfName(workflow) }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, inject, ref, toRefs, watch } from 'vue'
    import { until, watchOnce, whenever } from '@vueuse/core'
    import { Modal, message } from 'ant-design-vue'
    import { getDurationStringFromSec } from '~/utils/time'

    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
    import useWorkflowSubmit from '~/workflowsv2/composables/useWorkflowSubmit'

    import { usePackageInfo } from '~/workflowsv2/composables/usePackageInfo'
    import RunIndicators from '~/workflowsv2/components/common/runIndicators.vue'
    import UserWrapper from '~/workflowsv2/components/common/user.vue'
    import { useRunDiscoverList } from '~/workflowsv2/composables/useRunDiscoverList'

    export default defineComponent({
        name: 'WorkflowInfo',
        components: { PreviewTabsIcon, RunIndicators, UserWrapper },
        props: {
            tab: {
                type: Object,
                default: () => ({}),
            },
            workflow: {
                type: Object,
                default: () => {},
            },
            runs: {
                type: Array,
                default: () => [],
            },
        },
        setup(props) {
            const { runs, workflow } = toRefs(props)
            const updateRunByWorkflowName = inject(
                'updateRunByWorkflowName',
                () => {}
            )

            const {
                isCronWorkflow,
                cronString,
                creatorUsername,
                creationTimestamp,
                modifierUsername,
                name: wfName,
                packageType,
                nextRunRelativeTime,
                workflowTemplateName,
            } = useWorkflowInfo()

            const { name, version } = usePackageInfo()

            const estimatedRuntime = computed(() => {
                const secs = runs.value.reduce((acc: number[], run: any) => {
                    if (run?._source?.status?.estimatedDuration)
                        acc.push(run?._source?.status?.estimatedDuration)
                    return acc
                }, [] as number[])
                if (secs[0]) return getDurationStringFromSec(secs[0])
                return undefined
            })

            const {
                data,
                isLoading: runCountLoading,
                quickChange,
            } = useRunDiscoverList({
                facets: computed(() => ({
                    workflowTemplate: workflow.value?.metadata.name,
                })),
                limit: ref(0),
                immediate: false,
            })

            whenever(workflow, () => {
                if (runs.value.length >= 5) quickChange()
            })

            const runCount = computed(() =>
                runs.value.length >= 5
                    ? data.value?.hits?.total?.value
                    : runs.value.length
            )

            const handleRunNow = () => {
                Modal.confirm({
                    title: 'Are you sure you want to run this workflow?',

                    content: '',
                    okText: 'Yes',
                    onOk: async () => {
                        const body = {
                            namespace: 'default',
                            resourceKind: 'WorkflowTemplate',
                            resourceName: wfName(workflow.value),
                        }

                        const {
                            data: wfSubmitData,
                            error,
                            isLoading,
                        } = useWorkflowSubmit(body, true)

                        message.loading({
                            content: 'Starting a new run',
                            key: 'runKey',
                        })

                        await until(isLoading).toBe(false)

                        if (error.value)
                            message.error({
                                content: 'Failed to start workflow',
                                key: 'runKey',
                            })

                        if (wfSubmitData.value) {
                            setTimeout(
                                () =>
                                    updateRunByWorkflowName(
                                        workflowTemplateName(wfSubmitData.value)
                                    ),
                                600
                            )

                            message.success({
                                content: 'Run started',
                                key: 'runKey',
                            })
                        }
                    },
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    onCancel() {},
                })
            }

            return {
                wfName,
                isCronWorkflow,
                cronString,
                creatorUsername,
                modifierUsername,
                creationTimestamp,
                nextRunRelativeTime,
                packageType,
                name,
                version,
                estimatedRuntime,
                data,
                runCountLoading,
                runCount,
                handleRunNow,
            }
        },
    })
</script>

<style scoped>
    .info-title {
        @apply font-medium text-gray-500;
        @apply mb-2;
    }

    .badge {
        @apply inline-flex items-center justify-center;
        @apply h-5 rounded uppercase px-2;
        @apply text-xs tracking-wider bg-gray-200 text-gray;
    }
</style>
