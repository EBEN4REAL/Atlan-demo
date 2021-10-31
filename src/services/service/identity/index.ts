/* eslint-disable import/prefer-default-export */

import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useOptions } from '~/services/api/common'

const createIDP = (params: any, options?: useOptions) =>
    useAPI(map.CREATE_IDP, 'POST', { params }, options || {})

const updateIDP = (alias?: string, params?: any, options?: useOptions) =>
    useAPI(
        map.UPDATE_IDP,
        'POST',
        { params, pathVariables: { alias } },
        options || {}
    )

const deleteIDP = (alias?: string, options?: useOptions) =>
    useAPI(map.DELETE_IDP, 'POST', { pathVariables: { alias } }, options || {})

const getMappers = (alias?: string, options?: useOptions) =>
    useAPI(map.GET_MAPPER, 'GET', { pathVariables: { alias } }, options || {})

const createMapper = (alias?: string, params?: any, options?: useOptions) =>
    useAPI(
        map.CREATE_MAPPER,
        'POST',
        { params, pathVariables: { alias } },
        options || {}
    )

const updateMapper = (alias?: string, params?: any, options?: useOptions) =>
    useAPI(
        map.UPDATE_MAPPER,
        'POST',
        { pathVariables: { alias, id: params.id } },
        options || {}
    )

const getDefaultIDP = (options?: useOptions) =>
    useAPI(map.GET_DEFAULT_IDP, 'GET', {}, options || {})

const setDefaultIDP = (alias?: string, options?: useOptions) =>
    useAPI(
        map.SET_DEFAULT_IDP,
        'POST',
        { pathVariables: { alias } },
        options || {}
    )

const deleteDefaultIDP = (alias?: string, options?: useOptions) =>
    useAPI(
        map.DELETE_DEFAULT_IDP,
        'POST',
        { pathVariables: { alias } },
        options || {}
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
