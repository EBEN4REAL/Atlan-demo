/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'

import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'
import { Components } from '~/types/atlas/client'

const BulkUpdate = <T>(
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI<T>(map.ENTITY_BULK_UPDATE, 'POST', { body }, options || {})

const fetchMoreAudits = <T>(fetchmoreParams: any, guid: string) => useAPI<T>(map.GET_ASSET_AUDIT, 'GET', {
    params: fetchmoreParams,
    pathVariables: { guid },
}, {})

const fetchAudits = (params: any, guid: string) => useAPI<
    Components.Schemas.EntityAuditEventV2[]>(map.GET_ASSET_AUDIT, 'GET', {
        params,
        pathVariables: { guid },

    }, {})

export const Entity = {
    fetchAudits,
    BulkUpdate,
    fetchMoreAudits
}
