/* eslint-disable import/prefer-default-export */

import { map } from './key'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { AxiosRequestConfig } from 'axios'

const createIDP = (body: any, options?: AxiosRequestConfig) =>
    useAPIPromise(
        map.CREATE_IDP(),
        'POST',
        { body, options: options || {} },
    )

const updateIDP = (alias?: string, body?: any, options?: AxiosRequestConfig) =>
    useAPIPromise(
        map.UPDATE_IDP({ alias }),
        'POST',
        { body, options: options || {} },
    )

const deleteIDP = (alias?: string, options?: AxiosRequestConfig) =>
    useAPIPromise(
        map.DELETE_IDP({ alias }),
        'POST',
        { options: options || {} },
    )

const getMappers = (alias?: string, options?: AxiosRequestConfig) =>
    useAPIPromise(
        map.GET_MAPPER({ alias }),
        'GET',
        { options: options || {} },
    )

const createMapper = (alias?: string, body?: any, options?: AxiosRequestConfig) =>
    useAPIPromise(
        map.CREATE_MAPPER({ alias }),
        'POST',
        { body, options: options || {} },
    )

const updateMapper = (alias?: string, params?: any, options?: AxiosRequestConfig) =>
    useAPIPromise(
        map.UPDATE_MAPPER({ alias, id: params.id }),
        'POST',
        { options: options || {} },
    )

const getDefaultIDP = (options?: AxiosRequestConfig) =>
    useAPIPromise(
        map.GET_DEFAULT_IDP(),
        'GET',
        { options: options || {} },
    )

const setDefaultIDP = (alias?: string, options?: AxiosRequestConfig) =>
    useAPIPromise(
        map.SET_DEFAULT_IDP({ alias }),
        'POST',
        { options: options || {} },
    )

const deleteDefaultIDP = (alias?: string, options?: AxiosRequestConfig) =>
    useAPIPromise(
        map.DELETE_DEFAULT_IDP({ alias }),
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
