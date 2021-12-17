import bodybuilder from 'bodybuilder'

interface useBodyProps {
    from: number
    limit: number
    gte: string
    lt: string
    connectionQF?: string | undefined
    dbQualifiedName?: string | undefined
    schemaQualifiedName?: string | undefined
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
 * @param dbQualifiedName The name of the database.
 * @param schemaQualifiedName The name of the schema.
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
    dbQualifiedName,
    schemaQualifiedName,
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
    // If we have the name of the connector.
    if (connectorName) {
        base.filter('regexp', 'resource', `.+/\\[.*\\]/.*/${connectorName}/.*`)
    }
    // If we have a qualified name for the connection.
    if (connectionQF) {
        base.filter('regexp', 'resource', `.+/\\[.*\\]/${connectionQF}.*`)
    } else if (dbQualifiedName) {
        base.filter('regexp', 'resource', `.+/\\[.*\\]/${dbQualifiedName}.*`)
    } else if (schemaQualifiedName) {
        base.filter(
            'regexp',
            'resource',
            `.+/\\[.*\\]/${schemaQualifiedName}.*`
        )
    }
    // If we have the search text.
    if (searchText) {
        base.query('wildcard', 'resource', {
            value: `*${searchText}*`,
        })
    }

    // If we have the log statuses.
    if (logStatusValues && logStatusValues.length)
        base.filter('terms', 'result', logStatusValues)

    // If we have the log actions.
    if (logActionValues && logActionValues.length) {
        base.filter('terms', 'action', logActionValues)
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
                base.notFilter('prefix', 'reqUser', 'service-account-apikey')
            } else if (!includeBots && includeUsers) {
                base.notFilter('wildcard', 'reqUser', {
                    value: '*argo*',
                })
            } else if (includeBots && !includeUsers) {
                base.filter('wildcard', 'reqUser', {
                    value: '*argo*',
                })
            }
        } else if (!includeBots) {
            if (includeAPIKeys && includeUsers) {
                base.notFilter('wildcard', 'reqUser', {
                    value: '*argo*',
                })
            } else if (includeAPIKeys && !includeUsers) {
                base.filter('prefix', 'reqUser', 'service-account-apikey')
            }
        } else if (!includeUsers) {
            if (includeAPIKeys && includeBots) {
                base.orFilter(
                    'prefix',
                    'reqUser',
                    'service-account-apikey'
                ).orFilter('wildcard', 'reqUser', {
                    value: '*argo*',
                })
            }
        }
    }
    if (usernames && usernames.length)
        base.filter('terms', 'reqUser', usernames)
    if (properties) {
        // All the regular expressions listed below, assume a format of
        // {Asset Type}/[{Classification}]/{qualified name of asset}
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
                        base.filter('wildcard', element.operand, {
                            value: `*${element.value}`,
                        })
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
