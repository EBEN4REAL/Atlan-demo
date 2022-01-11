<template>
    <div class="flex-col">
        <div class="flex items-center gap-x-1">
            <template v-for="index in 3" :key="index">
                <a-tooltip :title="tooltipContent(index)">
                    <div
                        class="w-3 h-3 p-1 bg-gray-200 rounded-sm"
                        :class="getRunClass(index)"
                    ></div>
                </a-tooltip>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import cronstrue from 'cronstrue'

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
        },
        setup(props, { emit }) {
            const { item, runs } = toRefs(props)

            const getRunClass = (index) => {
                const tempStatus = getRunStatus(index)
                if (tempStatus === 'Succeeded') {
                    return 'bg-green-500 opacity-75'
                } else if (tempStatus === 'Failed' || tempStatus === 'Error') {
                    return 'bg-red-500 opacity-75'
                } else if (tempStatus === 'Running') {
                    return 'bg-primary opacity-75 animate-pulse'
                } else {
                    return 'bg-gray-200'
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

            const tooltipContent = (index) => {
                const tempStatus = getRunStatus(index)

                if (tempStatus) {
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
                duration,
            }
        },
    })
</script>

<style lang="less" scoped></style>
