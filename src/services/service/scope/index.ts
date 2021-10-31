/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

import { IScopes } from '~/types/accessPolicies/scopes'

const List = (params: any, options?: useOptions) =>
    useAPI<IScopes>(
        map.LIST_SCOPES,
        'GET',
        { params: { type: 'scopeUniverse' } },
        options || {}
    )

export const Scopes = {
    List,
}
