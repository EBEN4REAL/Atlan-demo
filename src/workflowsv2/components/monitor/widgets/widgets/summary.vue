<template>
    <div class="relative flex flex-col justify-between w-full text-center">
        <AtlanLoader v-if="isLoading" class="h-10 my-auto" />
        <template v-else>
            <div class="pt-4 pb-2" v-if="mainStatText">
                <p class="text-4xl font-bold text-new-gray-800">
                    {{ mainAggregation?.toLocaleString?.() }}
                </p>
                <p class="text-sm text-gray-500">{{ mainStatText }}</p>
            </div>

            <div class="flex justify-around gap-4 mt-3">
                <div v-for="item in aggregationBucket" :key="item.key">
                    <p class="text-lg font-bold tracking-tight text-gray-700">
                        {{ item.doc_count?.toLocaleString?.() }}
                    </p>
                    <p class="mb-0 text-sm text-gray-500">{{ item.key }}</p>
                </div>
            </div>
        </template>
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
                    ...data.value?.componentData?.filterQuery?.(filters?.value),
                },
            }))

            const { aggregations, refresh, isLoading } = useIndexSearch(body)

            const aggregationBucket = computed(
                () =>
                    aggregations.value[
                        data.value?.componentData.dataOptions.aggregationKey
                    ]?.buckets
            )

            const mainAggregation = computed(
                () =>
                    aggregations.value[
                        data.value?.componentData.dataOptions.mainStatKey
                    ]?.value
            )

            const mainStatText = computed(
                () => data.value?.componentData?.dataOptions?.mainStatText
            )

            watch(filters, () => refresh(), { deep: true })

            return {
                data,
                aggregations,
                aggregationBucket,
                mainAggregation,
                mainStatText,
                isLoading,
            }
        },
    })
</script>
