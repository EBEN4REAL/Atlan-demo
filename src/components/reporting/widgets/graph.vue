<template>
    <component
        :is="componentType"
        :data="testData"
        :options="data?.componentData.graphOptions"
    ></component>
</template>

<script lang="ts">
    import {
        computed,
        defineAsyncComponent,
        defineComponent,
        ref,
        toRefs,
    } from 'vue'

    import { Chart, registerables } from 'chart.js'

    import ChartDataLabels from 'chartjs-plugin-datalabels'

    Chart.register(...registerables)
    Chart.register(ChartDataLabels)

    import useIndexSearch from '~/composables/reporting/useIndexSearch'

    import { formatDateTime } from '~/utils/date'
    // import useLogSearch from '~/composables/reporting/useLogSearch'

    const Bar = defineAsyncComponent({
        loader: () => import('@/reporting/graph/bar.vue'),
    })
    const Pie = defineAsyncComponent({
        loader: () => import('@/reporting/graph/pie.vue'),
    })

    const Line = defineAsyncComponent({
        loader: () => import('@/reporting/graph/line.vue'),
    })

    const Scatter = defineAsyncComponent({
        loader: () => import('@/reporting/graph/scatter.vue'),
    })

    export default defineComponent({
        components: {
            Bar,
            Pie,
            Line,
            Scatter,
        },
        props: {
            data: {
                type: Object,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { data } = toRefs(props)

            const componentType = computed(() => {
                if (
                    data.value?.componentData.graphType &&
                    data.value?.component !== ''
                ) {
                    return data.value.componentData.graphType
                }
                return 'default'
            })

            console.log('sdasdasd', data?.value.queryIndex)
            let dataAPI
            if (data?.value.queryIndex === 'logs') {
                // dataAPI = useLogSearch(
                //     data.value?.componentData.query,
                //     data.value?.id,
                //     true
                // )
            } else {
                dataAPI = useIndexSearch(
                    data.value?.componentData.query,
                    data.value?.id,
                    true
                )
            }

            const { aggregations } = dataAPI

            const testData = computed(() => {
                const agg =
                    aggregations.value[
                        data.value?.componentData.dataOptions?.aggregationKey
                    ]
                const buckets = agg?.buckets

                if (data.value?.componentData.graphType === 'scatter') {
                    const temp = []
                    buckets?.forEach((element) => {
                        temp.push({
                            x: element.doc_count,
                            y: element.key,
                        })
                    })

                    return {
                        labels: 'keyMap',
                        datasets: [
                            {
                                data: temp,
                            },
                        ],
                    }
                }
                const keyMap = buckets?.map((i, index) => {
                    if (
                        data.value.componentData.dataOptions.keyConfig?.type?.toUpperCase() ===
                        'DATE'
                    ) {
                        return formatDateTime(i.key, {
                            month: 'short',
                            day: 'numeric',
                            timeZone:
                                Intl.DateTimeFormat().resolvedOptions()
                                    .timeZone,
                        })
                    }
                    if (
                        data.value.componentData.dataOptions.keyConfig?.type?.toUpperCase() ===
                        'RANGE'
                    ) {
                        if (
                            data.value.componentData.dataOptions.keyConfig
                                ?.interval
                        ) {
                            // const diff =
                            //     i.key -
                            //     data?.value?.componentData.dataOptions.keyConfig
                            //         ?.interval
                            return `${i.key}`
                        }
                    }
                    return i.key
                })
                const valueMap = buckets?.map((i) => i.doc_count)
                return {
                    labels: keyMap,
                    datasets: [
                        {
                            data: valueMap,
                            backgroundColor: ['#f4f6fd'],
                            borderColor: ['#5277d7'],
                            borderWidth: 1,
                        },
                    ],
                }
            })
            return { data, componentType, testData }
        },
    })
</script>
