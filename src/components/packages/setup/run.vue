<template>
    <div class="p-6 bg-gray-100 rounded">
        <div v-if="!run?.status">
            <a-spin class="mr-2" size="small"></a-spin>Getting Run Details
        </div>
        <div v-else>
            <div class="flex text-left gap-x-6">
                <div class="flex flex-col">
                    <div class="text-sm text-gray-500">Status</div>
                    <div class="text-sm font-semibold text-gray-700">
                        <AtlanIcon
                            v-if="run?.status?.phase === 'Running'"
                            icon="Loader"
                            class="mr-1 animate-spin"
                        ></AtlanIcon>
                        {{ run?.status?.phase }}
                    </div>
                </div>

                <div class="flex flex-col">
                    <div class="text-sm text-gray-500">Started</div>
                    <div class="text-sm text-gray-700">
                        {{ startedTimeAgo }}
                    </div>
                </div>
                <div
                    class="flex flex-col"
                    v-if="run?.status?.phase !== 'Running'"
                >
                    <div class="text-sm text-gray-500">Duration</div>
                    <div class="text-sm text-gray-700">
                        {{ finishedTimeAgo }}
                    </div>
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
    import { useTimeAgo } from '@vueuse/core'
    import { formatDateTime } from '~/utils/date'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    export default defineComponent({
        name: 'WorkflowSetupTab',
        props: {
            run: {
                type: Object,
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

            const percentage = computed(() => {
                if (run?.value?.status?.progress.split('/').length > 1) {
                    return (
                        (100 * run.value.status?.progress.split('/')[0]) /
                        run.value.status?.progress.split('/')[1]
                    )
                }
                return 0
            })

            const startedTimeAgo = computed(() => {
                if (run.value.status?.startedAt) {
                    return formatDateTime(run.value.status?.startedAt)
                }
                return ''
            })
            const finishedTimeAgo = computed(() => {
                if (run.value.status?.finishedAt) {
                    return formatDateTime(run.value.status?.finishedAt)
                }
                return ''
            })

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
                run,
                useTimeAgo,
                startedTimeAgo,
                finishedTimeAgo,
                percentage,
                isLoading,
                progressStatus,
            }
        },
        components: { AtlanIcon },
    })
</script>
