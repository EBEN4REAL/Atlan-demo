<template>
    <div class="flex-col">
        <div class="flex items-center gap-x-1">
            <template v-for="index in 3" :key="index">
                <template v-if="getRunStatus(index)">
                    <a-tooltip :title="tooltipContent(index)">
                        <div
                            class="bg-gray-200 rounded-sm"
                            :class="getRunClass(index)"
                            @click.stop.prevent="handleRunClick(index)"
                        ></div>
                    </a-tooltip>
                </template>
                <div
                    class="bg-gray-200 rounded-sm cursor-default"
                    :class="getRunClass(index)"
                    v-else
                ></div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import cronstrue from 'cronstrue'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            runs: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            workflow: {
                type: String,
                required: false,
            },
            statusType: {
                type: String,
                required: false,
                default: 'square',
            },
        },
        setup(props, { emit }) {
            const { item, runs, workflow, statusType } = toRefs(props)

            const getRunClass = (index) => {
                const tempStatus = getRunStatus(index)
                if (statusType.value === 'square') {
                    if (tempStatus === 'Succeeded') {
                        return 'bg-green-500 opacity-75 p-1 w-3 h-3'
                    } else if (
                        tempStatus === 'Failed' ||
                        tempStatus === 'Error'
                    ) {
                        return 'bg-red-500 opacity-75 p-1'
                    } else if (tempStatus === 'Running') {
                        return 'bg-primary opacity-75 animate-pulse p-1 w-3 h-3'
                    } else {
                        return 'bg-gray-200 p-1 w-3 h-3'
                    }
                } else if (statusType.value === 'line') {
                    if (tempStatus === 'Succeeded') {
                        return 'bg-green-500 opacity-75 w-6 h-1'
                    } else if (
                        tempStatus === 'Failed' ||
                        tempStatus === 'Error'
                    ) {
                        return 'bg-red-500 opacity-75 w-6 h-1'
                    } else if (tempStatus === 'Running') {
                        return 'bg-primary opacity-75 w-6 h-1 animate-pulse'
                    } else {
                        return 'bg-gray-200 w-6 h-1'
                    }
                }
            }

            const getRunStatus = (index) => {
                const tempPhase = getRun(index)
                return tempPhase?._source?.status.phase
            }

            const cron = computed(() => {
                return item.value.metadata.annotations[
                    'orchestration.atlan.com/schedule'
                ]
            })

            const getRun = (index) => {
                if (runs.value.length >= index) {
                    return runs.value[index - 1]
                }
                return {}
            }

            const cronString = computed(() => {
                if (cron.value) {
                    return cronstrue.toString(cron.value)
                }
            })

            const getRunTime = (index, relative) => {
                const tempStatus = getRunStatus(index)

                if (tempStatus === 'Running') {
                    return startedAt(getRun(index)?._source, true)
                } else {
                    return finishedAt(getRun(index)?._source, true)
                }
            }
            const router = useRouter()
            const handleRunClick = (index) => {
                const run = getRun(index)

                router.push(
                    `/workflows/${workflow.value}/runs?name=${run['_id']}`
                )
            }

            const tooltipContent = (index) => {
                const tempStatus = getRunStatus(index)

                if (!tempStatus) {
                    return ''
                }
                if (tempStatus === 'Succeeded') {
                    return `${tempStatus}, ${getRunTime(
                        index,
                        true
                    )} ago (${duration(getRun(index)._source)})`
                } else if (tempStatus === 'Failed' || tempStatus === 'Error') {
                    return `${tempStatus}, ${getRunTime(
                        index,
                        true
                    )} ago (${duration(getRun(index)._source)})`
                } else if (tempStatus === 'Running') {
                    return `${tempStatus}, started ${getRunTime(
                        index,
                        true
                    )} ago`
                }
                return `${tempStatus}, ${getRunTime(
                    index,
                    true
                )} ago (${duration(getRun(index)._source)})`
            }

            const { phase, finishedAt, startedAt, duration } = useWorkflowInfo()

            return {
                item,
                runs,
                phase,
                getRunStatus,
                getRunClass,
                cron,
                cronString,
                tooltipContent,
                getRunTime,
                finishedAt,
                startedAt,
                getRun,
                router,
                handleRunClick,
                workflow,
                duration,
            }
        },
    })
</script>

<style lang="less" scoped></style>
