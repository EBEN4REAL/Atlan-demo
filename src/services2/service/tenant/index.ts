/* eslint-disable import/prefer-default-export */
import { map } from './key'
import { useAPI } from '~/services2/api/useAPI'

import { useOptions } from '~/services2/api/common'

const GetTenant = (options?: useOptions) =>
    useAPI(map.GET_TENANT, 'GET', {}, options || {})

export const Tenant = {
    GetTenant,
}
