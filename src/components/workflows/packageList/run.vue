<template>
    <div class="flex-col">
        <div class="flex items-center gap-x-1">
            <template v-for="index in 3" :key="index">
                <a-tooltip>
                    <div
                        class="w-2 h-6 p-1 bg-gray-200 rounded shadow-sm"
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
                console.log(item.value.metadata.name)
                console.log(runs)
                if (runs.value.length >= index) {
                    const tempPhase = runs.value[index - 1]

                    console.log(item.value.metadata.name)
                    console.log(runs)
                    if (tempPhase._source.status.phase === 'Succeeded') {
                        return 'bg-green-500 opacity-75'
                    } else if (tempPhase._source.status.phase === 'Failed') {
                        return 'bg-red-500 opacity-75'
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

            const { phase } = useWorkflowInfo()

            return {
                item,
                runs,
                phase,
                getRunStatus,
                getRunClass,
                cron,
                cronString,
            }
        },
    })
</script>

<style lang="less" scoped></style>
