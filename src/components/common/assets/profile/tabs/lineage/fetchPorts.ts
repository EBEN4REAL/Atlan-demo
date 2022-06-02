/** VUE */
import { computed, ref } from 'vue'

/** PACKAGES */
import bodybuilder from 'bodybuilder'

/** CONSTANTS */
import { assetInterface } from '~/types/assets/asset.interface'
import { LineageAttributesPortLevel } from '~/constant/projection'

/** COMPOSABLES */
import useIndexSearch from '~/composables/discovery/useIndexSearch'
import {
    featureEnabledMap,
    LINEAGE_LOOKER_FIELD_LEVEL_LINEAGE,
} from '~/composables/labs/labFeatureList'

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

    if (featureEnabledMap.value[LINEAGE_LOOKER_FIELD_LEVEL_LINEAGE]) {
        portTypeNameMap.LookerExplore = 'LookerField'
        portTypeNameMap.LookerView = 'LookerField'
        nodeTypeNameMap.LookerExplore = 'lookerExplore'
        nodeTypeNameMap.LookerView = 'lookerView'
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
        // {
        //     id: 'haslineage',
        //     key: 'field',
        //     value: '__hasLineage',
        //     type: 'must',
        //     prop: 'exists',
        // },
        {
            id: 'haslineage',
            key: '__hasLineage',
            value: 'true',
            type: 'must',
            prop: 'term',
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
