/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'

import { map } from '../lineage/key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

const BulkUpdate = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI(map.ENTITY_BULK_UPDATE, 'POST', { body }, options || {})

export const Entity = {
    BulkUpdate,
}
