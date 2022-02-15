import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from: number
    limit: number
    gte: string
    lt: string
    connectionQF?: string | undefined
    dbName?: string | undefined
    schemaName?: string | undefined
    queryStatusValues?: string[] | undefined
    usernames?: string[] | undefined
    connectorName?: string | undefined
    searchText?: string | undefined
    aggregations?: string[]
}

const agg_prefix = 'group_by'

export default function useBody({
    from,
    limit,
    gte,
    lt,
    connectionQF,
    dbName,
    schemaName,
    queryStatusValues,
    usernames,
    connectorName,
    searchText,
    aggregations,
}: useBodyProps) {
    const base = bodybuilder()

    base.from(from || 0)
    base.size(limit || 0)
    base.sort('@timestamp', 'desc')
    base.query('range', 'time', {
        gte,
        lt,
    })
    if (searchText)
        base.query('wildcard', 'log.message.userSqlQuery', {
            value: `*${searchText}*`,
        })
    if (connectorName)
        base.filter('term', 'log.message.connector.keyword', connectorName)
    if (connectionQF) {
        base.filter(
            'term',
            'log.message.connectionQualifiedName.keyword',
            connectionQF
        )
    }
    if (connectionQF && dbName) {
        base.filter(
            'term',
            'log.message.connectionQualifiedName.keyword',
            connectionQF
        )
        base.filter('term', 'log.message.queryMetadata.catalog.keyword', dbName)
    }
    if (connectionQF && dbName && schemaName) {
        base.filter(
            'term',
            'log.message.connectionQualifiedName.keyword',
            connectionQF
        )
        base.filter('term', 'log.message.queryMetadata.catalog.keyword', dbName)
        base.filter(
            'term',
            'log.message.queryMetadata.schema.keyword',
            schemaName
        )
    }
    if (queryStatusValues && queryStatusValues.length)
        base.filter('terms', 'log.message.queryStatus', queryStatusValues)
    if (usernames && usernames.length)
        base.filter(
            'terms',
            'log.message.authenticatorResult.userName',
            usernames
        )
    if (aggregations) {
        aggregations?.forEach((mkey) => {
            switch (mkey) {
                case 'savedQueryId': {
                    if (mkey) {
                        base.aggregation(
                            'terms',
                            'message.savedQueryId.keyword',
                            { size: 20 },
                            `${agg_prefix}_${mkey}`
                        )
                    }
                    break
                }
                default:
                    console.log('no aggregation applied')
            }
        })
    }

    return base.build()
}
