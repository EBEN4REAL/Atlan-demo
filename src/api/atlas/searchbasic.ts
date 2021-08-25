import axios, { AxiosRequestConfig } from 'axios'
import { Ref } from 'vue'
import { IConfig } from 'swrv'
import { AsyncStateOptions } from '@vueuse/core'
import { getAPIPath, getAxiosClient } from '~/api'
import { SearchParameters } from '~/types/atlas/attributes'
import { useAPI } from '../useAPI'

import { BASIC_SEARCH, SAVED_SEARCH } from '~/api/keyMaps/search'
import { Components } from './client'

// DEPRECATE
const Basic = (body?: SearchParameters, options?: AxiosRequestConfig) => {}

const BasicV2 = (
    cache?: string,
    body?: Ref<SearchParameters>,
    options?:
        | Ref<IConfig & AxiosRequestConfig & AsyncStateOptions>
        | (IConfig & AxiosRequestConfig & AsyncStateOptions),
    dependantFetchingKey?: Ref<any>
) =>
    useAPI<any>(BASIC_SEARCH, 'POST', {
        cache,
        body,
        options,
        dependantFetchingKey,
    })

const CreateSavedSearch = (
    cache?: string,
    body?: Ref<Components.Schemas.AtlasUserSavedSearch>,
    options?: Ref<IConfig & AxiosRequestConfig & AsyncStateOptions>,
    dependantFetchingKey?: Ref<any>
) =>
    useAPI<any>(SAVED_SEARCH, 'POST', {
        cache,
        body,
        options,
        dependantFetchingKey,
    })

export const SearchBasic = {
    Basic,
    BasicV2,
    CreateSavedSearch,
}
