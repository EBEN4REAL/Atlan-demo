import { useAPIAsyncState, useAPIPromise } from '~/services/api/useAPI'
import { heracles_keymap } from '../heracles_keymap'
import { IPersona } from '~/types/accessPolicies/personas'

const listPersonas = () =>
    useAPIAsyncState<IPersona[]>(
        heracles_keymap.personas.LIST_PERSONAS,
        'GET',
        { initialState: [] },
        { resetOnExecute: false }
    )

const createPersona = (newPersona: IPersona): Promise<IPersona> =>
    useAPIPromise(heracles_keymap.personas.CREATE_PERSONA(), 'POST', {
        body: newPersona,
    })

const updatePersona = (newPersona: IPersona): Promise<IPersona> =>
    useAPIPromise(
        heracles_keymap.personas.UPDATE_PERSONA({ guid: newPersona.id! }),
        'POST',
        {
            body: newPersona,
        }
    )

export const personaServiceAPI = {
    listPersonas,
    createPersona,
    updatePersona,
}
