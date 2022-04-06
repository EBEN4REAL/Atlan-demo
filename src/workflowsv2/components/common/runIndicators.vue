<template>
    <div class="flex-col">
        <div class="pill-wrapper" :class="type">
            <template v-for="index in 5" :key="index">
                <template v-if="getRunStatus(index)">
                    <a-tooltip :title="tooltipContent(index)">
                        <div
                            class="cursor-pointer status-pill"
                            :class="[getRunClass(index), type]"
                            @click.stop.prevent="handleRunClick(index)"
                        ></div>
                    </a-tooltip>
                </template>
                <div
                    v-else
                    class="bg-gray-200 cursor-default status-pill"
                    :class="[getRunClass(index), type]"
                ></div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
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
            type: {
                type: String as PropType<'horizontal' | 'vertical'>,
                default: () => 'horizontal',
            },
        },
        setup(props) {
            const { runs, workflow } = toRefs(props)
            const { phase, finishedAt, startedAt, duration, getRunTooltip } =
                useWorkflowInfo()
            const router = useRouter()

            const getRun = (index) => {
                if (runs.value.length >= index) {
                    return runs.value[index - 1]?._source
                }
                return {}
            }

            const getRunStatus = (index) => phase(getRun(index))

            const getRunClass = (index) => {
                const tempStatus = phase(getRun(index))
                switch (tempStatus) {
                    case 'Succeeded':
                        return 'bg-green-500 bg-opacity-75'
                    case 'Running':
                        return 'bg-yellow-300 bg-opacity-75'
                    case 'Failed':
                    case 'Error':
                    case 'Stopped':
                        return 'bg-red-500 bg-opacity-75'
                    default:
                        return 'bg-gray-200'
                }
            }

            const handleRunClick = (index) => {
                const run = getRun(index)

                router.push(
                    `/workflows/${workflow.value}/runs?name=${run['_id']}`
                )
            }

            const tooltipContent = (index) => {
                const tRun = getRun(index)
                return getRunTooltip(tRun)
            }

            return {
                phase,
                getRunStatus,
                getRunClass,
                tooltipContent,
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

<style lang="less" scoped>
    .status-pill {
        @apply rounded-full;

        &.horizontal {
            width: 32px;
            height: 6px;
        }

        &.vertical {
            height: 32px;
            width: 6px;
        }
    }
    .pill-wrapper {
        @apply flex items-center;

        &.horizontal {
            @apply gap-x-1;
        }

        &.vertical {
            @apply gap-x-2;
        }
    }
</style>
