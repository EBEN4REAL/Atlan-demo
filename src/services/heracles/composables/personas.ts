import { IPersona } from '~/types/accessPolicies/personas'
import { personaServiceAPI } from '../apis/personas'

export default function usePersonaService() {
    function listPersonas() {
        return personaServiceAPI.listPersonas()
    }

    function createPersona(newPersona: IPersona) {
        return personaServiceAPI.createPersona(newPersona)
    }

    return { listPersonas, createPersona }
}
