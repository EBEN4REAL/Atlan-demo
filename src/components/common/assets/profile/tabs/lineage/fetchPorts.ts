import { computed, ref } from 'vue'
import bodybuilder from 'bodybuilder'
import { assetInterface } from '~/types/assets/asset.interface'
import useIndexSearch from '~/composables/discovery/useIndexSearch'
import { LineageAttributesPortLevel } from '~/constant/projection'

export default function fetchPorts(typeName, qualifiedName, offset, limit = 5) {
    const portTypeNameMap = {
        Table: 'Column',
        View: 'Column',
        MaterialisedView: 'Column',
        TableauDatasource: ['TableauDatasourceField', 'TableauCalculatedField'],
        // LookerExplore: 'LookerField',
        // LookerView: 'LookerField',
    }
    const nodeTypeNameMap = {
        Table: 'table',
        View: 'view',
        MaterialisedView: 'view',
        TableauDatasource: 'datasource',
        // LookerExplore: 'lookerExplore',
        // LookerView: 'lookerView',
    }
    const base = bodybuilder()
    const attributes = LineageAttributesPortLevel
    const facets = [
        {
            id: 'active',
            key: '__state',
            value: 'ACTIVE',
            type: 'must',
            prop: 'term',
        },
        {
            id: 'typename',
            key: '__typeName.keyword',
            value: portTypeNameMap[typeName],
            type: 'must',
            prop: Array.isArray(portTypeNameMap[typeName]) ? 'terms' : 'term',
        },
        {
            id: 'haslineage',
            key: 'field',
            value: '__hasLineage',
            type: 'must',
            prop: 'exists',
        },
        {
            id: 'parent',
            key: `${nodeTypeNameMap[typeName]}QualifiedName`,
            value: qualifiedName,
            type: 'must',
            prop: ['Table', 'View', 'MaterialisedView'].includes(typeName)
                ? 'term'
                : 'match_phrase_prefix',
        },
    ]

    base.sort('order', 'asc')
    base.from(offset)
    base.size(limit)
    base.filterMinimumShouldMatch(1)

    facets.forEach((x) => {
        const { key, value, type, prop } = x
        const filterType = type === 'should' ? 'orFilter' : 'filter'
        base[filterType](prop, key, value)
    })

    const localKey = ref('LINEAGE_PORTS')
    const isCache = false
    const tempQuery = base.build()
    const dsl = {
        ...tempQuery,
        query: tempQuery.query,
    }
    const body = {
        dsl,
        attributes,
        relationAttributes: [],
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
