import { ref, watch, Ref, h } from 'vue'
import useIndexSearch from '~/composables/discovery/useIndexSearch'
import bodybuilder from 'bodybuilder'

// fetch saved quey meta when data refreshes
const fetchSavedQueryMeta = ({
    body,
    savedQueryMetaMap,
}: {
    body: Ref<Record<string, any>>
    savedQueryMetaMap: Ref<Record<string, any>>
}) => {
    const {
        mutate,
        data: savedQueries,
        error,
        isLoading,
    } = useIndexSearch(body, undefined, false, false)
    watch([isLoading, error], () => {
        if (!error.value && !isLoading.value) {
            console.log(body, 'body')
            if (
                savedQueries &&
                savedQueries.value &&
                savedQueries.value.entities &&
                savedQueries.value.entities.length
            ) {
                const newSavedQueries = {}
                savedQueries.value.entities.forEach((savedQuery) => {
                    const { guid } = savedQuery
                    newSavedQueries[guid] = { ...savedQuery }
                })
                savedQueryMetaMap.value = {
                    ...savedQueryMetaMap.value,
                    ...newSavedQueries,
                }
            }
        }
    })
    return {
        isLoading,
        error,
        mutate,
    }
}

function generateBody(savedQueryIds: string[]) {
    const limit = savedQueryIds.length || 0
    console.log('limit', limit)
    const base = bodybuilder()
    base.size(limit)
    savedQueryIds.forEach((queryId) => base.orFilter('term', '__guid', queryId))
    // base.andFilter('term', '__state', 'ACTIVE')
    return base.build()
}
export function useSavedQueriesMeta(savedQueryIds: string[]) {
    const savedQueryMetaMap: Ref<Record<string, any>> = ref({})

    const body = ref({
        dsl: generateBody(savedQueryIds),
        attributes: [
            'name',
            'isVisualQuery',
            'certificateStatus',
            'variablesSchemaBase64',
            'connectionName',
            'connectionQualifiedName',
        ],
        suppressLogs: true,
    })
    const { mutate, isLoading, error } = fetchSavedQueryMeta({
        body,
        savedQueryMetaMap,
    })
    const updatedRequestBody = (savedQueryIds: string[]) => {
        body.value = {
            ...body.value,
            dsl: generateBody(savedQueryIds),
        }
    }
    return { savedQueryMetaMap, mutate, isLoading, error, updatedRequestBody }
}
