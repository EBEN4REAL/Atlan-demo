import bodybuilder from 'bodybuilder'
import { Search } from '~/services/meta/search'
import { computed } from 'vue'

export function useOwnershipData(user) {
    const query = bodybuilder()
        // .filter('term', 'ownerUsers', user.value.username)
        .aggregation('terms', '__typeName.keyword', {}, 'group_by_typeName')
        .build()
    const { data } = Search.IndexSearch({ dsl: query }, {})

    const ownedEntitiesCount = computed(() => {
        const entities = {}
        const aggregations =
            data?.value?.aggregations?.group_by_typeName?.buckets || []
        aggregations.forEach((aggregation) => {
            entities[aggregation.key] = aggregation.doc_count
        })
        return entities
    })

    return {
        ownedEntitiesCount,
    }
}
