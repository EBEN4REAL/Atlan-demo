import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from: number
    limit: number
    gte: string
    lt: string
    connectionQF?: string | undefined
    dbName?: string | undefined
    schemaName?: string | undefined
    logStatusValues?: string[] | undefined
    logActionValues?: string[] | undefined
    userTypes?: string[] | undefined
    usernames?: string[] | undefined
    connectorName?: string | undefined
    searchText?: string | undefined
    properties?: {} | undefined
    timezone?: string | '+05:30'
}

/**
 * A composable for driving the API calls to retrieve, filter, or paginate
 * the ranger-audit access logs.
 *
 * @param from The index from where to pick entries.
 * @param limit The number of entries to fetch.
 * @param gte The `from` time filter.
 * @param lt The `to` time filter.
 * @param connectionQF The qualified name of the connection.
 * @param dbName The name of the database.
 * @param schemaName The name of the schema.
 * @param logStatusValues The filters of log statuses.
 * @param logActionValues The filters of log actions.
 * @param userTypes The types of users: `User`, `BOT`, and `API Key`.
 * @param usernames The filters of the users.
 * @param properties The properties filter.
 * @param connectorName The name of the connector.
 * @param searchText The wildcard search filter.
 * @param timezone The timezone for the range query.
 */
export default function useBody({
    from,
    limit,
    gte,
    lt,
    connectionQF,
    dbName,
    schemaName,
    logStatusValues,
    logActionValues,
    userTypes,
    usernames,
    properties,
    connectorName,
    searchText,
    timezone,
}: useBodyProps) {
    const base = bodybuilder()

    base.from(from || 0)
    base.size(limit || 0)
    base.sort('evtTime', 'desc')
    base.query('range', 'evtTime', {
        gte,
        lt,
        format: 'strict_date_optional_time',
        time_zone: timezone,
    })
    if (connectorName) {
        base.query('wildcard', 'resource.keyword', {
            value: `*${connectorName}*`,
        })
    } else if (connectionQF) {
        // If we have a qualified name for the connection.
        base.query(
            'wildcard',
            'resource.keyword',
            {
                value: `*${connectionQF}*`,
            },
            {},
            (connectorQFFilteredQuery) => {
                // If we have a database too, use a nested filter.
                if (dbName) {
                    return connectorQFFilteredQuery.query(
                        'wildcard',
                        'resource.keyword',
                        {
                            value: `*${dbName}*`,
                        },
                        {},
                        (dbFilteredQuery) => {
                            // If we have a schema too, use a nested filter.
                            if (schemaName) {
                                dbFilteredQuery.query(
                                    'wildcard',
                                    'resource.keyword',
                                    {
                                        value: `*${schemaName}*`,
                                    }
                                )
                            }
                            return dbFilteredQuery
                        }
                    )
                }
                return connectorQFFilteredQuery
            }
        )
    }
    // If we have the search text.
    if (searchText) {
        base.query('wildcard', 'resource.keyword', {
            value: `*${searchText}*`,
        })
    }

    // If we have the log statuses.
    if (logStatusValues && logStatusValues.length)
        base.filter('terms', 'result', logStatusValues)

    // If we have the log actions.
    if (logActionValues && logActionValues.length) {
        base.filter('terms', 'action.keyword', logActionValues)
    }

    // If we have the types of users.
    if (userTypes && userTypes.length) {
        // This is a complex computation. If this is to be edited,
        // please keep in mind the permutations of all the conditions
        // possible.

        const includeAPIKeys = userTypes.includes('apikey')
        const includeBots = userTypes.includes('service-account')
        const includeUsers = userTypes.includes('user')

        if (!includeAPIKeys) {
            if (includeBots && includeUsers) {
                base.notQuery(
                    'prefix',
                    'reqUser.keyword',
                    'service-account-apikey'
                )
            } else if (!includeBots && includeUsers) {
                base.notQuery('prefix', 'reqUser.keyword', 'service-account')
            } else if (includeBots && !includeUsers) {
                base.query(
                    'prefix',
                    'reqUser.keyword',
                    'service-account'
                ).notQuery(
                    'prefix',
                    'reqUser.keyword',
                    'service-account-apikey'
                )
            }
        } else if (!includeBots) {
            if (includeAPIKeys && includeUsers) {
                base.notQuery(
                    'regexp',
                    'reqUser.keyword',
                    'service-account-(?!apikey)([a-z0-9]+)$'
                )
            } else if (includeAPIKeys && !includeUsers) {
                base.query(
                    'prefix',
                    'reqUser.keyword',
                    'service-account-apikey'
                )
            }
        } else if (!includeUsers) {
            if (includeAPIKeys && includeBots) {
                base.query('prefix', 'reqUser.keyword', 'service-account')
            }
        }
    }
    if (usernames && usernames.length)
        base.filter('terms', 'reqUser.keyword', usernames)
    if (properties) {
        // All the regular expressions listed below, assume a format of
        // {Asset Type}/[{some weird number}]/{qualified name of asset}
        Object.keys(properties).forEach((key) => {
            properties[key].forEach((element) => {
                if (element.value) {
                    if (element.operator === 'equals') {
                        base.filter(
                            'regexp',
                            element.operand,
                            `.+/\\[.*\\]/${element.value}`
                        )
                    }
                    if (element.operator === 'notEquals') {
                        base.notFilter(
                            'regexp',
                            element.operand,
                            `.+/\\[.*\\]/${element.value}`
                        )
                    }
                    if (element.operator === 'startsWith') {
                        base.filter(
                            'regexp',
                            element.operand,
                            `.+/\\[.*\\]/${element.value}.*`
                        )
                    }
                    if (element.operator === 'endsWith') {
                        base.filter(
                            'regexp',
                            element.operand,
                            `.+/\\[.*\\]/.*${element.value}`
                        )
                    }
                    if (element.operator === 'pattern') {
                        base.filter('regexp', element.operand, element.value)
                    }
                }
            })
        })
    }

    return base.build()
}
