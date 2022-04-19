<template>
    <div class="relative flex flex-col w-full">
        <AtlanLoader v-if="isLoading" class="absolute top-0 right-0 h-5" />
        <p class="mb-0 text-lg text-gray-500">Total Assets</p>
        <p class="text-lg font-bold tracking-tight text-gray-700">
            {{ sumAggregationValue }}
        </p>

        <div class="flex gap-4 mt-3">
            <div v-for="item in aggregationBucket" :key="item.key">
                <p class="mb-0 text-sm text-gray-500">{{ item.key }}</p>
                <p class="text-base font-bold tracking-tight text-gray-700">
                    {{ item.doc_count }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, inject, Ref, toRefs, watch } from 'vue'

    import useIndexSearch from '~/workflowsv2/composables/useIndexSearch'

    export default defineComponent({
        components: {},
        props: {
            data: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        setup(props, { emit }) {
            const { data } = toRefs(props)
            const filters = inject<Ref<Record<string, any>>>('monitorFilters')!

            const body = computed(() => ({
                dsl: {
                    ...data.value?.componentData.query,
                    ...data.value?.componentData?.filterQuery(filters?.value),
                },
            }))

            const { aggregations, refresh, isLoading } = useIndexSearch(body)

            const aggregationBucket = computed(() => {
                return aggregations.value[
                    data.value?.componentData.dataOptions.aggregationKey
                ]?.buckets
            })

            const sumAggregationValue = computed(() => {
                return aggregations.value[
                    data.value?.componentData.dataOptions.sumAggregationValue
                ]?.value
            })

            watch(
                filters,
                () => {
                    console.log('Filters updated')
                    refresh()
                },
                { deep: true }
            )

            return {
                data,
                aggregations,
                aggregationBucket,
                sumAggregationValue,
                isLoading,
            }
        },
    })
</script>
