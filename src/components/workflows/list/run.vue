<template>
    <div class="flex items-center justify-between">
        <div class="flex flex-col">
            <div>last run 2hrs ago</div>
            <div class="flex items-center">
                <div class="flex w-3 h-3 mr-1">
                    <span
                        class="absolute inline-flex w-4 h-4 -mt-0.5 -ml-0.5 rounded-full opacity-75 animate-ping bg-primary-focus"
                    ></span>
                    <span
                        class="relative inline-flex w-3 h-3 rounded-full bg-primary"
                    ></span>
                </div>
                Scheduled
            </div>
        </div>

        <div class="flex items-center gap-x-2">
            <template v-for="index in 5" :key="index">
                <a-tooltip>
                    <div
                        class="w-4 h-8 p-1 bg-gray-200 rounded shadow-sm"
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
                console.log(item.value.metadata.name)
                console.log(runs)
                if (runs.value.length >= index) {
                    const tempPhase = runs.value[index - 1]

                    console.log(item.value.metadata.name)
                    console.log(runs)
                    if (tempPhase._source.status.phase === 'Succeeded') {
                        return 'bg-green-500'
                    } else if (tempPhase._source.status.phase === 'Failed') {
                        return 'bg-red-500'
                    } else if (tempPhase._source.status.phase === 'Running') {
                        return 'bg-primary-focus animate-pulse'
                    } else {
                        return 'bg-gray-200'
                    }
                }
            }
            const getRunStatus = (index) => {
                if (runs.value.length >= index) {
                    const tempPhase = runs.value[index - 1]
                    return tempPhase._source.status.phase
                }
            }

            const { phase } = useWorkflowInfo()

            return {
                item,
                runs,
                phase,
                getRunStatus,
                getRunClass,
            }
        },
    })
</script>

<style lang="less" scoped></style>
