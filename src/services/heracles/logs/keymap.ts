import { getAPIPath } from '~/api'

export const QUERY_LOGS = 'QUERY_LOGS'

const serviceAlias = 'service'

const keyMap: Record<string, (...params: any) => string> = {
    [QUERY_LOGS]: () =>
        getAPIPath(
            serviceAlias,
            '/es-logs/tenants/default/heka-audit*/_search'
        ),
}

export default keyMap
