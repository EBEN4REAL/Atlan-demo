import {
    IPersona,
    IEnableDisablePayload,
} from '~/types/accessPolicies/personas'
import { Persona } from '../../../../services/service/persona'

export default function usePersonaService() {
    function listPersonas() {
        return Persona.listPersonas()
    }

    function createPersona(newPersona: IPersona) {
        return Persona.createPersona(newPersona)
    }

    function updatePersona(newPersona: IPersona) {
        return Persona.updatePersona(newPersona)
    }

    function deletePersona(id: string) {
        return Persona.deletePersona(id)
    }
    function updateUsers({ id, users, groups }) {
        return Persona.updatePersonaUsers({
            personaId: id,
            users,
            groups,
        })
    }
    function enableDisablePersona(id: string, payload: IEnableDisablePayload) {
        return Persona.enableDisablePersona(id, payload)
    }

    return {
        listPersonas,
        createPersona,
        updatePersona,
        deletePersona,
        updateUsers,
        enableDisablePersona,
    }
}
