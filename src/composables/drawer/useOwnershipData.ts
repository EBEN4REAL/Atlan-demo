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

    // [
    // {
    //     "key": "column",
    // },
    //     {
    //         "key": "table",
    //     },
    //     {
    //         "key": "columnprocess",
    //     },
    //     {
    //         "key": "view",
    //     },
    //     {
    //         "key": "process",
    //     },
    //     {
    //         "key": "atlasglossaryterm",
    //         "doc_count": 593
    //     },
    //     {
    //         "key": "schema",
    //         "doc_count": 369
    //     },
    //     {
    //         "key": "atlasglossarycategory",
    //         "doc_count": 204
    //     },
    //     {
    //         "key": "database",
    //         "doc_count": 172
    //     },
    //     {
    //         "key": "__atlasauditentry",
    //         "doc_count": 134
    //     }
    // ]

    return {
        ownedEntitiesCount,
    }
}
