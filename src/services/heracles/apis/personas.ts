import { useAPIAsyncState, useAPIPromise } from '~/api/useAPI'
import { KeyMaps } from '../keyMaps'
import { IPersona } from '~/types/accessPolicies/personas'

const listPersonas = () =>
    useAPIAsyncState<IPersona[]>(
        KeyMaps.personas.LIST_PERSONAS,
        'GET',
        { initialState: [] },
        { resetOnExecute: false }
    )

const createPersona = (newPersona: IPersona) =>
    useAPIPromise(KeyMaps.personas.CREATE_PERSONA(), 'POST', {
        body: newPersona,
    })

export const personaServiceAPI = {
    listPersonas,
    createPersona,
}
