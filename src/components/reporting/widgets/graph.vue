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
        toRefs,
    } from 'vue'

    import { Chart, registerables } from 'chart.js'

    import ChartDataLabels from 'chartjs-plugin-datalabels'

    Chart.register(...registerables)
    Chart.register(ChartDataLabels)

    import useIndexSearch from '~/composables/reporting/useIndexSearch'

    import { formatDateTime } from '~/utils/date'

    const Bar = defineAsyncComponent({
        loader: () => import('@/reporting/graph/bar.vue'),
    })
    const Pie = defineAsyncComponent({
        loader: () => import('@/reporting/graph/pie.vue'),
    })

    export default defineComponent({
        components: {
            Bar,
            Pie,
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

            const { aggregations } = useIndexSearch(
                data.value?.componentData.query,
                data.value?.id,
                true
            )
            const testData = computed(() => {
                const agg =
                    aggregations.value[
                        data.value?.componentData.dataOptions?.aggregationKey
                    ]
                const buckets = agg?.buckets
                const keyMap = buckets?.map((i) => {
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
