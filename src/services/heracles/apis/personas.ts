import { useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '../keyMaps'
import { Ref } from 'vue'
import { IPersona } from '~/types/accessPolicies/personas'

const listPersonas = () =>
    useAPIAsyncState<IPersona[]>(KeyMaps.personas.LIST_PERSONAS, 'GET', {})

export const personaServiceAPI = {
    listPersonas,
}
