import { ref, Ref, computed } from 'vue'
import useLogsService from './useQueryLogService'
import useBody from './useBody'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { SourceList } from '~/constant/source'

const { listQueryLogs } = useLogsService()
const { getConnectionName, getConnectorName } = useConnector()
export function useQueryLogs(
    gte: Ref<string>,
    lt: Ref<string>,
    from = ref(0),
    size = ref(6)
) {
    const body = ref<Record<string, any>>({})
    // const from = ref(0)
    // const limit = ref(100)

    const dsl = useBody({
        from: from.value,
        limit: size.value,
        gte: gte.value,
        lt: lt.value,
    })

    body.value = dsl
    const { data, mutate: refetchList, isLoading } = listQueryLogs(body)

    const list = computed(() => data.value?.hits?.hits)
    const totalCount = computed(() => size.value + from.value)
    const filteredLogsCount = computed(() => data.value?.hits?.total?.value)
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
