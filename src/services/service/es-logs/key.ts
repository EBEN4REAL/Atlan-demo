import { getAPIPath } from '~/services/api/common'

export const LIST_QUERY_LOGS = 'LIST_QUERY_LOGS'

export const map = {
    LIST_QUERY_LOGS: () =>
        getAPIPath('/service', '/es-logs/tenants/default/heka-audit*/_search'),
    LIST_ACCESS_LOGS: () =>
        getAPIPath(
            '/service',
            '/es-logs/tenants/default/ranger-audit*/_search'
        ),
}
