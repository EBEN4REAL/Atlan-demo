<template>
    <div class="flex-col w-full">
        <span class="text-gray-700">{{ workflow }}</span>

        <div class="flex items-center justify-between w-full">
            <div class="mr-1 font-normal text-gray-500">last three runs</div>
            <RunWidget
                :item="item"
                :workflow="workflow"
                :runs="runs"
            ></RunWidget>
        </div>
        <div class="flex items-center w-full gap-x-2">
            <div class="flex items-center justify-between"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import useWorkflowInfo from '~/composables/workflow/useWorkflowInfo'
    import cronstrue from 'cronstrue'
    import RunWidget from './run.vue'

    export default defineComponent({
        components: {
            RunWidget,
        },
        props: {
            item: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            workflow: {
                type: String,
                required: false,
                default() {
                    return ''
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
