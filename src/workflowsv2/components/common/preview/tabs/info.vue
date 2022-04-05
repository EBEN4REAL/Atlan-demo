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
                <span class="ml-1 pt-0.5">{{ cronString(workflow) }}</span>
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
            <a-divider class="mt-5 mb-0" />
            <div class="mb-1">
                <p class="info-title">Package and Type</p>

                <div class="flex mb-2 gap-x-2">
                    <span class="font-bold truncate text-primary">
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
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import { whenever } from '@vueuse/core'
    import { getDurationStringFromSec } from '~/utils/time'

    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'
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
        emits: [],
        setup(props) {
            const { runs, workflow } = toRefs(props)
            const {
                isCronWorkflow,
                cronString,
                creatorUsername,
                creationTimestamp,
                modifierUsername,
                name: wfName,
                packageType,
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

            return {
                wfName,
                isCronWorkflow,
                cronString,
                creatorUsername,
                modifierUsername,
                creationTimestamp,
                packageType,
                name,
                version,
                estimatedRuntime,
                data,
                runCountLoading,
                runCount,
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
