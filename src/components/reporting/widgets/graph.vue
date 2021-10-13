<template>
    <component :is="componentType" :data="testData"></component>
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

    export default defineComponent({
        name: 'Home',
        props: {
            id: {
                type: String,
                required: false,
            },
            label: {
                type: String,
                required: false,
            },
            payload: {
                type: Object,
                required: false,
            },
        },
        components: {
            Bar: defineAsyncComponent(
                () => import('@/reporting/graphs/bar.vue')
            ),
        },
        setup(props, { emit }) {
            const { payload, id } = toRefs(props)
            console.log(id.value)
            console.log(payload.value)

            const componentType = computed(() => {
                if (
                    payload.value?.graphType &&
                    payload.value?.component !== ''
                ) {
                    return payload.value.graphType
                }
                return 'default'
            })

            console.log(id.value)
            const { aggregations } = useIndexSearch(
                payload.value?.query,
                id.value
            )

            const testData = computed(() => {
                const agg = aggregations.value[payload.value.aggregationKey]
                const buckets = agg?.buckets

                const keyMap = buckets?.map((i) => {
                    if (payload.value.keyConfig.type.toUpperCase() === 'DATE') {
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

            return { payload, componentType, testData }
        },
    })
</script>
