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

    import { formatDateTime } from '~/utils/date'
    import useIndexSearch from '~/workflowsv2/composables/useIndexSearch'

    Chart.register(...registerables)
    Chart.register(ChartDataLabels)

    // import useLogSearch from '~/composables/reporting/useLogSearch'

    const Bar = defineAsyncComponent({
        loader: () => import('../graph/bar.vue'),
    })

    export default defineComponent({
        components: {
            Bar,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
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

            const dataAPI = useIndexSearch(
                data.value?.componentData.query,
                data.value?.id,
                true
            )

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
