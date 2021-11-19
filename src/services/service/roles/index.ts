/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

const List = (params: any, options?: useOptions) =>
    useAPI(map.LIST_ROLES, 'GET', { params }, options || {})

export const Roles = {
    List,
}
