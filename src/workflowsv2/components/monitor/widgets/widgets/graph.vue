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
