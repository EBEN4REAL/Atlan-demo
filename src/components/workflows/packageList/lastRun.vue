<template>
    <div class="flex-col">
        <div class="flex items-center gap-x-2">
            <a-tooltip>
                <div
                    class="w-2 h-8 p-1 bg-gray-200 rounded shadow-sm"
                    :class="getRunClass(1)"
                ></div>
            </a-tooltip>
            <div class="flex flex-col" v-if="getRunStatus(1)">
                <span class="text-sm text-gray-700">
                    {{ getRunStatus(1) }}</span
                >
                <span class="text-xs text-gray-500"
                    >{{ getRunTime(1) }} ago</span
                >
            </div>
            <div v-else>No run available</div>
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
                } else if (tempStatus === 'Failed') {
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

            const getRun = (index) => {
                if (runs.value.length >= index) {
                    return runs.value[index - 1]
                }
                return {}
            }

            const getRunTime = (index, relative) => {
                const tempStatus = getRunStatus(index)

                if (tempStatus === 'Running') {
                    return startedAt(getRun(index)?._source, true)
                } else {
                    return finishedAt(getRun(index)?._source, true)
                }
            }

            const cron = computed(() => {
                return item.value.metadata.annotations[
                    'orchestration.atlan.com/schedule'
                ]
            })

            const cronString = computed(() => {
                if (cron.value) {
                    return cronstrue.toString(cron.value)
                }
            })

            const { phase, finishedAt, startedAt } = useWorkflowInfo()

            return {
                item,
                runs,
                phase,
                getRunStatus,
                getRunClass,
                cron,
                cronString,
                finishedAt,
                getRun,
                getRunTime,
                startedAt,
            }
        },
    })
</script>

<style lang="less" scoped></style>
