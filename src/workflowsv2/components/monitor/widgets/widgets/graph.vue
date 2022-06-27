<template>
    <AtlanLoader v-if="isLoading" class="h-10 my-auto" />
    <component :is="componentType" v-else :data="graphData" :options="data" />
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

    import useIndexSearch from '~/workflowsv2/composables/useIndexSearch'

    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.extend(advanced)

    const Bar = defineAsyncComponent({
        loader: () => import('../graph/bar.vue'),
    })

    const Area = defineAsyncComponent({
        loader: () => import('../graph/area.vue'),
    })

    export default defineComponent({
        components: {
            Bar,
            Area,
        },
        props: {
            data: {
                type: Object,
                default: () => ({}),
            },
        },
        setup(props) {
            const { data } = toRefs(props)
            const filters = inject<Ref<Record<string, any>>>('monitorFilters')!

            const body = computed(() => ({
                dsl: {
                    ...data.value?.componentData.query,
                    ...data.value?.componentData?.filterQuery?.(filters?.value),
                },
            }))

            const componentType = computed(() => {
                if (data.value?.componentData.graphType)
                    return data.value.componentData.graphType

                return 'default'
            })

            const { aggregations, refresh, isLoading } = useIndexSearch(body)

            const graphData = computed(() => {
                const buckets = aggregations.value[
                    data.value?.componentData.dataOptions?.aggregationKey
                ]?.buckets as any[]

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
                    else if (days < 3) formatter = 'h a, ddd'
                    else if (days < 20) formatter = 'MMM D'
                    else formatter = 'MMM D'

                    return buckets?.map((bucket) => ({
                        timestamp: dayjs
                            .tz(bucket.key, dayjs.tz.guess())
                            .format(formatter),
                        count: bucket.doc_count,
                    })) as Record<string, any>[]
                }

                return buckets
            })

            watch(filters, () => refresh(), { deep: true })

            return { componentType, graphData, isLoading }
        },
    })
</script>
