/* eslint-disable import/prefer-default-export */

import { IEnableDisablePayload } from '~/types/accessPolicies/personas'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useAPIPromise } from '~/services/api/useAPIPromise'

import { useOptions } from '~/services/api/common'

import { IPersona } from '~/types/accessPolicies/purposes'

const List = (params?: any, options?: useOptions) =>
    useAPI(map.LIST_PURPOSE, 'GET', { params }, options || {})

const listPurposes = () =>
    useAPI(
        map.LIST_PURPOSE,
        'GET',
        { initialState: [] },
        {
            asyncOptions: {
                onError: (e) => {
                    throw e
                },
            },
        }
        // { resetOnExecute: false }
    )

const Create = (body: IPersona, options?: useOptions) =>
    useAPI<IPersona>(
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

const createPersona = (body: IPersona) =>
    useAPIPromise(map.CREATE_PURPOSE(), 'POST', {
        body: body,
    })

const Update = (body: IPersona, options?: useOptions) =>
    useAPI<IPersona>(
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

const updatePersona = (body: IPersona) =>
    useAPIPromise(map.UPDATE_PURPOSE({ guid: body.id! }), 'POST', {
        body: body,
    })
const updatePersonaUsers = ({ personaId, users, groups }) =>
    useAPIPromise(map.UPDATE_PURPOSE_USERS({ guid: personaId! }), 'POST', {
        body: { users, groups },
    })

const deletePersona = (id: string): Promise<IPersona> =>
    useAPIPromise(map.DELETE_PURPOSE({ guid: id }), 'DELETE', {})
const enableDisablePurpose = (id: string, body: IEnableDisablePayload) =>
    useAPIPromise(map.ENABLE_DISABLE_PURPOSE({ id }), 'POST', {
        body,
    })
export const Persona = {
    List,
    Create,
    Update,
    updatePersonaUsers,
    listPurposes,
    createPersona,
    updatePersona,
    deletePersona,
    enableDisablePurpose,
}
