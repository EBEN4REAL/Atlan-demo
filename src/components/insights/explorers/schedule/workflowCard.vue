<template>
    <div class="w-full p-3 text-sm border border-b border-gray-300 rounded-lg">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <AtlanIcon icon="Query" class="text-primary -mt-0.5 mr-1" />
                <p class="text-gray-500">Aggregate Bevrage order</p>
            </div>
            <div>
                <AtlanIcon icon="Mail" class="text-gray-500" />
            </div>
        </div>
        <div class="w-full pb-3 mt-1 mb-3 font-bold border-b border-gray-300">
            <Tooltip
                clampPercentage="99%"
                :tooltip-text="scheduleQueryName"
                :rows="2"
            />
        </div>
        <div class="flex items-center text-xs text-gray-500">
            <span class="capitalize">{{ frequency }}</span>
            <div class="w-1 h-1 bg-gray-300 mx-1.5 rounded-full"></div>
            <span
                >Next run at {{ _date?.format(format) }}
                {{ _date?.format('DD MMMM') }}
            </span>
            <div
                v-if="Object.keys(queryVariables).length"
                class="w-1 h-1 bg-gray-300 mx-1.5 rounded-full"
            ></div>
            <div v-if="Object.keys(queryVariables).length">
                <AtlanIcon icon="Flash" class="mr-1 -mt-0.5" />
                <span>{{ Object.keys(queryVariables).length }}</span>
            </div>
        </div>
        <div class="flex items-center mt-3">
            <!-- <div class="w-6 h-1 mr-1 rounded bg-success"></div>
            <div class="w-6 h-1 mr-1 rounded bg-success"></div>
            <div class="w-6 h-1 mr-1 rounded bg-success"></div> -->
            <div class="flex items-center w-full">
                <RunWidget
                    :item="runMap[item.metadata.name]"
                    :workflow="item.metadata.name"
                    :runs="runs(item.metadata.name)"
                    statusType="line"
                ></RunWidget>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        watch,
        defineComponent,
        PropType,
        toRefs,
        computed,
        inject,
        Ref,
    } from 'vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import parser from 'cron-parser'
    import dayjs from 'dayjs'
    import RunWidget from '~/components/workflows/preview/workflows/run.vue'
    import Ellipsis from '@/common/ellipsis/index.vue'

    export default defineComponent({
        components: { Tooltip, RunWidget, Ellipsis },
        props: {
            item: {
                required: true,
                type: Object as PropType<any>,
            },
        },
        setup(props) {
            const { item } = toRefs(props)
            const format = 'hh:MM A,'
            const runMap = inject('runMap') as Ref<any>

            const workflowParameters = computed(() => {
                if (
                    item.value.spec.templates.length &&
                    item.value.spec.templates[0].dag.tasks.length
                ) {
                    return item.value.spec.templates[0].dag.tasks[0].arguments
                        .parameters
                }
                return []
            })

            const scheduleQueryName = computed(() => {
                return (
                    workflowParameters.value.find(
                        (e) => e.name === 'report-name'
                    ).value ?? '-'
                )
            })
            const queryVariables = computed(() => {
                return (
                    JSON.parse(
                        workflowParameters.value.find(
                            (e) => e.name === 'query-variables'
                        ).value
                    ) ?? []
                )
            })

            const interval = parser.parseExpression(
                item.value.metadata.annotations[
                    'orchestration.atlan.com/schedule'
                ]
            )

            const _date = dayjs(interval.next().toString())
            const getCronFrequency = (cronString) => {
                const interval = parser.parseExpression(cronString)

                if (
                    interval.fields.hour.length === 24 &&
                    interval.fields.dayOfMonth.length === 31 &&
                    interval.fields.dayOfWeek.length === 8 &&
                    interval.fields.month.length === 12
                ) {
                    return 'hourly'
                }

                if (
                    interval.fields.dayOfMonth.length === 31 &&
                    interval.fields.dayOfWeek.length === 8 &&
                    interval.fields.month.length === 12
                ) {
                    return 'daily'
                }
                if (
                    interval.fields.dayOfMonth.length === 31 &&
                    interval.fields.dayOfWeek.join(',') ===
                        [1, 2, 3, 4, 5].join(',') &&
                    interval.fields.month.length === 12
                ) {
                    return 'weekdays'
                }
                if (
                    interval.fields.dayOfMonth.length === 31 &&
                    interval.fields.dayOfWeek.join(',') === [0, 6].join(',') &&
                    interval.fields.month.length === 12
                ) {
                    return 'weekend'
                }
                if (
                    interval.fields.dayOfMonth.length === 1 &&
                    interval.fields.dayOfWeek.length === 8 &&
                    interval.fields.month.length === 12
                ) {
                    return 'monthly'
                }
                return ''
            }
            const frequency = computed(() =>
                getCronFrequency(
                    item.value.metadata.annotations[
                        'orchestration.atlan.com/schedule'
                    ]
                )
            )

            const runs = (workflow) => runMap.value[workflow]

            // const parsedDate = new Date(_date.toString())
            return {
                runMap,
                format,
                _date,
                item,
                scheduleQueryName,
                queryVariables,
                frequency,
                runs,
            }
        },
    })
</script>
<style lang="less" scoped>
    .shadow-custom {
        box-shadow: 1px 2px 3px 3px #0000000d;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
