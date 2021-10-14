import { useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '../keyMaps'
import { Ref } from 'vue'
import { IPersona } from '~/types/accessPolicies/personas'

const listPersonas = () =>
    useAPIAsyncState<IPersona[]>(KeyMaps.personas.LIST_PERSONAS, 'GET', {})

const createPersona = () =>
    useAPIAsyncState<IPersona[]>(KeyMaps.personas.CREATE_PERSONA, 'POST', {})

export const personaServiceAPI = {
    listPersonas,
    createPersona,
}
