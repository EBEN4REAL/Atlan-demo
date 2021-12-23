/* eslint-disable import/prefer-default-export */

import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { ref, Ref } from 'vue'

const createIDP = <T>(body: Record<string, any> | Ref<Record<string, any>>) =>
    useAPI<T>(
        map.CREATE_IDP,
        'POST',
        { body },
        {
            asyncOptions: ref({
                immediate: false,
                onError: (e) => {
                    throw e
                },
            }),
        }
    )

const updateIDP = <T>(
    alias?: string,
    body?: Record<string, any> | Ref<Record<string, any>>
) =>
    useAPI<T>(
        map.UPDATE_IDP,
        'POST',
        {
            body,
            pathVariables: { alias },
        },
        {
            asyncOptions: ref({
                immediate: false,
                onError: (e) => {
                    throw e
                },
            }),
        }
    )

const deleteIDP = <T>(alias?: string) =>
    useAPI<T>(
        map.DELETE_IDP,
        'POST',
        { pathVariables: { alias } },
        {
            asyncOptions: ref({
                immediate: false,
                onError: (e) => {
                    throw e
                },
            }),
        }
    )

const getMappers = <T>(alias?: string) =>
    useAPI<T>(
        map.GET_MAPPER,
        'GET',
        { pathVariables: { alias } },
        {
            asyncOptions: ref({
                immediate: false,
                onError: (e) => {
                    throw e
                },
            }),
        }
    )

const createMapper = <T>(
    alias?: string,
    body?: Record<string, any> | Ref<Record<string, any>>
) =>
    useAPI<T>(
        map.CREATE_MAPPER,
        'POST',
        { body, pathVariables: { alias } },
        {
            asyncOptions: ref({
                immediate: false,
                onError: (e) => {
                    throw e
                },
            }),
        }
    )

const updateMapper = <T>(alias?: string, params?: any) =>
    useAPI<T>(
        map.UPDATE_MAPPER,
        'POST',
        { pathVariables: { alias, id: params.id }, body: params },
        {
            asyncOptions: ref({
                immediate: false,
                onError: (e) => {
                    throw e
                },
            }),
        }
    )

const getDefaultIDP = <T>() =>
    useAPI<T>(
        map.GET_DEFAULT_IDP,
        'GET',
        {},
        {
            asyncOptions: ref({
                immediate: false,
                onError: (e) => {
                    throw e
                },
            }),
        }
    )

const setDefaultIDP = <T>(alias?: string) =>
    useAPI<T>(
        map.SET_DEFAULT_IDP,
        'POST',
        { pathVariables: { alias } },
        {
            asyncOptions: ref({
                immediate: false,
                onError: (e) => {
                    throw e
                },
            }),
        }
    )

const deleteDefaultIDP = <T>(alias?: string) =>
    useAPI<T>(
        map.DELETE_DEFAULT_IDP,
        'POST',
        { pathVariables: { alias } },
        {
            asyncOptions: ref({
                immediate: false,
                onError: (e) => {
                    throw e
                },
            }),
        }
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
