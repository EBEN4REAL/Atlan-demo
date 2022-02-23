/* eslint-disable import/prefer-default-export */

import { IEnableDisablePayload } from '~/types/accessPolicies/personas'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useAPIPromise } from '~/services/api/useAPIPromise'

import { useOptions } from '~/services/api/common'

import { IPurpose } from '~/types/accessPolicies/purposes'

const List = (params?: any, options?: useOptions) =>
    useAPI(map.LIST_PURPOSE, 'GET', { params }, options || {})

const getPurposeByID = (id?: string, options?: useOptions) =>
    useAPI(map.GET_PURPOSE_FROM_ID, 'GET', { pathVariables: { id } }, options || {})


const listPurposes = (body, options) =>
    useAPI(
        map.LIST_PURPOSE,
        'GET',
        { initialState: [] },
        {
            asyncOptions: {
                ...options.asyncOptions,
                onError: (e) => {
                    throw e
                },
            },
        }
        // { resetOnExecute: false }
    )

const Create = (body: IPurpose, options?: useOptions) =>
    useAPI<IPurpose>(
        map.CREATE_PURPOSE,
        'POST',
        { body },
        {
            ...options,
            asyncOptions: {
                ...options?.asyncOptions,
                onError: (e) => {
                    throw e
                },
            },
        }
    )

const createPersona = (body: IPurpose) =>
    useAPIPromise(map.CREATE_PURPOSE(), 'POST', {
        body: body,
    })

const Update = (body: IPurpose, options?: useOptions) =>
    useAPI<IPurpose>(
        map.CREATE_PURPOSE,
        'POST',
        {
            body,
            pathVariables: {
                guid: body.id!,
            },
        },
        options || {}
    )

const updatePersona = (body: IPurpose) =>
    useAPIPromise(map.UPDATE_PURPOSE({ guid: body.id! }), 'POST', {
        body: body,
    })
const updatePersonaUsers = ({ personaId, users, groups }) =>
    useAPIPromise(map.UPDATE_PURPOSE_USERS({ guid: personaId! }), 'POST', {
        body: { users, groups },
    })

const deletePersona = (id: string): Promise<IPurpose> =>
    useAPIPromise(map.DELETE_PURPOSE({ guid: id }), 'DELETE', {})
const enableDisablePurpose = (id: string, body: IEnableDisablePayload) =>
    useAPIPromise(map.ENABLE_DISABLE_PURPOSE({ id }), 'POST', {
        body,
    })
export const Purpose = {
    List,
    getPurposeByID,
    Create,
    Update,
    updatePersonaUsers,
    listPurposes,
    createPersona,
    updatePersona,
    deletePersona,
    enableDisablePurpose,
}
