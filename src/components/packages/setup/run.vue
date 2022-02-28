<template>
    <div class="p-6 bg-gray-100 rounded">
        <div v-if="!run?.status" class="flex items-center">
            <AtlanLoader class="h-5 mr-2" />
            <span>Loading Run Details</span>
        </div>
        <div v-else>
            <div class="flex text-left gap-x-6">
                <div class="flex flex-col">
                    <span class="text-sm text-gray-500">Status</span>
                    <span class="text-sm font-semibold text-gray-700">
                        <AtlanLoader
                            v-if="run?.status?.phase === 'Running'"
                            class="mr-1"
                        />
                        {{ run?.status?.phase }}
                    </span>
                </div>

                <div class="flex flex-col">
                    <span class="text-sm text-gray-500">Started</span>
                    <span class="text-sm text-gray-700">
                        {{ startedTimeAgo }}
                    </span>
                </div>
                <div class="flex flex-col">
                    <span class="text-sm text-gray-500">
                        {{
                            run?.status?.phase === 'Running'
                                ? 'Elapsed'
                                : 'Duration'
                        }}
                    </span>
                    <span class="text-sm text-gray-700">
                        {{
                            run?.status?.phase === 'Running'
                                ? runtime
                                : duration(run)
                        }}
                    </span>
                </div>
            </div>
            <div class="flex items-center mt-3">
                <a-progress
                    :percent="percentage"
                    :showInfo="false"
                    :status="progressStatus"
                    class="mr-2"
                />
                <div class="flex flex-col">
                    <div class="text-sm text-gray-700">
                        {{ run?.status?.progress }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { computed, defineComponent, toRefs } from 'vue'
    import { useIntervalFn, useTimeAgo } from '@vueuse/core'
    import { formatDateTime } from '~/utils/date'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'

    export default defineComponent({
        name: 'WorkflowRun',
        props: {
            run: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            isLoading: {
                type: Boolean,
            },
            error: {
                type: Object,
            },
        },
        setup(props, { emit }) {
            const { run, isLoading } = toRefs(props)

            const { startedAt, duration } = useWorkflowInfo()

            const percentage = computed(() => {
                if (run?.value?.status?.progress?.split('/').length > 1) {
                    return (
                        (100 * run.value.status?.progress.split('/')[0]) /
                        run.value.status?.progress.split('/')[1]
                    )
                }
                return 0
            })

            const startedTimeAgo = computed(() => startedAt(run.value, false))

            const runtime = computed(() => startedAt(run.value, true))

            const progressStatus = computed(() => {
                if (run?.value.status?.phase === 'Running') {
                    return 'active'
                }
                if (run?.value.status?.phase === 'Succeeded') {
                    return 'success'
                }
                if (run?.value.status?.phase === 'Failed') {
                    return 'exception'
                }
                return 'exception'
            })

            return {
                useTimeAgo,
                startedTimeAgo,
                percentage,
                progressStatus,
                runtime,
                duration,
            }
        },
    })
</script>
