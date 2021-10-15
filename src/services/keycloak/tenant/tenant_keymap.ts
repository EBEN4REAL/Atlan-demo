import { getAPIPath } from '~/api'

export const GET_TENANT = 'GET_TENANT'

const tenantmap: Record<string, (...params: any) => string> = {
    [GET_TENANT]: () => getAPIPath('service', 'auth/tenants/default')
}

export default tenantmap
