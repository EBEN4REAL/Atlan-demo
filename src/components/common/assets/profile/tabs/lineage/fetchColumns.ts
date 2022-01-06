import { ref, watch } from 'vue'
import bodybuilder from 'bodybuilder'
import { assetInterface } from '~/types/assets/asset.interface'
import useIndexSearch from '~/composables/discovery/useIndexSearch'
import {
    AssetRelationAttributes,
    InternalAttributes,
    SQLAttributes,
} from '~/constant/projection'

export default function fetchColumns({
    viewQualifiedName,
    tableQualifiedName,
}) {
    const attributes = [...InternalAttributes, ...SQLAttributes]
    const relationAttributes = [...AssetRelationAttributes]
    const base = bodybuilder()
    const offset = 0
    const limit = 20
    const preference = { sort: 'order-asc' }
    const [name, type] = preference.sort.split('-')
    const facets = [
        {
            key: '__state',
            value: 'ACTIVE',
            type: 'must',
        },
        {
            key: '__typeName.keyword',
            value: 'Column',
            type: 'must',
        },
        {
            key: 'viewQualifiedName',
            value: viewQualifiedName,
            type: 'should',
        },
        {
            key: 'tableQualifiedName',
            value: tableQualifiedName,
            type: 'should',
        },
    ]

    base.sort(name, type)
    base.from(offset)
    base.size(limit)
    base.filterMinimumShouldMatch(1)
    facets.forEach((x) => {
        const { key, value, type } = x
        const filterType = type === 'should' ? 'orFilter' : 'filter'
        const termType = type === 'should' ? 'terms' : 'term'
        base[filterType](termType, key, value)
    })

    const localKey = ref('LINEAGE_COLUMNS_TWO')
    const isCache = false
    const tempQuery = base.build()
    const dsl = {
        ...tempQuery,
        query: tempQuery.query,
    }
    const body = {
        dsl,
        attributes,
        relationAttributes,
    }
    const { data } = useIndexSearch<assetInterface>(
        body,
        localKey,
        isCache,
        false,
        1
    )
    const list = ref([])

    watch(data, () => {
        if (data?.value?.entities) list.value = data?.value?.entities
    })

    return {
        list,
    }
}
