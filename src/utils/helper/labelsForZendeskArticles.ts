export const getLabelsForZendeskArticles = (path) => {
    const routeTokens = path.split('/')
    if (!routeTokens?.length) return ['quick-guide']
    if (routeTokens.length <= 1) return ['quick-guide']

    const primaryToken = routeTokens[1]
    switch (primaryToken) {
        case '':
            return ['quick-guide', 'atlan']
        case 'assets': {
            if (routeTokens.length === 2) return ['discovery']
            if (routeTokens.length > 2) return ['asset-profile', 'lineage']
            break
        }
        case 'glossary':
            return ['glossary']
        case 'insights':
            return ['collections', 'insights']
        case 'admin': {
            if (routeTokens.length === 2) return ['admin'] // though this will never be the case
            const secondaryToken = routeTokens[2]
            switch (secondaryToken) {
                case 'overview':
                    return ['admin']
                case 'users':
                    return ['users']
                case 'groups':
                    return ['groups', 'quick-guide']
                case 'apikeys':
                    return ['apikeys', 'quick-guide']
                case 'sso':
                    return ['sso']
                case 'smtp':
                    return ['smtp', 'quick-guide']
                case 'integrations':
                    return ['integrations', 'quick-guide']
                case 'query-logs':
                    return ['query-logs', 'quick-guide']
                case 'access-logs':
                    return ['access-logs', 'quick-guide']
                default:
                    return ['admin']
            }
        }
        case 'governance': {
            if (routeTokens.length === 2) return ['quick-guide'] // though this will never be the case
            const secondaryToken = routeTokens[2]
            switch (secondaryToken) {
                case 'personas':
                    return ['personas', 'access-policies']
                case 'purposes':
                    return ['purposes', 'access-policies']
                case 'groups':
                    return ['groups']
                case 'classifications':
                    return ['classifications']
                case 'requests':
                    return ['requests', 'quick-guide']
                case 'custom-metadata':
                    return ['custom-metadata']
                case 'enums':
                    return ['custom-metadata']
                default:
                    return ['quick-guide']
            }
        }
        case 'workflows':
            return ['quick-guide']

        default:
            return ['quick-guide']
    }
}
