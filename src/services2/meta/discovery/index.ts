/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'

import { map } from './key'
import { useAPI } from '~/services2/api/useAPI'

import { useOptions } from '~/services2/api/common'

const IndexSearch = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI(map.INDEX_SEARCH, 'POST', { body }, options || {})

export const Discovery = {
    IndexSearch,
}
