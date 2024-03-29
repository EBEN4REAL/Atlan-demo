import { ref, Ref, computed, watch } from 'vue'
import bodybuilder from 'bodybuilder'
import useLogsService from './useQueryLogService'
import useBody from './useBody'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { SourceList } from '~/constant/source'
import useIndexSearch from '~/composables/discovery/useIndexSearch'

const { listQueryLogs } = useLogsService()
export function useQueryLogs(
    gte: Ref<string>,
    lt: Ref<string>,
    from = ref(0),
    size = ref(6),
    usernames: Ref<Array<string>>,
    attributes = ['name'],
    aggregations = []
) {
    const savedQueryMetaMap: Ref<Record<string, any>> = ref({})
    const body = ref<Record<string, any>>({})
    // const from = ref(0)
    // const limit = ref(100)

    const dsl = useBody({
        from: from.value,
        limit: size.value,
        gte: gte.value,
        lt: lt.value,
        usernames: usernames?.value ? usernames?.value : undefined,
        aggregations,
    })

    body.value = dsl
    const { data, mutate: refetchList, isLoading } = listQueryLogs(body)

    // fetch saved quey meta when data refreshes
    const fetchSavedQueryMeta = (requestBody) => {
        const {
            data: savedQueries,
            error,
            isLoading,
        } = useIndexSearch(
            {
                dsl: { ...requestBody },
                attributes: attributes,
                suppressLogs: true,
            },
            ref('GET_SAVED_QUERY_META'),
            false
        )
        watch([isLoading, error], () => {
            if (!error.value && !isLoading.value) {
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
    }
    watch(
        data,
        () => {
            if (data.value?.hits?.hits?.length) {
                // get saved query logs, if present in the result
                let savedQueryIds = (
                    data.value?.hits?.hits.filter(
                        (log) => log._source?.message?.savedQueryId
                    ) || []
                ).map((log) => log._source.message.savedQueryId)
                const aggregateSavedQueryIds =
                    (
                        data.value?.aggregations?.group_by_savedQueryId
                            ?.buckets || []
                    ).map((bucket) => bucket.key) || []
                savedQueryIds = [
                    ...new Set([...savedQueryIds, ...aggregateSavedQueryIds]),
                ]
                // Check if the ids already have cached metadata
                let filteredSavedQueryIds = []
                if (savedQueryIds && savedQueryIds.length) {
                    filteredSavedQueryIds = savedQueryIds.filter(
                        (savedQueryId) =>
                            !savedQueryMetaMap.value.hasOwnProperty(
                                savedQueryId
                            )
                    )
                }
                if (filteredSavedQueryIds && filteredSavedQueryIds.length) {
                    const limit = filteredSavedQueryIds.length || 20
                    console.log('limit', limit)
                    const base = bodybuilder()
                    base.size(limit)
                    filteredSavedQueryIds.forEach((queryId) =>
                        base.orFilter('term', '__guid', queryId)
                    )
                    // TODO @rohan: apply isActive filter
                    // base.andFilter('term', '__state', 'ACTIVE')
                    const requestBody = base.build()
                    fetchSavedQueryMeta(requestBody)
                }
            }
        },
        { immediate: true }
    )

    const list = computed(() => data.value?.hits?.hits)
    const totalCount = computed(() => size.value + from.value)
    const filteredLogsCount = computed(() => data.value?.hits?.total?.value)
    const aggregates = computed(() => data.value?.aggregations)
    function mutateBody({
        from,
        size,
        gte,
        lt,
        usernames,
        queryStatusValues,
        schemaName,
        dbName,
        connectionQF,
        connectorName,
        searchText,
        aggregations,
    }) {
        body.value = useBody({
            from: from.value,
            limit: size.value,
            gte,
            lt,
            usernames,
            queryStatusValues,
            schemaName,
            dbName,
            connectionQF,
            connectorName,
            searchText,
            aggregations,
        })
    }
    const paginateLogs = (page: number) => {
        // modify offset
        const offset = (page - 1) * size.value
        from.value = offset
    }
    return {
        list,
        mutateBody,
        refetchList,
        totalCount,
        isLoading,
        filteredLogsCount,
        paginateLogs,
        savedQueryMetaMap,
        aggregates,
    }
}
export const getQueryMetadata = (query) => {
    const meta = {
        connection: {
            keyDisplayName: 'Connection',
            value: '',
            connector: {},
        },
        schema: {
            keyDisplayName: 'Schemas',
            value: '',
            icon: 'SchemaGray',
        },
        database: {
            keyDisplayName: 'Databases',
            value: '',
            icon: 'DatabaseGray',
        },
        table: {
            keyDisplayName: 'Tables',
            value: '',
            icon: 'TableGray',
        },
    }
    // Connection
    if (query?._source?.message?.connectionQualifiedName) {
        const { getConnectionName, getConnectorName } = useConnector()
        meta.connection.value = getConnectionName(
            query._source.message.connectionQualifiedName
        )
        const connectorName = getConnectorName(
            query._source.message.connectionQualifiedName
        )
        let connectorObj = {}
        if (connectorName)
            connectorObj = SourceList.find(
                (source) =>
                    source.id.toLowerCase() === connectorName.toLowerCase()
            )
        if (Object.keys(connectorObj).length)
            meta.connection.connector = { ...connectorObj }
    }

    if (query?._source?.message?.queryMetadata?.length) {
        // Database
        const catalogNames = (query?._source?.message?.queryMetadata || []).map(
            (queryMetaObj) => queryMetaObj.catalog
        )
        let deDuplicatedCatalogNames = []
        if (catalogNames && catalogNames.length)
            deDuplicatedCatalogNames = [...new Set(catalogNames)]

        if (deDuplicatedCatalogNames && deDuplicatedCatalogNames.length)
            meta.database.value = deDuplicatedCatalogNames.join(',')
        // SCHEMAS
        const schemaNames = (query?._source?.message?.queryMetadata || []).map(
            (queryMetaObj) => queryMetaObj.schema
        )
        let deDuplicatedSchemaNames = []
        if (schemaNames && schemaNames.length)
            deDuplicatedSchemaNames = [...new Set(schemaNames)]

        if (deDuplicatedSchemaNames && deDuplicatedSchemaNames.length)
            meta.schema.value = deDuplicatedSchemaNames.join(',')

        // Tables
        const tableNames = (query?._source?.message?.queryMetadata || []).map(
            (queryMetaObj) => queryMetaObj.table
        )
        let deDuplicatedTableNames = []
        if (tableNames && tableNames.length)
            deDuplicatedTableNames = [...new Set(tableNames)]

        if (deDuplicatedTableNames && deDuplicatedTableNames.length)
            meta.table.value = deDuplicatedTableNames.join(', ')
    }

    return meta
}
