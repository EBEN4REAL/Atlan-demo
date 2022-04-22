<template>
    <AtlanLoader v-if="isLoading" class="h-10 my-auto" />
    <component
        :is="componentType"
        v-else
        :data="testData"
        :options="data?.componentData.graphOptions"
    />
</template>

<script lang="ts">
    import {
        computed,
        defineAsyncComponent,
        defineComponent,
        inject,
        Ref,
        toRefs,
        watch,
    } from 'vue'
    import dayjs from 'dayjs'
    import utc from 'dayjs/plugin/utc'
    import timezone from 'dayjs/plugin/timezone'
    import advanced from 'dayjs/plugin/advancedFormat'

    import { Chart, registerables } from 'chart.js'

    import ChartDataLabels from 'chartjs-plugin-datalabels'

    import { formatDateTime } from '~/utils/date'
    import useIndexSearch from '~/workflowsv2/composables/useIndexSearch'

    Chart.register(...registerables)
    // Chart.register(ChartDataLabels)

    // import useLogSearch from '~/composables/reporting/useLogSearch'

    // Setting defaults
    Chart.defaults.backgroundColor = '#4A7ADF22'
    Chart.defaults.borderColor = '#225BD2'

    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.extend(advanced)

    const Bar = defineAsyncComponent({
        loader: () => import('../graph/bar.vue'),
    })

    const Line = defineAsyncComponent({
        loader: () => import('../graph/line.vue'),
    })

    export default defineComponent({
        components: {
            Bar,
            Line,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
        },
        setup(props, { emit }) {
            const { data } = toRefs(props)
            const filters = inject<Ref<Record<string, any>>>('monitorFilters')!

            const body = computed(() => ({
                dsl: {
                    ...data.value?.componentData.query,
                    ...data.value?.componentData?.filterQuery?.(filters?.value),
                },
            }))

            const componentType = computed(() => {
                if (
                    data.value?.componentData.graphType &&
                    data.value?.component !== ''
                ) {
                    return data.value.componentData.graphType
                }
                return 'default'
            })

            const { aggregations, refresh, isLoading } = useIndexSearch(body)

            const testData = computed(() => {
                const agg =
                    aggregations.value[
                        data.value?.componentData.dataOptions?.aggregationKey
                    ]
                const buckets = agg?.buckets as any[]
                const keyMap: string[] = []

                if (
                    data.value.componentData.dataOptions.keyConfig?.type?.toUpperCase() ===
                    'DATE'
                ) {
                    const days = Math.round(
                        (buckets[buckets.length - 1].key - buckets[0].key) /
                            (1000 * 60 * 60 * 24)
                    ) // ms * seconds * minutes * hours

                    let formatter = ''
                    if (days < 2) formatter = 'h a'
                    else if (days < 20) formatter = 'MMM D'
                    else formatter = 'MMM D'

                    buckets?.forEach((i) =>
                        keyMap.push(
                            dayjs.tz(i.key, dayjs.tz.guess()).format(formatter)
                        )
                    )
                } else {
                    buckets?.forEach((i) => keyMap.push(i.key))
                }

                const valueMap = buckets?.map((i) => i.doc_count)

                return {
                    labels: keyMap,
                    datasets: [
                        {
                            data: valueMap,
                            // borderWidth: 2,
                        },
                    ],
                }
            })

            watch(filters, () => refresh(), { deep: true })

            return { data, componentType, testData, isLoading }
        },
    })
</script>
