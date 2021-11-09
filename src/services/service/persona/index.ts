/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useAPIPromise } from '~/services/api/useAPIPromise'

import { useOptions } from '~/services/api/common'

import { IPersona } from '~/types/accessPolicies/personas'

const List = (params?: any, options?: useOptions) =>
    useAPI(map.LIST_PERSONAS, 'GET', { params }, options || {})

const listPersonas = () =>
    useAPI(
        map.LIST_PERSONAS,
        'GET',
        { initialState: [] },
        {}
        // { resetOnExecute: false }
    )


const Create = (body: IPersona, options?: useOptions) =>
    useAPI<IPersona>(map.CREATE_PERSONA, 'POST', { body }, options || {})

const createPersona = (body: IPersona) =>
    useAPIPromise(map.CREATE_PERSONA(), 'POST', {
        body: body,
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
    useAPIPromise(
        map.UPDATE_PERSONA({ guid: body.id! }),
        'POST',
        {
            body: body,
        }
    )
const updatePersonaUsers = ({ personaId, users, groups }) =>
    useAPIPromise(
        map.UPDATE_PERSONA_USERS({ guid: personaId! }),
        'POST',
        {
            body: { users, groups },
        }
    )

const deletePersona = (id: string): Promise<IPersona> =>
    useAPIPromise(
        map.DELETE_PERSONA({ guid: id }),
        'DELETE',
        {}
    )


export const Persona = {
    List,
    Create,
    Update,
    updatePersonaUsers,
    listPersonas,
    createPersona,
    updatePersona,
    deletePersona,
}




