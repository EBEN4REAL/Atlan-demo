<template>
    <div class="flex-col">
        <div class="flex items-center gap-x-1">
            <template v-for="index in 3" :key="index">
                <template v-if="getRunStatus(index)">
                    <a-tooltip :title="tooltipContent(index)">
                        <div
                            class="w-6 h-1.5 bg-gray-200 rounded-full cursor-pointer"
                            :class="getRunClass(index)"
                            @click.stop.prevent="handleRunClick(index)"
                        ></div>
                    </a-tooltip>
                </template>
                <div
                    v-else
                    class="w-6 h-1.5 bg-gray-200 rounded-full cursor-default"
                    :class="getRunClass(index)"
                ></div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'
    import { useRouter } from 'vue-router'
    import useWorkflowInfo from '~/workflowsv2/composables/useWorkflowInfo'

    export default defineComponent({
        props: {
            runs: {
                type: Array,
                required: false,
                default: () => [],
            },
            workflow: {
                type: String,
                required: false,
                default: () => {},
            },
        },
        setup(props) {
            const { runs, workflow } = toRefs(props)
            const { phase, finishedAt, startedAt, duration } = useWorkflowInfo()
            const router = useRouter()

            const getRun = (index) => {
                if (runs.value.length >= index) {
                    return runs.value[index - 1]
                }
                return {}
            }

            const getRunStatus = (index) => {
                const tempPhase = getRun(index)
                return tempPhase?._source?.status.phase
            }

            const getRunClass = (index) => {
                const tempStatus = getRunStatus(index)
                if (tempStatus === 'Succeeded') return 'bg-green-500 opacity-75'
                if (tempStatus === 'Failed' || tempStatus === 'Error')
                    return 'bg-red-500 opacity-75'
                if (tempStatus === 'Running')
                    return 'bg-primary opacity-75 animate-pulse'
                return 'bg-gray-200'
            }

            const getRunTime = (index, relative) => {
                const tempStatus = getRunStatus(index)

                return tempStatus === 'Running'
                    ? startedAt(getRun(index)?._source, true)
                    : finishedAt(getRun(index)?._source, true)
            }
            const handleRunClick = (index) => {
                const run = getRun(index)

                router.push(
                    `/workflows/${workflow.value}/runs?name=${run['_id']}`
                )
            }

            const tooltipContent = (index) => {
                const tempStatus = getRunStatus(index)

                if (!tempStatus) return ''

                if (tempStatus === 'Succeeded')
                    return `${tempStatus}, ${getRunTime(
                        index,
                        true
                    )} ago (${duration(getRun(index)._source)})`

                if (tempStatus === 'Failed' || tempStatus === 'Error')
                    return `${tempStatus}, ${getRunTime(
                        index,
                        true
                    )} ago (${duration(getRun(index)._source)})`

                if (tempStatus === 'Running')
                    return `${tempStatus}, started ${getRunTime(
                        index,
                        true
                    )} ago`

                return `${tempStatus}, ${getRunTime(
                    index,
                    true
                )} ago (${duration(getRun(index)._source)})`
            }

            return {
                phase,
                getRunStatus,
                getRunClass,
                tooltipContent,
                getRunTime,
                finishedAt,
                startedAt,
                getRun,
                router,
                handleRunClick,
                duration,
            }
        },
    })
</script>

<style lang="less" scoped></style>
