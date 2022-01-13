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
            key: 'viewQualifiedName',
            value: viewQualifiedName,
            type: 'should',
            prop: 'terms',
        },
        {
            key: 'tableQualifiedName',
            value: tableQualifiedName,
            type: 'should',
            prop: 'terms',
        },
    ]

    base.sort(name, type)
    base.from(offset)
    base.size(limit)
    base.filterMinimumShouldMatch(1)
    facets.forEach((x) => {
        const { key, value, type, prop } = x
        const filterType = type === 'should' ? 'orFilter' : 'filter'
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
        else list.value = null
    })

    return {
        list,
    }
}
