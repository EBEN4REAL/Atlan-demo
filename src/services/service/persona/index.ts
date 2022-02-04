/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { useOptions } from '~/services/api/common'
import {
    IPersona,
    IEnableDisablePayload,
} from '~/types/accessPolicies/personas'

const List = (params?: any, options?: useOptions) =>
    useAPI(map.LIST_PERSONAS, 'GET', { params }, options || {})

const listPersonas = (params: any) =>
    useAPI(
        map.LIST_PERSONAS,
        'GET',
        { initialState: [], params },
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
    useAPI<IPersona>(map.CREATE_PERSONA, 'POST', { body }, options || {})

const createPolicy = ( body: IPersona, id: String) => useAPIPromise(map.CREATE_POLICY({id}), 'POST', { body})

const updatePolicy = ( body: IPersona, idPolicy: String, idPersona: String) => useAPIPromise(map.UPDATE_POLICY({idPolicy, idPersona}), 'POST', { body})

const deletePolicy = ( idPolicy: String, idPersona: String) => useAPIPromise(map.DELETE_POLICY({idPolicy, idPersona}), 'DELETE', {})

const createPersona = (body: IPersona) =>
    useAPIPromise(map.CREATE_PERSONA(), 'POST', {
        body,
    })

const Update = (body: IPersona, options?: useOptions) =>
    useAPI<IPersona>(
        map.CREATE_PERSONA,
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
    useAPIPromise(map.UPDATE_PERSONA({ guid: body.id! }), 'POST', {
        body,
    })

const updatePersonaUsers = ({ personaId, users, groups }) =>
    useAPIPromise(map.UPDATE_PERSONA_USERS({ guid: personaId! }), 'POST', {
        body: { users, groups },
    })

const deletePersona = (id: string): Promise<IPersona> =>
    useAPIPromise(map.DELETE_PERSONA({ guid: id }), 'DELETE', {})

const enableDisablePersona = (id: string, body: IEnableDisablePayload) =>
    useAPIPromise(map.ENABLE_DISABLE_PERSONA({ id }), 'POST', {
        body,
    })

export const Persona = {
    List,
    Create,
    Update,
    updatePersonaUsers,
    listPersonas,
    createPersona,
    updatePersona,
    deletePersona,
    enableDisablePersona,
    createPolicy,
    updatePolicy,
    deletePolicy
}
