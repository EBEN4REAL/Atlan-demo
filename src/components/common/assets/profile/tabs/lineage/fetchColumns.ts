import { computed, ref } from 'vue'
import bodybuilder from 'bodybuilder'
import { assetInterface } from '~/types/assets/asset.interface'
import useIndexSearch from '~/composables/discovery/useIndexSearch'

export default function fetchColumns(
    typeName,
    qualifiedName,
    offset,
    limit = 5
) {
    const attributes = [
        'dataType',
        'qualifiedName',
        'certificateStatus',
        'table',
        'view',
    ]
    const relationAttributes = []
    const base = bodybuilder()
    const preference = { sort: 'order-asc' }
    const [name, type] = preference.sort.split('-')
    const facets = [
        {
            key: '__state',
            value: 'ACTIVE',
            type: 'must',
            prop: 'term',
        },
        {
            key: '__typeName.keyword',
            value: 'Column',
            type: 'must',
            prop: 'term',
        },
        {
            key: 'field',
            value: '__hasLineage',
            type: 'must',
            prop: 'exists',
        },
        {
            key: `${typeName}QualifiedName`,
            value: qualifiedName,
            type: 'should',
            prop: 'terms',
        },
    ]

    facets.push({
        key: `${typeName === 'view' ? 'table' : 'view'}QualifiedName`,
        value: ['def'],
        type: 'should',
        prop: 'terms',
    })

    base.sort(name, type)
    base.from(offset)
    base.size(limit)
    base.filterMinimumShouldMatch(1)
    facets.forEach((x) => {
        const { key, value, type: t, prop } = x
        const filterType = t === 'should' ? 'orFilter' : 'filter'
        base[filterType](prop, key, value)
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
        suppressLogs: true,
    }
    const { data, error } = useIndexSearch<assetInterface>(
        body,
        localKey,
        isCache,
        false,
        1
    )
    const list = computed(() => data?.value?.entities || [])
    const count = computed(() => data?.value?.approximateCount)

    return {
        list,
        count,
        error,
    }
}
