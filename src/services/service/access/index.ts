/* eslint-disable import/prefer-default-export */
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

interface WhoAmIResponse {
    permissions: string[]
    roles: {
        id: string
        name: string
    }[]
    username: string
    userId: string
    groups: { id: string; name: string; path: string }[]
    decentralizedRole: {
        level: string
        id: string
        type: string
    }[]
}

const WhoAmI = (options?: useOptions) =>
    useAPI<WhoAmIResponse>(map.WHO_AM_I, 'GET', {}, options || {})

const Evaluate = (body, options?: useOptions) =>
    useAPI(map.EVALUATE, 'POST', { body }, options || {})

export const Access = {
    WhoAmI,
    Evaluate,
}
