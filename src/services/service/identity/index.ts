/* eslint-disable import/prefer-default-export */

import { map } from './key'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { resolveUrl } from '~/services/api/common'
import { AxiosRequestConfig } from 'axios'

const createIDP = (params: any, options?: AxiosRequestConfig) =>
    useAPIPromise(
        resolveUrl(map.CREATE_IDP),
        'POST',
        { params, options: options || {} },
    )

const updateIDP = (alias?: string, params?: any, options?: AxiosRequestConfig) =>
    useAPIPromise(
        resolveUrl(map.UPDATE_IDP, { alias }),
        'POST',
        { options: options || {} },
    )

const deleteIDP = (alias?: string, options?: AxiosRequestConfig) =>
    useAPIPromise(
        resolveUrl(map.DELETE_IDP, { alias }),
        'POST',
        { options: options || {} },
    )

const getMappers = (alias?: string, options?: AxiosRequestConfig) =>
    useAPIPromise(
        resolveUrl(map.GET_MAPPER, { alias }),
        'GET',
        { options: options || {} },
    )

const createMapper = (alias?: string, params?: any, options?: AxiosRequestConfig) =>
    useAPIPromise(
        resolveUrl(map.CREATE_MAPPER, { alias }),
        'POST',
        { params, options: options || {} },
    )

const updateMapper = (alias?: string, params?: any, options?: AxiosRequestConfig) =>
    useAPIPromise(
        resolveUrl(map.UPDATE_MAPPER, { alias, id: params.id }),
        'POST',
        { options: options || {} },
    )

const getDefaultIDP = (options?: AxiosRequestConfig) =>
    useAPIPromise(
        resolveUrl(map.GET_DEFAULT_IDP),
        'GET',
        { options: options || {} },
    )

const setDefaultIDP = (alias?: string, options?: AxiosRequestConfig) =>
    useAPIPromise(
        resolveUrl(map.SET_DEFAULT_IDP, { alias }),
        'POST',
        { options: options || {} },
    )

const deleteDefaultIDP = (alias?: string, options?: AxiosRequestConfig) =>
    useAPIPromise(
        resolveUrl(map.DELETE_DEFAULT_IDP, { alias }),
        'POST',
        { options: options || {} },
    )


export const Identity = {
    createIDP,
    updateIDP,
    deleteIDP,
    getMappers,
    createMapper,
    getDefaultIDP,
    setDefaultIDP,
    deleteDefaultIDP,
    updateMapper,
}
