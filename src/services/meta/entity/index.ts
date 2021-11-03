/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'

import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

const BulkUpdate = <T>(
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI<T>(map.ENTITY_BULK_UPDATE, 'POST', { body }, options || {})


const EntityUpdate = <T>(
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI<T>(map.ENTITY_UPDATE, 'POST', { body }, options || {})

export const Entity = {
    BulkUpdate,
    EntityUpdate,
}
