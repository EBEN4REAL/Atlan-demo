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

    function createPolicy(newPersona: IPersona, id: String) {
        return Persona.createPolicy(newPersona, id)
    }

    function updateDataPolicy(
        newPersona: IPersona,
        idPolicy: String,
        idPersona: String
    ) {
        return Persona.updatePolicy(newPersona, idPolicy, idPersona)
    }

    function deleteDataPolicy(idPolicy: String, idPersona: String) {
        return Persona.deletePolicy(idPolicy, idPersona)
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
        createPolicy,
        updateDataPolicy,
        deleteDataPolicy,
    }
}
