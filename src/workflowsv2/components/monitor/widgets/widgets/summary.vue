<template>
    <div class="flex items-center flex-grow w-full">
        <div class="flex flex-col justify-between w-full">
            <div class="flex flex-col">
                <p class="mb-0 text-lg text-gray-500">Total Assets</p>
                <p class="text-lg font-bold tracking-tight text-gray-700">
                    {{ sumAggregationValue }}
                </p>
            </div>
            <div class="flex gap-4 mt-3">
                <div v-for="item in aggregationBucket" :key="item.key">
                    <div class="flex flex-col">
                        <p class="mb-0 text-sm text-gray-500">{{ item.key }}</p>
                        <p
                            class="text-base font-bold tracking-tight text-gray-700"
                        >
                            {{ item.doc_count }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'

    import useIndexSearch from '~/composables/reporting/useIndexSearch'

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

            const { aggregations } = useIndexSearch(
                data.value?.componentData.query,
                data.value?.id,
                true
            )

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

            return {
                data,
                aggregations,
                aggregationBucket,
                sumAggregationValue,
            }
        },
    })
</script>
