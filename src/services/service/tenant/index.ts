/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

const GetTenant = (options?: useOptions) =>
    useAPI(map.GET_TENANT, 'GET', {}, options || {})

const UpdateTenant = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI(map.POST_TENANT, 'POST', { body }, options || {})

export const Tenant = {
    GetTenant,
    UpdateTenant,
}
