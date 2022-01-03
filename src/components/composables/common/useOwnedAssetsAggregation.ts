import { ref, watch } from 'vue'
import bodybuilder from 'bodybuilder'
import assetCategories from '~/constant/assetCategories'
import useIndexSearch from '~/composables/discovery/useIndexSearch'

interface IOwnerFilter {
    ownerGroups?: string[]
    ownerUsers?: string[]
}

export default function useOwnedAssetAggregation() {
    // Ownership Widget Data
    const aggData = ref({
        state: '',
        data: {},
    })
    assetCategories.forEach((category) => {
        aggData.value.data[category.id] = {
            label: category.label,
            id: category.id,
            count: 0,
        }
    })

    const getAggregateOwnedEntities = (ownerFilterObject: IOwnerFilter) => {
        const base = bodybuilder()
        base.orFilter('terms', '__typeName.keyword', ['Asset'])
        base.filterMinimumShouldMatch(1)
        base.aggregation(
            'terms',
            '__typeName.keyword',
            { size: 50 },
            `group_by_typeName`
        )
        base.filter('term', '__state', 'ACTIVE')
        if (ownerFilterObject?.ownerGroups?.length)
            base.filter('terms', 'ownerGroups', ownerFilterObject.ownerGroups)
        if (ownerFilterObject?.ownerUsers?.length)
            base.filter('terms', 'ownerUsers', ownerFilterObject.ownerUsers)

        const requestBody = base.build()
        const {
            data,
            error: aggError,
            isLoading: aggLoading,
        } = useIndexSearch(
            {
                dsl: { from: 0, size: 0, ...requestBody },
            },
            ref('GET_OWNED_ASSETS_COUNT'),
            false
        )
        return { data, aggLoading, aggError }
    }

    const clearAggData = () => {
        aggData.value = {
            state: '',
            data: {},
        }
        assetCategories.forEach((category) => {
            aggData.value.data[category.id] = {
                label: category.label,
                id: category.id,
                count: 0,
            }
        })
    }

    const populateAggregateData = (ownerFilterObject: IOwnerFilter) => {
        clearAggData()
        const { data, aggLoading, aggError } =
            getAggregateOwnedEntities(ownerFilterObject)
        watch(
            [aggLoading, aggError],
            () => {
                if (aggLoading.value) aggData.value.state = 'loading'
                else if (!aggError.value && !aggLoading.value) {
                    aggData.value.state = 'success'
                    if (
                        data?.value?.aggregations?.group_by_typeName?.buckets
                            ?.length
                    ) {
                        const { buckets } =
                            data.value.aggregations.group_by_typeName

                        if (buckets && buckets.length) {
                            buckets.forEach((bucket) => {
                                const typeName = bucket.key.toLowerCase()
                                const category = assetCategories.find((cat) =>
                                    cat?.children?.find(
                                        (child) =>
                                            (child?.id ?? '').toLowerCase() ===
                                            typeName
                                    )
                                )
                                if (category) {
                                    aggData.value.data[category.id].count +=
                                        bucket.doc_count
                                }
                            })
                        }
                    }
                } else if (aggError.value && !aggLoading.value)
                    aggData.value.state = 'error'
                // else if (aggLoading.value) aggData.value.state = 'loading'
                else aggData.value.state = ''
            },
            { immediate: true, deep: true }
        )
    }

    return {
        aggData,
        populateAggregateData,
    }
}
