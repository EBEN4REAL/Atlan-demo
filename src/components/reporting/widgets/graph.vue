<template>
    <component
        class="h-full"
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

    import useIndexSearch from '~/composables/reporting/useIndexSearch'

    import { formatDateTime } from '~/utils/date'

    const Bar = defineAsyncComponent({
        loader: () => import('@/reporting/graph/bar.vue'),
    })

    export default defineComponent({
        components: {
            Bar,
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
                data.value?.id.value
            )
            const testData = computed(() => {
                const agg =
                    aggregations.value[
                        data.value?.componentData.dataOptions?.aggregationKey
                    ]
                const buckets = agg?.buckets
                const keyMap = buckets?.map((i) => {
                    if (
                        data.value.componentData.dataOptions.keyConfig.type.toUpperCase() ===
                        'DATE'
                    ) {
                        return formatDateTime(i.key, {
                            month: 'short',
                            day: 'numeric',
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
                            backgroundColor: [
                                '#77CEFF',
                                '#0079AF',
                                '#123E6B',
                                '#97B0C4',
                                '#A5C8ED',
                            ],
                        },
                    ],
                }
            })
            return { data, componentType, testData }
        },
    })
</script>
