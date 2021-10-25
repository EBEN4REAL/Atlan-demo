/* eslint-disable import/prefer-default-export */
import { map } from './key'
import { useAPI } from '~/services2/api/useAPI'

import { useOptions } from '~/services2/api/common'

const GetTypedefs = (
    params: Record<string, any> | URLSearchParams,
    options?: useOptions
) => useAPI(map.GET_TYPEDEFS, 'GET', { params }, options || {})

export const Typedefs = {
    GetTypedefs,
}
