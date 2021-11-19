import { ref, Ref, computed } from 'vue'
import useLogsService from './useQueryLogService'
import useBody from './useBody'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { SourceList } from '~/constant/source'

const { listQueryLogs } = useLogsService()
const { getConnectionName, getConnectorName } = useConnector()
export function useQueryLogs(gte: Ref<string>, lt: Ref<string>) {
    const body = ref<Record<string, any>>({})
    const from = ref(0)
    const limit = ref(100)

    const dsl = useBody({
        from: from.value,
        limit: limit.value,
        gte: gte.value,
        lt: lt.value,
    })

    body.value = dsl
    const { data, mutate: refetchList, isLoading } = listQueryLogs(body)

    const list = computed(() => data.value?.hits?.hits)
    const totalCount = computed(() => limit.value + from.value)

    function mutateBody({ gte, lt }) {
        body.value = useBody({
            from: from.value,
            limit: limit.value,
            gte,
            lt,
        })
    }

    return {
        list,
        mutateBody,
        refetchList,
        totalCount,
        isLoading,
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
        },
        database: {
            keyDisplayName: 'Databases',
            value: '',
        },
        table: {
            keyDisplayName: 'Tables',
            value: '',
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
            meta.table.value = deDuplicatedTableNames.join(',')
    }

    return meta
}
