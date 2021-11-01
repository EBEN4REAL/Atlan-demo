/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'

import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'
import { Components } from '~/types/atlas/client'

export type IndexSearchResponse<T> = Omit<Components.Schemas.AtlasSearchResult, 'entities' | 'searchParameters'> & {
    entities?: T[],
    searchParameters: {
        attributes: string[]
        query: string
    }
}

const IndexSearch = <T>(
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI<IndexSearchResponse<T>>(map.INDEX_SEARCH, 'POST', { body }, options || {})

export const Discovery = {
    IndexSearch,
}
