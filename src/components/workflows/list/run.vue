<template>
    <div class="flex items-center justify-between">
        <div class="flex-col flx">
            <div class="text-sm text-gray-500">Latest run</div>
            <div class="flex">
                <div
                    class="w-4 h-8 p-1 mr-1 bg-gray-200 rounded shadow-sm"
                    :class="getRunClass(1)"
                ></div>
                <div>2hrs ago</div>
            </div>
        </div>
        <div class="flex-col flx">
            <div class="text-sm text-gray-500">Last 5 runs</div>

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
                        return 'bg-primary opacity-75 animate-pulse'
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
